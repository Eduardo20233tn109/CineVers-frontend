import apiClient from './apiClient';

const movieService = {
  // Get all movies (public)
  async getMovies(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.classification) params.append('classification', filters.classification);
    if (filters.status) params.append('status', filters.status);
    
    const response = await apiClient.get(`/movies?${params.toString()}`);
    return response.data;
  },

  // Get movie by ID
  async getMovieById(id) {
    const response = await apiClient.get(`/movies/${id}`);
    return response.data;
  },

  // Create movie (gerente only)
  async createMovie(movieData) {
    const response = await apiClient.post('/movies', movieData);
    return response.data;
  },

  // Update movie (gerente only)
  async updateMovie(id, movieData) {
    const response = await apiClient.put(`/movies/${id}`, movieData);
    return response.data;
  },

  // Delete movie (gerente only)
  async deleteMovie(id) {
    const response = await apiClient.delete(`/movies/${id}`);
    return response.data;
  },
};

export default movieService;
