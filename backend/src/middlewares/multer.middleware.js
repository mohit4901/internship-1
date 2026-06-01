const multer    = require('multer');
const { ApiError } = require('../utils/apiError');

// Buffer storage — no disk writes, file lives in req.file.buffer
const storage = multer.memoryStorage();

const ALLOWED_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    return cb(
      new ApiError(415, `Unsupported file type "${file.mimetype}". Allowed: ${ALLOWED_MIMES.join(', ')}`),
      false
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB hard limit
  },
});

module.exports = { upload };
