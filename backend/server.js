const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const User = require("./models/user.model");

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

app.get("/", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Users Directory</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 2rem; background-color: #f8fafc; color: #334155; }
            h1 { color: #0f172a; margin-bottom: 1.5rem; }
            .table-container { overflow-x: auto; background: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
            table { width: 100%; border-collapse: collapse; text-align: left; }
            th, td { padding: 1rem; border-bottom: 1px solid #e2e8f0; }
            th { background-color: #f1f5f9; font-weight: 600; color: #475569; }
            tr:last-child td { border-bottom: none; }
            tr:hover { background-color: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>Registered Users Directory</h1>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                ${users.map(u => `
                  <tr>
                    <td><code>${u._id}</code></td>
                    <td><strong>${u.name}</strong></td>
                    <td>${u.email}</td>
                    <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    res.status(500).send("Error loading users: " + error.message);
  }
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