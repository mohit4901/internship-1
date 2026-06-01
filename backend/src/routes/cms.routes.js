/**
 * cms.routes.js
 * Mounted at /api/v1/cms
 */

const express = require('express');
const router  = express.Router();

// Controllers
const {
  getCmsByKey,
  updateCms,
  getAllCms,
} = require('../controllers/cms.controller');

// Middleware
const {
  protectAdmin,
  requirePermission,
} = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

// Validators
const { updateCmsSchema } = require('../validators/cms.validators');

/* ══════════════════════════════════════════════════════════════════════════════
   PUBLIC LOOKUP
   ══════════════════════════════════════════════════════════════════════════════ */

// GET /api/v1/cms/:key - Get content by key (homepage, about, contact, faq)
router.get('/:key', getCmsByKey);

/* ══════════════════════════════════════════════════════════════════════════════
   ADMIN CMS PANEL
   ══════════════════════════════════════════════════════════════════════════════ */

// GET /api/v1/cms - Get all entries dictionary for settings administration
router.get(
  '/',
  protectAdmin,
  requirePermission('cms:read'),
  getAllCms
);

// POST /api/v1/cms - Upsert CMS entry by key
router.post(
  '/',
  protectAdmin,
  requirePermission('cms:write'),
  validate(updateCmsSchema),
  updateCms
);

module.exports = router;
