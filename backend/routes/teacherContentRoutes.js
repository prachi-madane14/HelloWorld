const express = require("express");
const router = express.Router();

const {
  createContent,
  getAllContent,
  getTeacherContent,
  deleteContent
} = require("../controllers/teacherContentController");

const teacherAuth = require("../middleware/teacherAuthMiddleware");

router.post("/", teacherAuth, createContent);

router.get("/", teacherAuth, getAllContent);  // or public for students
router.get("/teacher", teacherAuth, getTeacherContent);

router.delete("/:id", teacherAuth, deleteContent);

module.exports = router;
