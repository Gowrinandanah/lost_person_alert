require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");

const createAdmins = async () => {
  try {
    await connectDB();

    /* ===========================================
       👑 CREATE PRIMARY ADMIN
    =========================================== */

    const existingPrimary = await User.findOne({ role: "primaryAdmin" });

    if (!existingPrimary) {
      const primaryPassword = await bcrypt.hash("primary123", 10);

      const primaryAdmin = new User({
        name: "Primary Admin",
        email: "primary@lostalert.com",
        phone: "9000000001",
        password: primaryPassword,
        role: "primaryAdmin",
        aadhaarVerified: true,
      });

      await primaryAdmin.save();
      console.log("✅ Primary Admin created");
    } else {
      console.log("⚠ Primary Admin already exists");
    }

    /* ===========================================
       🧑‍💼 CREATE SECONDARY ADMIN
    =========================================== */

    const existingSecondary = await User.findOne({ role: "secondaryAdmin" });

    if (!existingSecondary) {
      const secondaryPassword = await bcrypt.hash("secondary123", 10);

      const secondaryAdmin = new User({
        name: "Secondary Admin",
        email: "secondary@lostalert.com",
        phone: "9000000002",
        password: secondaryPassword,
        role: "secondaryAdmin",
        aadhaarVerified: true,
      });

      await secondaryAdmin.save();
      console.log("✅ Secondary Admin created");
    } else {
      console.log("⚠ Secondary Admin already exists");
    }

    console.log("\n🎉 Admin setup completed");
    process.exit();
  } catch (error) {
    console.error("❌ Error creating admins:", error);
    process.exit(1);
  }
};

createAdmins();