/**
 * dashboard.routes.js
 * Mounted at /api/v1/dashboard
 */

const express = require('express');
const router  = express.Router();

// Controllers
const { getDashboardStats } = require('../controllers/dashboard.controller');

// Middleware
const { protectAdmin, requirePermission } = require('../middlewares/auth.middleware');

// GET /api/v1/dashboard/stats
router.get(
  '/stats',
  protectAdmin,
  requirePermission('dashboard:read'),
  getDashboardStats
);

module.exports = router;
