/**
 * result.routes.js
 * Mounted at /api/v1/results
 */

const express = require('express');
const router  = express.Router();

// Controllers
const {
  createResult,
  updateResult,
  deleteResult,
  listResults,
  getOwnResults,
  searchResult,
  publishResultsForSchool,
  publishAllResults,
} = require('../controllers/result.controller');

// Middleware
const {
  protectAdmin,
  protectStudent,
  requirePermission,
} = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

// Validators
const {
  createResultSchema,
  updateResultSchema,
  searchResultQuerySchema,
  listResultsQuerySchema,
} = require('../validators/result.validators');

// Shorthand admin permission checks
const adminWrite = [protectAdmin, requirePermission('results:write')];
const adminRead  = [protectAdmin, requirePermission('results:read')];

/* ══════════════════════════════════════════════════════════════════════════════
   PUBLIC & STUDENT PORTAL ROUTES
   ══════════════════════════════════════════════════════════════════════════════ */

// GET /api/v1/results/search - Public search of result by roll number
router.get(
  '/search',
  validate(searchResultQuerySchema, 'query'),
  searchResult
);

// GET /api/v1/results/me - Get results for currently logged-in student
router.get(
  '/me',
  protectStudent,
  getOwnResults
);

/* ══════════════════════════════════════════════════════════════════════════════
   ADMIN CRUD ROUTES
   ══════════════════════════════════════════════════════════════════════════════ */

// PATCH /api/v1/results/publish/school/:schoolId - Publish/unpublish results school-wise
router.patch(
  '/publish/school/:schoolId',
  ...adminWrite,
  publishResultsForSchool
);

// PATCH /api/v1/results/publish/all - Publish/unpublish all results globally
router.patch(
  '/publish/all',
  ...adminWrite,
  publishAllResults
);

// GET /api/v1/results - List results (admin only)
router.get(
  '/',
  ...adminRead,
  validate(listResultsQuerySchema, 'query'),
  listResults
);

// POST /api/v1/results - Create/upload a student's result
router.post(
  '/',
  ...adminWrite,
  validate(createResultSchema),
  createResult
);

// PATCH /api/v1/results/:id - Update student result details
router.patch(
  '/:id',
  ...adminWrite,
  validate(updateResultSchema),
  updateResult
);

// DELETE /api/v1/results/:id - Remove a student's result
router.delete(
  '/:id',
  ...adminWrite,
  deleteResult
);

module.exports = router;
