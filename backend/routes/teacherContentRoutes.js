const express = require("express");
const router = express.Router();
const {
  createContent,
  getAllContent,
  getTeacherContent,
  deleteContent
} = require("../controllers/teacherContentController");

const authMiddleware = require("../middleware/authMiddleware");

// Teacher uploads new content
router.post("/", authMiddleware(["teacher"]), createContent);

// Get all content for students dashboard
router.get("/", authMiddleware(["teacher", "student"]), getAllContent);

// Get all content by a teacher
router.get("/teacher", authMiddleware(["teacher"]), getTeacherContent);

// Delete content
router.delete("/:id", authMiddleware(["teacher"]), deleteContent);

module.exports = router;
