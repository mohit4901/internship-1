require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const { logger } = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas and start listening
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    // Graceful Shutdown handlers
    const gracefulShutdown = (signal) => {
      logger.warn(`Received ${signal}. Starting graceful shutdown procedure...`);
      server.close(() => {
        logger.info('HTTP server closed. Releasing active database connections.');
        process.exit(0);
      });

      // Force close connections after 10s if graceful shutdown hangs
      setTimeout(() => {
        logger.error('Force closing applications due to timeout!');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  })
  .catch((err) => {
    logger.error('Database connection failed. Express server boot aborted!', err);
    process.exit(1);
  });

// Handle unhandled rejections outside Express loop
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down server immediately...', err);
  process.exit(1);
});
