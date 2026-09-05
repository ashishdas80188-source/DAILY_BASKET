import api from './api';
import { SAMPLE_CATEGORIES } from '../data/sampleProducts';

export const categoryService = {
  async getCategories() {
    try {
      const res = await api.get('/categories');
      return res.data.data;
    } catch (err) {
      return SAMPLE_CATEGORIES;
    }
  },

  async getCategoryById(id) {
    try {
      const res = await api.get(`/categories/${id}`);
      return res.data.data;
    } catch (err) {
      return SAMPLE_CATEGORIES.find(c => c.id === Number(id));
    }
  },

  async createCategory(data) {
    try {
      const res = await api.post('/categories', data);
      return res.data.data;
    } catch (err) {
      const newCat = { ...data, id: Date.now(), productCount: 0 };
      SAMPLE_CATEGORIES.push(newCat);
      return newCat;
    }
  },

  async updateCategory(id, data) {
    try {
      const res = await api.put(`/categories/${id}`, data);
      return res.data.data;
    } catch (err) {
      const idx = SAMPLE_CATEGORIES.findIndex(c => c.id === Number(id));
      if (idx !== -1) {
        SAMPLE_CATEGORIES[idx] = { ...SAMPLE_CATEGORIES[idx], ...data };
        return SAMPLE_CATEGORIES[idx];
      }
      return data;
    }
  },

  async deleteCategory(id) {
    try {
      await api.delete(`/categories/${id}`);
    } catch (err) {
      const idx = SAMPLE_CATEGORIES.findIndex(c => c.id === Number(id));
      if (idx !== -1) SAMPLE_CATEGORIES.splice(idx, 1);
    }
  }
};
