import api from "./axios";

// Teacher leaderboard
export const getClassProgress = (classId) =>
  api.get(`/progress/class/${classId}`);
