// resetPassword.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./src/models/User");
const connectDB = require("./src/config/db");

connectDB();

async function resetPassword() {
  try {
    const email = "testuser@test.com"; // put the user email here
    const newPassword = "Test@1234";    // new password you want to set

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      process.exit();
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    console.log(`Password reset successfully! New password: ${newPassword}`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

resetPassword();
