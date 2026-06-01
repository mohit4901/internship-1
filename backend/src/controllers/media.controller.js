const Media    = require('../models/Media');
const { ApiError }    = require('../utils/apiError');
const { ApiResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const mongoose = require('mongoose');

/**
 * GET /api/v1/media/:id
 * Serves a stored file from MongoDB with correct headers.
 * Public – no auth required.
 */
const getMedia = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid media ID format.');
  }

  const media = await Media.findById(id);
  if (!media) {
    throw new ApiError(404, 'File not found.');
  }

  res.set({
    'Content-Type':        media.contentType,
    'Content-Length':      media.size,
    'Content-Disposition': `inline; filename="${media.filename}"`,
    'Cache-Control':       'public, max-age=86400',
  });

  res.send(media.data);
});

/**
 * POST /api/v1/media/upload
 * Admin-only: accepts a single multipart file field named "file".
 * Allowed types: image/*, application/pdf
 * Max size: 5 MB (enforced in multer middleware)
 */
const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded. Use multipart/form-data with field name "file".');
  }

  const { originalname, mimetype, size, buffer } = req.file;

  // Extra MIME guard (belt-and-braces beyond multer fileFilter)
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (!allowed.includes(mimetype)) {
    throw new ApiError(415, `Unsupported file type: ${mimetype}. Allowed: image/jpeg, image/png, image/webp, application/pdf`);
  }

  const media = await Media.create({
    filename:    originalname,
    contentType: mimetype,
    size,
    data:        buffer,
  });

  res.status(201).json(
    new ApiResponse(201, {
      id:          media._id,
      filename:    media.filename,
      contentType: media.contentType,
      size:        media.size,
      url:         `/api/v1/media/${media._id}`,
      uploadedAt:  media.createdAt,
    }, 'File uploaded successfully.')
  );
});

module.exports = { getMedia, uploadMedia };
