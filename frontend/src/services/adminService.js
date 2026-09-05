import api from './api';
import { SAMPLE_PRODUCTS, SAMPLE_CATEGORIES } from '../data/sampleProducts';

export const adminService = {
  async getDashboardStats() {
    try {
      const res = await api.get('/admin/stats');
      return res.data.data;
    } catch (err) {
      // Mock stats
      return {
        totalUsers: 1420,
        totalProducts: SAMPLE_PRODUCTS.length,
        totalOrders: 384,
        totalRevenue: 284500.00,
        lowStockProductsCount: SAMPLE_PRODUCTS.filter(p => p.stockQuantity <= 35).length,
        pendingOrdersCount: 6,
        recentOrders: [
          {
            id: 1045,
            orderNumber: 'DB-20260905-9921',
            userFullName: 'Sarah Jenkins',
            userEmail: 'customer@dailybasket.com',
            totalAmount: 645.00,
            orderStatus: 'PLACED',
            paymentMethod: 'ONLINE_SIMULATED',
            createdAt: new Date().toISOString(),
          },
          {
            id: 1044,
            orderNumber: 'DB-20260905-4122',
            userFullName: 'Alex Rivera',
            userEmail: 'alex@example.com',
            totalAmount: 320.00,
            orderStatus: 'CONFIRMED',
            paymentMethod: 'CASH_ON_DELIVERY',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 1043,
            orderNumber: 'DB-20260905-1193',
            userFullName: 'Priya Sharma',
            userEmail: 'priya@example.com',
            totalAmount: 1180.00,
            orderStatus: 'OUT_FOR_DELIVERY',
            paymentMethod: 'ONLINE_SIMULATED',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
          }
        ]
      };
    }
  },

  async getAllOrders(status) {
    try {
      const res = await api.get('/admin/orders', { params: { status } });
      return res.data.data;
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('dailybasket_orders') || '[]');
      return {
        content: stored.length > 0 ? stored : [
          {
            id: 1045,
            orderNumber: 'DB-20260905-9921',
            shippingFullName: 'Sarah Jenkins',
            totalAmount: 645.00,
            orderStatus: 'PLACED',
            paymentMethod: 'ONLINE_SIMULATED',
            paymentStatus: 'COMPLETED',
            createdAt: new Date().toISOString(),
          },
          {
            id: 1044,
            orderNumber: 'DB-20260905-4122',
            shippingFullName: 'Alex Rivera',
            totalAmount: 320.00,
            orderStatus: 'CONFIRMED',
            paymentMethod: 'CASH_ON_DELIVERY',
            paymentStatus: 'PENDING',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          }
        ],
        totalElements: 2
      };
    }
  },

  async updateOrderStatus(orderId, orderStatus, paymentStatus) {
    try {
      const res = await api.put(`/admin/orders/${orderId}/status`, { orderStatus, paymentStatus });
      return res.data.data;
    } catch (err) {
      const orders = JSON.parse(localStorage.getItem('dailybasket_orders') || '[]');
      const idx = orders.findIndex(o => String(o.id) === String(orderId) || o.orderNumber === orderId);
      if (idx !== -1) {
        orders[idx].orderStatus = orderStatus;
        if (paymentStatus) orders[idx].paymentStatus = paymentStatus;
        localStorage.setItem('dailybasket_orders', JSON.stringify(orders));
        return orders[idx];
      }
      return { id: orderId, orderStatus, paymentStatus };
    }
  },

  async getUsers() {
    try {
      const res = await api.get('/admin/users');
      return res.data.data;
    } catch (err) {
      return [
        { id: 1, fullName: 'DailyBasket Admin', email: 'admin@dailybasket.com', phone: '+91 9876543210', role: 'ROLE_ADMIN', createdAt: new Date().toISOString() },
        { id: 2, fullName: 'Sarah Jenkins', email: 'customer@dailybasket.com', phone: '+91 9123456780', role: 'ROLE_USER', createdAt: new Date().toISOString() },
        { id: 3, fullName: 'Alex Rivera', email: 'alex@example.com', phone: '+91 9888877777', role: 'ROLE_USER', createdAt: new Date().toISOString() },
      ];
    }
  }
};
