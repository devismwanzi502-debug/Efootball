const API_URL = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('token');
}

async function request(endpoint, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${endpoint}`, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  register: (body) => request('/api/users/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/users/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/api/users/me'),
  updateMe: (body) => request('/api/users/me', { method: 'PUT', body: JSON.stringify(body) }),
  getProfile: (id) => request(`/api/users/profile/${id}`),

  forgotPassword: (email) => request('/api/password/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token, password) => request('/api/password/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),

  getTournaments: (params) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/tournaments${q ? '?' + q : ''}`);
  },
  getTournament: (id) => request(`/api/tournaments/${id}`),
  createTournament: (body) => request('/api/tournaments', { method: 'POST', body: JSON.stringify(body) }),
  joinTournament: (id) => request(`/api/tournaments/${id}/join`, { method: 'POST' }),
  leaveTournament: (id) => request(`/api/tournaments/${id}/leave`, { method: 'POST' }),
  startTournament: (id) => request(`/api/tournaments/${id}/start`, { method: 'PUT' }),

  getLeaderboard: () => request('/api/leaderboard'),

  getPosts: (params) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/posts${q ? '?' + q : ''}`);
  },
  getPost: (id) => request(`/api/posts/${id}`),
  createPost: (body) => request('/api/posts', { method: 'POST', body: JSON.stringify(body) }),
  likePost: (id) => request(`/api/posts/${id}/like`, { method: 'POST' }),
  commentPost: (id, content) => request(`/api/posts/${id}/comment`, { method: 'POST', body: JSON.stringify({ content }) }),
  deletePost: (id) => request(`/api/posts/${id}`, { method: 'DELETE' }),
};