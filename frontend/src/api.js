import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const studentsApi = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  remove: (id) => api.delete(`/students/${id}`)
};

export const attendanceApi = {
  getAll: () => api.get('/attendance'),
  getByStudent: (studentId) => api.get(`/attendance/student/${studentId}`),
  create: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  remove: (id) => api.delete(`/attendance/${id}`)
};

export default api;
