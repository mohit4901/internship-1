/**
 * student.routes.js
 * Mounted at /api/v1/students
 *
 * Student (self)  — requires protectStudent
 * Admin           — requires protectAdmin + permission
 */

const express = require('express');
const router  = express.Router();

// Controller
const {
  getOwnProfile,
  updateOwnProfile,
  listStudents,
  getStudentById,
  toggleStudentStatus,
  deleteStudent,
} = require('../controllers/student.controller');

// Middleware
const {
  protectStudent,
  protectAdmin,
  requirePermission,
} = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

// Validators
const {
  updateStudentProfileSchema,
  listStudentsQuerySchema,
  toggleStudentStatusSchema,
} = require('../validators/student.validators');

/* ══════════════════════════════════════════════════════════════════════════════
   STUDENT SELF-SERVICE ROUTES
   ══════════════════════════════════════════════════════════════════════════════ */

// GET  /api/v1/students/me
router.get('/me', protectStudent, getOwnProfile);

// PATCH /api/v1/students/me
router.patch('/me', protectStudent, validate(updateStudentProfileSchema), updateOwnProfile);

/* ══════════════════════════════════════════════════════════════════════════════
   ADMIN ROUTES
   ══════════════════════════════════════════════════════════════════════════════ */

// GET /api/v1/students  — list all (with filters)
router.get(
  '/',
  protectAdmin,
  requirePermission('users:read'),
  validate(listStudentsQuerySchema, 'query'),
  listStudents
);

// GET /api/v1/students/:id
router.get(
  '/:id',
  protectAdmin,
  requirePermission('users:read'),
  getStudentById
);

// PATCH /api/v1/students/:id/status
router.patch(
  '/:id/status',
  protectAdmin,
  requirePermission('users:write'),
  validate(toggleStudentStatusSchema),
  toggleStudentStatus
);

// DELETE /api/v1/students/:id
router.delete(
  '/:id',
  protectAdmin,
  requirePermission('users:write'),
  deleteStudent
);

module.exports = router;
