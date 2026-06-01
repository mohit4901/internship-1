/**
 * forgotPassword.controller.js
 *
 * Implements a 3-step security-question-based password reset flow.
 *
 * Step 1 — GET question : POST /:role/forgot-password/question
 *   Body : { email }
 *   Returns : { securityQuestion }  (no answer, no hint)
 *
 * Step 2 — Verify answer : POST /:role/forgot-password/verify
 *   Body : { email, securityAnswer }
 *   Returns : { resetToken }  (plain hex token, 15-min expiry)
 *
 * Step 3 — Reset password : POST /:role/forgot-password/reset
 *   Body : { resetToken, password, confirmPassword }
 *   Returns : 200 OK
 *
 * Bonus — Set question : POST /:role/forgot-password/set-question
 *   Body : { securityQuestion, securityAnswer }
 *   Access : Private (authenticated user sets own question)
 */

const crypto       = require('crypto');
const bcrypt       = require('bcryptjs');
const Admin        = require('../models/Admin');
const Student      = require('../models/Student');
const { ApiError }     = require('../utils/apiError');
const { ApiResponse }  = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

/* ─────────────────────────────────────────────
   Internal: resolve model from role string
   ───────────────────────────────────────────── */
const resolveModel = (role) => {
  if (role === 'admin')   return Admin;
  if (role === 'student') return Student;
  throw new ApiError(400, `Unsupported role: ${role}`);
};

/* ─────────────────────────────────────────────
   Security: generic error message to prevent
   user-enumeration attacks (don't reveal
   whether an email exists in the system).
   ───────────────────────────────────────────── */
const ENUM_SAFE_MSG =
  'If that email is registered and has a security question set, the question has been returned.';

/* ═══════════════════════════════════════════════════════════════════
   STEP 1 — Retrieve Security Question
   POST /api/v1/auth/:role/forgot-password/question
   Body: { email }
   ═══════════════════════════════════════════════════════════════════ */
const getSecurityQuestion = (role) =>
  asyncHandler(async (req, res) => {
    const Model = resolveModel(role);
    const { email } = req.body;

    // Select securityQuestion explicitly (field is select:false)
    const user = await Model
      .findOne({ email })
      .select('+securityQuestion');

    // Anti-enumeration: always return 200 with the same shape
    if (!user || !user.securityQuestion) {
      return res.status(200).json(
        new ApiResponse(200, { securityQuestion: null }, ENUM_SAFE_MSG)
      );
    }

    res.status(200).json(
      new ApiResponse(
        200,
        { securityQuestion: user.securityQuestion },
        'Security question retrieved. Please provide your answer to proceed.'
      )
    );
  });

/* ═══════════════════════════════════════════════════════════════════
   STEP 2 — Verify Security Answer → Issue Reset Token
   POST /api/v1/auth/:role/forgot-password/verify
   Body: { email, securityAnswer }
   ═══════════════════════════════════════════════════════════════════ */
const verifySecurityAnswer = (role) =>
  asyncHandler(async (req, res) => {
    const Model = resolveModel(role);
    const { email, securityAnswer } = req.body;

    const user = await Model
      .findOne({ email })
      .select('+securityQuestion +securityAnswerHash +passwordResetToken +passwordResetExpire');

    // Anti-enumeration: wrong email and wrong answer return identical error
    const INVALID_MSG = 'Security answer is incorrect or the account does not exist.';

    if (!user || !user.securityAnswerHash) {
      // Simulate bcrypt delay to prevent timing-based enumeration
      await bcrypt.compare('dummy', '$2a$10$dummyhashplaceholderthatnevermatchesanything1234567890');
      throw new ApiError(401, INVALID_MSG);
    }

    // Rate-limit guard: if a valid (unexpired) token was issued <2 min ago, block re-issue
    const TWO_MIN = 2 * 60 * 1000;
    if (
      user.passwordResetExpire &&
      user.passwordResetExpire > new Date() &&
      (user.passwordResetExpire - new Date()) > (15 * 60 * 1000 - TWO_MIN)
    ) {
      throw new ApiError(
        429,
        'A reset token was recently issued. Please wait 2 minutes before requesting another.'
      );
    }

    const isMatch = await user.compareSecurityAnswer(securityAnswer);
    if (!isMatch) {
      throw new ApiError(401, INVALID_MSG);
    }

    // Generate and save hashed reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          resetToken,                         // plain token — frontend passes this in Step 3
          expiresAt: user.passwordResetExpire, // 15 min from now
        },
        'Security answer verified. Use the reset token to set a new password within 15 minutes.'
      )
    );
  });

/* ═══════════════════════════════════════════════════════════════════
   STEP 3 — Reset Password Using Token
   POST /api/v1/auth/:role/forgot-password/reset
   Body: { resetToken, password, confirmPassword }
   ═══════════════════════════════════════════════════════════════════ */
const resetPassword = (role) =>
  asyncHandler(async (req, res) => {
    const Model = resolveModel(role);
    const { resetToken, password } = req.body;
    // confirmPassword already validated equal to password by Zod schema

    // Hash the incoming plain token to compare against DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken.trim())
      .digest('hex');

    const user = await Model
      .findOne({
        passwordResetToken:  hashedToken,
        passwordResetExpire: { $gt: new Date() }, // token not expired
      })
      .select('+password +passwordResetToken +passwordResetExpire');

    if (!user) {
      throw new ApiError(400, 'Reset token is invalid or has expired. Please restart the forgot-password flow.');
    }

    // Prevent reusing the same password
    const isSamePassword = await user.comparePassword(password);
    if (isSamePassword) {
      throw new ApiError(400, 'New password must be different from your current password.');
    }

    // Update password and clear reset fields
    user.password           = password;    // pre-save hook will bcrypt this
    user.passwordResetToken  = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    res.status(200).json(
      new ApiResponse(200, {}, 'Password has been reset successfully. Please log in with your new password.')
    );
  });

/* ═══════════════════════════════════════════════════════════════════
   BONUS — Set / Update Security Question (authenticated route)
   POST /api/v1/auth/:role/forgot-password/set-question
   Body: { securityQuestion, securityAnswer }
   Access: Private (protectAdmin / protectStudent in route)
   ═══════════════════════════════════════════════════════════════════ */
const setSecurityQuestion = (role) =>
  asyncHandler(async (req, res) => {
    const Model = resolveModel(role);
    const { securityQuestion, securityAnswer } = req.body;

    const user = await Model.findById(req.user._id);
    if (!user) throw new ApiError(404, 'User not found.');

    // Hash the answer before storing (case-insensitive: normalise first)
    const salt = await bcrypt.genSalt(10);
    const hashedAnswer = await bcrypt.hash(
      securityAnswer.trim().toLowerCase(),
      salt
    );

    user.securityQuestion   = securityQuestion.trim();
    user.securityAnswerHash = hashedAnswer;
    await user.save({ validateBeforeSave: false });

    res.status(200).json(
      new ApiResponse(200, {}, 'Security question set successfully.')
    );
  });

module.exports = {
  getSecurityQuestion,
  verifySecurityAnswer,
  resetPassword,
  setSecurityQuestion,
};
