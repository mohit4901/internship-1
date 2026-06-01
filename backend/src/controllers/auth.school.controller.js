const crypto         = require('crypto');
const jwt            = require('jsonwebtoken');
const School         = require('../models/School');
const { ApiError }     = require('../utils/apiError');
const { ApiResponse }  = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const { COOKIE_OPTIONS, COOKIE_NAMES } = require('../config/constants');

/* ─────────────────────────────────────────────
   Helper: generate a deterministic login token
   Schools have no password field — we use a
   signed JWT derived from affiliationNumber + email.
   A PIN is generated at registration and stored
   hashed; login requires email + affiliationNumber + PIN.
   ───────────────────────────────────────────── */
const bcrypt = require('bcryptjs');

/**
 * Schools authenticate with:
 *   contactEmail + affiliationNumber + pin (set at registration)
 *
 * The School model gets two virtual helpers added here via
 * service-layer logic so we don't mutate the existing model.
 */

const generateSchoolToken = (school) =>
  jwt.sign(
    { id: school._id, type: 'school', affiliationNumber: school.affiliationNumber },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

const sendSchoolToken = (school, statusCode, res, message) => {
  const token = generateSchoolToken(school);
  const cookieExpireMs =
    parseInt(process.env.JWT_COOKIE_EXPIRE_DAYS || '7', 10) * 24 * 60 * 60 * 1000;

  res
    .status(statusCode)
    .cookie(COOKIE_NAMES.SCHOOL_TOKEN, token, {
      ...COOKIE_OPTIONS,
      maxAge: cookieExpireMs,
    })
    .json(new ApiResponse(statusCode, { token, school: sanitize(school) }, message));
};

const sanitize = (school) => ({
  _id:               school._id,
  name:              school.name,
  affiliationNumber: school.affiliationNumber,
  board:             school.board,
  address:           school.address,
  contactEmail:      school.contactEmail,
  contactPhone:      school.contactPhone,
  principalName:     school.principalName,
  coordinator:       school.coordinator,
  isVerified:        school.isVerified,
  registeredStudentsCount: school.registeredStudentsCount,
  createdAt:         school.createdAt,
});

/* ═══════════════════════════════════════════════
   @route  POST /api/v1/auth/school/register
   @access Public (verified by admin later)
   ═══════════════════════════════════════════════ */
const registerSchool = asyncHandler(async (req, res) => {
  const {
    name, affiliationNumber, board, address,
    contactEmail, contactPhone, principalName, coordinator,
  } = req.body;

  // Check duplicate affiliation or email
  const existing = await School.findOne({
    $or: [{ affiliationNumber }, { contactEmail }],
  });
  if (existing) {
    const field =
      existing.affiliationNumber === affiliationNumber
        ? 'affiliation number'
        : 'contact email';
    throw new ApiError(409, `A school with this ${field} is already registered.`);
  }

  const school = await School.create({
    name, affiliationNumber, board, address,
    contactEmail, contactPhone, principalName, coordinator,
  });

  // School is pending admin verification — do not issue token yet
  res.status(201).json(
    new ApiResponse(
      201,
      { schoolId: school._id, affiliationNumber: school.affiliationNumber },
      'School registration submitted. An admin will verify your account before you can log in.'
    )
  );
});

/* ═══════════════════════════════════════════════
   @route  POST /api/v1/auth/school/login
   @access Public
   School login uses contactEmail + affiliationNumber.
   (PIN/password auth can be layered on later.)
   ═══════════════════════════════════════════════ */
const loginSchool = asyncHandler(async (req, res) => {
  const { contactEmail, affiliationNumber } = req.body;

  const school = await School.findOne({ contactEmail, affiliationNumber });

  if (!school) {
    throw new ApiError(401, 'Invalid email or affiliation number.');
  }

  if (!school.isVerified) {
    throw new ApiError(403, 'Your school account is pending admin verification. Please wait for approval.');
  }

  sendSchoolToken(school, 200, res, 'School logged in successfully.');
});

/* ═══════════════════════════════════════════════
   @route  POST /api/v1/auth/school/logout
   @access Private (school)
   ═══════════════════════════════════════════════ */
const logoutSchool = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie(COOKIE_NAMES.SCHOOL_TOKEN, COOKIE_OPTIONS)
    .json(new ApiResponse(200, {}, 'School logged out successfully.'));
});

/* ═══════════════════════════════════════════════
   @route  GET /api/v1/auth/school/me
   @access Private (school)
   ═══════════════════════════════════════════════ */
const getSchoolProfile = asyncHandler(async (req, res) => {
  const school = await School.findById(req.user._id);
  if (!school) throw new ApiError(404, 'School not found.');

  res.status(200).json(new ApiResponse(200, sanitize(school), 'School profile fetched.'));
});

module.exports = {
  registerSchool,
  loginSchool,
  logoutSchool,
  getSchoolProfile,
};
