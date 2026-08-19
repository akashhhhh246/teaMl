const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('teaml_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`[API ERROR] ${endpoint}:`, error);
    throw error;
  }
}

export const authAPI = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
};

export const teasAPI = {
  getTeas: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    return request(`/teas?${query.toString()}`);
  },
  getFeatured: () => request('/teas/featured'),
  getTeaById: (id) => request(`/teas/${id}`),
  createTea: (teaData) => request('/teas', { method: 'POST', body: JSON.stringify(teaData) }),
  updateTea: (id, teaData) => request(`/teas/${id}`, { method: 'PUT', body: JSON.stringify(teaData) }),
  deleteTea: (id) => request(`/teas/${id}`, { method: 'DELETE' }),
};

export const recommendationAPI = {
  predict: (quizData) => request('/recommendations/predict', { method: 'POST', body: JSON.stringify(quizData) }),
  getHistory: () => request('/recommendations/history'),
  getRecent: () => request('/recommendations/recent'),
  retrain: () => request('/recommendations/retrain', { method: 'POST' }),
  compareModels: () => request('/recommendations/models/compare'),
};

export const favoritesAPI = {
  getMyFavorites: () => request('/favorites'),
  addFavorite: (teaId) => request('/favorites', { method: 'POST', body: JSON.stringify({ teaId }) }),
  removeFavorite: (teaId) => request(`/favorites/${teaId}`, { method: 'DELETE' }),
};

export const reviewsAPI = {
  getByTeaId: (teaId) => request(`/reviews/tea/${teaId}`),
  create: (reviewData) => request('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),
  upvote: (reviewId) => request(`/reviews/${reviewId}/upvote`, { method: 'POST' }),
  delete: (reviewId) => request(`/reviews/${reviewId}`, { method: 'DELETE' }),
};

export const moodAPI = {
  logMood: (data) => request('/moods', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: () => request('/moods/history'),
};

export const chatAPI = {
  sendMessage: (message, context = null) => request('/chat', { method: 'POST', body: JSON.stringify({ message, context }) }),
};

export const analyticsAPI = {
  getDashboard: () => request('/analytics/dashboard'),
};

export const adminAPI = {
  getUsers: (page = 1, limit = 20) => request(`/admin/users?page=${page}&limit=${limit}`),
  updateUserRole: (id, role) => request(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  exportData: () => request('/admin/export'),
};
