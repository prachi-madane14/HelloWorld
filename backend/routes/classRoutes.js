const express = require("express");
const router = express.Router();
const {
  createClass,
  getTeacherClasses,
  joinClass,
  deleteClass
} = require("../controllers/classController");

// Teacher creates class
router.post("/create", createClass);

// Teacher gets all classes
router.get("/teacher/:teacherId", getTeacherClasses);

// Student joins class
router.post("/join", joinClass);

// Delete class
router.delete("/:classId", deleteClass);

module.exports = router;
