//src/models/Report.js

const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Missing Person Details
    personName: {
      type: String,
      required: true,
    },
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    complexion: String,
    clothing: String,
    description: String,
    
    // Last Seen
    lastSeenLocation: String,
    lastSeenDate: Date,
    lastSeenTime: String,
    lastSeenCoordinates: {
      latitude: Number,
      longitude: Number,
    },
    
    // Photos
    photo: String,
    
    // Informer Details
    informerName: String,
    informerPhone: String,
    informerRelation: String,
    
    // Status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "resolved"],
      default: "pending",
    },
    
    // NEW: Case Number (only assigned when approved)
    caseNumber: {
      type: String,
      unique: true,
      sparse: true, // Only approved reports get case numbers
    },
    
    // NEW: Tracking who approved and when
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    createdFromSighting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Response",
    default: null,
  },


    verifiedAt: Date,
    resolvedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);