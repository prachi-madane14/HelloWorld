const express = require("express");
const router = express.Router();
const { getClassProgress } = require("../controllers/progressController");

// Teacher views progress of all students
router.get("/class/:classId", getClassProgress);

module.exports = router;
