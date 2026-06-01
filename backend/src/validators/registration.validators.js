const { z } = require('zod');

const createRegistrationSchema = z.object({
  olympiadId: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Olympiad ID format'),
});

const listRegistrationsQuerySchema = z.object({
  olympiadId: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Olympiad ID format').optional(),
  studentId: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Student ID format').optional(),
  paymentStatus: z.enum(['Pending', 'Paid', 'Failed', 'Refunded']).optional(),
  registrationStatus: z.enum(['Initiated', 'Confirmed', 'Cancelled']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sort: z.enum(['createdAt', '-createdAt']).optional().default('-createdAt'),
});

module.exports = {
  createRegistrationSchema,
  listRegistrationsQuerySchema,
};
