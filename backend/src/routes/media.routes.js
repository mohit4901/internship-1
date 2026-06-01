/**
 * media.routes.js
 * Mounted at /api/v1/media
 */
const express = require('express');
const router  = express.Router();

const { getMedia, uploadMedia } = require('../controllers/media.controller');
const { protectAdmin, requirePermission } = require('../middlewares/auth.middleware');
const { upload } = require('../middlewares/multer.middleware');

// ── PUBLIC: serve any stored file by ID ──────────────────────────────────────
// GET /api/v1/media/:id
router.get('/:id', getMedia);

// ── ADMIN: upload a file (banner, pdf) ───────────────────────────────────────
// POST /api/v1/media/upload
// field name must be "file" in multipart/form-data
router.post(
  '/upload',
  protectAdmin,
  requirePermission('cms:write'),
  upload.single('file'),
  uploadMedia
);

module.exports = router;
