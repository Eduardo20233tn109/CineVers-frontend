import apiClient from './apiClient';

const bookingService = {
  // Get movies with schedules (for booking)
  async getMoviesWithSchedules() {
    const response = await apiClient.get('/bookings/movies');
    return response.data;
  },

  // Get schedules for a specific movie
  async getSchedules(movieId) {
    const response = await apiClient.get(`/bookings/schedules/${movieId}`);
    return response.data;
  },

  // Get available seats for a movie schedule
  async getSeats(movieId, scheduleId) {
    const response = await apiClient.get(`/bookings/seats/${movieId}/${scheduleId}`);
    return response.data;
  },

  // Select seats (temporary reservation)
  async selectSeats(data) {
    const response = await apiClient.post('/bookings/select-seats', data);
    return response.data;
  },

  // Get booking summary
  async getSummary(data) {
    const response = await apiClient.post('/bookings/summary', data);
    return response.data;
  },

  // Complete purchase
  async purchase(data) {
    const response = await apiClient.post('/bookings/purchase', data);
    return response.data;
  },

  // Get my bookings
  async getMyBookings() {
    const response = await apiClient.get('/bookings/my-bookings');
    return response.data;
  },

  // Cancel booking
  async cancelBooking(bookingId) {
    const response = await apiClient.delete(`/bookings/${bookingId}/cancel`);
    return response.data;
  },
};

export default bookingService;
