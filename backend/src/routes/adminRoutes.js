// src/routes/adminRoutes.js

const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Report = require("../models/Report");
const Response = require("../models/Response");

const protect = require("../middleware/authMiddleware");
const { primaryAdminOnly,secondaryAdminOnly } = require("../middleware/adminMiddleware");

/* ===========================================
   REPORT MANAGEMENT (PRIMARY ADMIN)
=========================================== */

// GET ALL REPORTS (for admin panel)
router.get(
  "/reports",
  protect,
  secondaryAdminOnly,
  async (req, res) => {
    try {
      const reports = await Report.find()
        .populate("user", "name email phone aadhaarVerified isFlagged")
        .sort({ createdAt: -1 });

      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET SINGLE REPORT DETAILS
router.get(
  "/reports/:id",
  protect,
  secondaryAdminOnly,
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id)
        .populate("user", "name email phone aadhaarVerified isFlagged");

      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.json(report);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// UPDATE REPORT STATUS (Approve / Reject)
router.put(
  "/reports/:id",
  protect,
  secondaryAdminOnly,
  async (req, res) => {
    try {
      const { status } = req.body;

      const report = await Report.findById(req.params.id);
      if (!report)
        return res.status(404).json({ message: "Report not found" });

      report.status = status;
      await report.save();

      res.json({ message: "Report status updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* ===========================================
   USERS MANAGEMENT (PRIMARY ADMIN ONLY)
=========================================== */

// GET Non-Verified Users
router.get(
  "/users/non-verified",
  protect,
  primaryAdminOnly,
  async (req, res) => {
    try {
      const users = await User.find({ aadhaarVerified: false })
        .select("-password")
        .sort({ createdAt: -1 });

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET Verified Users
router.get(
  "/users/verified",
  protect,
  primaryAdminOnly,secondaryAdminOnly,
  async (req, res) => {
    try {
      const users = await User.find({ aadhaarVerified: true })
        .select("-password")
        .sort({ createdAt: -1 });

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// VERIFY USER AADHAAR
router.put(
  "/users/:id/verify-aadhaar",
  protect,
  primaryAdminOnly,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user)
        return res.status(404).json({ message: "User not found" });

      user.aadhaarVerified = true;
      await user.save();

      res.json({ message: "User Aadhaar verified successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// FLAG USER
router.put(
  "/users/:id/flag",
  protect,
  primaryAdminOnly,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user)
        return res.status(404).json({ message: "User not found" });

      user.isFlagged = true;
      await user.save();

      res.json({ message: "User flagged successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// DELETE USER
router.delete(
  "/users/:id",
  protect,
  primaryAdminOnly,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user)
        return res.status(404).json({ message: "User not found" });

      await user.deleteOne();
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET FULL USER DETAILS
router.get(
  "/users/:id/details",
  protect,
  primaryAdminOnly,
  async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId).select("-password");
      if (!user)
        return res.status(404).json({ message: "User not found" });

      const reports = await Report.find({ user: userId }).sort({
        createdAt: -1,
      });

      const responses = await Response.find({ user: userId })
        .populate("report", "personName status")
        .sort({ createdAt: -1 });

      res.json({ user, reports, responses });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;