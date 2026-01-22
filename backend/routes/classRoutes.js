const express = require("express");
const router = express.Router();
const {
  createClass,
  getTeacherClasses,
  joinClass,
  deleteClass
} = require("../controllers/classController");

// Teacher creates class
router.post("/api/class/create", createClass);

// Teacher gets all classes
router.get("/api/class/teacher/:teacherId", getTeacherClasses);

// Student joins class
router.post("/api/class/join", joinClass);

// Delete class
router.delete("/api/class/:classId", deleteClass);

module.exports = router;
