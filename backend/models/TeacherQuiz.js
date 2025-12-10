const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }], // ["A", "B", "C", "D"]
  correctAnswer: { type: String, required: true },
});

const teacherQuizSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },

  quizTitle: { type: String, required: true },
  country: { type: String, required: true },   // e.g. "Japan", "France"
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },

  questions: [questionSchema],  

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TeacherQuiz", teacherQuizSchema);
