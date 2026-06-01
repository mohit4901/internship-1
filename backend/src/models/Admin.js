const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an admin name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide a contact email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a secure password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false
    },
    role: {
      type: String,
      enum: ['superadmin', 'moderator', 'finance', 'support'],
      default: 'support'
    },
    permissions: [
      {
        type: String,
        enum: [
          'users:read',
          'users:write',
          'olympiads:write',
          'registrations:read',
          'registrations:write',
          'payments:read',
          'announcements:write',
          'results:write'
        ]
      }
    ],
    isMfaEnabled: {
      type: Boolean,
      default: false
    },
    mfaSecret: {
      type: String,
      select: false
    },
    lastLogin: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // ── Security Question / Forgot-Password ──────────────────────────────────
    securityQuestion: {
      type: String,
      trim: true,
      select: false   // never returned in normal queries
    },
    securityAnswerHash: {
      type: String,
      select: false   // bcrypt hash — never exposed
    },
    passwordResetToken: {
      type: String,
      select: false
    },
    passwordResetExpire: {
      type: Date,
      select: false
    }
  },
  {
    timestamps: true
  }
);

// Encrypt password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare user password
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compare security answer (case-insensitive, trimmed)
adminSchema.methods.compareSecurityAnswer = async function (candidateAnswer) {
  if (!this.securityAnswerHash) return false;
  return await bcrypt.compare(candidateAnswer.trim().toLowerCase(), this.securityAnswerHash);
};

// Generate a cryptographically secure password-reset token (plain returned, SHA-256 hash stored)
adminSchema.methods.generatePasswordResetToken = function () {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken  = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  return resetToken;
};

// Generate JWT token
adminSchema.methods.generateJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, type: 'admin' },
    process.env.JWT_SECRET || 'fallback_secret_for_local_development_only',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = mongoose.model('Admin', adminSchema);
