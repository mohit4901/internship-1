const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Import utilities & custom middleware
const { errorHandler } = require('./middlewares/error.middleware');
const { ApiError } = require('./utils/apiError');

// Import routes
const routes = require('./routes');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow any origin for development, or if no origin (like Postman)
    callback(null, true);
  },
  credentials: true
}));

// Request parsers
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// Logger middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Root Check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Bharat AI Olympiad (BAIO) Backend API Server. Use /api/v1 for endpoints or /health for server health check.'
  });
});

// API Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BAIO Backend Server is running in healthy status.'
  });
});

// API Routes Mounting
app.use('/api/v1', routes);

// 404 handler for unmatched routes
app.use('*', (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
