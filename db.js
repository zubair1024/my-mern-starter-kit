import mongoose from 'mongoose';

import { getDBUrl } from './config.js';
import { logger } from './winston.js';

export const connectDB = async () => {
  try {
    logger.log(`MongoDB connecting...📶`);
    await mongoose.connect(getDBUrl(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    logger.log(`MongoDB connected...✅`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  return mongoose.connection.close();
};

export const installDBConnectionHandlers = () => {
  mongoose.connection.on('connecting', () => {
    logger.info('connecting to MongoDB... 📶');
  });

  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected! ✅');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('Mongoose reconnected! 🔁');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('Error in MongoDb connection:' + err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.error('MongoDB disconnected!');
  });
};
