import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  sendOTP: (email) => api.post('/auth/send-otp', { email }),
  signup: (data) => api.post('/auth/signup', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
};

// Room API calls
export const roomAPI = {
  getCities: () => api.get('/rooms/cities'),
  getCityById: (id) => api.get(`/rooms/cities/${id}`),
  getAllRooms: (params) => api.get('/rooms', { params }),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  getRoomsByCity: (cityId) => api.get(`/rooms/city/${cityId}/rooms`),
};

// Booking API calls
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getUserBookings: () => api.get('/bookings/user/my-bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`, {}),
  getAllBookings: () => api.get('/bookings'), // Admin only
};

// Complaint API calls
export const complaintAPI = {
  createComplaint: (data) => api.post('/complaints', data),
  getUserComplaints: () => api.get('/complaints/user/my-complaints'),
  getComplaintById: (id) => api.get(`/complaints/${id}`),
  getAllComplaints: () => api.get('/complaints'), // Admin only
};

// Room Services API calls (Public)
export const roomServicesAPI = {
  getApprovedRoomServices: (params) => api.get('/room-services/approved', { params }),
  getRoomServiceById: (id) => api.get(`/room-services/${id}`),
  submitRoomService: (data) => api.post('/room-services', data),
  // Admin only
  getPendingRoomServices: () => api.get('/room-services/pending/list'),
  getAllRoomServices: (status) => api.get('/room-services', { params: { status } }),
  approveRoomService: (id, data) => api.put(`/room-services/${id}/approve`, data),
  rejectRoomService: (id, data) => api.put(`/room-services/${id}/reject`, data),
};

export default api;
