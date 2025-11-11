const Notebook = require("../models/Notebook");

// Save new note
exports.saveNote = async (req, res) => {
  const { phrase, translation, noteType } = req.body;
  const note = await Notebook.create({
    user: req.user.id,
    phrase,
    translation,
    noteType
  });
  res.status(201).json({ msg: "Note saved", note });
};

// Get all notes
exports.getNotes = async (req, res) => {
  const notes = await Notebook.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notes);
};

// Delete note
exports.deleteNote = async (req, res) => {
  const note = await Notebook.findOneAndDelete({ _id: req.params.noteId, user: req.user.id });
  if (!note) return res.status(404).json({ msg: "Note not found" });
  res.json({ msg: "Note deleted" });
};
