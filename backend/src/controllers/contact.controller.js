const ContactSubmission = require('../models/ContactSubmission');
const { ApiError } = require('../utils/apiError');
const { ApiResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const mongoose = require('mongoose');

/* ─────────────────────────────────────────────────────────────────────────────
   Helper: valid ObjectId guard
   ───────────────────────────────────────────────────────────────────────────── */
const assertObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Submission ID format.');
  }
};

/* ═══════════════════════════════════════════════════════════════════════════════
   SUBMIT CONTACT FORM (Public)
   POST /api/v1/contact
   Access: Public
   ═══════════════════════════════════════════════════════════════════════════════ */
const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const submission = await ContactSubmission.create({
    name,
    email,
    phone,
    subject,
    message,
    status: 'New'
  });

  res.status(201).json(
    new ApiResponse(201, { submissionId: submission._id }, 'Your inquiry has been submitted successfully. We will get back to you shortly.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   LIST CONTACT SUBMISSIONS (Admin)
   GET /api/v1/contact
   Access: Admin only (contact:read)
   ═══════════════════════════════════════════════════════════════════════════════ */
const listSubmissions = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20, sort = '-createdAt' } = req.query;

  const filter = {};
  if (status) filter.status = status;

  const sortObj = sort.startsWith('-') ? { [sort.slice(1)]: -1 } : { [sort]: 1 };
  const skip = (Number(page) - 1) * Number(limit);

  const [submissions, total] = await Promise.all([
    ContactSubmission.find(filter)
      .populate('assignedTo', 'fullName email')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    ContactSubmission.countDocuments(filter)
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        submissions,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      },
      'Contact form submissions retrieved successfully.'
    )
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   GET SUBMISSION BY ID (Admin)
   GET /api/v1/contact/:id
   Access: Admin only (contact:read)
   ═══════════════════════════════════════════════════════════════════════════════ */
const getSubmissionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  assertObjectId(id);

  const submission = await ContactSubmission.findById(id)
    .populate('assignedTo', 'fullName email')
    .populate('timeline.adminId', 'fullName email')
    .lean();

  if (!submission) {
    throw new ApiError(404, 'Contact form submission not found.');
  }

  res.status(200).json(
    new ApiResponse(200, { submission }, 'Contact submission details fetched successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   UPDATE SUBMISSION STATUS / ACTION LOG (Admin)
   PATCH /api/v1/contact/:id/status
   Access: Admin only (contact:write)
   ═══════════════════════════════════════════════════════════════════════════════ */
const updateSubmissionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  assertObjectId(id);

  const { status, note } = req.body;

  const submission = await ContactSubmission.findById(id);
  if (!submission) {
    throw new ApiError(404, 'Contact form submission not found.');
  }

  // Update status & assignment
  submission.status = status;
  submission.assignedTo = req.user._id;

  if (status === 'Resolved') {
    submission.resolvedAt = new Date();
  } else {
    submission.resolvedAt = null;
  }

  // Push updates to historical tracking timeline
  const timelineNote = note || `Status updated to ${status} by admin.`;
  submission.timeline.push({
    adminId: req.user._id,
    note: timelineNote,
    changedAt: new Date()
  });

  const updatedSubmission = await submission.save();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        submissionId: updatedSubmission._id,
        status: updatedSubmission.status,
        resolvedAt: updatedSubmission.resolvedAt
      },
      'Submission status updated successfully.'
    )
  );
});

module.exports = {
  submitContactForm,
  listSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
};
