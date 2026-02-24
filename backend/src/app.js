//src/app.js

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("Lost Person Alert Backend Running");
});

// Auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// User & public reports
app.use("/api/reports", require("./routes/reportRoutes"));

// Admin routes (users & admin-level reports)
app.use("/api/admin", require("./routes/adminRoutes")); 

module.exports = app;