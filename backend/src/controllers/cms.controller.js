const Cms = require('../models/Cms');
const { ApiError } = require('../utils/apiError');
const { ApiResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

// Default starter payloads for CMS keys to prevent frontend crashes
const DEFAULT_PAYLOADS = {
  homepage: {
    heroTitle: 'Welcome to Bharat AI Olympiad',
    heroSubtitle: 'Empowering future minds with artificial intelligence education.',
    features: []
  },
  about: {
    title: 'About Us',
    content: 'We are dedicated to fostering AI knowledge across schools and academic institutions.',
    mission: '',
    vision: ''
  },
  contact: {
    email: 'support@baio.in',
    phone: '+91 99999 99999',
    address: 'New Delhi, India',
    officeHours: 'Mon - Fri, 9am - 6pm'
  },
  faq: [
    { question: 'What is Bharat AI Olympiad?', answer: 'It is a national level AI-focused competition.' }
  ]
};

/* ═══════════════════════════════════════════════════════════════════════════════
   GET CMS CONTENT BY KEY (Public / Frontend)
   GET /api/v1/cms/:key
   Access: Public
   ═══════════════════════════════════════════════════════════════════════════════ */
const getCmsByKey = asyncHandler(async (req, res) => {
  const { key } = req.params;

  if (!DEFAULT_PAYLOADS[key]) {
    throw new ApiError(400, `Invalid CMS key '${key}'. Allowed: ${Object.keys(DEFAULT_PAYLOADS).join(', ')}`);
  }

  let cmsEntry = await Cms.findOne({ key }).lean();

  // If entry doesn't exist, return default structure rather than 404
  const value = cmsEntry ? cmsEntry.value : DEFAULT_PAYLOADS[key];

  res.status(200).json(
    new ApiResponse(200, { key, value }, `CMS content for '${key}' retrieved successfully.`)
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   UPSERT CMS CONTENT (Admin)
   POST /api/v1/cms
   Access: Admin only (cms:write)
   ═══════════════════════════════════════════════════════════════════════════════ */
const updateCms = asyncHandler(async (req, res) => {
  const { key, value } = req.body;

  if (!DEFAULT_PAYLOADS[key]) {
    throw new ApiError(400, `Invalid CMS key '${key}'. Allowed: ${Object.keys(DEFAULT_PAYLOADS).join(', ')}`);
  }

  // Find and update or create (upsert)
  const cmsEntry = await Cms.findOneAndUpdate(
    { key },
    {
      key,
      value,
      updatedBy: req.user._id
    },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json(
    new ApiResponse(200, { cms: cmsEntry }, `CMS content for '${key}' updated successfully.`)
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   GET ALL CMS ENTRIES (Admin Settings Panel)
   GET /api/v1/cms
   Access: Admin only (cms:read)
   ═══════════════════════════════════════════════════════════════════════════════ */
const getAllCms = asyncHandler(async (req, res) => {
  const entries = await Cms.find({}).populate('updatedBy', 'fullName email').lean();

  // Map entries into a complete dictionary (merge defaults for missing keys)
  const result = {};
  Object.keys(DEFAULT_PAYLOADS).forEach((k) => {
    const matched = entries.find((e) => e.key === k);
    result[k] = matched ? { value: matched.value, updatedAt: matched.updatedAt, updatedBy: matched.updatedBy } : { value: DEFAULT_PAYLOADS[k] };
  });

  res.status(200).json(
    new ApiResponse(200, { cms: result }, 'All CMS content retrieved successfully.')
  );
});

module.exports = {
  getCmsByKey,
  updateCms,
  getAllCms,
};
