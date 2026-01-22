const express = require("express");
const router = express.Router();
const { saveNote, getNotes, deleteNote } = require("../controllers/notebookController");
const authMiddleware = require("../middleware/authMiddleware");

// Save new phrase
router.post("/api/notebook", authMiddleware(["student"]), saveNote);

// Get all notes for student
router.get("/api/notebook", authMiddleware(["student"]), getNotes);

// Delete a saved note
router.delete("/api/notebook/:noteId", authMiddleware(["student"]), deleteNote);

module.exports = router;
