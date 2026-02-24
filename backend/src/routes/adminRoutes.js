// src/routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const upload = require("../config/multer"); // Add this for file uploads

const User = require("../models/User");
const Report = require("../models/Report");
const Response = require("../models/Response");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

/* ===========================================
   REPORT MANAGEMENT (ADMIN)
=========================================== */

// GET ALL REPORTS (with optional district filter)
router.get(
  "/reports",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      let query = {};
      
      // If admin has a district (not GENERAL), show only their district reports
      if (req.user.district && req.user.district !== "GENERAL") {
        // This requires adding district field to reports or using location
        // For now, we'll skip filtering
      }
      
      const reports = await Report.find(query)
        .populate("user", "name email phone aadhaarStatus isFlagged")
        .sort({ createdAt: -1 });

      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET PENDING REPORTS (for admin dashboard)
router.get(
  "/reports/pending",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const reports = await Report.find({ status: "pending" })
        .populate("user", "name email phone")
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
  adminOnly,
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id)
        .populate("user", "name email phone aadhaarStatus isFlagged");

      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.json(report);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// UPDATE REPORT STATUS (Approve / Reject) - WITH CASE NUMBER GENERATION
router.put(
  "/reports/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { status } = req.body;

      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      // If approving a pending report, generate case number
      if (report.status === "pending" && status === "approved") {
        
        // Get admin's district (default to GENERAL)
        const adminDistrict = req.user.district || "GENERAL";
        
        // Find the last case number for this district this month
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        
        const lastApprovedReport = await Report.findOne({
          caseNumber: new RegExp(`^LP/${adminDistrict}/${year}/${month}/`),
          status: "approved"
        }).sort({ caseNumber: -1 });
        
        let sequence = 1;
        if (lastApprovedReport && lastApprovedReport.caseNumber) {
          const lastSeq = parseInt(lastApprovedReport.caseNumber.split('/').pop());
          sequence = lastSeq + 1;
        }
        
        // Format: LP/DISTRICT/YYYY/MM/0001
        const caseNumber = `LP/${adminDistrict}/${year}/${month}/${String(sequence).padStart(4, '0')}`;
        
        report.caseNumber = caseNumber;
        report.verifiedBy = req.user._id;
        report.verifiedAt = new Date();
      }
      
      // If resolving a report
      if (status === "resolved") {
        report.resolvedAt = new Date();
      }

      report.status = status;
      await report.save();

      res.json({ 
        message: `Report ${status} successfully`,
        caseNumber: report.caseNumber 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* ===========================================
   RESPONSE MANAGEMENT (ADMIN)
=========================================== */

// GET ALL RESPONSES (including general sightings)
router.get(
  "/responses",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const responses = await Response.find()
        .populate("user", "name email")
        .populate("report", "personName caseNumber")
        .populate("matchedToReport", "personName caseNumber")
        .sort({ createdAt: -1 });
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET PENDING RESPONSES (linked sightings)
router.get(
  "/responses/pending",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const responses = await Response.find({ 
        status: "pending",
        isGeneralSighting: { $ne: true } // Exclude general sightings
      })
        .populate("user", "name email")
        .populate("report", "personName caseNumber")
        .sort({ createdAt: -1 });
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// VERIFY RESPONSE (linked sighting)
router.put(
  "/responses/:id/verify",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { status } = req.body; // verified, false, helpful
      const response = await Response.findById(req.params.id);
      if (!response) return res.status(404).json({ message: "Response not found" });
      
      response.status = status;
      response.verifiedBy = req.user._id;
      response.verifiedAt = new Date();
      
      // If verified, make it public
      if (status === "verified" || status === "helpful") {
        response.isPublic = true;
      }
      
      await response.save();
      res.json({ message: `Response marked as ${status}` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* ===========================================
   GENERAL SIGHTING MANAGEMENT (ADMIN)
=========================================== */

// GET ALL GENERAL SIGHTINGS
router.get(
  "/general-sightings",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { status } = req.query;
      
      let query = { isGeneralSighting: true };
      if (status) {
        query.status = status;
      }

      const sightings = await Response.find(query)
        .populate("user", "name email phone")
        .populate("matchedToReport", "personName caseNumber")
        .sort({ createdAt: -1 });

      res.json(sightings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET PENDING GENERAL SIGHTINGS
router.get(
  "/general-sightings/pending",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const sightings = await Response.find({
        isGeneralSighting: true,
        status: "pending"
      })
        .populate("user", "name email phone")
        .sort({ createdAt: -1 });

      res.json(sightings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET SINGLE GENERAL SIGHTING
router.get(
  "/general-sightings/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const sighting = await Response.findOne({
        _id: req.params.id,
        isGeneralSighting: true,
      })
        .populate("user", "name email phone")
        .populate("matchedToReport", "personName caseNumber");

      if (!sighting) {
        return res.status(404).json({ message: "General sighting not found" });
      }

      res.json(sighting);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET ALL ACTIVE REPORTS FOR MATCHING DROPDOWN
router.get(
  "/active-reports-for-matching",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const reports = await Report.find({ 
        status: { $in: ["approved", "pending"] } 
      })
        .select("personName caseNumber status lastSeenLocation")
        .sort({ createdAt: -1 });

      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// MATCH GENERAL SIGHTING TO EXISTING REPORT
router.put(
  "/general-sightings/:id/match",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { reportId, adminNotes } = req.body;

      if (!reportId) {
        return res.status(400).json({ message: "Report ID is required" });
      }

      // Check if report exists
      const report = await Report.findById(reportId);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      // Find the general sighting
      const sighting = await Response.findOne({
        _id: req.params.id,
        isGeneralSighting: true,
      });

      if (!sighting) {
        return res.status(404).json({ message: "General sighting not found" });
      }

      // Update the sighting
      sighting.matchedToReport = reportId;
      sighting.status = "matched";
      sighting.isPublic = true;
      sighting.reviewedBy = req.user._id;
      sighting.reviewedAt = new Date();
      sighting.adminNotes = adminNotes || sighting.adminNotes;

      await sighting.save();

      res.json({
        message: "Sighting matched to report successfully",
        sighting,
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// CREATE NEW REPORT FROM GENERAL SIGHTING
router.post(
  "/general-sightings/:id/create-report",
  protect,
  adminOnly,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { adminNotes } = req.body;

      // Find the general sighting
      const sighting = await Response.findOne({
        _id: req.params.id,
        isGeneralSighting: true,
      });

      if (!sighting) {
        return res.status(404).json({ message: "General sighting not found" });
      }

      // Create a new report from the sighting data
      const reportData = {
        user: sighting.user,
        personName: sighting.personDescription.name || "Unknown Person",
        age: sighting.personDescription.age ? parseInt(sighting.personDescription.age) : undefined,
        gender: sighting.personDescription.gender,
        height: sighting.personDescription.height,
        complexion: sighting.personDescription.complexion,
        clothing: sighting.personDescription.clothing,
        description: sighting.description,
        
        lastSeenLocation: sighting.location,
        lastSeenDate: sighting.date,
        
        photo: req.file ? req.file.path : sighting.photo,
        
        informerName: sighting.contactName,
        informerPhone: sighting.contactPhone,
        
        status: "pending",
        
        // Track that this report came from a sighting
        createdFromSighting: sighting._id,
      };

      const newReport = await Report.create(reportData);

      // Update the sighting
      sighting.matchedToReport = newReport._id;
      sighting.status = "new_case";
      sighting.isPublic = true;
      sighting.reviewedBy = req.user._id;
      sighting.reviewedAt = new Date();
      sighting.adminNotes = adminNotes || "Created new report from sighting";

      await sighting.save();

      res.status(201).json({
        message: "New report created from sighting",
        report: newReport,
        sighting,
      });

    } catch (error) {
      console.error("Error creating report from sighting:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// MARK GENERAL SIGHTING AS IRRELEVANT
router.put(
  "/general-sightings/:id/reject",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { adminNotes } = req.body;

      const sighting = await Response.findOne({
        _id: req.params.id,
        isGeneralSighting: true,
      });

      if (!sighting) {
        return res.status(404).json({ message: "General sighting not found" });
      }

      sighting.status = "irrelevant";
      sighting.isPublic = false;
      sighting.reviewedBy = req.user._id;
      sighting.reviewedAt = new Date();
      sighting.adminNotes = adminNotes || "Marked as irrelevant";

      await sighting.save();

      res.json({
        message: "Sighting marked as irrelevant",
        sighting,
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET STATS FOR GENERAL SIGHTINGS
router.get(
  "/stats/general-sightings",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const pending = await Response.countDocuments({
        isGeneralSighting: true,
        status: "pending"
      });

      const matched = await Response.countDocuments({
        isGeneralSighting: true,
        status: "matched"
      });

      const newCases = await Response.countDocuments({
        isGeneralSighting: true,
        status: "new_case"
      });

      const irrelevant = await Response.countDocuments({
        isGeneralSighting: true,
        status: "irrelevant"
      });

      res.json({
        pending,
        matched,
        newCases,
        irrelevant,
        total: pending + matched + newCases + irrelevant
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* ===========================================
   USER MANAGEMENT (ADMIN)
=========================================== */

// GET ALL USERS
router.get(
  "/users/all",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET Pending Users
router.get(
  "/users/pending",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const users = await User.find({ aadhaarStatus: "pending" })
        .select("-password")
        .sort({ createdAt: -1 });

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET Approved Users
router.get(
  "/users/approved",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const users = await User.find({ aadhaarStatus: "approved" })
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
  adminOnly,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.aadhaarStatus !== "pending") {
        return res.status(400).json({
          message: "User Aadhaar is not in pending state",
        });
      }

      user.aadhaarStatus = "approved";
      await user.save();

      res.json({ message: "User Aadhaar verified successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// REJECT USER AADHAAR
router.put(
  "/users/:id/reject-aadhaar",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.aadhaarStatus = "rejected";
      await user.save();

      res.json({ message: "User Aadhaar rejected" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// FLAG USER
router.put(
  "/users/:id/flag",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.isFlagged = !user.isFlagged;
      await user.save();

      res.json({ message: `User ${user.isFlagged ? 'flagged' : 'unflagged'} successfully` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// DELETE USER
router.delete(
  "/users/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

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
  adminOnly,
  async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const reports = await Report.find({ user: userId }).sort({
        createdAt: -1,
      });

      const responses = await Response.find({ user: userId })
        .populate("report", "personName caseNumber status")
        .populate("matchedToReport", "personName caseNumber")
        .sort({ createdAt: -1 });

      res.json({ user, reports, responses });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* ===========================================
   DASHBOARD STATS
=========================================== */

// GET COMPLETE DASHBOARD STATS
router.get(
  "/stats",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const pendingReports = await Report.countDocuments({ status: "pending" });
      const pendingResponses = await Response.countDocuments({ 
        status: "pending",
        isGeneralSighting: { $ne: true }
      });
      const pendingGeneralSightings = await Response.countDocuments({ 
        status: "pending",
        isGeneralSighting: true 
      });
      const pendingUsers = await User.countDocuments({ aadhaarStatus: "pending" });
      
      const totalReports = await Report.countDocuments();
      const totalUsers = await User.countDocuments({ role: "user" });
      const totalGeneralSightings = await Response.countDocuments({ isGeneralSighting: true });

      res.json({
        pendingReports,
        pendingResponses,
        pendingGeneralSightings,
        pendingUsers,
        totalReports,
        totalUsers,
        totalGeneralSightings
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


// GET users who haven't uploaded Aadhaar
router.get(
  "/users/not-uploaded",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const users = await User.find({ aadhaarStatus: "not_uploaded" })
        .select("-password")
        .sort({ createdAt: -1 });

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


// GET FLAGGED USERS
router.get(
  "/users/flagged",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const users = await User.find({ isFlagged: true })
        .select("-password")
        .sort({ createdAt: -1 });

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


module.exports = router;