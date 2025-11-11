// models/Progress.js
const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ type: String }], // e.g. ["Quiz Master", "Streak King"]
  countriesUnlocked: [{ type: String }], // e.g. ["Japan", "France"]
  streakDays: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Progress", progressSchema);
