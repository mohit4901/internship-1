/**
 * student.validators.js
 *
 * Validation schemas for the Student profile management module.
 * Registration/login schemas live in auth.validators.js — not repeated here.
 */

const { z } = require('zod');

const VALID_GRADES  = ['6', '7', '8', '9', '10', '11', '12', 'UG'];
const VALID_GENDERS = ['Male', 'Female', 'Other'];

/* ══════════════════════════════════════════════════════════════════════════════
   UPDATE OWN PROFILE  —  PATCH /api/v1/students/me
   Students may update personal/contact info but NOT email, class, or schoolId.
   All fields are optional; at least one must be provided.
   ══════════════════════════════════════════════════════════════════════════════ */
const updateStudentProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters')
      .optional(),

    phone: z
      .string()
      .trim()
      .regex(/^[0-9]{10}$/, 'Phone must be a valid 10-digit mobile number')
      .optional(),

    section: z
      .string()
      .trim()
      .max(10, 'Section cannot exceed 10 characters')
      .optional(),

    gender: z.enum(VALID_GENDERS, {
      invalid_type_error: `Gender must be one of: ${VALID_GENDERS.join(', ')}`,
    }).optional(),

    dob: z.coerce
      .date()
      .max(new Date(), 'Date of birth cannot be in the future')
      .optional(),

    address: z
      .object({
        street: z.string().trim().optional(),
        city:   z.string().trim().min(1, 'City cannot be empty').optional(),
        state:  z.string().trim().min(1, 'State cannot be empty').optional(),
        zip:    z.string().trim().regex(/^[0-9]{6}$/, 'ZIP must be a 6-digit PIN code').optional(),
      })
      .optional(),

    parent: z
      .object({
        name:  z.string().trim().min(2, 'Parent name must be at least 2 characters').optional(),
        phone: z.string().trim().regex(/^[0-9]{10}$/, 'Parent phone must be 10 digits').optional(),
        email: z.string().trim().toLowerCase().email('Invalid parent email').optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Reject empty update payloads
    const hasAtLeastOne = Object.values(data).some((v) => v !== undefined);
    if (!hasAtLeastOne) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field must be provided to update the profile.',
      });
    }
  });

/* ══════════════════════════════════════════════════════════════════════════════
   ADMIN — LIST STUDENTS QUERY  —  GET /api/v1/students
   ══════════════════════════════════════════════════════════════════════════════ */
const listStudentsQuerySchema = z.object({
  class:    z.enum(VALID_GRADES).optional(),
  schoolId: z.string().trim().optional(),
  isActive: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
  search: z
    .string()
    .trim()
    .max(100, 'Search term too long')
    .optional(),
  page:  z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sort:  z
    .enum(['createdAt', '-createdAt', 'name', '-name'])
    .optional()
    .default('-createdAt'),
});

/* ══════════════════════════════════════════════════════════════════════════════
   ADMIN — TOGGLE STUDENT ACTIVE STATUS
   PATCH /api/v1/students/:id/status
   ══════════════════════════════════════════════════════════════════════════════ */
const toggleStudentStatusSchema = z.object({
  isActive: z.boolean({
    required_error: 'isActive (boolean) is required',
    invalid_type_error: 'isActive must be a boolean',
  }),
  reason: z
    .string()
    .trim()
    .max(300, 'Reason cannot exceed 300 characters')
    .optional(),
});

module.exports = {
  updateStudentProfileSchema,
  listStudentsQuerySchema,
  toggleStudentStatusSchema,
};
