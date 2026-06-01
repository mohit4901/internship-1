const Announcement = require('../models/Announcement');
const { ApiError } = require('../utils/apiError');
const { ApiResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const mongoose = require('mongoose');

/* ─────────────────────────────────────────────────────────────────────────────
   Helper: valid ObjectId guard
   ───────────────────────────────────────────────────────────────────────────── */
const assertObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Announcement ID format.');
  }
};

/* ═══════════════════════════════════════════════════════════════════════════════
   CREATE ANNOUNCEMENT
   POST /api/v1/announcements
   Access: Admin only (announcements:write)
   ═══════════════════════════════════════════════════════════════════════════════ */
const createAnnouncement = asyncHandler(async (req, res) => {
  const {
    title,
    content,
    category,
    targetAudience,
    olympiadId,
    isPinned,
    publishedAt,
    expiresAt,
  } = req.body;

  const announcement = await Announcement.create({
    title,
    content,
    category,
    targetAudience,
    olympiadId: olympiadId || null,
    authorId: req.user._id, // Set author from logged-in admin details
    isPinned,
    publishedAt,
    expiresAt,
  });

  res.status(201).json(
    new ApiResponse(201, { announcement }, 'Announcement created successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   UPDATE ANNOUNCEMENT
   PATCH /api/v1/announcements/:id
   Access: Admin only (announcements:write)
   ═══════════════════════════════════════════════════════════════════════════════ */
const updateAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  assertObjectId(id);

  const announcement = await Announcement.findById(id);
  if (!announcement) {
    throw new ApiError(404, 'Announcement not found.');
  }

  const allowedFields = [
    'title',
    'content',
    'category',
    'targetAudience',
    'olympiadId',
    'isPinned',
    'publishedAt',
    'expiresAt',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      announcement[field] = req.body[field];
    }
  });

  const updatedAnnouncement = await announcement.save();

  res.status(200).json(
    new ApiResponse(200, { announcement: updatedAnnouncement }, 'Announcement updated successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   DELETE ANNOUNCEMENT
   DELETE /api/v1/announcements/:id
   Access: Admin only (announcements:write)
   ═══════════════════════════════════════════════════════════════════════════════ */
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  assertObjectId(id);

  const announcement = await Announcement.findById(id);
  if (!announcement) {
    throw new ApiError(404, 'Announcement not found.');
  }

  await announcement.deleteOne();

  res.status(200).json(
    new ApiResponse(200, {}, 'Announcement deleted successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   LIST ANNOUNCEMENTS
   GET /api/v1/announcements
   Access: Public / Authenticated Students / Schools / Admin
   ═══════════════════════════════════════════════════════════════════════════════ */
const listAnnouncements = asyncHandler(async (req, res) => {
  const {
    category,
    targetAudience,
    olympiadId,
    page = 1,
    limit = 10,
    sort = '-publishedAt',
  } = req.query;

  const filter = {};

  // If user is a student or school (not an admin), show only published and non-expired announcements
  const isAdmin = req.user && req.user.role !== undefined;
  if (!isAdmin) {
    const now = new Date();
    filter.publishedAt = { $lte: now };
    filter.$or = [
      { expiresAt: null },
      { expiresAt: { $gt: now } }
    ];
  }

  if (category) filter.category = category;
  if (olympiadId) filter.olympiadId = olympiadId;

  // Filter target audience contextually
  if (targetAudience) {
    filter.targetAudience = targetAudience;
  } else if (!isAdmin) {
    // Non-admin default to seeing announcements targeted at "All" or their respective category
    const audiences = ['All'];
    if (req.userType === 'school') {
      audiences.push('Schools');
    }
    // If student is signed in, we can match student's class range if we want, or keep it to 'All'
    filter.targetAudience = { $in: audiences };
  }

  const sortObj = {};
  // Always prioritize pinned announcements on top
  sortObj.isPinned = -1;

  if (sort.startsWith('-')) {
    sortObj[sort.slice(1)] = -1;
  } else {
    sortObj[sort] = 1;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [announcements, total] = await Promise.all([
    Announcement.find(filter)
      .populate('olympiadId', 'title')
      .populate('authorId', 'fullName email')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Announcement.countDocuments(filter)
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        announcements,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      },
      'Announcements fetched successfully.'
    )
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   GET ANNOUNCEMENT BY ID
   GET /api/v1/announcements/:id
   Access: Public / Authenticated Users
   ═══════════════════════════════════════════════════════════════════════════════ */
const getAnnouncementById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  assertObjectId(id);

  const announcement = await Announcement.findById(id)
    .populate('olympiadId', 'title')
    .populate('authorId', 'fullName email')
    .lean();

  if (!announcement) {
    throw new ApiError(404, 'Announcement not found.');
  }

  // Verification to prevent non-admins from viewing unreleased or expired announcements
  const isAdmin = req.user && req.user.role !== undefined;
  if (!isAdmin) {
    const now = new Date();
    if (announcement.publishedAt > now) {
      throw new ApiError(403, 'This announcement is not published yet.');
    }
    if (announcement.expiresAt && announcement.expiresAt <= now) {
      throw new ApiError(403, 'This announcement has expired.');
    }
  }

  res.status(200).json(
    new ApiResponse(200, { announcement }, 'Announcement details fetched successfully.')
  );
});

module.exports = {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  listAnnouncements,
  getAnnouncementById,
};
