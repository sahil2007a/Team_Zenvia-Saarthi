const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI;

    if (!connUri) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    // Set connection options
    const options = {
      serverSelectionTimeoutMS: 8000, // Timeout after 8 seconds instead of hanging
      socketTimeoutMS: 45000,
    };

    console.log('[Database] Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(connUri, options);

    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`[Database] Database Name: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] MongoDB Connection Failed: ${error.message}`);
    // Do not crash the entire process so server can still serve health check / offline fallbacks
    console.warn('[Database Warning] Continuing in degraded mode (check Atlas IP whitelist / network credentials).');
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB connection disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] MongoDB connection re-established.');
});

module.exports = connectDB;
