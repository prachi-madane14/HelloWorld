const TeacherQuiz = require("../models/TeacherQuiz");

// -------------------- CREATE QUIZ --------------------
const createQuiz = async (req, res) => {
  try {
    const quiz = new TeacherQuiz({
      teacherId: req.user.id,         
      classId: req.body.classId,
      quizTitle: req.body.quizTitle,
      country: req.body.country,
      difficulty: req.body.difficulty,
      questions: req.body.questions
    });

    await quiz.save();

    res.status(201).json({
      message: "Quiz created successfully!",
      quiz,
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to create quiz",
      error: err.message,
    });
  }
};

// -------------------- GET TEACHER QUIZZES --------------------
const getTeacherQuizzes = async (req, res) => {
  try {
    const quizzes = await TeacherQuiz.find({ teacherId: req.user.id });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching teacher quizzes",
      error: err.message,
    });
  }
};

// -------------------- GET CLASS QUIZZES --------------------
const getClassQuizzes = async (req, res) => {
  try {
    const quizzes = await TeacherQuiz.find({ classId: req.params.classId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({
      message: "Error loading class quizzes",
      error: err.message,
    });
  }
};

// -------------------- GET SINGLE QUIZ --------------------
const getSingleQuiz = async (req, res) => {
  try {
    const quiz = await TeacherQuiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching quiz",
      error: err.message,
    });
  }
};

// -------------------- DELETE QUIZ --------------------
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await TeacherQuiz.findByIdAndDelete(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting quiz",
      error: err.message,
    });
  }
};

// -------------------- EXPORTS --------------------
module.exports = {
  createQuiz,
  getTeacherQuizzes,
  getClassQuizzes,
  getSingleQuiz,
  deleteQuiz,
};
