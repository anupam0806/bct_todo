const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Don't exit the process during development when the DB is unreachable.
    // This allows the server to start for testing endpoints that don't require DB.
  }
};

module.exports = connectDB;