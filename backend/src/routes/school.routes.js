/**
 * school.routes.js
 * Mounted at /api/v1/schools
 *
 * School (self)  — requires protectSchool
 * Admin          — requires protectAdmin + permission
 *
 * NOTE: register / login / logout / me (auth) are at /api/v1/auth/school/*
 */

const express = require('express');
const router  = express.Router();

// Controller
const {
  getOwnProfile,
  updateOwnProfile,
  listSchools,
  getSchoolById,
  verifySchool,
  listPublicSchools,
} = require('../controllers/school.controller');

// Middleware
const {
  protectSchool,
  protectAdmin,
  requirePermission,
} = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

// Validators
const {
  updateSchoolProfileSchema,
  listSchoolsQuerySchema,
  verifySchoolSchema,
} = require('../validators/school.validators');

/* ══════════════════════════════════════════════════════════════════════════════
   PUBLIC SCHOOLS ROUTES
   ══════════════════════════════════════════════════════════════════════════════ */
router.get('/public', listPublicSchools);

/* ══════════════════════════════════════════════════════════════════════════════
   SCHOOL SELF-SERVICE ROUTES
   ══════════════════════════════════════════════════════════════════════════════ */

// GET  /api/v1/schools/me
router.get('/me', protectSchool, getOwnProfile);

// PATCH /api/v1/schools/me
router.patch('/me', protectSchool, validate(updateSchoolProfileSchema), updateOwnProfile);

/* ══════════════════════════════════════════════════════════════════════════════
   ADMIN ROUTES
   ══════════════════════════════════════════════════════════════════════════════ */

// GET /api/v1/schools  — list all (with filters + pagination)
router.get(
  '/',
  protectAdmin,
  requirePermission('users:read'),
  validate(listSchoolsQuerySchema, 'query'),
  listSchools
);

// GET /api/v1/schools/:id
router.get(
  '/:id',
  protectAdmin,
  requirePermission('users:read'),
  getSchoolById
);

// PATCH /api/v1/schools/:id/verify  — approve or reject
router.patch(
  '/:id/verify',
  protectAdmin,
  requirePermission('users:write'),
  validate(verifySchoolSchema),
  verifySchool
);

module.exports = router;
