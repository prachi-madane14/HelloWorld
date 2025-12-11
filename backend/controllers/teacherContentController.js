const TeacherContent = require("../models/TeacherContent");

// 1️⃣ Create content
const createContent = async (req, res) => {
  try {
    const content = new TeacherContent({
      teacherId: req.user.id,
      title: req.body.title,
      type: req.body.type,
      content: req.body.content
    });

    await content.save();
    res.status(201).json({ message: "Content uploaded successfully!", content });
  } catch (err) {
    res.status(400).json({ message: "Failed to upload content", error: err.message });
  }
};

// 2️⃣ Get all content (for students dashboard)
const getAllContent = async (req, res) => {
  try {
    const contents = await TeacherContent.find().sort({ createdAt: -1 }); // latest first
    res.json(contents);
  } catch (err) {
    res.status(500).json({ message: "Error fetching content" });
  }
};

// 3️⃣ Get content by teacher
const getTeacherContent = async (req, res) => {
  try {
    const contents = await TeacherContent.find({ teacherId: req.user.id }).sort({ createdAt: -1 });
    res.json(contents);
  } catch (err) {
    res.status(500).json({ message: "Error fetching teacher content" });
  }
};

// 4️⃣ Delete content
const deleteContent = async (req, res) => {
  try {
    const content = await TeacherContent.findByIdAndDelete(req.params.id);
    if (!content) return res.status(404).json({ message: "Content not found" });

    res.json({ message: "Content deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting content" });
  }
};

module.exports = {
  createContent,
  getAllContent,
  getTeacherContent,
  deleteContent
};
