const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    personName: {
      type: String,
      required: true,
    },
    age: Number,
    gender: String,
    description: String,
    lastSeenLocation: String,

    photo: {
      type: String, // store image path
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    height: Number,
    weight: Number,
    clothing: String,
    lastSeenDate: Date,
    lastSeenTime: String,

    // For future map integration
    lastSeenCoordinates: {
      latitude: Number,
      longitude: Number,
    },

    // Informer Details
    informerName: String,
    informerPhone: String,
    informerRelation: String,



  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);