// models/Badge.js
const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Quiz Master"
  description: { type: String }, // e.g. "Scored 90%+ in 5 quizzes"
  icon: { type: String }, // optional: icon filename or URL
  criteria: { type: String }, // e.g. "quiz_score >= 90"
  xpReward: { type: Number, default: 50 }, // XP points rewarded
});

module.exports = mongoose.model("Badge", badgeSchema);
