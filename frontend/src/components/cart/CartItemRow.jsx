import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartItemRow = ({ item, onUpdateQuantity, onRemove }) => {
  if (!item) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.85rem',
      padding: '0.85rem 0',
      borderBottom: '1px solid #f1f5f9',
    }}>
      {/* Product Image */}
      <img
        src={item.imageUrl}
        alt={item.productName}
        style={{
          width: '60px',
          height: '60px',
          objectFit: 'cover',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
        }}
      />

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link
          to={`/product/${item.productId}`}
          style={{
            fontSize: '0.875rem',
            fontWeight: 700,
            color: '#0f172a',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.productName}
        </Link>
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem' }}>
          {item.productUnit}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0f172a' }}>
            ₹{item.discountPrice}
          </span>
          {item.originalPrice && item.originalPrice > item.discountPrice && (
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
              ₹{item.originalPrice}
            </span>
          )}
        </div>
      </div>

      {/* Stepper (+/-) */}
      <div className="quantity-stepper" style={{ height: '30px' }}>
        <button
          className="stepper-btn"
          style={{ width: '26px' }}
          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          aria-label="Decrease"
        >
          <Minus size={12} />
        </button>
        <span className="stepper-value" style={{ fontSize: '0.8rem', minWidth: '20px' }}>
          {item.quantity}
        </span>
        <button
          className="stepper-btn"
          style={{ width: '26px' }}
          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          aria-label="Increase"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.productId)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#94a3b8',
          padding: '4px',
          display: 'flex',
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        title="Remove item"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default CartItemRow;
