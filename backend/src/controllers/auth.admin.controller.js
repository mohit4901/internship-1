const Admin          = require('../models/Admin');
const { ApiError }     = require('../utils/apiError');
const { ApiResponse }  = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const { COOKIE_OPTIONS, COOKIE_NAMES } = require('../config/constants');

/* ─────────────────────────────────────────────
   Helper: send token as HttpOnly cookie + body
   ───────────────────────────────────────────── */
const sendAdminToken = (admin, statusCode, res, message) => {
  const token = admin.generateJwtToken();

  const cookieExpireMs =
    parseInt(process.env.JWT_COOKIE_EXPIRE_DAYS || '7', 10) * 24 * 60 * 60 * 1000;

  res
    .status(statusCode)
    .cookie(COOKIE_NAMES.ADMIN_TOKEN, token, {
      ...COOKIE_OPTIONS,
      maxAge: cookieExpireMs,
    })
    .json(
      new ApiResponse(statusCode, { token, admin: sanitize(admin) }, message)
    );
};

/* ─────────────────────────────────────────────
   Helper: strip sensitive fields before sending
   ───────────────────────────────────────────── */
const sanitize = (admin) => ({
  _id:          admin._id,
  name:         admin.name,
  email:        admin.email,
  role:         admin.role,
  permissions:  admin.permissions,
  isActive:     admin.isActive,
  lastLogin:    admin.lastLogin,
  isMfaEnabled: admin.isMfaEnabled,
  createdAt:    admin.createdAt,
});

/* ═══════════════════════════════════════════════
   @route  POST /api/v1/auth/admin/register
   @access Private (superadmin only – seeded via script or first-run)
   ═══════════════════════════════════════════════ */
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check for existing admin
  const existing = await Admin.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'An admin account with this email already exists.');
  }

  const admin = await Admin.create({ name, email, password, role });

  sendAdminToken(admin, 201, res, 'Admin account created successfully.');
});

/* ═══════════════════════════════════════════════
   @route  POST /api/v1/auth/admin/login
   @access Public
   ═══════════════════════════════════════════════ */
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Fetch with password (field is select:false in schema)
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (!admin.isActive) {
    throw new ApiError(403, 'Your admin account has been deactivated. Contact a superadmin.');
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // Update lastLogin timestamp
  admin.lastLogin = new Date();
  await admin.save({ validateBeforeSave: false });

  sendAdminToken(admin, 200, res, 'Admin logged in successfully.');
});

/* ═══════════════════════════════════════════════
   @route  POST /api/v1/auth/admin/logout
   @access Private (admin)
   ═══════════════════════════════════════════════ */
const logoutAdmin = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie(COOKIE_NAMES.ADMIN_TOKEN, COOKIE_OPTIONS)
    .json(new ApiResponse(200, {}, 'Admin logged out successfully.'));
});

/* ═══════════════════════════════════════════════
   @route  GET /api/v1/auth/admin/me
   @access Private (admin)
   ═══════════════════════════════════════════════ */
const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user._id);
  if (!admin) throw new ApiError(404, 'Admin not found.');

  res.status(200).json(new ApiResponse(200, sanitize(admin), 'Admin profile fetched.'));
});

module.exports = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
};
