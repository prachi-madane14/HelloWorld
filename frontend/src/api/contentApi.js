import api from "./axios";

// Teacher
export const createContent = (data) =>
  api.post("/tcontent", data);

export const getTeacherContent = () =>
  api.get("/tcontent/teacher");

export const deleteContent = (contentId) =>
  api.delete(`/tcontent/${contentId}`);

// Student
export const getStudentContent = () =>
  api.get("/tcontent");
