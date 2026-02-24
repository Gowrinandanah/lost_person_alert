//src/models/Response.js

const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    // For linked sightings - this can be null for general sightings
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: false, // Changed to false for general sightings
      default: null,
    },
    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // ===== GENERAL SIGHTING FIELDS =====
    // Flag to identify general sightings
    isGeneralSighting: {
      type: Boolean,
      default: false,
    },
    
    // Person description (for general sightings)
    personDescription: {
      name: String,
      age: String,
      gender: {
        type: String,
        enum: ["male", "female", "other", "unknown", ""],
      },
      height: String,
      complexion: String,
      clothing: String,
    },
    
    // ===== SIGHTING DETAILS =====
    location: {
      type: String,
      required: true,
    },
    
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    
    description: {
      type: String,
      required: true,
    },
    
    // Person's condition when sighted
    personCondition: {
      type: String,
      enum: ["healthy", "injured", "confused", "with_someone", "other"],
      default: "healthy",
    },
    
    // Photos
    photo: String,
    
    // Contact (optional)
    contactName: String,
    contactPhone: String,
    contactEmail: String,
    
    // ===== STATUS & MATCHING =====
    status: {
      type: String,
      enum: ["pending", "verified", "false", "helpful", "matched", "new_case", "irrelevant"],
      default: "pending",
    },
    
    // For general sightings that are matched to existing reports
    matchedToReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      default: null,
    },
    
    // Admin who reviewed this sighting
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    
    reviewedAt: Date,
    
    adminNotes: String,
    
    // Whether public can see this sighting
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for querying general sightings
responseSchema.index({ isGeneralSighting: 1, status: 1 });
responseSchema.index({ matchedToReport: 1 });

module.exports = mongoose.model("Response", responseSchema);