import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const ProductModal = ({ isOpen, onClose, onSave, product = null, categories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: categories[0]?.id || 1,
    unit: '1 kg',
    originalPrice: '',
    discountPrice: '',
    stockQuantity: 50,
    imageUrl: '',
    brand: 'DailyBasket Fresh',
    featured: false,
    dealOfTheDay: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        categoryId: product.categoryId || categories[0]?.id || 1,
        unit: product.unit || '1 kg',
        originalPrice: product.originalPrice || '',
        discountPrice: product.discountPrice || '',
        stockQuantity: product.stockQuantity !== undefined ? product.stockQuantity : 50,
        imageUrl: product.imageUrl || '',
        brand: product.brand || 'DailyBasket Fresh',
        featured: !!product.featured,
        dealOfTheDay: !!product.dealOfTheDay,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        categoryId: categories[0]?.id || 1,
        unit: '1 kg',
        originalPrice: '',
        discountPrice: '',
        stockQuantity: 50,
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
        brand: 'DailyBasket Fresh',
        featured: false,
        dealOfTheDay: false,
      });
    }
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      originalPrice: Number(formData.originalPrice),
      discountPrice: Number(formData.discountPrice),
      stockQuantity: Number(formData.stockQuantity),
      categoryId: Number(formData.categoryId),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            {product ? 'Edit Grocery Product' : 'Add New Grocery Product'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-control"
              placeholder="e.g. Fresh Cow Milk (Pasteurized)"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="form-control"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Packaging / Unit (e.g. 1 L, 500 g) *</label>
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="form-control"
                placeholder="1 kg"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">MRP Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="form-control"
                placeholder="80.00"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Selling Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                className="form-control"
                placeholder="65.00"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Stock Units *</label>
              <input
                type="number"
                required
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="form-control"
                placeholder="50"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Product Image URL *</label>
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="form-control"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Brand</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="form-control"
              placeholder="DailyBasket Fresh"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-control"
              placeholder="Detailed description of the grocery item..."
            />
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
              />
              Featured in Trending
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.dealOfTheDay}
                onChange={(e) => setFormData({ ...formData, dealOfTheDay: e.target.checked })}
                style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
              />
              Deal of the Day
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <Save size={18} /> {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
