const Pronunciation = require("../models/Pronunciation");
const User = require("../models/User");

// Submit pronunciation score
exports.submitPronunciation = async (req, res) => {
  try {
    const { phrase, accuracy } = req.body;

    const record = await Pronunciation.create({
      user: req.user.id,
      phrase,
      accuracy,
    });

    // Update user XP based on accuracy
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { xp: Math.round(accuracy / 10) } // Example: 80% → +8 XP
    });

    res.status(201).json({ msg: "Pronunciation saved", record });
  } catch (err) {
    res.status(500).json({ msg: "Error saving pronunciation", error: err.message });
  }
};

// Get pronunciation history
exports.getPronunciationHistory = async (req, res) => {
  try {
    const history = await Pronunciation.find({ user: req.user.id }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching history", error: err.message });
  }
};
