const { z } = require('zod');

const VALID_CATEGORIES = ['General', 'Schedule', 'OlympiadInfo', 'Emergency'];
const VALID_AUDIENCE   = ['All', 'Junior', 'Senior', 'Masters', 'Schools'];

const createAnnouncementSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(150, 'Title cannot exceed 150 characters'),
  content: z
    .string({ required_error: 'Content description is required' })
    .trim()
    .min(10, 'Content description must be at least 10 characters'),
  category: z.enum(VALID_CATEGORIES).optional().default('General'),
  targetAudience: z.enum(VALID_AUDIENCE).optional().default('All'),
  olympiadId: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Olympiad ID').optional().nullable(),
  isPinned: z.boolean().optional().default(false),
  publishedAt: z.coerce.date().optional().default(() => new Date()),
  expiresAt: z.coerce.date().optional().nullable().default(null),
});

const updateAnnouncementSchema = z.object({
  title: z.string().trim().min(3).max(150).optional(),
  content: z.string().trim().min(10).optional(),
  category: z.enum(VALID_CATEGORIES).optional(),
  targetAudience: z.enum(VALID_AUDIENCE).optional(),
  olympiadId: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Olympiad ID').optional().nullable(),
  isPinned: z.boolean().optional(),
  publishedAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional().nullable(),
});

const listAnnouncementsQuerySchema = z.object({
  category: z.enum(VALID_CATEGORIES).optional(),
  targetAudience: z.enum(VALID_AUDIENCE).optional(),
  olympiadId: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Olympiad ID').optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sort: z.enum(['publishedAt', '-publishedAt']).optional().default('-publishedAt'),
});

module.exports = {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  listAnnouncementsQuerySchema,
};
