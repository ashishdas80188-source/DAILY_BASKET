import api from './api';

export const orderService = {
  async createOrder(orderData) {
    try {
      const res = await api.post('/orders', orderData);
      return res.data.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      // Demo order creation fallback
      const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const mockOrder = {
        id: Date.now(),
        orderNumber: `DB-${datePrefix}-${randomDigits}`,
        items: orderData.items || [],
        subtotal: orderData.subtotal || 450,
        discountAmount: orderData.discountAmount || 50,
        deliveryFee: orderData.deliveryFee || 0,
        totalAmount: orderData.totalAmount || 450,
        paymentMethod: orderData.paymentMethod || 'CASH_ON_DELIVERY',
        paymentStatus: orderData.paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'COMPLETED',
        orderStatus: 'PLACED',
        shippingFullName: orderData.shippingFullName || 'Sarah Jenkins',
        shippingPhone: orderData.shippingPhone || '+91 9123456780',
        shippingAddress: orderData.shippingStreetAddress || 'Flat 402, Green Meadows',
        shippingCity: orderData.shippingCity || 'Bengaluru',
        shippingState: orderData.shippingState || 'Karnataka',
        shippingPinCode: orderData.shippingPinCode || '560034',
        deliverySlot: orderData.deliverySlot || 'Standard Delivery (Tomorrow 7 AM - 10 AM)',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      const orders = JSON.parse(localStorage.getItem('dailybasket_orders') || '[]');
      orders.unshift(mockOrder);
      localStorage.setItem('dailybasket_orders', JSON.stringify(orders));

      return mockOrder;
    }
  },

  async getUserOrders() {
    try {
      const res = await api.get('/orders');
      return res.data.data;
    } catch (err) {
      const orders = JSON.parse(localStorage.getItem('dailybasket_orders') || '[]');
      if (orders.length === 0) {
        // Provide sample order for rich UX demo
        const sampleOrder = {
          id: 1001,
          orderNumber: 'DB-20260905-8842',
          subtotal: 399.00,
          discountAmount: 70.00,
          deliveryFee: 0.00,
          totalAmount: 399.00,
          paymentMethod: 'ONLINE_SIMULATED',
          paymentStatus: 'COMPLETED',
          orderStatus: 'DELIVERED',
          shippingFullName: 'Sarah Jenkins',
          shippingPhone: '+91 9123456780',
          shippingAddress: 'Flat 402, Green Meadows, 5th Main Road',
          shippingCity: 'Bengaluru',
          shippingState: 'Karnataka',
          shippingPinCode: '560034',
          deliverySlot: 'Instant Delivery (15-30 mins)',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              id: 1,
              productId: 1,
              productName: 'Fresh Cow Milk (Pasteurized)',
              productUnit: '1 L',
              unitPrice: 65.00,
              quantity: 2,
              subtotal: 130.00,
              imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80'
            },
            {
              id: 2,
              productId: 18,
              productName: 'Premium California Whole Almonds',
              productUnit: '500 g',
              unitPrice: 269.00,
              quantity: 1,
              subtotal: 269.00,
              imageUrl: 'https://images.unsplash.com/photo-1508061252445-5350f3777130?w=600&auto=format&fit=crop&q=80'
            }
          ]
        };
        orders.push(sampleOrder);
        localStorage.setItem('dailybasket_orders', JSON.stringify(orders));
      }
      return orders;
    }
  },

  async getOrderDetails(orderId) {
    try {
      const res = await api.get(`/orders/${orderId}`);
      return res.data.data;
    } catch (err) {
      const orders = JSON.parse(localStorage.getItem('dailybasket_orders') || '[]');
      const found = orders.find(o => String(o.id) === String(orderId) || o.orderNumber === orderId);
      if (!found) throw new Error('Order not found');
      return found;
    }
  }
};
