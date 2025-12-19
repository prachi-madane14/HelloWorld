const express = require("express");
const router = express.Router();
const { submitQuiz, getQuizHistory, getLeaderboard } = require("../controllers/quizController");
const authMiddleware = require("../middleware/authMiddleware");

// Submit quiz result
router.post("/submit", authMiddleware(["student"]), submitQuiz);

// Get student quiz history
router.get("/history", authMiddleware(["student"]), getQuizHistory);

// Leaderboard (top students)
router.get("/leaderboard", authMiddleware(["student", "teacher"]), getLeaderboard);

module.exports = router;
