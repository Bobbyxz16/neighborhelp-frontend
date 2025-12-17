import React from 'react';
import { createContext, useContext } from 'react';

// ==================== CONTEXT & STATE ====================

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// ==================== API UTILITIES ====================

const API_BASE = 'http://localhost:8080/api';

export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Auth endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return data;
  },

  async register(userData) {
    return await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Resources endpoints
  async getResources(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/resources${query ? `?${query}` : ''}`);
  },

  async getResourceBySlug(slug) {
    return await this.request(`/resources/${slug}`);
  },

  async createResource(data) {
    return await this.request('/resources', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Categories
  async getCategories() {
    return await this.request('/categories');
  },

  // Locations
  async getCities() {
    return await this.request('/locations/cities');
  },
};

// ==================== AUTH PROVIDER ====================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Verificar si el usuario está autenticado al cargar
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Aquí podrías verificar el token con el backend
      setUser({ name: 'Usuario', email: 'user@example.com' });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
      const data = await api.login(email, password);
      localStorage.setItem('accessToken', data.accessToken);
      setUser({ name: data.user.name, email: data.user.email });
      return data;
    };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export default AuthContext;