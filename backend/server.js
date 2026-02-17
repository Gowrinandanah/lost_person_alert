require("dotenv").config();
const path = require("path");
const express = require("express");

const connectDB = require("./src/config/db");
const app = require("./src/app");

// Connect to MongoDB
connectDB();

// 🔥 Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});