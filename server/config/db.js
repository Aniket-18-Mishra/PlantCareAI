import mongoose from 'mongoose';

/**
 * Connects to MongoDB using the URI from environment variables.
 * Exits the process if the connection fails — the app cannot run without a database.
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error(
        'MONGODB_URI is not defined in your .env file. ' +
        'Please add your MongoDB connection string to server/.env'
      );
    }

    const conn = await mongoose.connect(uri, {
      // Modern Mongoose (7+) no longer needs these options, but listed for clarity
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1); // Stop the server — no point running without a database
  }
};

export default connectDB;
