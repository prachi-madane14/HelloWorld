// routes/badgeRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllBadges,
  getBadgeById,
  createBadge,
  updateBadge,
  deleteBadge,
} = require("../controllers/badgeController");

// Example: /api/badges

router.get("/api/badges", getAllBadges);
router.get("/api/badges/:id", getBadgeById);
router.post("/api/badges", createBadge);
router.put("/api/badges/:id", updateBadge);
router.delete("/api/badges/:id", deleteBadge);

module.exports = router;
