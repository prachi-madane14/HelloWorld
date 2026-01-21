import api from "./axios";

export const getAvgXp = () =>
  api.get("/analytics/avg-xp");

export const getMostExploredCountries = () =>
  api.get("/analytics/countries");

export const getQuizStats = () =>
  api.get("/analytics/quiz-stats");
