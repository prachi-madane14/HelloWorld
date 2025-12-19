const ChatMessage = require("../models/ChatMessage");

// 1️⃣ Send a message (teacher feedback or student question)
const sendMessage = async (req, res) => {
  try {
    const { receiverId, message, type } = req.body;

    const chat = new ChatMessage({
      senderId: req.user.id,
      receiverId,
      message,
      type
    });

    await chat.save();
    res.status(201).json({ message: "Message sent", chat });
  } catch (err) {
    res.status(400).json({ message: "Failed to send message", error: err.message });
  }
};

// 2️⃣ Get chat messages between teacher & student
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
    res.status(500).json({ message: "Error fetching chat messages" });
  }
};

// 3️⃣ Delete a message (optional)
const deleteMessage = async (req, res) => {
  try {
    const chat = await ChatMessage.findByIdAndDelete(req.params.id);
    if (!chat) return res.status(404).json({ message: "Message not found" });

    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting message" });
  }
};

module.exports = { sendMessage, getChatMessages, deleteMessage };
