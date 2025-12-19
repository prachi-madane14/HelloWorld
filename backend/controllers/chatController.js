const ChatMessage = require("../models/ChatMessage");

/**
 * 1️⃣ Send a message (teacher feedback or student question)
 * isRead defaults to false
 */
const sendMessage = async (req, res) => {
  try {
    const { receiverId, message, type } = req.body;

    const chat = new ChatMessage({
      senderId: req.user.id,
      receiverId,
      message,
      type,
      isRead: false // 👈 unread by default
    });

    await chat.save();
    res.status(201).json({ message: "Message sent", chat });
  } catch (err) {
    res.status(400).json({
      message: "Failed to send message",
      error: err.message
    });
  }
};

/**
 * 2️⃣ Get chat messages between teacher & student
 */
const getChatMessages = async (req, res) => {
  try {
    const { teacherId, studentId } = req.params;

    const messages = await ChatMessage.find({
      $or: [
        { senderId: teacherId, receiverId: studentId },
        { senderId: studentId, receiverId: teacherId }
      ]
    }).sort({ createdAt: 1 }); // oldest first

    res.json(messages);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching chat messages",
      error: err.message
    });
  }
};

/**
 * 3️⃣ Delete a message (Teacher only )
 */
const deleteMessage = async (req, res) => {
  try {
    const chat = await ChatMessage.findByIdAndDelete(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting message",
      error: err.message
    });
  }
};

/**
 * 4️⃣ Mark messages as READ
 * Called when user opens the chat
 */
const markMessagesAsRead = async (req, res) => {
  try {
    const { senderId } = req.body;

    await ChatMessage.updateMany(
      {
        senderId: senderId,          // messages sent by other user
        receiverId: req.user.id,     // messages received by logged-in user
        isRead: false
      },
      { isRead: true }
    );

    res.json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to mark messages as read",
      error: err.message
    });
  }
};


module.exports = {
  sendMessage,
  getChatMessages,
  deleteMessage,
  markMessagesAsRead
};
