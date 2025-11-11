const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ ROUTES SETUP
app.use("/api/auth", require("./routes/authRoutes")); // Register/Login
app.use("/dashboard", require("./routes/dashboard")); // Common dashboard route
app.use("/api/student", require("./routes/studentRoutes")); // Student progress etc.
app.use("/api/notebook", require("./routes/notebookRoutes")); // Student notebook
app.use("/api/quiz", require("./routes/quizRoutes")); // Quizzes
app.use("/api/pronunciation", require("./routes/pronunciationRoutes")); // Pronunciation practice
app.use("/api/badges", require("./routes/badgeRoutes")); // 🎖️ Badges


// ✅ START SERVER
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
