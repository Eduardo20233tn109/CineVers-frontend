import apiClient from './apiClient';

const reportService = {
  // Get sales summary (gerente only)
  async getSalesSummary(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.type) params.append('type', filters.type);
    
    const response = await apiClient.get(`/reports/sales?${params.toString()}`);
    return response.data;
  },

  // Generate detailed report (gerente only)
  async generateReport(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.movie) params.append('movie', filters.movie);
    
    const response = await apiClient.get(`/reports/generate?${params.toString()}`);
    return response.data;
  },

  // Get top movies (gerente only)
  async getTopMovies(limit = 10) {
    const response = await apiClient.get(`/reports/top-movies?limit=${limit}`);
    return response.data;
  },
};

export default reportService;
