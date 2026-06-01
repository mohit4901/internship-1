/**
 * Application-wide constants for BAIO Backend.
 * Centralises cookie names, token expiry values, and role enumerations.
 */

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
};

const ACCESS_TOKEN_EXPIRY  = process.env.JWT_EXPIRE       || '7d';
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRE || '30d';

const COOKIE_NAMES = {
  ADMIN_TOKEN:   'baio_admin_token',
  STUDENT_TOKEN: 'baio_student_token',
  SCHOOL_TOKEN:  'baio_school_token',
};

const ROLES = {
  ADMIN:   'admin',
  STUDENT: 'student',
  SCHOOL:  'school',
};

const ADMIN_SUB_ROLES = ['superadmin', 'moderator', 'finance', 'support'];

module.exports = {
  COOKIE_OPTIONS,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  COOKIE_NAMES,
  ROLES,
  ADMIN_SUB_ROLES,
};
