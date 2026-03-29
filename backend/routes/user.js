const express = require("express");
const router = express.Router();
const { profileUploads } = require("../middleware/uploads");
const authenticateUser = require("../middleware/authenticateUser");
const User = require("../models/User");

router.post(
  "/upload-profile-pic",
  authenticateUser,
  profileUploads.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Try different properties that might contain the URL
      const profileUrl = req.file.path || req.file.secure_url || req.file.url;

      if (!profileUrl) {
        console.error("File object:", req.file);
        return res
          .status(400)
          .json({ message: "Image upload to Cloudinary failed" });
      }

      const { fullName } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          profilepic: profileUrl,
          ...(fullName && { fullName }),
        },
        { new: true },
      );

      res.json({
        success: true,
        profilepic: profileUrl,
        fullName: updatedUser.fullName,
      });
    } catch (err) {
      console.error("Profile update error:", err);
      res.status(500).json({ message: "upload failed", error: err.message });
    }
  },
);

router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "fullName profilepic email",
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

module.exports = router;
