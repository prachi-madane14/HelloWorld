import api from "./axios";

export const sendMessage = (data) =>
  api.post("/chat", data);

export const getChatHistory = (teacherId, studentId) =>
  api.get(`/chat/${teacherId}/${studentId}`);

export const markMessagesRead = (data) =>
  api.put("/chat/read", data);

export const deleteMessage = (messageId) =>
  api.delete(`/chat/${messageId}`);
