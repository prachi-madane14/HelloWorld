const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getChatMessages,
  deleteMessage,
  markMessagesAsRead
} = require("../controllers/chatController");

const authMiddleware = require("../middleware/authMiddleware");

/**
 * 1️⃣ Send a message
 * Teacher → feedback
 * Student → question
 */
router.post(
  "/",
  authMiddleware(["teacher", "student"]),
  sendMessage
);

/**
 * 2️⃣ Get chat messages between teacher & student
 */
router.get(
  "/:teacherId/:studentId",
  authMiddleware(["teacher", "student"]),
  getChatMessages
);

/**
 * 3️⃣ Delete a message (Teacher only)
 */
router.delete(
  "/:id",
  authMiddleware(["teacher"]),
  deleteMessage
);

/**
 * 4️⃣ Mark messages as READ
 * Called when user opens chat
 */
router.put(
  "/read",
  authMiddleware(["teacher", "student"]),
  markMessagesAsRead
);

module.exports = router;
