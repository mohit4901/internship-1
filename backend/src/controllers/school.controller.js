/**
 * school.controller.js
 *
 * Handles school profile management and admin-facing school operations.
 * Registration / login / logout are handled by auth.school.controller.js
 *
 * Routes (mounted at /api/v1/schools):
 *
 *   School (self)
 *   GET    /me             – getOwnProfile
 *   PATCH  /me             – updateOwnProfile
 *
 *   Admin (users:read / users:write)
 *   GET    /               – listSchools
 *   GET    /:id            – getSchoolById
 *   PATCH  /:id/verify     – verifySchool   (approve or reject)
 */

const mongoose         = require('mongoose');
const School           = require('../models/School');
const Participant      = require('../models/Participant');
const { ApiError }     = require('../utils/apiError');
const { ApiResponse }  = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

/* ─────────────────────────────────────────────────────────────────────────────
   Helper: ObjectId guard
   ───────────────────────────────────────────────────────────────────────────── */
const assertObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid school ID format.');
  }
};

// Fields a school cannot change via profile update
const IMMUTABLE_FIELDS = ['affiliationNumber', 'contactEmail', 'isVerified', 'registeredStudentsCount'];

/* ─────────────────────────────────────────────────────────────────────────────
   Sanitize helper — strips internal fields from responses
   ───────────────────────────────────────────────────────────────────────────── */
const sanitize = (school) => {
  const obj = school.toObject ? school.toObject() : { ...school };
  return obj;
};

/* ═══════════════════════════════════════════════════════════════════════════════
   GET OWN PROFILE
   GET /api/v1/schools/me
   Access: Authenticated school
   ═══════════════════════════════════════════════════════════════════════════════ */
const getOwnProfile = asyncHandler(async (req, res) => {
  const school = await School.findById(req.user._id).lean();
  if (!school) throw new ApiError(404, 'School not found.');

  res.status(200).json(
    new ApiResponse(200, { school }, 'School profile fetched successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   UPDATE OWN PROFILE
   PATCH /api/v1/schools/me
   Access: Authenticated school
   ═══════════════════════════════════════════════════════════════════════════════ */
const updateOwnProfile = asyncHandler(async (req, res) => {
  const school = await School.findById(req.user._id);
  if (!school) throw new ApiError(404, 'School not found.');

  // Strip immutable fields even if sent
  IMMUTABLE_FIELDS.forEach((f) => delete req.body[f]);

  const { address, coordinator, ...topLevel } = req.body;

  // Apply top-level scalar updates
  Object.assign(school, topLevel);

  // Merge nested address sub-doc
  if (address) {
    const existing = school.address?.toObject?.() ?? school.address ?? {};
    school.address = { ...existing, ...address };
    school.markModified('address');
  }

  // Merge nested coordinator sub-doc
  if (coordinator) {
    const existing = school.coordinator?.toObject?.() ?? school.coordinator ?? {};
    school.coordinator = { ...existing, ...coordinator };
    school.markModified('coordinator');
  }

  await school.save({ validateBeforeSave: true });

  res.status(200).json(
    new ApiResponse(200, { school: sanitize(school) }, 'School profile updated successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   LIST ALL SCHOOLS  (Admin)
   GET /api/v1/schools?isVerified=false&state=Maharashtra&board=CBSE&search=name
   Access: Admin (users:read)
   ═══════════════════════════════════════════════════════════════════════════════ */
const listSchools = asyncHandler(async (req, res) => {
  const {
    isVerified,
    state,
    city,
    board,
    search,
    page  = 1,
    limit = 20,
    sort  = '-createdAt',
  } = req.query;

  const filter = {};

  if (isVerified !== undefined) filter.isVerified         = isVerified;
  if (state)                    filter['address.state']   = new RegExp(state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (city)                     filter['address.city']    = new RegExp(city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (board)                    filter.board              = board;

  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { name: regex },
      { contactEmail: regex },
      { affiliationNumber: regex },
    ];
  }

  const sortObj = sort.startsWith('-')
    ? { [sort.slice(1)]: -1 }
    : { [sort]: 1 };

  const skip = (Number(page) - 1) * Number(limit);

  const [schools, total] = await Promise.all([
    School.find(filter).sort(sortObj).skip(skip).limit(Number(limit)).lean(),
    School.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        schools,
        pagination: {
          total,
          page:       Number(page),
          limit:      Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      'Schools fetched successfully.'
    )
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   GET SCHOOL BY ID  (Admin)
   GET /api/v1/schools/:id
   Access: Admin (users:read)
   ═══════════════════════════════════════════════════════════════════════════════ */
const getSchoolById = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);

  const school = await School.findById(req.params.id).lean();
  if (!school) throw new ApiError(404, 'School not found.');

  res.status(200).json(
    new ApiResponse(200, { school }, 'School fetched successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   VERIFY / APPROVE SCHOOL  (Admin)
   PATCH /api/v1/schools/:id/verify
   Body: { isVerified: true|false, remarks?: string }
   Access: Admin (users:write)
   ═══════════════════════════════════════════════════════════════════════════════ */
const verifySchool = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);

  const { isVerified, remarks } = req.body;

  const school = await School.findById(req.params.id);
  if (!school) throw new ApiError(404, 'School not found.');

  if (school.isVerified === isVerified) {
    const state = isVerified ? 'already verified' : 'already unverified/rejected';
    throw new ApiError(400, `School is ${state}.`);
  }

  school.isVerified = isVerified;
  await school.save({ validateBeforeSave: false });

  const action  = isVerified ? 'approved' : 'rejected';
  const message = `School has been ${action} successfully.${remarks ? ` Remarks: ${remarks}` : ''}`;

  res.status(200).json(
    new ApiResponse(
      200,
      { schoolId: school._id, isVerified: school.isVerified },
      message
    )
  );
});

const listPublicSchools = asyncHandler(async (req, res) => {
  // Return verified schools or all schools in development if none are verified yet
  let schools = await School.find({ isVerified: true }).select('name affiliationNumber board address.city address.state').sort('name').lean();
  if (schools.length === 0) {
    schools = await School.find().select('name affiliationNumber board address.city address.state').sort('name').lean();
  }
  res.status(200).json(
    new ApiResponse(200, { schools }, 'Public schools fetched successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   ADD PARTICIPANTS (batch)
   POST /api/v1/schools/me/participants
   Body: { participants: [{ name, class, section?, rollNo?, gender? }] }
   Access: Authenticated school
   ═══════════════════════════════════════════════════════════════════════════════ */
const addParticipants = asyncHandler(async (req, res) => {
  const school = await School.findById(req.user._id);
  if (!school) throw new ApiError(404, 'School not found.');
  if (!school.isVerified) throw new ApiError(403, 'Your school must be verified before submitting participants.');

  const { participants } = req.body;
  if (!Array.isArray(participants) || participants.length === 0) {
    throw new ApiError(400, 'Please provide a non-empty array of participants.');
  }
  if (participants.length > 200) {
    throw new ApiError(400, 'You can submit at most 200 participants per batch.');
  }

  // Attach schoolId to every entry
  const docs = participants.map((p) => ({ ...p, schoolId: school._id }));

  const inserted = await Participant.insertMany(docs, { ordered: false });

  // Update the count on the school document
  school.registeredStudentsCount = await Participant.countDocuments({ schoolId: school._id });
  await school.save({ validateBeforeSave: false });

  res.status(201).json(
    new ApiResponse(201, { added: inserted.length }, `${inserted.length} participant(s) added successfully.`)
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   GET PARTICIPANTS
   GET /api/v1/schools/me/participants?class=9&division=Junior&page=1&limit=50
   Access: Authenticated school
   ═══════════════════════════════════════════════════════════════════════════════ */
const getParticipants = asyncHandler(async (req, res) => {
  const school = await School.findById(req.user._id);
  if (!school) throw new ApiError(404, 'School not found.');

  const { class: cls, division, page = 1, limit = 50 } = req.query;
  const filter = { schoolId: school._id };
  if (cls)      filter.class    = cls;
  if (division) filter.division = division;

  const skip = (Number(page) - 1) * Number(limit);
  const [participants, total] = await Promise.all([
    Participant.find(filter).sort('class name').skip(skip).limit(Number(limit)).lean(),
    Participant.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        participants,
        pagination: {
          total,
          page:       Number(page),
          limit:      Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      'Participants fetched successfully.'
    )
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   GET SCHOOL PARTICIPANTS (ADMIN)
   GET /api/v1/schools/:id/participants
   Access: Admin only
   ═══════════════════════════════════════════════════════════════════════════════ */
const getSchoolParticipantsAdmin = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const school = await School.findById(req.params.id);
  if (!school) throw new ApiError(404, 'School not found.');

  const { class: cls, division, page = 1, limit = 50 } = req.query;
  const filter = { schoolId: school._id };
  if (cls)      filter.class    = cls;
  if (division) filter.division = division;

  const skip = (Number(page) - 1) * Number(limit);
  const [participants, total] = await Promise.all([
    Participant.find(filter).sort('class name').skip(skip).limit(Number(limit)).lean(),
    Participant.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        participants,
        pagination: {
          total,
          page:       Number(page),
          limit:      Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      'School participants fetched successfully.'
    )
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   GET ALL PARTICIPANTS (ADMIN GLOBAL LIST)
   GET /api/v1/schools/admin/participants
   Access: Admin only
   ═══════════════════════════════════════════════════════════════════════════════ */
const listAllParticipantsAdmin = asyncHandler(async (req, res) => {
  const { schoolId, class: cls, division, page = 1, limit = 50, search } = req.query;
  const filter = {};
  if (schoolId) {
    assertObjectId(schoolId);
    filter.schoolId = schoolId;
  }
  if (cls)      filter.class    = cls;
  if (division) filter.division = division;
  if (search) {
    filter.name = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [participants, total] = await Promise.all([
    Participant.find(filter)
      .populate('schoolId', 'name')
      .sort('class name')
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Participant.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        participants,
        pagination: {
          total,
          page:       Number(page),
          limit:      Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      'All participants fetched successfully.'
    )
  );
});

module.exports = {
  getOwnProfile,
  updateOwnProfile,
  listSchools,
  getSchoolById,
  verifySchool,
  listPublicSchools,
  addParticipants,
  getParticipants,
  getSchoolParticipantsAdmin,
  listAllParticipantsAdmin,
};
