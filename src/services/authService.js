import apiClient from './apiClient';

const authService = {
  // Login
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    
    if (response.data.success && response.data.token) {
      const user = response.data.user;
      const isAdmin = user.role === 'gerente' || user.role === 'admin';
      
      if (isAdmin) {
        // Store admin session
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminRole', user.role);
        localStorage.setItem('adminName', user.name);
        localStorage.setItem('adminEmail', user.email);
        localStorage.setItem('adminId', user.id);
      } else {
        // Store client session
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.id);
      }
    }
    
    return response.data;
  },

  // Logout
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all sessions to be safe, or we could be more specific
      // For now, let's clear everything to ensure a clean state
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRole');
      localStorage.removeItem('adminName');
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminId');
    }
  },

  // Register
  async register(userData) {
    const response = await apiClient.post('/users/register', userData);
    return response.data;
  },

  // Get current user profile
  async getProfile() {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  // Update profile
  async updateProfile(updateData) {
    const response = await apiClient.put('/users/profile', updateData);
    return response.data;
  },

  // Forgot password
  async forgotPassword(email) {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated() {
    // Check based on context (URL)
    if (window.location.pathname.startsWith('/admin')) {
      return !!localStorage.getItem('adminToken');
    }
    return !!localStorage.getItem('token');
  },

  // Get current user role
  getUserRole() {
    if (window.location.pathname.startsWith('/admin')) {
      return localStorage.getItem('adminRole');
    }
    return localStorage.getItem('userRole');
  },

  // Get current user data
  getCurrentUser() {
    if (window.location.pathname.startsWith('/admin')) {
      return {
        id: localStorage.getItem('adminId'),
        name: localStorage.getItem('adminName'),
        email: localStorage.getItem('adminEmail'),
        role: localStorage.getItem('adminRole'),
      };
    }
    return {
      id: localStorage.getItem('userId'),
      name: localStorage.getItem('userName'),
      email: localStorage.getItem('userEmail'),
      role: localStorage.getItem('userRole'),
    };
  },
};

export default authService;
