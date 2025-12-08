const express = require("express");
const router = express.Router();
const { saveNote, getNotes, deleteNote } = require("../controllers/notebookController");
const authMiddleware = require("../middleware/studentauthMiddleware");

// Save new phrase
router.post("/", authMiddleware(["student"]), saveNote);

// Get all notes for student
router.get("/", authMiddleware(["student"]), getNotes);

// Delete a saved note
router.delete("/:noteId", authMiddleware(["student"]), deleteNote);

module.exports = router;
