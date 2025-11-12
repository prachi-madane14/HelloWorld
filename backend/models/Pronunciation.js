const mongoose = require("mongoose");

const pronunciationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  phrase: { type: String, required: true },
  accuracy: { type: Number, required: true }, // % of correctness
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Pronunciation", pronunciationSchema);
