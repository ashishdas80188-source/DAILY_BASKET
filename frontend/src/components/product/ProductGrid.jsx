import React from 'react';
import ProductCard from './ProductCard';
import { ShoppingBag } from 'lucide-react';

const ProductGrid = ({ products = [], loading = false, emptyMessage = "No groceries found matching your selection." }) => {
  if (loading) {
    return (
      <div className="product-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="product-card" style={{ gap: '0.75rem' }}>
            <div className="skeleton" style={{ width: '100%', paddingTop: '85%' }} />
            <div className="skeleton" style={{ width: '40%', height: '14px' }} />
            <div className="skeleton" style={{ width: '85%', height: '18px' }} />
            <div className="skeleton" style={{ width: '30%', height: '14px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
              <div className="skeleton" style={{ width: '35%', height: '24px' }} />
              <div className="skeleton" style={{ width: '35%', height: '32px', borderRadius: '8px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 1.5rem',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ShoppingBag size={32} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>No Products Found</h3>
        <p style={{ color: '#64748b', maxWidth: '400px', fontSize: '0.9rem' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
