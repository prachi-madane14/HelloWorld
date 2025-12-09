const StudentClassMap = require("../models/StudentClassMap");
const StudentProgress = require("../models/StudentProgress");
const User = require("../models/User"); // assuming a User model exists

// 📍 Get leaderboard + progress for a class
exports.getClassProgress = async (req, res) => {
  try {
    const classId = req.params.classId;

    // 1. Find all students in class
    const students = await StudentClassMap.find({ classId }).populate("studentId");

    const result = [];

    for (let s of students) {
      const progress = await StudentProgress.findOne({ studentId: s.studentId._id });

      result.push({
        studentId: s.studentId._id,
        name: s.studentId.name,
        xp: progress?.xp || 0,
        totalQuizzes: progress?.totalQuizzes || 0,
        avgScore: progress?.avgScore || 0,
        exploredCountries: progress?.exploredCountries || []
      });
    }

    // Sort leaderboard by XP descending
    result.sort((a, b) => b.xp - a.xp);

    res.json({ classId, leaderboard: result });

  } catch (err) {
    res.status(500).json({ message: "Error loading class progress", error: err.message });
  }
};
