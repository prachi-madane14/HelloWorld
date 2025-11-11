const express = require("express");
const router = express.Router();
const { analyzePronunciation } = require("../controllers/pronunciationController");
const authMiddleware = require("../middleware/authMiddleware");

// Analyze student speech similarity
router.post("/analyze", authMiddleware(["learner"]), analyzePronunciation);

module.exports = router;
