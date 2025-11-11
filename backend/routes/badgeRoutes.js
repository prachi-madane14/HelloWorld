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

router.get("/", getAllBadges);
router.get("/:id", getBadgeById);
router.post("/", createBadge);
router.put("/:id", updateBadge);
router.delete("/:id", deleteBadge);

module.exports = router;
