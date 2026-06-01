/**
 * olympiad.controller.js
 *
 * CRUD + status management for Olympiad events.
 * Handles file uploads (syllabusPdf and bannerImage) via Multer, storing them in MongoDB.
 *
 * Routes handled (all mounted at /api/v1/olympiads):
 *
 *   GET    /               – listOlympiads     (public)
 *   GET    /:id            – getOlympiad       (public)
 *   POST   /               – createOlympiad    (admin: olympiads:write)
 *   PATCH  /:id            – updateOlympiad    (admin: olympiads:write)
 *   PATCH  /:id/status     – changeStatus      (admin: olympiads:write)
 *   DELETE /:id            – deleteOlympiad    (admin: olympiads:write)
 */

const mongoose          = require('mongoose');
const Olympiad          = require('../models/Olympiad');
const Media             = require('../models/Media');
const { ApiError }      = require('../utils/apiError');
const { ApiResponse }   = require('../utils/apiResponse');
const { asyncHandler }  = require('../utils/asyncHandler');

/* ─────────────────────────────────────────────────────────────────────────────
   Helper: valid ObjectId guard
   ───────────────────────────────────────────────────────────────────────────── */
const assertObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Olympiad ID format.');
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   Helper: Parse JSON field safely (for multipart/form-data fields)
   ───────────────────────────────────────────────────────────────────────────── */
const parseJsonField = (field) => {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (e) {
      // Return as is if it fails parsing (could be simple string)
      return field;
    }
  }
  return field;
};

/* ═══════════════════════════════════════════════════════════════════════════════
   LIST OLYMPIADS
   GET /api/v1/olympiads
   Query: status, category, grade, page, limit, sort
   Public — students and schools can browse available olympiads.
   ═══════════════════════════════════════════════════════════════════════════════ */
const listOlympiads = asyncHandler(async (req, res) => {
  const {
    status,
    category,
    grade,
    page  = 1,
    limit = 10,
    sort  = '-createdAt',
  } = req.query;

  // Build dynamic filter
  const filter = {};
  if (status)   filter.status   = status;
  if (category) filter.category = category;
  if (grade)    filter.gradesSupported = grade; // matches if grade is inside the array

  // Sort string → Mongoose sort object
  const sortObj = sort.startsWith('-')
    ? { [sort.slice(1)]: -1 }
    : { [sort]: 1 };

  const skip = (Number(page) - 1) * Number(limit);

  const [olympiads, total] = await Promise.all([
    Olympiad.find(filter)
      .populate('syllabusPdf', 'filename contentType size')
      .populate('bannerImage', 'filename contentType size')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Olympiad.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        olympiads,
        pagination: {
          total,
          page:       Number(page),
          limit:      Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      'Olympiads fetched successfully.'
    )
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   GET SINGLE OLYMPIAD
   GET /api/v1/olympiads/:id
   Public.
   ═══════════════════════════════════════════════════════════════════════════════ */
const getOlympiad = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);

  const olympiad = await Olympiad.findById(req.params.id)
    .populate('syllabusPdf', 'filename contentType size')
    .populate('bannerImage', 'filename contentType size')
    .lean();

  if (!olympiad) throw new ApiError(404, 'Olympiad not found.');

  res.status(200).json(
    new ApiResponse(200, { olympiad }, 'Olympiad fetched successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   CREATE OLYMPIAD
   POST /api/v1/olympiads
   Access: Admin with 'olympiads:write' permission.
   ═══════════════════════════════════════════════════════════════════════════════ */
const createOlympiad = asyncHandler(async (req, res) => {
  // Support application/json and multipart/form-data
  const body = { ...req.body };

  // Parse fields that might be stringified due to multipart/form-data
  const gradesSupported = parseJsonField(body.gradesSupported);
  const timeline        = parseJsonField(body.timeline);
  const syllabus        = parseJsonField(body.syllabus);
  const rules           = parseJsonField(body.rules);
  const registrationFee = body.registrationFee !== undefined ? Number(body.registrationFee) : undefined;
  const maxRegistrations = body.maxRegistrations !== undefined ? Number(body.maxRegistrations) : undefined;

  let syllabusPdfId = null;
  let bannerImageId = null;

  // Handle file uploads if present
  if (req.files) {
    if (req.files.syllabusPdf && req.files.syllabusPdf[0]) {
      const pdfFile = req.files.syllabusPdf[0];
      const media = await Media.create({
        filename: pdfFile.originalname,
        contentType: pdfFile.mimetype,
        data: pdfFile.buffer,
        size: pdfFile.size,
      });
      syllabusPdfId = media._id;
    }

    if (req.files.bannerImage && req.files.bannerImage[0]) {
      const imgFile = req.files.bannerImage[0];
      const media = await Media.create({
        filename: imgFile.originalname,
        contentType: imgFile.mimetype,
        data: imgFile.buffer,
        size: imgFile.size,
      });
      bannerImageId = media._id;
    }
  }

  const olympiad = await Olympiad.create({
    title: body.title,
    description: body.description,
    category: body.category,
    gradesSupported,
    registrationFee,
    currency: body.currency,
    timeline,
    syllabus,
    rules,
    maxRegistrations,
    status: body.status,
    syllabusPdf: syllabusPdfId,
    bannerImage: bannerImageId,
  });

  // Populate references for the return response
  const populated = await Olympiad.findById(olympiad._id)
    .populate('syllabusPdf', 'filename contentType size')
    .populate('bannerImage', 'filename contentType size');

  res.status(201).json(
    new ApiResponse(201, { olympiad: populated }, 'Olympiad created successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   UPDATE OLYMPIAD
   PATCH /api/v1/olympiads/:id
   Access: Admin with 'olympiads:write' permission.
   Restriction: Cannot update a 'Finished' olympiad.
   ═══════════════════════════════════════════════════════════════════════════════ */
const updateOlympiad = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);

  const olympiad = await Olympiad.findById(req.params.id);
  if (!olympiad) throw new ApiError(404, 'Olympiad not found.');

  if (olympiad.status === 'Finished') {
    throw new ApiError(400, 'A finished Olympiad cannot be edited.');
  }

  const body = { ...req.body };

  // Parse multipart stringified fields
  const gradesSupported = body.gradesSupported !== undefined ? parseJsonField(body.gradesSupported) : undefined;
  const timeline        = body.timeline !== undefined ? parseJsonField(body.timeline) : undefined;
  const syllabus        = body.syllabus !== undefined ? parseJsonField(body.syllabus) : undefined;
  const rules           = body.rules !== undefined ? parseJsonField(body.rules) : undefined;
  const registrationFee = body.registrationFee !== undefined ? Number(body.registrationFee) : undefined;
  const maxRegistrations = body.maxRegistrations !== undefined ? Number(body.maxRegistrations) : undefined;

  // Build top level updates
  const allowedFields = ['title', 'description', 'category', 'currency'];
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      olympiad[field] = body[field];
    }
  });

  if (gradesSupported !== undefined) olympiad.gradesSupported = gradesSupported;
  if (syllabus !== undefined)        olympiad.syllabus = syllabus;
  if (rules !== undefined)           olympiad.rules = rules;
  if (registrationFee !== undefined) olympiad.registrationFee = registrationFee;
  if (maxRegistrations !== undefined) olympiad.maxRegistrations = maxRegistrations;

  // Merge timeline sub-fields
  if (timeline) {
    Object.assign(olympiad.timeline, timeline);
    olympiad.markModified('timeline');
  }

  // Handle files update
  if (req.files) {
    if (req.files.syllabusPdf && req.files.syllabusPdf[0]) {
      const pdfFile = req.files.syllabusPdf[0];
      // Delete old file if exists
      if (olympiad.syllabusPdf) {
        await Media.findByIdAndDelete(olympiad.syllabusPdf);
      }
      const media = await Media.create({
        filename: pdfFile.originalname,
        contentType: pdfFile.mimetype,
        data: pdfFile.buffer,
        size: pdfFile.size,
      });
      olympiad.syllabusPdf = media._id;
    }

    if (req.files.bannerImage && req.files.bannerImage[0]) {
      const imgFile = req.files.bannerImage[0];
      // Delete old file if exists
      if (olympiad.bannerImage) {
        await Media.findByIdAndDelete(olympiad.bannerImage);
      }
      const media = await Media.create({
        filename: imgFile.originalname,
        contentType: imgFile.mimetype,
        data: imgFile.buffer,
        size: imgFile.size,
      });
      olympiad.bannerImage = media._id;
    }
  }

  const updated = await olympiad.save();
  const populated = await Olympiad.findById(updated._id)
    .populate('syllabusPdf', 'filename contentType size')
    .populate('bannerImage', 'filename contentType size');

  res.status(200).json(
    new ApiResponse(200, { olympiad: populated }, 'Olympiad updated successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   CHANGE STATUS
   PATCH /api/v1/olympiads/:id/status
   Access: Admin with 'olympiads:write' permission.
   Enforces a valid status transition:
     Draft → Active → RegistrationClosed → Finished
   ═══════════════════════════════════════════════════════════════════════════════ */
const STATUS_TRANSITIONS = {
  Draft:               ['Active'],
  Active:              ['RegistrationClosed', 'Draft'],
  RegistrationClosed:  ['Finished', 'Active'],
  Finished:            [],            // terminal state
};

const changeStatus = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);

  const olympiad = await Olympiad.findById(req.params.id);
  if (!olympiad) throw new ApiError(404, 'Olympiad not found.');

  const { status: newStatus } = req.body;
  const allowed = STATUS_TRANSITIONS[olympiad.status] ?? [];

  if (!allowed.includes(newStatus)) {
    throw new ApiError(
      400,
      `Cannot transition from '${olympiad.status}' to '${newStatus}'. ` +
      (allowed.length
        ? `Allowed next states: ${allowed.join(', ')}.`
        : 'This Olympiad has reached a terminal state.')
    );
  }

  olympiad.status = newStatus;
  await olympiad.save({ validateBeforeSave: false });

  res.status(200).json(
    new ApiResponse(
      200,
      { status: olympiad.status },
      `Olympiad status changed to '${newStatus}'.`
    )
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   DELETE OLYMPIAD
   DELETE /api/v1/olympiads/:id
   Access: Admin with 'olympiads:write' permission.
   Restriction: Cannot delete if status is Active or RegistrationClosed
                (registrations may already exist).
   ═══════════════════════════════════════════════════════════════════════════════ */
const deleteOlympiad = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);

  const olympiad = await Olympiad.findById(req.params.id);
  if (!olympiad) throw new ApiError(404, 'Olympiad not found.');

  const undeletable = ['Active', 'RegistrationClosed'];
  if (undeletable.includes(olympiad.status)) {
    throw new ApiError(
      400,
      `Cannot delete an Olympiad with status '${olympiad.status}'. ` +
      'First close registrations or move to Draft/Finished.'
    );
  }

  // Delete associated media files to free MongoDB space
  if (olympiad.syllabusPdf) {
    await Media.findByIdAndDelete(olympiad.syllabusPdf);
  }
  if (olympiad.bannerImage) {
    await Media.findByIdAndDelete(olympiad.bannerImage);
  }

  await olympiad.deleteOne();

  res.status(200).json(
    new ApiResponse(200, {}, 'Olympiad deleted successfully.')
  );
});

module.exports = {
  listOlympiads,
  getOlympiad,
  createOlympiad,
  updateOlympiad,
  changeStatus,
  deleteOlympiad,
};
