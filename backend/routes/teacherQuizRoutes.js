const express = require("express");
const router = express.Router();

const {
  createQuiz,
  getTeacherQuizzes,
  getClassQuizzes,
  getSingleQuiz,
  deleteQuiz,
} = require("../controllers/teacherQuizController");

const teacherAuth = require("../middleware/teacherAuthMiddleware");

// Create quiz
router.post("/", teacherAuth, createQuiz);

// Get all quizzes by teacher
router.get("/", teacherAuth, getTeacherQuizzes);

// Get quizzes for a specific class
router.get("/class/:classId", teacherAuth, getClassQuizzes);

// Get one quiz
router.get("/:id", teacherAuth, getSingleQuiz);

// Delete quiz
router.delete("/:id", teacherAuth, deleteQuiz);

module.exports = router;
