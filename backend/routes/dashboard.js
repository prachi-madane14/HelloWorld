const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Teacher Dashboard (only teacher role can access)
router.get(
  "/teacher",
  authMiddleware(["teacher"]),
  (req, res) => {
    res.json({
      msg: "Welcome to Teacher Dashboard",
      user: req.user, // { id, role }
    });
  }
);

// ✅ Learner Dashboard (only learner role can access)
router.get(
  "/Student",
  authMiddleware(["Student"]),
  (req, res) => {
    res.json({
      msg: "Welcome to Student Dashboard",
      user: req.user,
    });
  }
);

module.exports = router;
