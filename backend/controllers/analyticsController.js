const Progress = require("../models/Progress");
const Quiz = require("../models/Quiz");

/**
 * 1️⃣ Average XP per student
 */
const getAverageXP = async (req, res) => {
  try {
    const result = await Progress.aggregate([
      {
        $group: {
          _id: null,
          avgXP: { $avg: "$xp" }
        }
      }
    ]);

    res.json({
      averageXP: Math.round(result[0]?.avgXP || 0)
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to calculate average XP" });
  }
};

/**
 * 2️⃣ Most explored countries
 */
const getMostExploredCountries = async (req, res) => {
  try {
    const countries = await Progress.aggregate([
      { $unwind: "$countriesUnlocked" },
      {
        $group: {
          _id: "$countriesUnlocked",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch explored countries" });
  }
};

/**
 * 3️⃣ Quiz participation & completion stats
 */
const getQuizStats = async (req, res) => {
  try {
    const totalAttempts = await Quiz.countDocuments();

    const avgScore = await Quiz.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$score" }
        }
      }
    ]);

    res.json({
      totalQuizAttempts: totalAttempts,
      averageScore: Math.round(avgScore[0]?.avgScore || 0)
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to calculate quiz stats" });
  }
};

module.exports = {
  getAverageXP,
  getMostExploredCountries,
  getQuizStats
};
