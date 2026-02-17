const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      latitude: Number,
      longitude: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Response", responseSchema);