// src/middleware/adminMiddleware.js

// 🔹 Primary Admin Only
const primaryAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === "primaryAdmin") {
    return next();
  }
  return res.status(403).json({
    message: "Primary admin access required",
  });
};

// 🔹 Secondary Admin Only
const secondaryAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === "secondaryAdmin") {
    return next();
  }
  return res.status(403).json({
    message: "Secondary admin access required",
  });
};

// 🔹 Backward Compatible (Old adminOnly behavior)
const adminOnly = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "primaryAdmin" ||
      req.user.role === "secondaryAdmin")
  ) {
    return next();
  }
  return res.status(403).json({
    message: "Admin access only",
  });
};

// 🚀 EXPORT MAGIC
module.exports = adminOnly; // keeps old imports working
module.exports.primaryAdminOnly = primaryAdminOnly;
module.exports.secondaryAdminOnly = secondaryAdminOnly;