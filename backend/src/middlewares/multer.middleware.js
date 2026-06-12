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
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
  'application/octet-stream',
];

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    // Also check file extension for safety
    const ext = file.originalname.split('.').pop().toLowerCase();
    const docExtensions = ['xlsx', 'xls', 'csv', 'pdf', 'png', 'jpg', 'jpeg', 'webp', 'gif'];
    if (docExtensions.includes(ext)) {
      return cb(null, true);
    }
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
    fileSize: 10 * 1024 * 1024, // 10 MB limit for spreadsheet uploads
  },
});

module.exports = { upload };
