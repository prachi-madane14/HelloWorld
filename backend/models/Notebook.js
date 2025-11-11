const mongoose = require("mongoose");

const notebookSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  phrase: { type: String, required: true },
  translation: { type: String },
  noteType: { type: String, default: "AI Chat" }, // optional
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notebook", notebookSchema);
