/**
 * registration.routes.js
 * Mounted at /api/v1/registrations
 */

const express = require('express');
const router  = express.Router();

// Controllers
const {
  registerForOlympiad,
  getOwnRegistrations,
  listRegistrations,
  getRegistrationById,
} = require('../controllers/registration.controller');

// Middleware
const {
  protect,
  protectAdmin,
  protectStudent,
  requirePermission,
} = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

// Validators
const {
  createRegistrationSchema,
  listRegistrationsQuerySchema,
} = require('../validators/registration.validators');

/* ══════════════════════════════════════════════════════════════════════════════
   STUDENT PORTAL ENDPOINTS
   ══════════════════════════════════════════════════════════════════════════════ */

// POST /api/v1/registrations - Register a student to an active Olympiad
router.post(
  '/',
  protectStudent,
  validate(createRegistrationSchema),
  registerForOlympiad
);

// GET /api/v1/registrations/me - Get registrations of current logged-in student
router.get(
  '/me',
  protectStudent,
  getOwnRegistrations
);

/* ══════════════════════════════════════════════════════════════════════════════
   ADMIN / GENERAL ENDPOINTS
   ══════════════════════════════════════════════════════════════════════════════ */

// GET /api/v1/registrations - List registrations (admin only)
router.get(
  '/',
  protectAdmin,
  requirePermission('registrations:read'),
  validate(listRegistrationsQuerySchema, 'query'),
  listRegistrations
);

// GET /api/v1/registrations/:id - View details of specific registration (Student own / Admin)
// Needs 'protect' middleware to load either student or admin details into req.user
router.get(
  '/:id',
  protect,
  getRegistrationById
);

module.exports = router;
