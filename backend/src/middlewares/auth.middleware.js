const jwt      = require('jsonwebtoken');
const Admin    = require('../models/Admin');
const Student  = require('../models/Student');
const School   = require('../models/School');
const { ApiError }     = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');
const { COOKIE_NAMES } = require('../config/constants');

/* ─────────────────────────────────────────────
   Helper: extract JWT from cookie or Bearer header
   ───────────────────────────────────────────── */
const extractToken = (req, cookieName) => {
  // 1. HttpOnly cookie (preferred)
  if (req.cookies && req.cookies[cookieName]) {
    return req.cookies[cookieName];
  }
  // 2. Authorization: Bearer <token> header fallback
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
};

/* ─────────────────────────────────────────────
   Helper: verify token and load user document
   ───────────────────────────────────────────── */
const verifyAndLoad = async (token, expectedType) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired token. Please log in again.');
  }

  if (decoded.type !== expectedType) {
    throw new ApiError(403, 'Token type mismatch. Access denied.');
  }

  let user;
  switch (expectedType) {
    case 'admin':
      user = await Admin.findById(decoded.id).select('-password');
      break;
    case 'student':
      user = await Student.findById(decoded.id).select('-password');
      break;
    case 'school':
      user = await School.findById(decoded.id);
      break;
    default:
      throw new ApiError(403, 'Unrecognised token type.');
  }

  if (!user) {
    throw new ApiError(401, 'User account not found. Token is no longer valid.');
  }

  // isActive check (Admin & Student models have this field)
  if (user.isActive === false) {
    throw new ApiError(403, 'Your account has been deactivated. Please contact support.');
  }

  return { user, decoded };
};

/* ═══════════════════════════════════════════════
   MIDDLEWARE: protect – require any valid JWT
   ═══════════════════════════════════════════════ */
/**
 * General authentication guard.
 * Checks cookies in order: admin → student → school.
 * Attaches req.user and req.userType on success.
 */
const protect = asyncHandler(async (req, res, next) => {
  // Try admin token first
  let token = extractToken(req, COOKIE_NAMES.ADMIN_TOKEN);
  if (token) {
    const { user } = await verifyAndLoad(token, 'admin');
    req.user     = user;
    req.userType = 'admin';
    return next();
  }

  // Try student token
  token = extractToken(req, COOKIE_NAMES.STUDENT_TOKEN);
  if (token) {
    const { user } = await verifyAndLoad(token, 'student');
    req.user     = user;
    req.userType = 'student';
    return next();
  }

  // Try school token
  token = extractToken(req, COOKIE_NAMES.SCHOOL_TOKEN);
  if (token) {
    const { user } = await verifyAndLoad(token, 'school');
    req.user     = user;
    req.userType = 'school';
    return next();
  }

  throw new ApiError(401, 'Authentication required. Please log in.');
});

/* ═══════════════════════════════════════════════
   MIDDLEWARE: protectAdmin – require admin JWT
   ═══════════════════════════════════════════════ */
const protectAdmin = asyncHandler(async (req, res, next) => {
  const token = extractToken(req, COOKIE_NAMES.ADMIN_TOKEN);
  if (!token) throw new ApiError(401, 'Admin authentication required.');

  const { user } = await verifyAndLoad(token, 'admin');
  req.user     = user;
  req.userType = 'admin';
  next();
});

/* ═══════════════════════════════════════════════
   MIDDLEWARE: protectStudent – require student JWT
   ═══════════════════════════════════════════════ */
const protectStudent = asyncHandler(async (req, res, next) => {
  const token = extractToken(req, COOKIE_NAMES.STUDENT_TOKEN);
  if (!token) throw new ApiError(401, 'Student authentication required.');

  const { user } = await verifyAndLoad(token, 'student');
  req.user     = user;
  req.userType = 'student';
  next();
});

/* ═══════════════════════════════════════════════
   MIDDLEWARE: protectSchool – require school JWT
   ═══════════════════════════════════════════════ */
const protectSchool = asyncHandler(async (req, res, next) => {
  const token = extractToken(req, COOKIE_NAMES.SCHOOL_TOKEN);
  if (!token) throw new ApiError(401, 'School authentication required.');

  const { user } = await verifyAndLoad(token, 'school');
  req.user     = user;
  req.userType = 'school';
  next();
});

/* ═══════════════════════════════════════════════
   MIDDLEWARE: authorizeRoles – restrict by role
   Usage: authorizeRoles('superadmin', 'moderator')
   ═══════════════════════════════════════════════ */
const authorizeRoles = (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    // For admin sub-roles; req.user.role = 'superadmin' | 'moderator' | etc.
    const userRole = req.userType === 'admin' ? req.user.role : req.userType;

    if (!allowedRoles.includes(userRole)) {
      return next(
        new ApiError(403, `Role '${userRole}' is not permitted to access this resource.`)
      );
    }
    next();
  };

/* ═══════════════════════════════════════════════
   MIDDLEWARE: requirePermission – granular permission check
   Usage: requirePermission('olympiads:write')
   ═══════════════════════════════════════════════ */
const requirePermission = (permission) =>
  (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    // Superadmin always passes
    if (req.user.role === 'superadmin') return next();

    const hasPermission =
      Array.isArray(req.user.permissions) &&
      req.user.permissions.includes(permission);

    if (!hasPermission) {
      return next(
        new ApiError(403, `Missing permission: '${permission}'.`)
      );
    }
    next();
  };

module.exports = {
  protect,
  protectAdmin,
  protectStudent,
  protectSchool,
  authorizeRoles,
  requirePermission,
};
