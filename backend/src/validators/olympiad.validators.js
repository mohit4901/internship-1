const { z } = require('zod');

const VALID_GRADES  = ['6', '7', '8', '9', '10', '11', '12', 'UG'];
const VALID_STATUS  = ['Draft', 'Active', 'RegistrationClosed', 'Finished'];
const VALID_CATS    = ['Junior', 'Senior', 'Masters'];

/* ── syllabus entry ─────────────────────────────────────────────────────────── */
const syllabusEntrySchema = z.object({
  topic: z.string().trim().min(1, 'Syllabus topic cannot be empty'),
  subtopics: z.array(z.string().trim()).optional().default([]),
});

/* ══════════════════════════════════════════════════════════════════════════════
   CREATE OLYMPIAD  —  POST /api/v1/olympiads
   Access: Admin (olympiads:write)
   ══════════════════════════════════════════════════════════════════════════════ */
const createOlympiadSchema = z
  .object({
    title: z
      .string({ required_error: 'Olympiad title is required' })
      .trim()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title cannot exceed 200 characters'),

    description: z
      .string({ required_error: 'Olympiad description is required' })
      .trim()
      .min(20, 'Description must be at least 20 characters'),

    category: z.enum(VALID_CATS, {
      required_error: 'Category is required',
      invalid_type_error: `Category must be one of: ${VALID_CATS.join(', ')}`,
    }),

    gradesSupported: z
      .array(z.enum(VALID_GRADES, { invalid_type_error: 'Invalid grade value' }))
      .min(1, 'At least one grade must be supported'),

    registrationFee: z
      .number({ required_error: 'Registration fee is required', invalid_type_error: 'Fee must be a number' })
      .min(0, 'Fee cannot be negative'),

    currency: z
      .string()
      .trim()
      .length(3, 'Currency must be a 3-letter ISO code (e.g. INR, USD)')
      .toUpperCase()
      .optional()
      .default('INR'),

    timeline: z.object({
      registrationStart: z.coerce.date({ required_error: 'Registration start date is required' }),
      registrationEnd:   z.coerce.date({ required_error: 'Registration end date is required' }),
      examDate:          z.coerce.date({ required_error: 'Exam date is required' }),
    }),

    syllabus: z.array(syllabusEntrySchema).optional().default([]),

    rules: z
      .array(z.string().trim().min(1))
      .optional()
      .default([]),

    maxRegistrations: z
      .number()
      .int('Max registrations must be a whole number')
      .min(0, 'Max registrations cannot be negative')
      .optional()
      .default(0),

    status: z.enum(VALID_STATUS).optional().default('Draft'),
  })
  .superRefine((data, ctx) => {
    const { registrationStart, registrationEnd, examDate } = data.timeline;
    if (registrationEnd <= registrationStart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['timeline', 'registrationEnd'],
        message: 'Registration end date must be after registration start date',
      });
    }
    if (examDate <= registrationEnd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['timeline', 'examDate'],
        message: 'Exam date must be after registration end date',
      });
    }
  });

/* ══════════════════════════════════════════════════════════════════════════════
   UPDATE OLYMPIAD  —  PATCH /api/v1/olympiads/:id
   All fields optional; timeline cross-validation only when both sides supplied.
   Access: Admin (olympiads:write)
   ══════════════════════════════════════════════════════════════════════════════ */
const updateOlympiadSchema = z
  .object({
    title: z.string().trim().min(3).max(200).optional(),
    description: z.string().trim().min(20).optional(),
    category: z.enum(VALID_CATS).optional(),
    gradesSupported: z.array(z.enum(VALID_GRADES)).min(1).optional(),
    registrationFee: z.number().min(0).optional(),
    currency: z.string().trim().length(3).toUpperCase().optional(),
    timeline: z
      .object({
        registrationStart: z.coerce.date().optional(),
        registrationEnd:   z.coerce.date().optional(),
        examDate:          z.coerce.date().optional(),
      })
      .optional(),
    syllabus: z.array(syllabusEntrySchema).optional(),
    rules: z.array(z.string().trim().min(1)).optional(),
    maxRegistrations: z.number().int().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    const t = data.timeline;
    if (!t) return;
    if (t.registrationStart && t.registrationEnd && t.registrationEnd <= t.registrationStart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['timeline', 'registrationEnd'],
        message: 'Registration end date must be after registration start date',
      });
    }
    if (t.registrationEnd && t.examDate && t.examDate <= t.registrationEnd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['timeline', 'examDate'],
        message: 'Exam date must be after registration end date',
      });
    }
  });

/* ══════════════════════════════════════════════════════════════════════════════
   CHANGE STATUS  —  PATCH /api/v1/olympiads/:id/status
   Access: Admin (olympiads:write)
   ══════════════════════════════════════════════════════════════════════════════ */
const changeStatusSchema = z.object({
  status: z.enum(VALID_STATUS, {
    required_error: 'Status is required',
    invalid_type_error: `Status must be one of: ${VALID_STATUS.join(', ')}`,
  }),
});

/* ══════════════════════════════════════════════════════════════════════════════
   LIST QUERY PARAMS  —  GET /api/v1/olympiads
   ══════════════════════════════════════════════════════════════════════════════ */
const listOlympiadsQuerySchema = z.object({
  status:   z.enum(VALID_STATUS).optional(),
  category: z.enum(VALID_CATS).optional(),
  grade:    z.enum(VALID_GRADES).optional(),
  page:     z.coerce.number().int().min(1).optional().default(1),
  limit:    z.coerce.number().int().min(1).max(100).optional().default(10),
  sort:     z
    .enum(['createdAt', '-createdAt', 'timeline.examDate', '-timeline.examDate'])
    .optional()
    .default('-createdAt'),
});

module.exports = {
  createOlympiadSchema,
  updateOlympiadSchema,
  changeStatusSchema,
  listOlympiadsQuerySchema,
};
