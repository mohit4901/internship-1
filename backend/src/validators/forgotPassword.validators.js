const { z } = require('zod');

// ── Predefined question bank (frontend should use this list) ─────────────────
const SECURITY_QUESTIONS = [
  "What is the name of your first school?",
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What is your favourite childhood book?",
  "What city were you born in?",
  "What is the name of your best childhood friend?",
  "What was the make of your first car?",
  "What is your eldest sibling's middle name?",
  "What was the name of the street you grew up on?",
  "What is your maternal grandmother's first name?",
];

/* ──────────────────────────────────────────────────────────────────────────────
   Step 0 — Set security question (called at registration or via profile)
   Body: { securityQuestion, securityAnswer }
   ────────────────────────────────────────────────────────────────────────────── */
const setSecurityQuestionSchema = z.object({
  securityQuestion: z
    .string({ required_error: 'Security question is required' })
    .trim()
    .min(10, 'Security question must be at least 10 characters')
    .max(255, 'Security question is too long'),
  securityAnswer: z
    .string({ required_error: 'Security answer is required' })
    .trim()
    .min(2, 'Security answer must be at least 2 characters')
    .max(100, 'Security answer cannot exceed 100 characters'),
});

/* ──────────────────────────────────────────────────────────────────────────────
   Step 1 — Lookup: user submits email
   Response will return the security question (not the answer)
   Body: { email }
   ────────────────────────────────────────────────────────────────────────────── */
const forgotPasswordStep1Schema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),
});

/* ──────────────────────────────────────────────────────────────────────────────
   Step 2 — Verify: user submits email + security answer
   Response will return a short-lived reset token on success
   Body: { email, securityAnswer }
   ────────────────────────────────────────────────────────────────────────────── */
const forgotPasswordStep2Schema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),
  securityAnswer: z
    .string({ required_error: 'Security answer is required' })
    .trim()
    .min(1, 'Security answer cannot be empty')
    .max(100, 'Security answer cannot exceed 100 characters'),
});

/* ──────────────────────────────────────────────────────────────────────────────
   Step 3 — Reset: user submits resetToken + new password
   Body: { resetToken, password, confirmPassword }
   ────────────────────────────────────────────────────────────────────────────── */
const resetPasswordSchema = z.object({
  resetToken: z
    .string({ required_error: 'Reset token is required' })
    .trim()
    .min(1, 'Reset token cannot be empty'),
  password: z
    .string({ required_error: 'New password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z
    .string({ required_error: 'Please confirm your new password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

module.exports = {
  SECURITY_QUESTIONS,
  setSecurityQuestionSchema,
  forgotPasswordStep1Schema,
  forgotPasswordStep2Schema,
  resetPasswordSchema,
};
