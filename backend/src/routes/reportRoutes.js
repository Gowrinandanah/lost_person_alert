const express = require("express");
const router = express.Router();

const Report = require("../models/Report");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

/* ===========================================
   Aadhaar Approved Middleware (Users Only)
=========================================== */

const aadhaarOnly = (req, res, next) => {
  if (req.user && req.user.aadhaarStatus === "approved") {
    return next();
  }

  return res.status(403).json({
    message: "Aadhaar approval required to submit reports.",
  });
};

/* ===========================================
   USER SUBMIT REPORT
=========================================== */

router.post(
  "/",
  protect,
  aadhaarOnly,
  upload.single("photo"),
  async (req, res) => {
    try {
      const report = await Report.create({
        ...req.body,
        user: req.user._id,
        photo: req.file ? req.file.path : null,
      });

      res.status(201).json({
        message: "Report submitted successfully",
        report,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* ===========================================
   ADMIN REPORT MANAGEMENT
=========================================== */

// GET ALL REPORTS
router.get(
  "/admin/all",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const reports = await Report.find()
        .populate("user", "name email phone aadhaarStatus")
        .sort({ createdAt: -1 });

      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET SINGLE REPORT
router.get(
  "/admin/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id)
        .populate("user", "name email phone aadhaarStatus");

      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.json(report);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// APPROVE REPORT
router.put(
  "/admin/:id/approve",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      report.status = "approved";
      await report.save();

      res.json({ message: "Report approved successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// REJECT REPORT
router.put(
  "/admin/:id/reject",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      report.status = "rejected";
      await report.save();

      res.json({ message: "Report rejected successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* ===========================================
   PUBLIC ROUTES
=========================================== */

router.get("/active", async (req, res) => {
  try {
    const reports = await Report.find({ status: "approved" })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      status: "approved",
    }).populate("user", "name");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
