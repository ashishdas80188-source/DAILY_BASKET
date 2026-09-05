import api from './api';

export const wishlistService = {
  async getWishlist() {
    try {
      const res = await api.get('/wishlist');
      return res.data.data;
    } catch (err) {
      const stored = localStorage.getItem('dailybasket_wishlist');
      return stored ? JSON.parse(stored) : [];
    }
  },

  async addToWishlist(productId) {
    try {
      const res = await api.post(`/wishlist/${productId}`);
      return res.data.data;
    } catch (err) {
      return null;
    }
  },

  async removeFromWishlist(productId) {
    try {
      await api.delete(`/wishlist/${productId}`);
    } catch (err) {
      // offline
    }
  },

  async checkStatus(productId) {
    try {
      const res = await api.get(`/wishlist/check/${productId}`);
      return res.data.data.inWishlist;
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('dailybasket_wishlist') || '[]');
      return stored.some(item => item.product?.id === productId || item.id === productId);
    }
  }
};
