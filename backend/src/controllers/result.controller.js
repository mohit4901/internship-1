const Result = require('../models/Result');
const Participant = require('../models/Participant');
const Olympiad = require('../models/Olympiad');
const { ApiError } = require('../utils/apiError');
const { ApiResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const mongoose = require('mongoose');

/* ─────────────────────────────────────────────────────────────────────────────
   Helper: valid ObjectId guard
   ───────────────────────────────────────────────────────────────────────────── */
const assertObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid ID format.');
  }
};

/* ═══════════════════════════════════════════════════════════════════════════════
   CREATE RESULT (Admin)
   POST /api/v1/results
   Access: Admin only (results:write)
   ═══════════════════════════════════════════════════════════════════════════════ */
const createResult = asyncHandler(async (req, res) => {
  const {
    participantId,
    olympiadId,
    rollNumber,
    scores,
    totalMaxMarks,
    percentage,
    percentile,
    rankings,
    qualificationStatus,
    scorecardUrl,
    certificateUrl,
    isPublished,
  } = req.body;

  // Validate reference IDs
  assertObjectId(participantId);
  assertObjectId(olympiadId);

  // Check duplicate result for participant
  const duplicateReg = await Result.findOne({ participantId });
  if (duplicateReg) {
    throw new ApiError(409, 'A result is already created for this participant.');
  }

  // Check duplicate roll number
  const duplicateRoll = await Result.findOne({ rollNumber });
  if (duplicateRoll) {
    throw new ApiError(409, 'This roll number is already associated with another result.');
  }

  const result = await Result.create({
    participantId,
    olympiadId,
    rollNumber,
    scores,
    totalMaxMarks,
    percentage,
    percentile,
    rankings,
    qualificationStatus,
    scorecardUrl,
    certificateUrl,
    isPublished,
    publishedAt: isPublished ? new Date() : null,
  });

  const populated = await Result.findById(result._id)
    .populate({ path: 'participantId', select: 'name class section rollNo', populate: { path: 'schoolId', select: 'name' } })
    .populate('olympiadId', 'title category');

  res.status(201).json(
    new ApiResponse(201, { result: populated }, 'Result saved successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   UPDATE RESULT (Admin)
   PATCH /api/v1/results/:id
   Access: Admin only (results:write)
   ═══════════════════════════════════════════════════════════════════════════════ */
const updateResult = asyncHandler(async (req, res) => {
  const { id } = req.params;
  assertObjectId(id);

  const result = await Result.findById(id);
  if (!result) {
    throw new ApiError(404, 'Result not found.');
  }

  const {
    rollNumber,
    scores,
    totalMaxMarks,
    percentage,
    percentile,
    rankings,
    qualificationStatus,
    scorecardUrl,
    certificateUrl,
    isPublished,
  } = req.body;

  if (rollNumber && rollNumber !== result.rollNumber) {
    const duplicateRoll = await Result.findOne({ rollNumber });
    if (duplicateRoll) {
      throw new ApiError(409, 'This roll number is already associated with another result.');
    }
    result.rollNumber = rollNumber;
  }

  if (scores) {
    result.scores = { ...result.scores, ...scores };
  }
  if (rankings) {
    result.rankings = { ...result.rankings, ...rankings };
  }

  if (totalMaxMarks !== undefined) result.totalMaxMarks = totalMaxMarks;
  if (percentage !== undefined)     result.percentage = percentage;
  if (percentile !== undefined)     result.percentile = percentile;
  if (qualificationStatus !== undefined) result.qualificationStatus = qualificationStatus;
  if (scorecardUrl !== undefined)   result.scorecardUrl = scorecardUrl;
  if (certificateUrl !== undefined) result.certificateUrl = certificateUrl;

  if (isPublished !== undefined) {
    result.isPublished = isPublished;
    if (isPublished && !result.publishedAt) {
      result.publishedAt = new Date();
    } else if (!isPublished) {
      result.publishedAt = null;
    }
  }

  const updated = await result.save();
  const populated = await Result.findById(updated._id)
    .populate({ path: 'participantId', select: 'name class section rollNo', populate: { path: 'schoolId', select: 'name' } })
    .populate('olympiadId', 'title category');

  res.status(200).json(
    new ApiResponse(200, { result: populated }, 'Result updated successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   DELETE RESULT (Admin)
   DELETE /api/v1/results/:id
   Access: Admin only (results:write)
   ═══════════════════════════════════════════════════════════════════════════════ */
const deleteResult = asyncHandler(async (req, res) => {
  const { id } = req.params;
  assertObjectId(id);

  const result = await Result.findById(id);
  if (!result) {
    throw new ApiError(404, 'Result not found.');
  }

  await result.deleteOne();

  res.status(200).json(
    new ApiResponse(200, {}, 'Result deleted successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   LIST RESULTS (Admin)
   GET /api/v1/results
   Access: Admin only (results:read)
   ═══════════════════════════════════════════════════════════════════════════════ */
const listResults = asyncHandler(async (req, res) => {
  const {
    olympiadId,
    participantId,
    rollNumber,
    isPublished,
    page = 1,
    limit = 20,
    sort = '-createdAt',
  } = req.query;

  const filter = {};
  if (olympiadId) filter.olympiadId = olympiadId;
  if (participantId) filter.participantId = participantId;
  if (isPublished !== undefined) filter.isPublished = isPublished;
  if (rollNumber) filter.rollNumber = new RegExp(rollNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

  const sortObj = sort.startsWith('-') ? { [sort.slice(1)]: -1 } : { [sort]: 1 };
  const skip = (Number(page) - 1) * Number(limit);

  const [results, total] = await Promise.all([
    Result.find(filter)
      .populate({ path: 'participantId', select: 'name class section rollNo', populate: { path: 'schoolId', select: 'name' } })
      .populate('olympiadId', 'title category registrationFee')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Result.countDocuments(filter)
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        results,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      },
      'Results retrieved successfully.'
    )
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   GET OWN RESULTS (Student Portal - legacy fallback)
   GET /api/v1/results/me
   Access: Student only
   ═══════════════════════════════════════════════════════════════════════════════ */
const getOwnResults = asyncHandler(async (req, res) => {
  const results = await Result.find({ participantId: req.user._id, isPublished: true })
    .populate('olympiadId', 'title category timelines timelines.examDate')
    .sort('-createdAt')
    .lean();

  res.status(200).json(
    new ApiResponse(200, { results }, 'Your results fetched successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   SEARCH RESULTS (Public / Student)
   GET /api/v1/results/search?rollNumber=...
   Access: Public
   ═══════════════════════════════════════════════════════════════════════════════ */
const searchResult = asyncHandler(async (req, res) => {
  const { rollNumber } = req.query;

  const result = await Result.findOne({ rollNumber, isPublished: true })
    .populate({ path: 'participantId', select: 'name', populate: { path: 'schoolId', select: 'name' } })
    .populate('olympiadId', 'title category')
    .lean();

  if (!result) {
    throw new ApiError(404, 'No published result found for the provided Roll Number.');
  }

  // Sanitize data for public display to ensure privacy (e.g. no student phone/email)
  const sanitizedResult = {
    rollNumber: result.rollNumber,
    studentName: result.participantId ? result.participantId.name : 'N/A',
    schoolName: result.participantId?.schoolId ? result.participantId.schoolId.name : 'N/A',
    olympiad: result.olympiadId ? result.olympiadId.title : 'N/A',
    category: result.olympiadId ? result.olympiadId.category : 'N/A',
    scores: result.scores,
    totalMaxMarks: result.totalMaxMarks,
    percentage: result.percentage,
    percentile: result.percentile,
    rankings: {
      national: result.rankings.national,
      state: result.rankings.state,
    },
    qualificationStatus: result.qualificationStatus,
    scorecardUrl: result.scorecardUrl,
    certificateUrl: result.certificateUrl,
    publishedAt: result.publishedAt,
  };

  res.status(200).json(
    new ApiResponse(200, { result: sanitizedResult }, 'Result details fetched successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   PUBLISH RESULTS SCHOOL-WISE
   PATCH /api/v1/results/publish/school/:schoolId
   Body: { isPublished: true|false }
   Access: Admin only (results:write)
   ═══════════════════════════════════════════════════════════════════════════════ */
const publishResultsForSchool = asyncHandler(async (req, res) => {
  const { schoolId } = req.params;
  const { isPublished } = req.body;

  if (isPublished === undefined) {
    throw new ApiError(400, 'isPublished field is required in request body.');
  }

  assertObjectId(schoolId);
  const school = await School.findById(schoolId);
  if (!school) throw new ApiError(404, 'School not found.');

  // Find participants for this school
  const participants = await Participant.find({ schoolId }).select('_id').lean();
  const participantIds = participants.map(p => p._id);

  const updateResult = await Result.updateMany(
    { participantId: { $in: participantIds } },
    {
      $set: {
        isPublished: !!isPublished,
        publishedAt: isPublished ? new Date() : null
      }
    }
  );

  res.status(200).json(
    new ApiResponse(
      200,
      { matchedCount: updateResult.matchedCount, modifiedCount: updateResult.modifiedCount },
      `Successfully ${isPublished ? 'published' : 'unpublished'} results for school "${school.name}".`
    )
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   PUBLISH ALL RESULTS GLOBALLY
   PATCH /api/v1/results/publish/all
   Body: { isPublished: true|false }
   Access: Admin only (results:write)
   ═══════════════════════════════════════════════════════════════════════════════ */
const publishAllResults = asyncHandler(async (req, res) => {
  const { isPublished } = req.body;

  if (isPublished === undefined) {
    throw new ApiError(400, 'isPublished field is required in request body.');
  }

  const updateResult = await Result.updateMany(
    {},
    {
      $set: {
        isPublished: !!isPublished,
        publishedAt: isPublished ? new Date() : null
      }
    }
  );

  res.status(200).json(
    new ApiResponse(
      200,
      { matchedCount: updateResult.matchedCount, modifiedCount: updateResult.modifiedCount },
      `Successfully ${isPublished ? 'published' : 'unpublished'} all results globally.`
    )
  );
});

module.exports = {
  createResult,
  updateResult,
  deleteResult,
  listResults,
  getOwnResults,
  searchResult,
  publishResultsForSchool,
  publishAllResults,
};
