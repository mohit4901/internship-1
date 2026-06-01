const mongoose = require('mongoose');
const Olympiad = require('../models/Olympiad');
const OlympiadRegistration = require('../models/OlympiadRegistration');
const Student = require('../models/Student');
const { ApiError } = require('../utils/apiError');
const { ApiResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

/* ═══════════════════════════════════════════════════════════════════════════════
   REGISTER STUDENT FOR OLYMPIAD
   POST /api/v1/registrations
   Access: Student only
   ═══════════════════════════════════════════════════════════════════════════════ */
const registerForOlympiad = asyncHandler(async (req, res) => {
  const { olympiadId } = req.body;
  const studentId = req.user._id;

  // 1. Fetch Olympiad details
  const olympiad = await Olympiad.findById(olympiadId);
  if (!olympiad) {
    throw new ApiError(404, 'Olympiad not found.');
  }

  // 2. Validate Olympiad status
  if (olympiad.status !== 'Active') {
    throw new ApiError(400, `Registration is not open for this Olympiad. Current status: ${olympiad.status}`);
  }

  // 3. Validate deadlines
  const now = new Date();
  if (now > olympiad.timeline.registrationEnd) {
    throw new ApiError(400, 'Registration deadline has passed for this Olympiad.');
  }
  if (now < olympiad.timeline.registrationStart) {
    throw new ApiError(400, 'Registration has not started yet for this Olympiad.');
  }

  // 4. Validate registration limit (seats limit)
  if (olympiad.maxRegistrations > 0 && olympiad.currentRegistrationsCount >= olympiad.maxRegistrations) {
    throw new ApiError(400, 'Registration full. No remaining seats for this Olympiad.');
  }

  // 5. Prevent duplicate registration
  const existingRegistration = await OlympiadRegistration.findOne({ studentId, olympiadId });
  if (existingRegistration) {
    throw new ApiError(409, 'You have already registered for this Olympiad.');
  }

  // 6. Fetch Student's school association (if any)
  const studentProfile = await Student.findById(studentId);
  const schoolId = studentProfile ? studentProfile.schoolId : null;

  // 7. Generate deterministic/readable registration details
  const registrationNumber = `REG-${olympiadId.toString().slice(-4).toUpperCase()}-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

  // 8. Create registration
  const registration = await OlympiadRegistration.create({
    registrationNumber,
    studentId,
    olympiadId,
    schoolId,
    paymentStatus: 'Pending',
    registrationStatus: 'Initiated'
  });

  // 9. Increment current registration count on Olympiad
  await Olympiad.findByIdAndUpdate(olympiadId, {
    $inc: { currentRegistrationsCount: 1 }
  });

  res.status(201).json(
    new ApiResponse(201, { registration }, 'Successfully registered for the Olympiad.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   GET OWN REGISTRATIONS
   GET /api/v1/registrations/me
   Access: Student only
   ═══════════════════════════════════════════════════════════════════════════════ */
const getOwnRegistrations = asyncHandler(async (req, res) => {
  const registrations = await OlympiadRegistration.find({ studentId: req.user._id })
    .populate('olympiadId', 'title description timeline registrationFee currency status')
    .sort('-createdAt')
    .lean();

  res.status(200).json(
    new ApiResponse(200, { registrations }, 'Your registrations fetched successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   LIST REGISTRATIONS (Admin only)
   GET /api/v1/registrations
   Access: Admin only
   ═══════════════════════════════════════════════════════════════════════════════ */
const listRegistrations = asyncHandler(async (req, res) => {
  const {
    olympiadId,
    studentId,
    paymentStatus,
    registrationStatus,
    page = 1,
    limit = 10,
    sort = '-createdAt'
  } = req.query;

  const filter = {};
  if (olympiadId) filter.olympiadId = olympiadId;
  if (studentId) filter.studentId = studentId;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (registrationStatus) filter.registrationStatus = registrationStatus;

  const sortObj = sort.startsWith('-') ? { [sort.slice(1)]: -1 } : { [sort]: 1 };
  const skip = (Number(page) - 1) * Number(limit);

  const [registrations, total] = await Promise.all([
    OlympiadRegistration.find(filter)
      .populate('olympiadId', 'title registrationFee status')
      .populate('studentId', 'fullName email phone')
      .populate('schoolId', 'name contactEmail')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    OlympiadRegistration.countDocuments(filter)
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        registrations,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      },
      'Registrations list retrieved successfully.'
    )
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   GET REGISTRATION BY ID
   GET /api/v1/registrations/:id
   Access: Student (own only) or Admin
   ═══════════════════════════════════════════════════════════════════════════════ */
const getRegistrationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Registration ID format.');
  }

  const registration = await OlympiadRegistration.findById(id)
    .populate('olympiadId', 'title description timeline registrationFee currency status')
    .populate('studentId', 'fullName email phone')
    .populate('schoolId', 'name contactEmail');

  if (!registration) {
    throw new ApiError(404, 'Registration not found.');
  }

  // Allow access if admin, or if it is the student's own registration
  const isAdmin = req.user && req.user.role !== undefined; // Admin has role from adminJWT
  const isOwnStudent = req.user && req.user._id.toString() === registration.studentId._id.toString();

  if (!isAdmin && !isOwnStudent) {
    throw new ApiError(403, 'Unauthorized access to this registration details.');
  }

  res.status(200).json(
    new ApiResponse(200, { registration }, 'Registration details retrieved successfully.')
  );
});

module.exports = {
  registerForOlympiad,
  getOwnRegistrations,
  listRegistrations,
  getRegistrationById,
};
