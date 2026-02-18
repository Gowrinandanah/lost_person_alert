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
      required: true,
    },

    
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    aadhaarStatus: {
      type: String,
      enum: ["not_uploaded", "pending", "approved", "rejected"],
      default: "not_uploaded",
    },
 

    aadhaarNumber: {
      type: String,
      trim: true,
    },

    aadhaarPhoto: {
      type: String,
    },

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

    profilePhoto: {
      type: String,
    },

    isFlagged: {
      type: Boolean,
      default: false
    },

  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);