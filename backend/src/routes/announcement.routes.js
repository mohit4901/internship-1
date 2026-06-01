/**
 * announcement.routes.js
 * Mounted at /api/v1/announcements
 */

const express = require('express');
const router  = express.Router();

// Controllers
const {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  listAnnouncements,
  getAnnouncementById,
} = require('../controllers/announcement.controller');

// Middleware
const {
  protect,
  protectAdmin,
  requirePermission,
} = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

// Validators
const {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  listAnnouncementsQuerySchema,
} = require('../validators/announcement.validators');

// Shorthand admin permission check
const adminWrite = [protectAdmin, requirePermission('announcements:write')];

/* ══════════════════════════════════════════════════════════════════════════════
   PUBLIC & STUDENT LOOKUP ENDPOINTS
   ══════════════════════════════════════════════════════════════════════════════ */

// GET /api/v1/announcements - Retrieve announcements (students/schools see published only)
// Optional 'protect' parses user credentials if signed in, but allows guest access
router.get(
  '/',
  (req, res, next) => {
    protect(req, res, (err) => {
      next();
    });
  },
  validate(listAnnouncementsQuerySchema, 'query'),
  listAnnouncements
);

// GET /api/v1/announcements/:id - Retrieve specific announcement details
router.get(
  '/:id',
  (req, res, next) => {
    protect(req, res, (err) => {
      next();
    });
  },
  getAnnouncementById
);

/* ══════════════════════════════════════════════════════════════════════════════
   ADMIN CRUD ENDPOINTS
   ══════════════════════════════════════════════════════════════════════════════ */

// POST /api/v1/announcements - Publish a new announcement
router.post(
  '/',
  ...adminWrite,
  validate(createAnnouncementSchema),
  createAnnouncement
);

// PATCH /api/v1/announcements/:id - Modify announcement details
router.patch(
  '/:id',
  ...adminWrite,
  validate(updateAnnouncementSchema),
  updateAnnouncement
);

// DELETE /api/v1/announcements/:id - Permanently remove announcement
router.delete(
  '/:id',
  ...adminWrite,
  deleteAnnouncement
);

module.exports = router;
