const Teacher = require("../models/Teacher");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER TEACHER
exports.registerTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let teacher = await Teacher.findOne({ email });
    if (teacher) return res.status(400).json({ msg: "Teacher already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    teacher = await Teacher.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ msg: "Teacher registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// LOGIN TEACHER
exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: teacher._id, role: "teacher" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      teacher: { id: teacher._id, name: teacher.name, email: teacher.email }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
