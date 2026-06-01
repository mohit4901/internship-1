const mongoose       = require('mongoose');
const Student        = require('../models/Student');
const School         = require('../models/School');
const { ApiError }     = require('../utils/apiError');
const { ApiResponse }  = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const { COOKIE_OPTIONS, COOKIE_NAMES } = require('../config/constants');

/* ─────────────────────────────────────────────
   Helper: send token
   ───────────────────────────────────────────── */
const sendStudentToken = (student, statusCode, res, message) => {
  const token = student.generateJwtToken();
  const cookieExpireMs =
    parseInt(process.env.JWT_COOKIE_EXPIRE_DAYS || '7', 10) * 24 * 60 * 60 * 1000;

  res
    .status(statusCode)
    .cookie(COOKIE_NAMES.STUDENT_TOKEN, token, {
      ...COOKIE_OPTIONS,
      maxAge: cookieExpireMs,
    })
    .json(new ApiResponse(statusCode, { token, student: sanitize(student) }, message));
};

const sanitize = (student) => ({
  _id:             student._id,
  name:            student.name,
  email:           student.email,
  phone:           student.phone,
  schoolId:        student.schoolId,
  class:           student.class,
  section:         student.section,
  gender:          student.gender,
  isEmailVerified: student.isEmailVerified,
  isActive:        student.isActive,
  createdAt:       student.createdAt,
});

/* ═══════════════════════════════════════════════
   @route  POST /api/v1/auth/student/register
   @access Public
   ═══════════════════════════════════════════════ */
const registerStudent = asyncHandler(async (req, res) => {
  const { name, email, phone, password, schoolId, class: cls, section,
          dob, gender, parent, address } = req.body;

  // Validate school exists
  if (!mongoose.Types.ObjectId.isValid(schoolId)) {
    throw new ApiError(400, 'Invalid school ID format.');
  }
  const school = await School.findById(schoolId);
  if (!school) {
    throw new ApiError(404, 'School not found. Please check the school ID.');
  }

  // Check duplicates
  const existing = await Student.findOne({ $or: [{ email }, { phone }] });
  if (existing) {
    const field = existing.email === email ? 'email' : 'phone number';
    throw new ApiError(409, `A student account with this ${field} already exists.`);
  }

  const student = await Student.create({
    name, email, phone, password,
    schoolId, class: cls, section, dob, gender, parent, address,
  });

  // Increment school student count
  await School.findByIdAndUpdate(schoolId, { $inc: { registeredStudentsCount: 1 } });

  sendStudentToken(student, 201, res, 'Student registered successfully.');
});

/* ═══════════════════════════════════════════════
   @route  POST /api/v1/auth/student/login
   @access Public
   ═══════════════════════════════════════════════ */
const loginStudent = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email }).select('+password');

  if (!student) throw new ApiError(401, 'Invalid email or password.');
  if (!student.isActive) throw new ApiError(403, 'Your account has been deactivated. Contact support.');

  const isMatch = await student.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password.');

  sendStudentToken(student, 200, res, 'Student logged in successfully.');
});

/* ═══════════════════════════════════════════════
   @route  POST /api/v1/auth/student/logout
   @access Private (student)
   ═══════════════════════════════════════════════ */
const logoutStudent = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie(COOKIE_NAMES.STUDENT_TOKEN, COOKIE_OPTIONS)
    .json(new ApiResponse(200, {}, 'Student logged out successfully.'));
});

/* ═══════════════════════════════════════════════
   @route  GET /api/v1/auth/student/me
   @access Private (student)
   ═══════════════════════════════════════════════ */
const getStudentProfile = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user._id).populate('schoolId', 'name affiliationNumber');
  if (!student) throw new ApiError(404, 'Student not found.');

  res.status(200).json(new ApiResponse(200, sanitize(student), 'Student profile fetched.'));
});

module.exports = {
  registerStudent,
  loginStudent,
  logoutStudent,
  getStudentProfile,
};
