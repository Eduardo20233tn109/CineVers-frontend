import apiClient from './apiClient';

const paymentService = {
  // Save a new card
  async saveCard(cardData) {
    const response = await apiClient.post('/payments/cards', cardData);
    return response.data;
  },

  // Get user cards
  async getUserCards() {
    const response = await apiClient.get('/payments/cards');
    return response.data;
  },

  // Delete a card
  async deleteCard(id) {
    const response = await apiClient.delete(`/payments/cards/${id}`);
    return response.data;
  }
};

export default paymentService;
