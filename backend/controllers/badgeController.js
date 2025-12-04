// controllers/badgeController.js
const Badge = require("../models/Badge");

// 📍 Get all badges
exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (err) {
    res.status(500).json({ message: "Error fetching badges", error: err.message });
  }
};

// 📍 Get single badge by ID
exports.getBadgeById = async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    if (!badge) return res.status(404).json({ message: "Badge not found" });
    res.json(badge);
  } catch (err) {
    res.status(500).json({ message: "Error fetching badge", error: err.message });
  }
};

// 📍 Create a new badge
exports.createBadge = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const badge = new Badge(req.body);
    await badge.save();
    res.status(201).json({ message: "Badge created successfully", badge });
  } catch (err) {
    res.status(400).json({ message: "Error creating badge", error: err.message });
  }
};

// 📍 Update badge
exports.updateBadge = async (req, res) => {
  try {
    const badge = await Badge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!badge) return res.status(404).json({ message: "Badge not found" });
    res.json({ message: "Badge updated successfully", badge });
  } catch (err) {
    res.status(400).json({ message: "Error updating badge", error: err.message });
  }
};

// 📍 Delete badge
exports.deleteBadge = async (req, res) => {
  try {
    const badge = await Badge.findByIdAndDelete(req.params.id);
    if (!badge) return res.status(404).json({ message: "Badge not found" });
    res.json({ message: "Badge deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting badge", error: err.message });
  }
};
