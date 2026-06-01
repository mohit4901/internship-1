const Student = require('../models/Student');
const School = require('../models/School');
const Olympiad = require('../models/Olympiad');
const OlympiadRegistration = require('../models/OlympiadRegistration');
const { ApiResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

/* ═══════════════════════════════════════════════════════════════════════════════
   GET ADMIN DASHBOARD ANALYTICS STATS
   GET /api/v1/dashboard/stats
   Access: Admin only (dashboard:read / general admin access)
   ═══════════════════════════════════════════════════════════════════════════════ */
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalSchools,
    totalOlympiads,
    totalRegistrations,

    pendingSchoolsCount,
    verifiedSchoolsCount,

    paidRegistrationsCount,
    pendingRegistrationsCount,

    recentRegistrations,
    recentStudents
  ] = await Promise.all([
    // Main counts
    Student.countDocuments({}),
    School.countDocuments({}),
    Olympiad.countDocuments({}),
    OlympiadRegistration.countDocuments({}),

    // School breakdowns
    School.countDocuments({ isVerified: false }),
    School.countDocuments({ isVerified: true }),

    // Registration payment breakdowns
    OlympiadRegistration.countDocuments({ paymentStatus: 'Paid' }),
    OlympiadRegistration.countDocuments({ paymentStatus: 'Pending' }),

    // Recent activity logs
    OlympiadRegistration.find({})
      .populate('studentId', 'fullName email')
      .populate('olympiadId', 'title')
      .sort('-createdAt')
      .limit(5)
      .lean(),

    Student.find({})
      .select('fullName email createdAt')
      .sort('-createdAt')
      .limit(5)
      .lean()
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        cards: {
          totalStudents,
          totalSchools,
          totalOlympiads,
          totalRegistrations,
        },
        breakdowns: {
          schools: {
            verified: verifiedSchoolsCount,
            pending: pendingSchoolsCount
          },
          registrations: {
            paid: paidRegistrationsCount,
            pending: pendingRegistrationsCount
          }
        },
        recentActivity: {
          registrations: recentRegistrations,
          students: recentStudents
        }
      },
      'Dashboard analytics retrieved successfully.'
    )
  );
});

module.exports = {
  getDashboardStats,
};
