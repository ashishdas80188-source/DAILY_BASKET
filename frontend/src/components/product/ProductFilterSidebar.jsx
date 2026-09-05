import React from 'react';
import { Filter, X, RotateCcw, Star, Check } from 'lucide-react';

const ProductFilterSidebar = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  priceRange,
  onChangePriceRange,
  selectedRating,
  onSelectRating,
  inStockOnly,
  onToggleInStock,
  onResetFilters,
  isOpenOnMobile,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Sidebar Box */}
      <aside className={`product-filter-sidebar ${isOpenOnMobile ? 'mobile-open' : ''}`} style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '1.5rem',
        height: 'fit-content',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          paddingBottom: '0.85rem',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem' }}>
            <Filter size={18} color="#10b981" /> Filters
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={onResetFilters}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', gap: '0.25rem' }}
              title="Reset all filters"
            >
              <RotateCcw size={12} /> Reset
            </button>
            {isOpenOnMobile && (
              <button onClick={onCloseMobile} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* 1. Category Filter */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
            Categories
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '240px', overflowY: 'auto' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.875rem',
                fontWeight: selectedCategory === null ? 700 : 500,
                color: selectedCategory === null ? '#10b981' : '#334155',
                cursor: 'pointer',
                padding: '0.2rem 0',
              }}
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === null}
                onChange={() => onSelectCategory(null)}
                style={{ accentColor: '#10b981' }}
              />
              All Categories
            </label>
            {categories.map((cat) => (
              <label
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.875rem',
                  fontWeight: selectedCategory === cat.id ? 700 : 500,
                  color: selectedCategory === cat.id ? '#10b981' : '#334155',
                  cursor: 'pointer',
                  padding: '0.2rem 0',
                }}
              >
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat.id}
                  onChange={() => onSelectCategory(cat.id)}
                  style={{ accentColor: '#10b981' }}
                />
                <span style={{ flex: 1 }}>{cat.name}</span>
                {cat.productCount > 0 && (
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({cat.productCount})</span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* 2. Price Range Filter */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
              Max Price
            </h4>
            <span style={{ fontWeight: 800, color: '#10b981', fontSize: '0.9rem' }}>₹{priceRange.max}</span>
          </div>
          <input
            type="range"
            min="30"
            max="600"
            step="10"
            value={priceRange.max}
            onChange={(e) => onChangePriceRange({ ...priceRange, max: Number(e.target.value) })}
            style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            <span>₹30</span>
            <span>₹300</span>
            <span>₹600</span>
          </div>
        </div>

        {/* 3. Rating Filter */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
            Customer Rating
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[4, 3, 2].map((stars) => (
              <label
                key={stars}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.875rem',
                  color: selectedRating === stars ? '#10b981' : '#334155',
                  cursor: 'pointer',
                  fontWeight: selectedRating === stars ? 700 : 500,
                }}
              >
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === stars}
                  onChange={() => onSelectRating(selectedRating === stars ? null : stars)}
                  style={{ accentColor: '#10b981' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {stars} <Star size={14} fill="#d97706" color="#d97706" /> & above
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 4. Availability Toggle */}
        <div>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
            Availability
          </h4>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', cursor: 'pointer', color: '#334155', fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onToggleInStock(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
            />
            In Stock Items Only
          </label>
        </div>
      </aside>
    </>
  );
};

export default ProductFilterSidebar;
