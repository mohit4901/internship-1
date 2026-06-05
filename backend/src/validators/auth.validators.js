const { z } = require('zod');

// Helper phone schema that cleans up common formatting before validation
const phoneSchema = (requiredMsg = 'Phone number is required', regexMsg = 'Please provide a valid 10-digit Indian mobile number') => z.preprocess(
  (val) => {
    if (typeof val !== 'string') return val;
    let cleaned = val.replace(/[\s\-\(\)\+]/g, '');
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      cleaned = cleaned.slice(2);
    }
    return cleaned;
  },
  z.string({ required_error: requiredMsg })
    .regex(/^[6-9]\d{9}$/, regexMsg)
);

// Helper zip schema that cleans up spaces
const zipSchema = (requiredMsg = 'ZIP code is required') => z.preprocess(
  (val) => {
    if (typeof val !== 'string') return val;
    return val.replace(/\s+/g, '');
  },
  z.string({ required_error: requiredMsg })
    .regex(/^\d{6}$/, 'Please provide a valid 6-digit PIN code')
);


/* ──────────────────────────────────────────
   Admin Auth Validators
   ────────────────────────────────────────── */
const adminRegisterSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  role: z
    .enum(['superadmin', 'moderator', 'finance', 'support'])
    .optional()
    .default('support'),
});

const adminLoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

/* ──────────────────────────────────────────
   Student Auth Validators
   ────────────────────────────────────────── */
const studentRegisterSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),
  phone: phoneSchema('Phone number is required'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase and a number'
    ),
  schoolId: z
    .string({ required_error: 'School ID is required' })
    .regex(/^[a-fA-F0-9]{24}$/, 'Please provide a valid school ID'),
  class: z
    .string({ required_error: 'Class is required' })
    .trim(),
  section: z.string().trim().optional(),
  dob: z
    .string({ required_error: 'Date of birth is required' })
    .refine((v) => !isNaN(Date.parse(v)), 'Please provide a valid date of birth'),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  parent: z.object({
    name:  z.string().trim().min(2, 'Parent name must be at least 2 characters'),
    phone: phoneSchema('Parent phone number is required', 'Please provide a valid parent phone number'),
    email: z.string().trim().toLowerCase().email('Please provide a valid parent email').optional(),
  }).optional(),
  address: z.object({
    street: z.string().trim().optional(),
    city:   z.string().trim().min(1, 'City is required'),
    state:  z.string().trim().min(1, 'State is required'),
    zip:    zipSchema('ZIP code is required'),
  }).optional(),
});

const studentLoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

/* ──────────────────────────────────────────
   School Auth Validators
   ────────────────────────────────────────── */
const schoolRegisterSchema = z.object({
  name: z
    .string({ required_error: 'School name is required' })
    .trim()
    .min(3, 'School name must be at least 3 characters'),
  affiliationNumber: z
    .string({ required_error: 'Affiliation number is required' })
    .trim()
    .min(3, 'Affiliation number must be at least 3 characters'),
  board: z.enum(['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'], {
    required_error: 'Educational board is required',
  }),
  address: z.object({
    street: z.string().trim().optional(),
    city:   z.string({ required_error: 'City is required' }).trim().min(1),
    state:  z.string({ required_error: 'State is required' }).trim().min(1),
    zip:    zipSchema('ZIP code is required'),
    country: z.string().trim().optional().default('India'),
  }),
  contactEmail: z
    .string({ required_error: 'Contact email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid school email'),
  contactPhone: phoneSchema('Contact phone is required', 'Please provide a valid 10-digit phone number'),
  principalName: z.string().trim().optional(),
  coordinator: z.object({
    name:  z.string({ required_error: 'Coordinator name is required' }).trim().min(2),
    phone: phoneSchema('Coordinator phone is required', 'Please provide a valid coordinator phone'),
    email: z.string({ required_error: 'Coordinator email is required' }).trim().toLowerCase().email('Please provide a valid coordinator email'),
  }),
});

const schoolLoginSchema = z.object({
  contactEmail: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),
  affiliationNumber: z
    .string({ required_error: 'Affiliation number is required' })
    .trim(),
});

module.exports = {
  adminRegisterSchema,
  adminLoginSchema,
  studentRegisterSchema,
  studentLoginSchema,
  schoolRegisterSchema,
  schoolLoginSchema,
};
