const express = require("express");
const router = express.Router();

const {
  createQuiz,
  getTeacherQuizzes,
  getClassQuizzes,
  getSingleQuiz,
  deleteQuiz,
} = require("../controllers/teacherQuizController");

const teacherAuth = require("../middleware/authMiddleware");

// Create quiz
router.post("/api/tquiz", teacherAuth, createQuiz);

// Get all quizzes by teacher
router.get("/api/tquiz", teacherAuth, getTeacherQuizzes);

// Get quizzes for a specific class
router.get("/api/tquiz/class/:classId", teacherAuth, getClassQuizzes);

// Get one quiz
router.get("/api/tquiz/:id", teacherAuth, getSingleQuiz);

// Delete quiz
router.delete("/api/tquiz/:id", teacherAuth, deleteQuiz);

module.exports = router;
