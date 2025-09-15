const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "student" },

  // Progress
  xp: { type: Number, default: 0 },
  countriesExplored: [String],
  quizzesAttempted: { type: Number, default: 0 },
  aiChatsCompleted: { type: Number, default: 0 },
   badges: [String]
});

module.exports = mongoose.model("Student", studentSchema);
