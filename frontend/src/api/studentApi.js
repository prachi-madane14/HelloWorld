import api from "./axios";

export const getStudentProgress = () =>
  api.get("/student/progress");

export const updateStudentProgress = (data) =>
  api.put("/student/progress", data);
