const express = require("express");
const router = express.Router();
const { saveNote, getNotes, deleteNote } = require("../controllers/notebookController");
const authMiddleware = require("../middleware/authMiddleware");

// Save new phrase
router.post("/", authMiddleware(["learner"]), saveNote);

// Get all notes for student
router.get("/", authMiddleware(["learner"]), getNotes);

// Delete a saved note
router.delete("/:noteId", authMiddleware(["learner"]), deleteNote);

module.exports = router;
