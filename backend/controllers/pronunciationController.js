// (You can later connect this to AI or speech API)
exports.analyzePronunciation = async (req, res) => {
  const { spokenPhrase, correctPhrase } = req.body;

  // Simple mock check
  const accuracy = Math.max(0, 100 - Math.abs(spokenPhrase.length - correctPhrase.length) * 10);

  res.json({
    msg: "Pronunciation analyzed",
    accuracy: `${accuracy}%`,
    feedback:
      accuracy > 80
        ? "Excellent pronunciation!"
        : accuracy > 50
        ? "Good, but can improve!"
        : "Keep practicing!"
  });
};
