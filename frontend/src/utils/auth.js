// Authentication utility functions
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authService = {
  // Get stored token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Store token
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Remove token
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Get stored user
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Store user
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Remove user
  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!authService.getToken();
  },

  // Clear all auth data
  logout: () => {
    authService.removeToken();
    authService.removeUser();
  },

  // Login
  login: async (username, password, apiUrl) => {
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    authService.setToken(data.token);
    authService.setUser(data.user);
    return data;
  },

  // Register
  register: async (username, password, email, role, apiUrl) => {
    const response = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email, role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return await response.json();
  },
};

// API utility to make authenticated requests
export const apiRequest = async (url, options = {}) => {
  const token = authService.getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    authService.logout();
    window.location.reload(); // Force reload to show login
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return await response.json();
};
