import api from "./axios";

// Teacher
export const createClass = (data) =>
  api.post("/class/create", data);

export const getTeacherClasses = (teacherId) =>
  api.get(`/class/teacher/${teacherId}`);

export const deleteClass = (classId) =>
  api.delete(`/class/${classId}`);

// Student
export const joinClass = (data) =>
  api.post("/class/join", data);
