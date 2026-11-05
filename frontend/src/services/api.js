import axios from 'axios';

// Base API URL pointing to the Express server
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Attach JWT Token from localStorage to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Service APIs
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Complaint Service APIs
export const complaintService = {
  // Student submits a new complaint
  createComplaint: async (complaintData) => {
    const response = await api.post('/complaints', complaintData);
    return response.data;
  },
  // Student gets their own complaints
  getMyComplaints: async () => {
    const response = await api.get('/complaints/my');
    return response.data;
  },
  // Admin gets all student complaints
  getAllComplaints: async () => {
    const response = await api.get('/complaints');
    return response.data;
  },
  // Get single complaint by ID
  getComplaintById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },
  // Admin updates complaint status
  updateComplaintStatus: async (id, status) => {
    const response = await api.patch(`/complaints/${id}/status`, { status });
    return response.data;
  },
  // Delete a complaint (Student if Pending, Admin can delete any)
  deleteComplaint: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },
};

export default api;
