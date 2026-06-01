/**
 * student.controller.js
 *
 * Handles student profile management and admin-facing student operations.
 * Registration / login / logout / forgot-password are handled by auth modules.
 *
 * Routes (mounted at /api/v1/students):
 *
 *   Student (self)
 *   GET    /me          – getOwnProfile
 *   PATCH  /me          – updateOwnProfile
 *
 *   Admin (users:read / users:write)
 *   GET    /            – listStudents
 *   GET    /:id         – getStudentById
 *   PATCH  /:id/status  – toggleStudentStatus
 */

const mongoose         = require('mongoose');
const Student          = require('../models/Student');
const { ApiError }     = require('../utils/apiError');
const { ApiResponse }  = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────────────────────── */
const assertObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid student ID format.');
  }
};

// Fields a student is NEVER allowed to change themselves
const IMMUTABLE_FIELDS = ['email', 'password', 'class', 'schoolId', 'isActive', 'isEmailVerified'];

/* ═══════════════════════════════════════════════════════════════════════════════
   GET OWN PROFILE
   GET /api/v1/students/me
   Access: Authenticated student
   ═══════════════════════════════════════════════════════════════════════════════ */
const getOwnProfile = asyncHandler(async (req, res) => {
  // req.user is already populated by protectStudent (password excluded)
  res.status(200).json(
    new ApiResponse(200, { student: req.user }, 'Profile fetched successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   UPDATE OWN PROFILE
   PATCH /api/v1/students/me
   Access: Authenticated student
   ═══════════════════════════════════════════════════════════════════════════════ */
const updateOwnProfile = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user._id);
  if (!student) throw new ApiError(404, 'Student account not found.');

  // Guard: strip any immutable fields that may have slipped through
  IMMUTABLE_FIELDS.forEach((f) => delete req.body[f]);

  // Handle nested address / parent — merge with existing rather than replace
  const { address, parent, ...topLevelFields } = req.body;

  Object.assign(student, topLevelFields);

  if (address) {
    student.address = { ...student.address?.toObject?.() ?? student.address, ...address };
    student.markModified('address');
  }

  if (parent) {
    student.parent = { ...student.parent?.toObject?.() ?? student.parent, ...parent };
    student.markModified('parent');
  }

  await student.save();

  // Remove sensitive fields before responding
  const studentObj = student.toObject();
  delete studentObj.password;
  delete studentObj.verificationToken;
  delete studentObj.securityAnswerHash;
  delete studentObj.passwordResetToken;
  delete studentObj.passwordResetExpire;

  res.status(200).json(
    new ApiResponse(200, { student: studentObj }, 'Profile updated successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   LIST ALL STUDENTS  (Admin)
   GET /api/v1/students?class=10&schoolId=xxx&isActive=true&search=name&page=1&limit=20
   Access: Admin (users:read)
   ═══════════════════════════════════════════════════════════════════════════════ */
const listStudents = asyncHandler(async (req, res) => {
  const {
    class: grade,
    schoolId,
    isActive,
    search,
    page  = 1,
    limit = 20,
    sort  = '-createdAt',
  } = req.query;

  const filter = {};

  if (grade)    filter.class    = grade;
  if (schoolId && mongoose.Types.ObjectId.isValid(schoolId)) {
    filter.schoolId = schoolId;
  }
  if (isActive !== undefined) filter.isActive = isActive;

  // Full-text style search on name + email using regex
  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const sortObj = sort.startsWith('-')
    ? { [sort.slice(1)]: -1 }
    : { [sort]: 1 };

  const skip = (Number(page) - 1) * Number(limit);

  const [students, total] = await Promise.all([
    Student.find(filter)
      .select('-password -verificationToken -securityAnswerHash -passwordResetToken -passwordResetExpire')
      .populate('schoolId', 'schoolName city state')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Student.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        students,
        pagination: {
          total,
          page:       Number(page),
          limit:      Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      'Students fetched successfully.'
    )
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   GET STUDENT BY ID  (Admin)
   GET /api/v1/students/:id
   Access: Admin (users:read)
   ═══════════════════════════════════════════════════════════════════════════════ */
const getStudentById = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);

  const student = await Student.findById(req.params.id)
    .select('-password -verificationToken -securityAnswerHash -passwordResetToken -passwordResetExpire')
    .populate('schoolId', 'schoolName city state')
    .lean();

  if (!student) throw new ApiError(404, 'Student not found.');

  res.status(200).json(
    new ApiResponse(200, { student }, 'Student fetched successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   TOGGLE STUDENT STATUS  (Admin)
   PATCH /api/v1/students/:id/status
   Body: { isActive: boolean, reason?: string }
   Access: Admin (users:write)
   ═══════════════════════════════════════════════════════════════════════════════ */
const toggleStudentStatus = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);

  const { isActive, reason } = req.body;

  const student = await Student.findById(req.params.id);
  if (!student) throw new ApiError(404, 'Student not found.');

  if (student.isActive === isActive) {
    throw new ApiError(
      400,
      `Student account is already ${isActive ? 'active' : 'inactive'}.`
    );
  }

  student.isActive = isActive;
  await student.save({ validateBeforeSave: false });

  res.status(200).json(
    new ApiResponse(
      200,
      { studentId: student._id, isActive: student.isActive },
      `Student account ${isActive ? 'activated' : 'deactivated'} successfully.${reason ? ` Reason: ${reason}` : ''}`
    )
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   DELETE STUDENT  (Admin)
   DELETE /api/v1/students/:id
   Access: Admin (users:write)
   ═══════════════════════════════════════════════════════════════════════════════ */
const deleteStudent = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);

  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) throw new ApiError(404, 'Student not found.');

  res.status(200).json(
    new ApiResponse(200, { studentId: req.params.id }, 'Student deleted successfully.')
  );
});

module.exports = {
  getOwnProfile,
  updateOwnProfile,
  listStudents,
  getStudentById,
  toggleStudentStatus,
  deleteStudent,
};
