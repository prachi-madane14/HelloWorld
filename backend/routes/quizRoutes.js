const express = require("express");
const router = express.Router();
const { submitQuiz, getQuizHistory, getLeaderboard } = require("../controllers/quizController");
const authMiddleware = require("../middleware/authMiddleware");

// Submit quiz result
router.post("/submit", authMiddleware(["learner"]), submitQuiz);

// Get student quiz history
router.get("/history", authMiddleware(["learner"]), getQuizHistory);

// Leaderboard (top students)
router.get("/leaderboard", authMiddleware(["learner", "admin"]), getLeaderboard);

module.exports = router;
