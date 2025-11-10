const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student", "teacher"], default: "student" },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  countriesExplored: { type: [String], default: [] },
  quizzesAttempted: { type: Number, default: 0 },
  aiChatsCompleted: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  streakDays: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);
