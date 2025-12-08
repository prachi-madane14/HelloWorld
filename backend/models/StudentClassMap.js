//Student joins class → stored here.
const mongoose = require("mongoose");

const studentClassSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "TeacherClass", required: true },
  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StudentClassMap", studentClassSchema);
