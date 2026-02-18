const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, homeLocation } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      homeLocation,
    });

    res.status(201).json({
      message: "Registration successful. Please complete Aadhaar verification.",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
      id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    homeLocation: user.homeLocation,
    aadhaarStatus: user.aadhaarStatus,
    profilePhoto: user.profilePhoto,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



//=====================upload profile pic==================//
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/upload-profile-photo",
  authMiddleware,
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      req.user.profilePhoto = req.file.path;
      await req.user.save();
      res.json({ message: "Profile photo updated" });
    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  }
);



// ================= UPLOAD AADHAAR =================
router.put(
  "/upload-aadhaar",
  protect,
  upload.single("aadhaarPhoto"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      // 🚫 Block re-submission
      if (user.aadhaarStatus === "pending") {
        return res.status(400).json({
          message: "Aadhaar already submitted and awaiting approval.",
        });
      }

      if (user.aadhaarStatus === "approved") {
        return res.status(400).json({
          message: "Aadhaar already approved. Cannot re-submit.",
        });
      }

      const { aadhaarNumber } = req.body;

      if (!aadhaarNumber || !req.file) {
        return res.status(400).json({ message: "Aadhaar details required" });
      }

      user.aadhaarNumber = aadhaarNumber;
      user.aadhaarPhoto = req.file.path;
      user.aadhaarStatus = "pending";

      await user.save();

      res.json({ message: "Aadhaar submitted for admin approval." });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);





// ================= GET USERS (ADMIN) =================
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});



//__________------get current logged in user-------------//
// Get current logged in user
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});






module.exports = router;