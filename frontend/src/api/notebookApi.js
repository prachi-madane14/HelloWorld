import api from "./axios";

export const saveNote = (data) =>
  api.post("/notebook", data);

export const getNotes = () =>
  api.get("/notebook");

export const deleteNote = (noteId) =>
  api.delete(`/notebook/${noteId}`);
