const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const dashboardRoutes = require("./routes/dashboard");

dotenv.config();
connectDB();

require("dotenv").config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
app.use(express.json());
app.use(cors());


// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/notebook", require("./routes/notebookRoutes"));
app.use("/api/quiz", require("./routes/quizRoutes"));
app.use("/api/pronunciation", require("./routes/pronunciationRoutes"));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
