const Quiz = require("../models/Quiz");
const User = require("../models/User");

// Submit quiz result
exports.submitQuiz = async (req, res) => {
  const { country, score, total } = req.body;

  const quiz = await Quiz.create({
    user: req.user.id,
    country,
    score,
    total
  });

  // update user XP and stats
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { quizzesAttempted: 1, xp: score }
  });

  res.status(201).json({ msg: "Quiz submitted", quiz });
};

// Get quiz history
exports.getQuizHistory = async (req, res) => {
  const history = await Quiz.find({ user: req.user.id }).sort({ date: -1 });
  res.json(history);
};

// Leaderboard
exports.getLeaderboard = async (req, res) => {
  const leaderboard = await User.find({ role: "learner" })
    .sort({ xp: -1 })
    .limit(10)
    .select("name xp");
  res.json(leaderboard);
};
