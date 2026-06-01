/**
 * olympiad.routes.js
 * Mounted at /api/v1/olympiads
 *
 * Public endpoints   — visible to anyone (students, schools, guests)
 * Protected endpoints — require admin JWT + 'olympiads:write' permission
 */

const express = require('express');
const router  = express.Router();

// Controller
const {
  listOlympiads,
  getOlympiad,
  createOlympiad,
  updateOlympiad,
  changeStatus,
  deleteOlympiad,
} = require('../controllers/olympiad.controller');

// Middleware
const { protectAdmin, requirePermission } = require('../middlewares/auth.middleware');
const { validate }                        = require('../middlewares/validate.middleware');
const { upload }                          = require('../middlewares/multer.middleware');

// Validators
const {
  createOlympiadSchema,
  updateOlympiadSchema,
  changeStatusSchema,
  listOlympiadsQuerySchema,
} = require('../validators/olympiad.validators');

// Shorthand guard: admin + olympiads:write
const adminWrite = [protectAdmin, requirePermission('olympiads:write')];

// Multer upload fields config
const uploadFields = upload.fields([
  { name: 'bannerImage', maxCount: 1 },
  { name: 'syllabusPdf', maxCount: 1 },
]);

/**
 * Middleware to parse stringified JSON fields in multipart requests before Zod validation.
 */
const parseMultipartFields = (req, res, next) => {
  const jsonFields = ['gradesSupported', 'timeline', 'syllabus', 'rules'];
  jsonFields.forEach((field) => {
    if (typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (e) {
        // Keep original string if parsing fails
      }
    }
  });

  if (req.body.registrationFee !== undefined && typeof req.body.registrationFee === 'string') {
    const parsedFee = Number(req.body.registrationFee);
    if (!isNaN(parsedFee)) {
      req.body.registrationFee = parsedFee;
    }
  }

  if (req.body.maxRegistrations !== undefined && typeof req.body.maxRegistrations === 'string') {
    const parsedMax = Number(req.body.maxRegistrations);
    if (!isNaN(parsedMax)) {
      req.body.maxRegistrations = parsedMax;
    }
  }

  next();
};

/* ══════════════════════════════════════════════════════════════════════════════
   PUBLIC ROUTES
   ══════════════════════════════════════════════════════════════════════════════ */

// GET /api/v1/olympiads?status=Active&category=Junior&grade=9&page=1&limit=10
router.get('/', validate(listOlympiadsQuerySchema, 'query'), listOlympiads);

// GET /api/v1/olympiads/:id
router.get('/:id', getOlympiad);

/* ══════════════════════════════════════════════════════════════════════════════
   ADMIN-ONLY ROUTES  (olympiads:write)
   ══════════════════════════════════════════════════════════════════════════════ */

// POST /api/v1/olympiads
router.post(
  '/',
  ...adminWrite,
  uploadFields,
  parseMultipartFields,
  validate(createOlympiadSchema),
  createOlympiad
);

// PATCH /api/v1/olympiads/:id
router.patch(
  '/:id',
  ...adminWrite,
  uploadFields,
  parseMultipartFields,
  validate(updateOlympiadSchema),
  updateOlympiad
);

// PATCH /api/v1/olympiads/:id/status   ← must come BEFORE /:id to avoid param collision
router.patch('/:id/status', ...adminWrite, validate(changeStatusSchema), changeStatus);

// DELETE /api/v1/olympiads/:id
router.delete('/:id', ...adminWrite, deleteOlympiad);

module.exports = router;
