const User = require("../models/User");

// GET student progress
exports.getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({
      xp: user.xp || 0,
      countriesExplored: user.countriesExplored || [],
      quizzesAttempted: user.quizzesAttempted || 0,
      aiChatsCompleted: user.aiChatsCompleted || 0,
      badges: user.badges || []
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// UPDATE student progress
exports.updateProgress = async (req, res) => {
  try {
    const updates = req.body; // { xp, countriesExplored, ... }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.json({
      msg: "Progress updated",
      progress: {
        xp: user.xp,
        countriesExplored: user.countriesExplored,
        quizzesAttempted: user.quizzesAttempted,
        aiChatsCompleted: user.aiChatsCompleted,
        badges: user.badges
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
