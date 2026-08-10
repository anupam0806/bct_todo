const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

let isConnected = false;

const connectToDB = async () => {
  if (!isConnected && process.env.MONGO_URI) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error("MongoDB connection error:", err.message);
    }
  }
};

// Connect to DB on each request (serverless-friendly)
app.use(async (req, res, next) => {
  await connectToDB();
  next();
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/tasks", require("./routes/task.routes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// For Vercel serverless
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(
        `Server is running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
      );
    });
  }).catch(err => {
    console.error("Failed to connect to DB:", err.message);
    process.exit(1);
  });
}