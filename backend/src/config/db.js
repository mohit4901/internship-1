const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const connectDB = async () => {
  try {
    const connInstance = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB Connected successfully. DB HOST: ${connInstance.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = { connectDB };
