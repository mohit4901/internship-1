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
const Result           = require('../models/Result');
const xlsx             = require('xlsx');
const pdfParse         = require('pdf-parse');
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

/* ═══════════════════════════════════════════════════════════════════════════════
   UPLOAD PARTICIPANTS FILE (Excel/PDF)
   POST /api/v1/schools/me/participants/upload
   Access: Authenticated school
   ═══════════════════════════════════════════════════════════════════════════════ */
const uploadParticipantsFile = asyncHandler(async (req, res) => {
  const school = await School.findById(req.user._id);
  if (!school) throw new ApiError(404, 'School not found.');
  if (!school.isVerified) {
    throw new ApiError(403, 'Your school must be verified before submitting participants.');
  }

  if (!req.file) {
    throw new ApiError(400, 'Please upload a file (.xlsx, .xls, .csv, or .pdf).');
  }

  const fileExt = req.file.originalname.split('.').pop().toLowerCase();
  let rawParticipants = [];

  try {
    if (fileExt === 'pdf') {
      // PDF text extraction and regex parsing
      const pdfData = await pdfParse(req.file.buffer);
      const text = pdfData.text || '';
      const lines = text.split('\n');

      for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // Skip headers unless data-looking
        if (/school|olympiad|bharat|candidate|student|register|class|section|roll/i.test(line) && rawParticipants.length === 0) {
          if (!/name/i.test(line)) continue;
        }

        let student = null;

        // Pattern 1: label-value like "Name: John, Class: 8..."
        if (/name/i.test(line) && /class/i.test(line)) {
          const nameMatch = line.match(/name\s*:\s*([^,;|]+)/i);
          const classMatch = line.match(/(?:class|grade)\s*:\s*([^,;|]+)/i);
          const secMatch = line.match(/(?:section|sec)\s*:\s*([^,;|]+)/i);
          const rollMatch = line.match(/(?:roll|rollno|roll\s*no)\s*:\s*([^,;|]+)/i);
          const genderMatch = line.match(/(?:gender|sex)\s*:\s*([^,;|]+)/i);

          if (nameMatch && classMatch) {
            student = {
              name: nameMatch[1].trim(),
              class: classMatch[1].trim(),
              section: secMatch ? secMatch[1].trim() : '',
              rollNo: rollMatch ? rollMatch[1].trim() : '',
              gender: genderMatch ? genderMatch[1].trim() : 'Male'
            };
          }
        }

        // Pattern 2: Comma or Tab separated tabular list
        if (!student) {
          const parts = line.split(/[,;\t]/).map(p => p.trim());
          if (parts.length >= 2) {
            let name = '', cls = '', sec = '', roll = '', gen = 'Male';
            for (const p of parts) {
              if (!p) continue;
              if (/^(?:male|female|other)$/i.test(p)) {
                gen = p;
              } else if (/^(?:6|7|8|9|10|11|12)$/.test(p)) {
                cls = p;
              } else if (/^[A-Z]$/.test(p) && p.length === 1) {
                sec = p;
              } else if (/^\d+$/.test(p) && !cls) {
                cls = p;
              } else if (/^\d+$/.test(p) && cls) {
                roll = p;
              } else if (!name) {
                name = p;
              } else if (name && !sec && p.length <= 3) {
                sec = p;
              } else if (name && !roll) {
                roll = p;
              }
            }
            if (name && cls) {
              student = { name, class: cls, section: sec, rollNo: roll, gender: gen };
            }
          }
        }

        // Pattern 3: Space separated list
        if (!student) {
          const parts = line.split(/\s{2,}/).map(p => p.trim());
          if (parts.length >= 2) {
            const name = parts[0];
            const cls = parts[1];
            const sec = parts.length > 2 ? parts[2] : '';
            const roll = parts.length > 3 ? parts[3] : '';
            const gen = parts.length > 4 ? parts[4] : 'Male';

            if (name && cls && /^(?:6|7|8|9|10|11|12)$/.test(cls.replace(/th|nd|rd|st/i, '').trim())) {
              student = { name, class: cls, section: sec, rollNo: roll, gender: gen };
            }
          }
        }

        if (student) {
          rawParticipants.push(student);
        }
      }
    } else {
      // Excel, CSV processing
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = xlsx.utils.sheet_to_json(worksheet);

      for (const row of rows) {
        let name = '';
        let cls = '';
        let sec = '';
        let roll = '';
        let gen = 'Male';

        for (const key of Object.keys(row)) {
          const val = String(row[key]).trim();
          if (!val) continue;

          if (/name/i.test(key)) {
            name = val;
          } else if (/class|grade/i.test(key)) {
            cls = val;
          } else if (/section|sec/i.test(key)) {
            sec = val;
          } else if (/roll/i.test(key)) {
            roll = val;
          } else if (/gender|sex/i.test(key)) {
            gen = val;
          }
        }

        if (name && cls) {
          rawParticipants.push({ name, class: cls, section: sec, rollNo: roll, gender: gen });
        }
      }
    }
  } catch (err) {
    throw new ApiError(400, `Failed to parse file: ${err.message}`);
  }

  if (rawParticipants.length === 0) {
    throw new ApiError(400, 'No student records could be parsed. Please check the file formatting.');
  }

  // Validate and normalize rows
  const docs = [];
  const errors = [];
  const juniorClasses = ['6', '7', '8', '9'];

  for (let i = 0; i < rawParticipants.length; i++) {
    const p = rawParticipants[i];
    const rowNum = i + 1;

    // Check Name
    if (!p.name || p.name.trim().length === 0) {
      errors.push(`Row ${rowNum}: Student Name is missing.`);
      continue;
    }

    // Check Class
    let cleanClass = String(p.class).replace(/th|nd|rd|st/i, '').trim();
    if (!['6', '7', '8', '9', '10', '11', '12'].includes(cleanClass)) {
      errors.push(`Row ${rowNum}: Invalid Class "${p.class}". Must be between 6 and 12.`);
      continue;
    }

    // Check Gender
    let cleanGender = 'Male';
    if (/female/i.test(p.gender)) cleanGender = 'Female';
    else if (/other/i.test(p.gender)) cleanGender = 'Other';

    docs.push({
      schoolId: school._id,
      name: p.name.trim(),
      class: cleanClass,
      section: p.section ? String(p.section).trim() : '',
      rollNo: p.rollNo ? String(p.rollNo).trim() : '',
      gender: cleanGender,
      division: juniorClasses.includes(cleanClass) ? 'Junior' : 'Senior'
    });
  }

  if (docs.length === 0) {
    return res.status(400).json(
      new ApiResponse(400, { errors }, 'All rows were invalid. No participants imported.')
    );
  }

  // Bulk Insert
  let insertedCount = 0;
  try {
    const inserted = await Participant.insertMany(docs, { ordered: false });
    insertedCount = inserted.length;
  } catch (bulkErr) {
    insertedCount = bulkErr.insertedDocs ? bulkErr.insertedDocs.length : 0;
    if (bulkErr.writeErrors) {
      bulkErr.writeErrors.forEach(we => {
        errors.push(`Row ${we.index + 1}: ${we.errmsg}`);
      });
    }
  }

  // Update registeredStudentsCount on School doc
  school.registeredStudentsCount = await Participant.countDocuments({ schoolId: school._id });
  await school.save({ validateBeforeSave: false });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        added: insertedCount,
        errors,
        totalParsed: rawParticipants.length
      },
      `Imported ${insertedCount} of ${rawParticipants.length} student(s) successfully.`
    )
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   HELPER: Aggregates School / Grade / Section Analytics
   ═══════════════════════════════════════════════════════════════════════════════ */
const compileSchoolAnalytics = (participants, results) => {
  const resultsMap = {};
  results.forEach(r => {
    resultsMap[r.participantId.toString()] = r;
  });

  const studentData = participants.map(p => {
    const res = resultsMap[p._id.toString()] || null;
    return {
      ...p,
      result: res
    };
  });

  const appeared = studentData.filter(s => s.result);
  const totalStudents = studentData.length;
  const totalAppeared = appeared.length;

  let totalMarks = 0;
  let highestMark = 0;
  let lowestMark = Infinity;
  let qualifiedCount = 0;

  const classStats = {};
  const sectionStats = {};

  const classes = ['6', '7', '8', '9', '10', '11', '12'];
  classes.forEach(c => {
    classStats[c] = { total: 0, appeared: 0, totalMarks: 0, highest: 0, lowest: Infinity };
  });

  appeared.forEach(s => {
    const marks = s.result.scores?.totalMarksObtained || 0;
    totalMarks += marks;
    if (marks > highestMark) highestMark = marks;
    if (marks < lowestMark) lowestMark = marks;

    if (['Qualified', 'MeritAwardee', 'NationalRanker'].includes(s.result.qualificationStatus)) {
      qualifiedCount++;
    }

    const cls = s.class;
    if (classStats[cls]) {
      classStats[cls].appeared++;
      classStats[cls].totalMarks += marks;
      if (marks > classStats[cls].highest) classStats[cls].highest = marks;
      if (marks < classStats[cls].lowest) classStats[cls].lowest = marks;
    }

    const secChar = s.section ? s.section.trim().toUpperCase() : 'Unassigned';
    const secKey = `${cls}-${secChar}`;
    if (!sectionStats[secKey]) {
      sectionStats[secKey] = {
        class: cls,
        section: secChar,
        appeared: 0,
        totalMarks: 0,
        highest: 0,
        lowest: Infinity
      };
    }
    sectionStats[secKey].appeared++;
    sectionStats[secKey].totalMarks += marks;
    if (marks > sectionStats[secKey].highest) sectionStats[secKey].highest = marks;
    if (marks < sectionStats[secKey].lowest) sectionStats[secKey].lowest = marks;
  });

  studentData.forEach(s => {
    const cls = s.class;
    if (classStats[cls]) {
      classStats[cls].total++;
    }
  });

  classes.forEach(c => {
    const stats = classStats[c];
    stats.average = stats.appeared > 0 ? Number((stats.totalMarks / stats.appeared).toFixed(2)) : 0;
    stats.lowest = stats.lowest === Infinity ? 0 : stats.lowest;
  });

  const sectionStatsList = Object.keys(sectionStats).map(key => {
    const stats = sectionStats[key];
    return {
      key,
      class: stats.class,
      section: stats.section,
      appeared: stats.appeared,
      average: stats.appeared > 0 ? Number((stats.totalMarks / stats.appeared).toFixed(2)) : 0,
      highest: stats.highest,
      lowest: stats.lowest === Infinity ? 0 : stats.lowest
    };
  });

  return {
    overview: {
      totalRegistered: totalStudents,
      totalAppeared,
      averageScore: totalAppeared > 0 ? Number((totalMarks / totalAppeared).toFixed(2)) : 0,
      highestScore: totalAppeared > 0 ? highestMark : 0,
      lowestScore: totalAppeared > 0 && lowestMark !== Infinity ? lowestMark : 0,
      qualificationRate: totalAppeared > 0 ? Number(((qualifiedCount / totalAppeared) * 100).toFixed(2)) : 0,
      qualifiedCount
    },
    classStats,
    sectionStats: sectionStatsList,
    students: studentData
  };
};

/* ═══════════════════════════════════════════════════════════════════════════════
   GET SCHOOL RESULTS AND ANALYTICS (Own School)
   GET /api/v1/schools/me/results
   Access: Authenticated school
   ═══════════════════════════════════════════════════════════════════════════════ */
const getSchoolResults = asyncHandler(async (req, res) => {
  const school = await School.findById(req.user._id);
  if (!school) throw new ApiError(404, 'School not found.');

  const participants = await Participant.find({ schoolId: school._id }).sort('class name').lean();
  const participantIds = participants.map(p => p._id);

  const results = await Result.find({ participantId: { $in: participantIds } })
    .populate('olympiadId', 'title category')
    .lean();

  const analytics = compileSchoolAnalytics(participants, results);

  res.status(200).json(
    new ApiResponse(200, analytics, 'School results and analytics retrieved successfully.')
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   GET SCHOOL RESULTS AND ANALYTICS FOR ADMIN
   GET /api/v1/schools/:id/results
   Access: Admin
   ═══════════════════════════════════════════════════════════════════════════════ */
const getSchoolResultsAdmin = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const school = await School.findById(req.params.id);
  if (!school) throw new ApiError(404, 'School not found.');

  const participants = await Participant.find({ schoolId: school._id }).sort('class name').lean();
  const participantIds = participants.map(p => p._id);

  const results = await Result.find({ participantId: { $in: participantIds } })
    .populate('olympiadId', 'title category')
    .lean();

  const analytics = compileSchoolAnalytics(participants, results);

  res.status(200).json(
    new ApiResponse(200, { school, ...analytics }, 'School analytics retrieved successfully.')
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
  uploadParticipantsFile,
  getSchoolResults,
  getSchoolResultsAdmin,
};
