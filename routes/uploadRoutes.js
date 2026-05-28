const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"), false);
  },
});

// ── Admin: upload single image ──────────────────────────────
router.post("/", protect, adminOnly, upload.single("image"), (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ success: true, url, filename: req.file.filename });
});

// ── Admin: upload multiple images (max 5) ───────────────────
router.post(
  "/multiple",
  protect,
  adminOnly,
  upload.array("images", 5),
  (req, res) => {
    if (!req.files?.length)
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    const urls = req.files.map((f) => ({
      url: `${req.protocol}://${req.get("host")}/uploads/${f.filename}`,
      filename: f.filename,
    }));
    res.json({ success: true, urls });
  },
);

// ── Admin: delete image ─────────────────────────────────────
router.delete("/:filename", protect, adminOnly, (req, res) => {
  try {
    const filePath = path.join(uploadDir, req.params.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: "Image deleted" });
    } else {
      res.status(404).json({ success: false, message: "File not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Customer: upload own avatar ─────────────────────────────
router.post("/avatar", protect, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });

    const User = require("../models/User");

    // Delete old avatar file if exists
    const user = await User.findById(req.user._id);
    if (user.avatar) {
      const oldFilename = user.avatar.split("/uploads/")[1];
      if (oldFilename) {
        const oldPath = path.join(uploadDir, oldFilename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user._id, { avatar: url });
    res.json({ success: true, url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
