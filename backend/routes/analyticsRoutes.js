const express = require("express");
const router = express.Router();
const {
  getAverageXP,
  getMostExploredCountries,
  getQuizStats
} = require("../controllers/analyticsController");

const authMiddleware = require("../middleware/authMiddleware");

// Teacher-only analytics routes
router.get("/avg-xp", authMiddleware(["teacher"]), getAverageXP);

router.get(
  "/countries",
  authMiddleware(["teacher"]),
  getMostExploredCountries
);

router.get(
  "/quiz-stats",
  authMiddleware(["teacher"]),
  getQuizStats
);

module.exports = router;
