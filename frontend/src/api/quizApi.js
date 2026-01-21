import api from "./axios";

// Teacher
export const createQuiz = (data) =>
  api.post("/tquiz", data);

export const getTeacherQuizzes = () =>
  api.get("/tquiz");

export const deleteQuiz = (quizId) =>
  api.delete(`/tquiz/${quizId}`);

// Student & Teacher
export const getClassQuizzes = (classId) =>
  api.get(`/tquiz/class/${classId}`);

export const getQuizById = (quizId) =>
  api.get(`/tquiz/${quizId}`);

// Student
export const submitQuiz = (data) =>
  api.post("/quiz/submit", data);

export const getQuizHistory = () =>
  api.get("/quiz/history");

export const getQuizLeaderboard = () =>
  api.get("/quiz/leaderboard");
