const jwt = require("jsonwebtoken");

const teacherAuth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "teacher") {
      return res.status(403).json({ msg: "Access denied: Teacher only" });
    }

    req.teacher = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token not valid" });
  }
};

module.exports = teacherAuth;
