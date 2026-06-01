const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the student name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide a registration email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Please provide student or parent mobile number'],
      unique: true,
      trim: true,
      match: [
        /^[0-9]{10}$/,
        'Please provide a valid 10-digit mobile number'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a secure account password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      default: null
    },
    class: {
      type: String,
      required: [true, 'Please specify active study class/grade'],
      enum: ['6', '7', '8', '9', '10', '11', '12', 'UG'],
      index: true
    },
    section: {
      type: String,
      trim: true
    },
    dob: {
      type: Date,
      required: [true, 'Please provide student Date of Birth']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, required: [true, 'Please provide city name'], trim: true },
      state: { type: String, required: [true, 'Please provide state name'], trim: true },
      zip: { type: String, required: [true, 'Please provide area zip code'], trim: true }
    },
    parent: {
      name: {
        type: String,
        required: [true, 'Please provide parent/guardian name'],
        trim: true
      },
      phone: {
        type: String,
        required: [true, 'Please provide parent/guardian mobile number'],
        trim: true
      },
      email: {
        type: String,
        lowercase: true,
        trim: true
      }
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      select: false
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
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Encrypt password before saving
studentSchema.pre('save', async function (next) {
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

// Compare password
studentSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compare security answer (case-insensitive, trimmed)
studentSchema.methods.compareSecurityAnswer = async function (candidateAnswer) {
  if (!this.securityAnswerHash) return false;
  return await bcrypt.compare(candidateAnswer.trim().toLowerCase(), this.securityAnswerHash);
};

// Generate a cryptographically secure password-reset token (plain returned, hashed stored)
studentSchema.methods.generatePasswordResetToken = function () {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  // Store SHA-256 hash — the plain token is sent to client (never stored)
  this.passwordResetToken  = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  return resetToken;
};

// Generate JWT token
studentSchema.methods.generateJwtToken = function () {
  return jwt.sign(
    { id: this._id, class: this.class, type: 'student' },
    process.env.JWT_SECRET || 'fallback_secret_for_local_development_only',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Compound index for batch analytics/allocations
studentSchema.index({ schoolId: 1, class: 1 });

module.exports = mongoose.model('Student', studentSchema);
