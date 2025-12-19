const express = require("express");
const router = express.Router();
const { sendMessage, getChatMessages, deleteMessage } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

// Send a message
router.post("/", authMiddleware(["teacher", "student"]), sendMessage);

// Get chat messages between teacher & student
router.get("/:teacherId/:studentId", authMiddleware(["teacher", "student"]), getChatMessages);

// Delete a message (optional, teacher only)
router.delete("/:id", authMiddleware(["teacher"]), deleteMessage);

module.exports = router;
