const { z } = require('zod');

const createContactSubmissionSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Invalid email address format'),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .regex(/^[0-9]{10,12}$/, 'Phone number must be a valid 10 to 12 digit number'),
  subject: z
    .string()
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .optional()
    .default('General Inquiry'),
  message: z
    .string({ required_error: 'Message content is required' })
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message cannot exceed 2000 characters'),
});

const updateContactStatusSchema = z.object({
  status: z.enum(['New', 'InProgress', 'Resolved'], {
    required_error: 'Status is required',
  }),
  note: z
    .string()
    .trim()
    .min(5, 'Timeline note must be at least 5 characters')
    .optional(),
});

const listSubmissionsQuerySchema = z.object({
  status: z.enum(['New', 'InProgress', 'Resolved']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sort: z.enum(['createdAt', '-createdAt']).optional().default('-createdAt'),
});

module.exports = {
  createContactSubmissionSchema,
  updateContactStatusSchema,
  listSubmissionsQuerySchema,
};
