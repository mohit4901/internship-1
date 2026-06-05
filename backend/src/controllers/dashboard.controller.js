const School = require('../models/School');
const Olympiad = require('../models/Olympiad');
const Participant = require('../models/Participant');
const Result = require('../models/Result');
const { ApiResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

/* ═══════════════════════════════════════════════════════════════════════════════
   GET ADMIN DASHBOARD ANALYTICS STATS
   GET /api/v1/dashboard/stats
   Access: Admin only (dashboard:read / general admin access)
   ═══════════════════════════════════════════════════════════════════════════════ */
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalSchools,
    totalOlympiads,
    totalParticipants,
    totalResults,

    pendingSchoolsCount,
    verifiedSchoolsCount,

    recentSchools,
    recentParticipants
  ] = await Promise.all([
    // Main counts
    School.countDocuments({}),
    Olympiad.countDocuments({}),
    Participant.countDocuments({}),
    Result.countDocuments({}),

    // School breakdowns
    School.countDocuments({ isVerified: false }),
    School.countDocuments({ isVerified: true }),

    // Recent activity logs
    School.find({})
      .sort('-createdAt')
      .limit(5)
      .lean(),

    Participant.find({})
      .populate('schoolId', 'name')
      .sort('-createdAt')
      .limit(5)
      .lean()
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        cards: {
          totalSchools,
          totalOlympiads,
          totalParticipants,
          totalResults,
        },
        breakdowns: {
          schools: {
            verified: verifiedSchoolsCount,
            pending: pendingSchoolsCount
          }
        },
        recentActivity: {
          schools: recentSchools,
          participants: recentParticipants
        }
      },
      'Dashboard analytics retrieved successfully.'
    )
  );
});

module.exports = {
  getDashboardStats,
};

