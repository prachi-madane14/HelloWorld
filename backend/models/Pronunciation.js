// models/Pronunciation.js
const mongoose = require("mongoose");

const pronunciationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  phrase: { type: String, required: true }, // what user was asked to say
  userAudioURL: { type: String }, // optional - link to audio file
  accuracy: { type: Number, min: 0, max: 100 }, // AI feedback %
  feedbackText: { type: String }, // e.g. “Your pronunciation of ‘r’ needs improvement.”
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Pronunciation", pronunciationSchema);
