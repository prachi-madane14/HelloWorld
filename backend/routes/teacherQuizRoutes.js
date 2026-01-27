const express = require("express");
const router = express.Router();

const {
  createQuiz,
  getTeacherQuizzes,
  getClassQuizzes,
  getSingleQuiz,
  deleteQuiz,
} = require("../controllers/teacherQuizController");

const authMiddleware = require("../middleware/authMiddleware");

// ✅ CREATE QUIZ (Teacher)
router.post("/", authMiddleware(["teacher"]), createQuiz);

// ✅ GET ALL QUIZZES BY TEACHER
router.get("/", authMiddleware(["teacher"]), getTeacherQuizzes);

// ✅ GET QUIZZES FOR A CLASS (Student / Teacher)
router.get("/class/:classId", authMiddleware(["student", "teacher"]), getClassQuizzes);

// ✅ GET SINGLE QUIZ
router.get("/:id", authMiddleware(["student", "teacher"]), getSingleQuiz);

// ✅ DELETE QUIZ
router.delete("/:id", authMiddleware(["teacher"]), deleteQuiz);

module.exports = router;
