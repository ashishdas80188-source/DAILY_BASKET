import api from './api';

export const cartService = {
  async getCart() {
    try {
      const res = await api.get('/cart');
      return res.data.data;
    } catch (err) {
      const stored = localStorage.getItem('dailybasket_cart');
      return stored ? JSON.parse(stored) : calculateCartDTO([]);
    }
  },

  async addToCart(productId, quantity = 1) {
    try {
      const res = await api.post('/cart/items', { productId, quantity });
      return res.data.data;
    } catch (err) {
      // Offline fallback
      return null;
    }
  },

  async updateCartItem(itemId, quantity) {
    try {
      const res = await api.put(`/cart/items/${itemId}`, { quantity });
      return res.data.data;
    } catch (err) {
      return null;
    }
  },

  async removeCartItem(itemId) {
    try {
      const res = await api.delete(`/cart/items/${itemId}`);
      return res.data.data;
    } catch (err) {
      return null;
    }
  },

  async clearCart() {
    try {
      const res = await api.delete('/cart/clear');
      return res.data.data;
    } catch (err) {
      return null;
    }
  }
};

export function calculateCartDTO(items = []) {
  let subtotal = 0;
  let totalSavings = 0;
  let totalItems = 0;

  const enrichedItems = items.map((item) => {
    const itemTotal = item.discountPrice * item.quantity;
    subtotal += itemTotal;
    if (item.originalPrice && item.originalPrice > item.discountPrice) {
      totalSavings += (item.originalPrice - item.discountPrice) * item.quantity;
    }
    totalItems += item.quantity;
    return { ...item, itemTotal };
  });

  const freeDeliveryThreshold = 499;
  const deliveryFee = subtotal === 0 || subtotal >= freeDeliveryThreshold ? 0 : 40;
  const finalTotal = subtotal + deliveryFee;

  return {
    items: enrichedItems,
    totalItems,
    subtotal,
    totalSavings,
    deliveryFee,
    finalTotal,
    freeDeliveryThreshold,
    eligibleForFreeDelivery: subtotal >= freeDeliveryThreshold && subtotal > 0,
  };
}
