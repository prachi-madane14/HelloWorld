const TeacherClass = require("../models/TeacherClass");
const StudentClassMap = require("../models/StudentClassMap");
const { nanoid } = require("nanoid"); // for unique class code

// 📍 Create class (Teacher)
exports.createClass = async (req, res) => {
  try {
    const code = nanoid(6); // unique code
    const newClass = new TeacherClass({
      name: req.body.name,
      teacherId: req.body.teacherId,
      code,
    });

    await newClass.save();
    res.status(201).json({ message: "Class created", newClass });
  } catch (err) {
    res.status(500).json({ message: "Error creating class", error: err.message });
  }
};

// 📍 Get all classes of teacher
exports.getTeacherClasses = async (req, res) => {
  try {
    const classes = await TeacherClass.find({ teacherId: req.params.teacherId });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching classes", error: err.message });
  }
};

// 📍 Student joins class
exports.joinClass = async (req, res) => {
  try {
    const classObj = await TeacherClass.findOne({ code: req.body.code });

    if (!classObj)
      return res.status(404).json({ message: "Invalid class code" });

    const mapping = new StudentClassMap({
      studentId: req.body.studentId,
      classId: classObj._id
    });

    await mapping.save();
    res.json({ message: "Joined class successfully", classObj });
  } catch (err) {
    res.status(500).json({ message: "Error joining class", error: err.message });
  }
};

// 📍 Delete class
exports.deleteClass = async (req, res) => {
  try {
    await TeacherClass.findByIdAndDelete(req.params.classId);
    await StudentClassMap.deleteMany({ classId: req.params.classId });
    res.json({ message: "Class deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting class", error: err.message });
  }
};
