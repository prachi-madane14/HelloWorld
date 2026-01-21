import api from "./axios";

export const getAllBadges = () =>
  api.get("/badges");

export const getBadgeById = (id) =>
  api.get(`/badges/${id}`);

export const createBadge = (data) =>
  api.post("/badges", data);

export const updateBadge = (id, data) =>
  api.put(`/badges/${id}`, data);

export const deleteBadge = (id) =>
  api.delete(`/badges/${id}`);
