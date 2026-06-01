const express = require('express');
const router  = express.Router();

// Controllers
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
} = require('../controllers/auth.admin.controller');

const {
  registerStudent,
  loginStudent,
  logoutStudent,
  getStudentProfile,
} = require('../controllers/auth.student.controller');

const {
  registerSchool,
  loginSchool,
  logoutSchool,
  getSchoolProfile,
} = require('../controllers/auth.school.controller');

const {
  getSecurityQuestion,
  verifySecurityAnswer,
  resetPassword,
  setSecurityQuestion,
} = require('../controllers/forgotPassword.controller');

// Middleware
const { protectAdmin, protectStudent, protectSchool } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  adminRegisterSchema,
  adminLoginSchema,
  studentRegisterSchema,
  studentLoginSchema,
  schoolRegisterSchema,
  schoolLoginSchema,
} = require('../validators/auth.validators');
const {
  forgotPasswordStep1Schema,
  forgotPasswordStep2Schema,
  resetPasswordSchema,
  setSecurityQuestionSchema,
} = require('../validators/forgotPassword.validators');

/* ════════════════════════════════════════════
   ADMIN AUTH ROUTES  —  /api/v1/auth/admin
   ════════════════════════════════════════════ */
router.post('/admin/register', validate(adminRegisterSchema),  registerAdmin);
router.post('/admin/login',    validate(adminLoginSchema),     loginAdmin);
router.post('/admin/logout',   protectAdmin,                   logoutAdmin);
router.get( '/admin/me',       protectAdmin,                   getAdminProfile);

// Forgot Password — Admin (3-step flow)
router.post('/admin/forgot-password/question',     validate(forgotPasswordStep1Schema), getSecurityQuestion('admin'));
router.post('/admin/forgot-password/verify',       validate(forgotPasswordStep2Schema), verifySecurityAnswer('admin'));
router.post('/admin/forgot-password/reset',        validate(resetPasswordSchema),       resetPassword('admin'));
router.post('/admin/forgot-password/set-question', protectAdmin, validate(setSecurityQuestionSchema), setSecurityQuestion('admin'));

/* ════════════════════════════════════════════
   STUDENT AUTH ROUTES  —  /api/v1/auth/student
   ════════════════════════════════════════════ */
router.post('/student/register', validate(studentRegisterSchema), registerStudent);
router.post('/student/login',    validate(studentLoginSchema),    loginStudent);
router.post('/student/logout',   protectStudent,                  logoutStudent);
router.get( '/student/me',       protectStudent,                  getStudentProfile);

// Forgot Password — Student (3-step flow)
router.post('/student/forgot-password/question',     validate(forgotPasswordStep1Schema), getSecurityQuestion('student'));
router.post('/student/forgot-password/verify',       validate(forgotPasswordStep2Schema), verifySecurityAnswer('student'));
router.post('/student/forgot-password/reset',        validate(resetPasswordSchema),       resetPassword('student'));
router.post('/student/forgot-password/set-question', protectStudent, validate(setSecurityQuestionSchema), setSecurityQuestion('student'));

/* ════════════════════════════════════════════
   SCHOOL AUTH ROUTES  —  /api/v1/auth/school
   ════════════════════════════════════════════ */
router.post('/school/register', validate(schoolRegisterSchema), registerSchool);
router.post('/school/login',    validate(schoolLoginSchema),    loginSchool);
router.post('/school/logout',   protectSchool,                  logoutSchool);
router.get( '/school/me',       protectSchool,                  getSchoolProfile);

module.exports = router;
