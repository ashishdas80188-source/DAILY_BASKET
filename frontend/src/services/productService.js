import api from './api';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';

export const productService = {
  async getProducts(params = {}) {
    try {
      const res = await api.get('/products', { params });
      return res.data.data;
    } catch (err) {
      // Offline fallback: filter from SAMPLE_PRODUCTS
      let filtered = [...SAMPLE_PRODUCTS];

      if (params.categoryId) {
        filtered = filtered.filter(p => p.categoryId === Number(params.categoryId));
      }
      if (params.query) {
        const q = params.query.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q)
        );
      }
      if (params.minPrice) {
        filtered = filtered.filter(p => p.discountPrice >= Number(params.minPrice));
      }
      if (params.maxPrice) {
        filtered = filtered.filter(p => p.discountPrice <= Number(params.maxPrice));
      }
      if (params.inStock !== undefined && params.inStock !== '') {
        filtered = filtered.filter(p => p.inStock === (params.inStock === 'true' || params.inStock === true));
      }
      if (params.minRating) {
        filtered = filtered.filter(p => p.rating >= Number(params.minRating));
      }

      // Sorting
      if (params.sortBy === 'price_asc') {
        filtered.sort((a, b) => a.discountPrice - b.discountPrice);
      } else if (params.sortBy === 'price_desc') {
        filtered.sort((a, b) => b.discountPrice - a.discountPrice);
      } else if (params.sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else {
        filtered.sort((a, b) => b.id - a.id);
      }

      return {
        content: filtered,
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / (params.size || 12)),
        number: params.page || 0,
        size: params.size || 12,
      };
    }
  },

  async getFeaturedProducts() {
    try {
      const res = await api.get('/products/featured');
      return res.data.data;
    } catch (err) {
      return SAMPLE_PRODUCTS.filter(p => p.featured);
    }
  },

  async getDealsOfTheDay() {
    try {
      const res = await api.get('/products/deals');
      return res.data.data;
    } catch (err) {
      return SAMPLE_PRODUCTS.filter(p => p.dealOfTheDay);
    }
  },

  async getProductsByCategory(categoryId) {
    try {
      const res = await api.get(`/products/category/${categoryId}`);
      return res.data.data;
    } catch (err) {
      return SAMPLE_PRODUCTS.filter(p => p.categoryId === Number(categoryId));
    }
  },

  async getProductById(id) {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data.data;
    } catch (err) {
      const found = SAMPLE_PRODUCTS.find(p => p.id === Number(id) || p.slug === id);
      if (!found) throw new Error("Product not found");
      return found;
    }
  },

  async getProductBySlug(slug) {
    try {
      const res = await api.get(`/products/slug/${slug}`);
      return res.data.data;
    } catch (err) {
      const found = SAMPLE_PRODUCTS.find(p => p.slug === slug || p.id === Number(slug));
      if (!found) throw new Error("Product not found");
      return found;
    }
  },

  async getLiveSuggestions(query) {
    try {
      const res = await api.get('/products/search-suggestions', { params: { query } });
      return res.data.data;
    } catch (err) {
      if (!query || query.length < 2) return [];
      const q = query.toLowerCase();
      return SAMPLE_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q)
      ).slice(0, 6);
    }
  },

  async createProduct(data) {
    try {
      const res = await api.post('/products', data);
      return res.data.data;
    } catch (err) {
      const newProduct = { ...data, id: Date.now(), rating: 4.8, reviewCount: 0 };
      SAMPLE_PRODUCTS.unshift(newProduct);
      return newProduct;
    }
  },

  async updateProduct(id, data) {
    try {
      const res = await api.put(`/products/${id}`, data);
      return res.data.data;
    } catch (err) {
      const idx = SAMPLE_PRODUCTS.findIndex(p => p.id === Number(id));
      if (idx !== -1) {
        SAMPLE_PRODUCTS[idx] = { ...SAMPLE_PRODUCTS[idx], ...data };
        return SAMPLE_PRODUCTS[idx];
      }
      return data;
    }
  },

  async deleteProduct(id) {
    try {
      await api.delete(`/products/${id}`);
    } catch (err) {
      const idx = SAMPLE_PRODUCTS.findIndex(p => p.id === Number(id));
      if (idx !== -1) SAMPLE_PRODUCTS.splice(idx, 1);
    }
  }
};
