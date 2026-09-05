import api from './api';

export const authService = {
  async register(data) {
    try {
      const res = await api.post('/auth/register', data);
      return res.data.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      // Demo fallback if backend is offline
      const mockUser = {
        token: 'mock_jwt_token_' + Date.now(),
        id: 101,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || '+91 9876543210',
        role: 'ROLE_USER',
      };
      return mockUser;
    }
  },

  async login(email, password) {
    try {
      const res = await api.post('/auth/login', { email, password });
      return res.data.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      // Demo fallback for test credentials if backend is offline
      if (email === 'admin@dailybasket.com' && password === 'admin123') {
        return {
          token: 'mock_admin_jwt_token',
          id: 1,
          fullName: 'DailyBasket Admin',
          email: 'admin@dailybasket.com',
          phone: '+91 9876543210',
          role: 'ROLE_ADMIN',
        };
      }
      if (email === 'customer@dailybasket.com' && password === 'customer123') {
        return {
          token: 'mock_customer_jwt_token',
          id: 2,
          fullName: 'Sarah Jenkins',
          email: 'customer@dailybasket.com',
          phone: '+91 9123456780',
          role: 'ROLE_USER',
        };
      }
      // Generic mock fallback
      return {
        token: 'mock_jwt_token_' + Date.now(),
        id: 3,
        fullName: email.split('@')[0],
        email: email,
        phone: '+91 9876543210',
        role: email.includes('admin') ? 'ROLE_ADMIN' : 'ROLE_USER',
      };
    }
  },

  async getProfile() {
    try {
      const res = await api.get('/users/profile');
      return res.data.data;
    } catch (err) {
      const stored = localStorage.getItem('dailybasket_user');
      return stored ? JSON.parse(stored) : null;
    }
  },

  async updateProfile(data) {
    try {
      const res = await api.put('/users/profile', data);
      return res.data.data;
    } catch (err) {
      const stored = localStorage.getItem('dailybasket_user');
      const user = stored ? JSON.parse(stored) : {};
      const updated = { ...user, ...data };
      localStorage.setItem('dailybasket_user', JSON.stringify(updated));
      return updated;
    }
  },

  async getAddresses() {
    try {
      const res = await api.get('/users/addresses');
      return res.data.data;
    } catch (err) {
      const localAddresses = localStorage.getItem('dailybasket_addresses');
      if (localAddresses) return JSON.parse(localAddresses);
      const defaultAddrs = [
        {
          id: 1,
          fullName: 'Sarah Jenkins',
          phone: '+91 9123456780',
          streetAddress: 'Flat 402, Green Meadows, 5th Main Road',
          landmark: 'Near City Center Mall',
          city: 'Bengaluru',
          state: 'Karnataka',
          pinCode: '560034',
          addressType: 'HOME',
          isDefault: true,
        },
      ];
      localStorage.setItem('dailybasket_addresses', JSON.stringify(defaultAddrs));
      return defaultAddrs;
    }
  },

  async addAddress(data) {
    try {
      const res = await api.post('/users/addresses', data);
      return res.data.data;
    } catch (err) {
      const localAddresses = JSON.parse(localStorage.getItem('dailybasket_addresses') || '[]');
      const newAddr = { ...data, id: Date.now() };
      if (newAddr.isDefault) {
        localAddresses.forEach(a => (a.isDefault = false));
      }
      localAddresses.push(newAddr);
      localStorage.setItem('dailybasket_addresses', JSON.stringify(localAddresses));
      return newAddr;
    }
  },

  async deleteAddress(id) {
    try {
      await api.delete(`/users/addresses/${id}`);
    } catch (err) {
      let localAddresses = JSON.parse(localStorage.getItem('dailybasket_addresses') || '[]');
      localAddresses = localAddresses.filter(a => a.id !== id);
      localStorage.setItem('dailybasket_addresses', JSON.stringify(localAddresses));
    }
  }
};
