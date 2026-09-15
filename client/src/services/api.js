const API_BASE = '/api';

export function getToken() {
  return localStorage.getItem('pixelresolve_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('pixelresolve_token', token);
  } else {
    localStorage.removeItem('pixelresolve_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data.error || 'Something went wrong. Please try again.';
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  auth: {
    signup: (data) => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    getMe: () => request('/auth/me', { method: 'GET' }),
    checkUsername: (username, currentUserId) => {
      const q = new URLSearchParams({ username });
      if (currentUserId) q.append('currentUserId', currentUserId);
      return request(`/auth/check-username?${q.toString()}`, { method: 'GET' });
    },
    getProfile: () => request('/auth/profile', { method: 'GET' }),
    updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
    verifyEmail: () => request('/auth/verify-email', { method: 'POST' }),
    logout: () => {
      setToken(null);
      return request('/auth/logout', { method: 'POST' }).catch(() => {});
    }
  },
  resolutions: {
    getAll: () => request('/resolutions', { method: 'GET' }),
    getOne: (id) => request(`/resolutions/${id}`, { method: 'GET' }),
    create: (data) => request('/resolutions', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/resolutions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/resolutions/${id}`, { method: 'DELETE' }),
  },
  feedback: {
    submit: (data) => request('/feedback', { method: 'POST', body: JSON.stringify(data) }),
    getMy: () => request('/feedback/my', { method: 'GET' }),
    getAdminList: () => request('/feedback/admin', { method: 'GET' }),
    updateAdmin: (id, data) => request(`/feedback/admin/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
  }
};
