const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/studentauthMiddleware");
const { submitPronunciation, getPronunciationHistory } = require("../controllers/pronunciationController");

// Submit pronunciation score
router.post("/submit", authMiddleware(["learner"]), submitPronunciation);

// Get pronunciation history
router.get("/history", authMiddleware(["learner"]), getPronunciationHistory);

module.exports = router;
