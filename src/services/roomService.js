import apiClient from './apiClient';

const roomService = {
  // Get all rooms
  async getRooms(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/rooms?${params.toString()}`);
    return response.data;
  },

  // Get room by ID
  async getRoomById(id) {
    const response = await apiClient.get(`/rooms/${id}`);
    return response.data;
  },

  // Create room (gerente only)
  async createRoom(roomData) {
    const response = await apiClient.post('/rooms', roomData);
    return response.data;
  },

  // Update room (gerente only)
  async updateRoom(id, roomData) {
    const response = await apiClient.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  // Delete room (gerente only)
  async deleteRoom(id) {
    const response = await apiClient.delete(`/rooms/${id}`);
    return response.data;
  },

  // Reactivate room (gerente only)
  async reactivateRoom(id) {
    const response = await apiClient.post(`/rooms/${id}/reactivate`);
    return response.data;
  },
};

export default roomService;
