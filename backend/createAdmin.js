require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");

const createAdmin = async () => {
  try {
    await connectDB();

    /* ===========================================
       👑 CREATE SINGLE ADMIN
    =========================================== */

    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("⚠ Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin", 10);

    const admin = new User({
      name: "System Admin",
      email: "admin@gmail.com",
      phone: "9000000000",
      password: hashedPassword,
      role: "admin",
      aadhaarStatus: "approved",
      isFlagged: false,
    });

    await admin.save();

    console.log("✅ Admin created successfully");
    console.log("📧 Email: admin@lostalert.com");
    console.log("🔑 Password: Admin@123");

    process.exit();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
