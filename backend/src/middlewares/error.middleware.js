const { logger } = require('../utils/logger');
const { ApiError } = require('../utils/apiError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, err.errors, err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  };

  logger.error(`[${req.method}] ${req.originalUrl} - ${error.statusCode} - ${error.message}`);
  if (error.errors && error.errors.length > 0) {
    logger.error(`Validation details: ${JSON.stringify(error.errors, null, 2)}`);
  }
  if (process.env.NODE_ENV === 'development') {
    logger.error(error.stack);
  }

  res.status(error.statusCode).json(response);
};

module.exports = { errorHandler };
