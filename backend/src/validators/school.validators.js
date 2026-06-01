/**
 * school.validators.js
 *
 * Validation schemas for the School management module.
 * Registration / login schemas live in auth.validators.js — not repeated here.
 */

const { z } = require('zod');

const VALID_BOARDS  = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'];

/* ══════════════════════════════════════════════════════════════════════════════
   UPDATE OWN PROFILE  —  PATCH /api/v1/schools/me
   Schools may update contact/coordinator info. Affiliation number is immutable.
   ══════════════════════════════════════════════════════════════════════════════ */
const updateSchoolProfileSchema = z
  .object({
    name: z
      .string().trim()
      .min(3, 'School name must be at least 3 characters')
      .max(200, 'School name cannot exceed 200 characters')
      .optional(),

    principalName: z
      .string().trim()
      .min(2, 'Principal name must be at least 2 characters')
      .max(100, 'Principal name cannot exceed 100 characters')
      .optional(),

    board: z.enum(VALID_BOARDS, {
      invalid_type_error: `Board must be one of: ${VALID_BOARDS.join(', ')}`,
    }).optional(),

    contactPhone: z
      .string().trim()
      .regex(/^[0-9]{10,12}$/, 'Contact phone must be 10–12 digits')
      .optional(),

    address: z.object({
      street:  z.string().trim().optional(),
      city:    z.string().trim().min(1, 'City cannot be empty').optional(),
      state:   z.string().trim().min(1, 'State cannot be empty').optional(),
      zip:     z.string().trim().regex(/^[0-9]{6}$/, 'ZIP must be a 6-digit PIN code').optional(),
      country: z.string().trim().optional(),
    }).optional(),

    coordinator: z.object({
      name:  z.string().trim().min(2, 'Coordinator name must be at least 2 characters').optional(),
      phone: z.string().trim().regex(/^[0-9]{10,12}$/, 'Coordinator phone must be 10–12 digits').optional(),
      email: z.string().trim().toLowerCase().email('Invalid coordinator email').optional(),
    }).optional(),
  })
  .superRefine((data, ctx) => {
    const hasAtLeastOne = Object.values(data).some((v) => v !== undefined);
    if (!hasAtLeastOne) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field must be provided to update the profile.',
      });
    }
  });

/* ══════════════════════════════════════════════════════════════════════════════
   ADMIN — LIST SCHOOLS QUERY  —  GET /api/v1/schools
   ══════════════════════════════════════════════════════════════════════════════ */
const listSchoolsQuerySchema = z.object({
  isVerified: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
  state:  z.string().trim().optional(),
  city:   z.string().trim().optional(),
  board:  z.enum(VALID_BOARDS).optional(),
  search: z.string().trim().max(100).optional(),
  page:   z.coerce.number().int().min(1).optional().default(1),
  limit:  z.coerce.number().int().min(1).max(100).optional().default(20),
  sort:   z
    .enum(['createdAt', '-createdAt', 'name', '-name'])
    .optional()
    .default('-createdAt'),
});

/* ══════════════════════════════════════════════════════════════════════════════
   ADMIN — APPROVE / REJECT SCHOOL
   PATCH /api/v1/schools/:id/verify
   ══════════════════════════════════════════════════════════════════════════════ */
const verifySchoolSchema = z.object({
  isVerified: z.boolean({
    required_error: 'isVerified (boolean) is required',
    invalid_type_error: 'isVerified must be true or false',
  }),
  remarks: z
    .string().trim()
    .max(500, 'Remarks cannot exceed 500 characters')
    .optional(),
});

module.exports = {
  updateSchoolProfileSchema,
  listSchoolsQuerySchema,
  verifySchoolSchema,
};
