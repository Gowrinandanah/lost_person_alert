//src/models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: function() {
        return this.role !== 'guest';
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "guest"],
      default: "user",
    },
    //  For police station/district admins
    district: {
      type: String,
      trim:true,
      default: "GENERAL",
      required: function() {
        return this.role === 'admin';
      }
    },
    aadhaarStatus: {
      type: String,
      enum: ["not_uploaded", "pending", "approved", "rejected"],
      default: "not_uploaded",
    },
    aadhaarNumber: String,
    aadhaarPhoto: String,
    homeLocation: {
      latitude: Number,
      longitude: Number,
    },
    currentLocation: {
      latitude: Number,
      longitude: Number,
    },
    lastLocationUpdatedAt: Date,
    fcmToken: String,
    profilePhoto: String,
    isFlagged: {
      type: Boolean,
      default: false
    },
    // Guest user fields
    radius: Number,
    verified: {
      type: Boolean,
      default: false,
    },
    unsubscribeToken: String,
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);