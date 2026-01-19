import axios from 'axios';

// Base API configuration - update this URL to your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/api/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string; role: 'teacher' | 'student' }) => 
    api.post('/api/auth/register', data),
};

// Class APIs (Teacher)
export const classAPI = {
  create: (data: { name: string; description?: string }) => 
    api.post('/api/class/create', data),
  getByTeacher: (teacherId: string) => 
    api.get(`/api/class/teacher/${teacherId}`),
  delete: (classId: string) => 
    api.delete(`/api/class/${classId}`),
  joinClass: (classCode: string) =>
    api.post('/api/class/join', { classCode }),
};

// Progress APIs
export const progressAPI = {
  getClassProgress: (classId: string) => 
    api.get(`/api/progress/class/${classId}`),
  getStudentProgress: () => 
    api.get('/api/student/progress'),
  updateStudentProgress: (data: any) => 
    api.put('/api/student/progress', data),
};

// Teacher Quiz APIs
export const teacherQuizAPI = {
  create: (data: any) => 
    api.post('/api/tquiz', data),
  getAll: () => 
    api.get('/api/tquiz'),
  getByClass: (classId: string) => 
    api.get(`/api/tquiz/class/${classId}`),
  getById: (quizId: string) => 
    api.get(`/api/tquiz/${quizId}`),
  delete: (quizId: string) => 
    api.delete(`/api/tquiz/${quizId}`),
};

// Teacher Content APIs
export const teacherContentAPI = {
  create: (data: any) => 
    api.post('/api/tcontent', data),
  getAll: () => 
    api.get('/api/tcontent'),
  getByTeacher: () => 
    api.get('/api/tcontent/teacher'),
  delete: (id: string) => 
    api.delete(`/api/tcontent/${id}`),
};

// Analytics APIs
export const analyticsAPI = {
  getAvgXP: () => 
    api.get('/api/analytics/avg-xp'),
  getCountries: () => 
    api.get('/api/analytics/countries'),
  getQuizStats: () => 
    api.get('/api/analytics/quiz-stats'),
};

// Chat APIs
export const chatAPI = {
  send: (data: { receiverId: string; message: string }) => 
    api.post('/api/chat', data),
  getMessages: (teacherId: string, studentId: string) => 
    api.get(`/api/chat/${teacherId}/${studentId}`),
  markRead: (messageIds: string[]) => 
    api.put('/api/chat/read', { messageIds }),
  delete: (messageId: string) => 
    api.delete(`/api/chat/${messageId}`),
};

// Badge APIs
export const badgeAPI = {
  getAll: () => 
    api.get('/api/badges'),
  getById: (id: string) => 
    api.get(`/api/badges/${id}`),
};

// Notebook APIs
export const notebookAPI = {
  create: (data: { phrase: string; translation?: string; country?: string }) => 
    api.post('/api/notebook', data),
  getAll: () => 
    api.get('/api/notebook'),
  delete: (id: string) => 
    api.delete(`/api/notebook/${id}`),
};

// Quiz APIs (Student)
export const quizAPI = {
  submit: (data: any) => 
    api.post('/api/quiz/submit', data),
  getHistory: () => 
    api.get('/api/quiz/history'),
  getLeaderboard: () => 
    api.get('/api/quiz/leaderboard'),
};

export default api;
