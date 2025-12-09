const mongoose = require("mongoose");

const studentProgressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  xp: { type: Number, default: 0 },
  totalQuizzes: { type: Number, default: 0 },
  avgScore: { type: Number, default: 0 },
  exploredCountries: [{ type: String }], // ["Japan","France"]
});

module.exports = mongoose.model("StudentProgress", studentProgressSchema);
