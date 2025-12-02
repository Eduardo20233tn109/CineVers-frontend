import apiClient from './apiClient';

const userService = {
  // Get all users (gerente only)
  async getAllUsers(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/users?${params.toString()}`);
    return response.data;
  },
  
  // Get user by ID (admin only)
  async getUserById(id) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
  
  // Create new client (uses register endpoint)
  async createClient(userData) {
    const response = await apiClient.post('/users/register', {
      ...userData,
      role: 'cliente',
    });
    return response.data;
  },
  
  // Update user (admin only)
  async updateUser(id, userData) {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },
  
  // Update user status (admin only)
  async updateUserStatus(id, status) {
    const response = await apiClient.patch(`/users/${id}/status`, { status });
    return response.data;
  },
};

export default userService;
