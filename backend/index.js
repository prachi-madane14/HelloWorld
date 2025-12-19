const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const classRoutes = require("./routes/classRoutes");
const progressRoutes = require("./routes/progressRoutes");


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ ROUTES SETUP
app.use("/api/auth", require("./routes/studentauthRoutes")); // Register/Login
app.use("/api/teacher", require("./routes/teacherAuthRoutes"));
app.use("/dashboard", require("./routes/dashboard")); // Common dashboard route
app.use("/api/student", require("./routes/studentRoutes")); // Student progress etc.
app.use("/api/notebook", require("./routes/notebookRoutes")); // Student notebook
app.use("/api/quiz", require("./routes/quizRoutes")); // Quizzes
app.use("/api/pronunciation", require("./routes/pronunciationRoutes")); // Pronunciation practice
app.use("/api/badges", require("./routes/badgeRoutes")); // 🎖️ Badges
app.use("/api/class", classRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/tquiz", require("./routes/teacherQuizRoutes"));
app.use("/api/tcontent", require("./routes/teacherContentRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));


// ✅ START SERVER
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
