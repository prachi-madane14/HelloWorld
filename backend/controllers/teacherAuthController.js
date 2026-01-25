const Teacher = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER TEACHER
exports.registerTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher"
    });

    const token = jwt.sign(
      { id: user._id, role: "teacher" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        role: "teacher",
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// LOGIN TEACHER
exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "teacher" });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: "teacher" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        role: "teacher",
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
