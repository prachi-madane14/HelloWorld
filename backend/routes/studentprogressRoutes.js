const express = require("express");
const router = express.Router();
const { getProgress, updateProgress } = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");

// Get student progress (no ID in URL, uses token)
router.get("/progress", authMiddleware(["student"]), getProgress);

// Update student progress
router.put("/progress", authMiddleware(["student"]), updateProgress);

module.exports = router;
