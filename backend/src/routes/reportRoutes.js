// src/routes/reportRoutes.js

const express = require("express");
const router = express.Router();

const Report = require("../models/Report");
const Response = require("../models/Response"); // Make sure this is imported
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
   GET USER'S OWN REPORTS
=========================================== */

router.get("/my-reports", protect, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================================
   RESPONSES FOR A REPORT (LINKED SIGHTINGS)
=========================================== */

// GET responses for a specific report (public - only verified)
router.get("/:id/responses", async (req, res) => {
  try {
    const responses = await Response.find({ 
      report: req.params.id,
      isGeneralSighting: false,
      status: { $in: ["verified", "helpful"] }
    })
    .populate("user", "name")
    .sort({ createdAt: -1 });

    res.json(responses);
  } catch (error) {
    console.error("Error fetching responses:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST a new response to a report (linked sighting)
router.post(
  "/:id/responses",
  protect,
  upload.single("photo"),
  async (req, res) => {
    try {
      // Check if report exists
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      // Create response (linked sighting)
      const response = await Response.create({
        report: req.params.id,
        user: req.user._id,
        isGeneralSighting: false,
        location: req.body.location,
        date: req.body.date || new Date(),
        description: req.body.description,
        personCondition: req.body.personCondition || "healthy",
        photo: req.file ? req.file.path : null,
        contactName: req.body.contactName || req.user.name,
        contactPhone: req.body.contactPhone || req.user.phone,
        contactEmail: req.body.contactEmail || req.user.email,
        status: "pending",
      });

      res.status(201).json({
        message: "Response submitted successfully",
        response,
      });
    } catch (error) {
      console.error("Error submitting response:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

/* ===========================================
   GENERAL SIGHTING ROUTES
=========================================== */

// Submit a general sighting (not linked to any report)
router.post(
  "/general-sighting",
  protect,
  upload.single("photo"),
  async (req, res) => {
    try {
      const {
        location,
        date,
        description,
        personCondition,
        contactName,
        contactPhone,
        contactEmail,
        personName,
        personAge,
        personGender,
        personHeight,
        personComplexion,
        personClothing,
      } = req.body;

      if (!location || !date || !description) {
        return res.status(400).json({ 
          message: "Location, date, and description are required" 
        });
      }

      const sighting = await Response.create({
        user: req.user._id,
        isGeneralSighting: true,
        report: null,
        personDescription: {
          name: personName || "",
          age: personAge || "",
          gender: personGender || "",
          height: personHeight || "",
          complexion: personComplexion || "",
          clothing: personClothing || "",
        },
        location,
        date: new Date(date),
        description,
        personCondition: personCondition || "healthy",
        photo: req.file ? req.file.path : null,
        contactName: contactName || req.user.name,
        contactPhone: contactPhone || req.user.phone,
        contactEmail: contactEmail || req.user.email,
        status: "pending",
        isPublic: false,
      });

      res.status(201).json({
        message: "General sighting submitted successfully",
        sighting,
      });

    } catch (error) {
      console.error("Error submitting general sighting:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get public general sightings (after approval)
router.get("/general-sightings/public", async (req, res) => {
  try {
    const sightings = await Response.find({
      isGeneralSighting: true,
      isPublic: true,
      status: { $in: ["verified", "helpful", "matched"] }
    })
    .populate("user", "name")
    .populate("matchedToReport", "personName caseNumber")
    .sort({ createdAt: -1 });

    res.json(sightings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single public general sighting
router.get("/general-sightings/:id", async (req, res) => {
  try {
    const sighting = await Response.findOne({
      _id: req.params.id,
      isGeneralSighting: true,
      isPublic: true,
    })
    .populate("user", "name")
    .populate("matchedToReport", "personName caseNumber");

    if (!sighting) {
      return res.status(404).json({ message: "Sighting not found" });
    }

    res.json(sighting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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



// GET responses for the reporter (includes contact info)
router.get("/:id/reporter-responses", protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Only the reporter or admin can access
    if (report.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const responses = await Response.find({ 
      report: req.params.id,
      isGeneralSighting: false
    })
    .populate("user", "name email phone") // Include contact info
    .sort({ createdAt: -1 });

    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;