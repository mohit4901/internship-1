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
const { protectAdmin, protectSchool } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  adminRegisterSchema,
  adminLoginSchema,
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
   SCHOOL AUTH ROUTES  —  /api/v1/auth/school
   ════════════════════════════════════════════ */
router.post('/school/register', validate(schoolRegisterSchema), registerSchool);
router.post('/school/login',    validate(schoolLoginSchema),    loginSchool);
router.post('/school/logout',   protectSchool,                  logoutSchool);
router.get( '/school/me',       protectSchool,                  getSchoolProfile);

module.exports = router;
