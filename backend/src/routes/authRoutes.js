//src/routes/authRoutes

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, homeLocation } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      homeLocation,
      role: "user",
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registration successful. Please complete Aadhaar verification.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        aadhaarStatus: user.aadhaarStatus,
      },
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
        district: user.district,
        homeLocation: user.homeLocation,
        aadhaarStatus: user.aadhaarStatus,
        profilePhoto: user.profilePhoto,
        isFlagged: user.isFlagged,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= UPLOAD PROFILE PHOTO =================
router.post(
  "/upload-profile-photo",
  protect,
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      req.user.profilePhoto = req.file.path;
      await req.user.save();
      res.json({ message: "Profile photo updated", path: req.file.path });
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

      // Basic validation
      if (!/^\d{12}$/.test(aadhaarNumber)) {
        return res.status(400).json({ message: "Invalid Aadhaar number" });
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

// ================= GUEST SUBSCRIPTION =================
router.post("/guest-subscribe", async (req, res) => {
  try {
    const { email, location, radius = 10 } = req.body;
    
    // Check if guest already exists
    let guest = await User.findOne({ email, role: "guest" });
    
    if (guest) {
      // Update existing guest
      guest.homeLocation = location;
      guest.radius = radius;
    } else {
      // Create new guest
      guest = await User.create({
        email,
        role: "guest",
        homeLocation: location,
        radius,
        verified: false,
        unsubscribeToken: require('crypto').randomBytes(32).toString('hex'),
      });
    }
    
    await guest.save();
    
    res.json({ 
      message: "Subscribed successfully",
      email: guest.email 
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= UNSUBSCRIBE =================
router.post("/unsubscribe/:token", async (req, res) => {
  try {
    const guest = await User.findOne({ 
      unsubscribeToken: req.params.token,
      role: "guest" 
    });
    
    if (!guest) {
      return res.status(404).json({ message: "Invalid unsubscribe token" });
    }
    
    await guest.deleteOne();
    res.json({ message: "Unsubscribed successfully" });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= GET CURRENT USER =================
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// ================= UPDATE PROFILE =================
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone, homeLocation } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (homeLocation) user.homeLocation = homeLocation;
    
    await user.save();
    
    res.json({ 
      message: "Profile updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        homeLocation: user.homeLocation,
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;