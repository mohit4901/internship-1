/**
 * contact.routes.js
 * Mounted at /api/v1/contact
 */

const express = require('express');
const router  = express.Router();

// Controllers
const {
  submitContactForm,
  listSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
} = require('../controllers/contact.controller');

// Middleware
const {
  protectAdmin,
  requirePermission,
} = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

// Validators
const {
  createContactSubmissionSchema,
  updateContactStatusSchema,
  listSubmissionsQuerySchema,
} = require('../validators/contact.validators');

/* ══════════════════════════════════════════════════════════════════════════════
   PUBLIC ROUTES
   ══════════════════════════════════════════════════════════════════════════════ */

// POST /api/v1/contact - Submit contact form ticket
router.post(
  '/',
  validate(createContactSubmissionSchema),
  submitContactForm
);

/* ══════════════════════════════════════════════════════════════════════════════
   ADMIN SECURED ROUTES
   ══════════════════════════════════════════════════════════════════════════════ */

// GET /api/v1/contact - List support tickets (admin)
router.get(
  '/',
  protectAdmin,
  requirePermission('contact:read'),
  validate(listSubmissionsQuerySchema, 'query'),
  listSubmissions
);

// GET /api/v1/contact/:id - Get specific ticket details (admin)
router.get(
  '/:id',
  protectAdmin,
  requirePermission('contact:read'),
  getSubmissionById
);

// PATCH /api/v1/contact/:id/status - Update ticket status / add notes (admin)
router.patch(
  '/:id/status',
  protectAdmin,
  requirePermission('contact:write'),
  validate(updateContactStatusSchema),
  updateSubmissionStatus
);

module.exports = router;
