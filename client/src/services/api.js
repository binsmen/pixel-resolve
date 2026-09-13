const API_BASE = '/api';

function getToken() {
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
  }
};
