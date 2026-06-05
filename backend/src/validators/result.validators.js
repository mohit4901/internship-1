const { z } = require('zod');

const createResultSchema = z.object({
  participantId: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid participant ID'),
  olympiadId: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Olympiad ID'),
  rollNumber: z.string().trim().min(3, 'Roll number must be at least 3 characters'),
  scores: z.object({
    logicalReasoning: z.number().min(0),
    algorithmicThinking: z.number().min(0),
    aiCore: z.number().min(0),
    totalMarksObtained: z.number().min(0),
  }),
  totalMaxMarks: z.number().min(1).optional().default(100),
  percentage: z.number().min(0).max(100),
  percentile: z.number().min(0).max(100),
  rankings: z.object({
    national: z.number().int().min(1),
    state: z.number().int().min(1),
    school: z.number().int().min(1).optional().nullable(),
  }),
  qualificationStatus: z.enum(['Qualified', 'Participated', 'MeritAwardee', 'NationalRanker']).optional().default('Participated'),
  scorecardUrl: z.string().trim().url('Invalid scorecard URL').optional(),
  certificateUrl: z.string().trim().url('Invalid certificate URL').optional(),
  isPublished: z.boolean().optional().default(false),
});

const updateResultSchema = z.object({
  rollNumber: z.string().trim().min(3).optional(),
  scores: z.object({
    logicalReasoning: z.number().min(0).optional(),
    algorithmicThinking: z.number().min(0).optional(),
    aiCore: z.number().min(0).optional(),
    totalMarksObtained: z.number().min(0).optional(),
  }).optional(),
  totalMaxMarks: z.number().min(1).optional(),
  percentage: z.number().min(0).max(100).optional(),
  percentile: z.number().min(0).max(100).optional(),
  rankings: z.object({
    national: z.number().int().min(1).optional(),
    state: z.number().int().min(1).optional(),
    school: z.number().int().min(1).optional().nullable(),
  }).optional(),
  qualificationStatus: z.enum(['Qualified', 'Participated', 'MeritAwardee', 'NationalRanker']).optional(),
  scorecardUrl: z.string().trim().url().optional(),
  certificateUrl: z.string().trim().url().optional(),
  isPublished: z.boolean().optional(),
});

const searchResultQuerySchema = z.object({
  rollNumber: z.string({ required_error: 'Roll number is required to search results' }).trim().min(3),
});

const listResultsQuerySchema = z.object({
  olympiadId: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Olympiad ID').optional(),
  participantId: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid participant ID').optional(),
  rollNumber: z.string().trim().optional(),
  isPublished: z.string().transform((v) => v === 'true').optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sort: z.enum(['createdAt', '-createdAt', 'scores.totalMarksObtained', '-scores.totalMarksObtained']).optional().default('-createdAt'),
});

module.exports = {
  createResultSchema,
  updateResultSchema,
  searchResultQuerySchema,
  listResultsQuerySchema,
};
