const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ── Customer: view own profile ──────────────────────────────
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Customer: update own profile + upload avatar ────────────
router.put("/profile", protect, async (req, res) => {
  try {
    const allowed = ["name", "phone", "address", "avatar"];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Admin: get all users ────────────────────────────────────
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await User.countDocuments();
    const users = await User.find()
      .sort("-createdAt")
      .skip((+page - 1) * +limit)
      .limit(+limit);
    res.json({ success: true, users, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Admin: get single user ──────────────────────────────────
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Admin: update user ──────────────────────────────────────
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    // Block making more than 2 admins at a time
    if (req.body.role === "admin") {
      const adminCount = await User.countDocuments({
        role: "admin",
        isActive: true,
      });
      if (adminCount >= 2) {
        return res.status(400).json({
          success: false,
          message: "Maximum 2 admins allowed at a time. Remove an admin first.",
        });
      }
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Admin: deactivate user ──────────────────────────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "User deactivated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
