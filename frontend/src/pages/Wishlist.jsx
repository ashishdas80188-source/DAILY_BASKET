import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '480px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '3.5rem 2rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <Heart size={40} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>Your Wishlist is Empty</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Save your favorite vegetables, fruits, dairy, and snacks to purchase them easily next time.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg btn-block">
            Explore Groceries <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Wishlist</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          <strong>{wishlist.length} items</strong> saved for later
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1.5rem',
      }}>
        {wishlist.map((item) => {
          const product = item.product || item;
          return (
            <div
              key={product.id}
              className="card"
              style={{
                borderRadius: '16px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {/* Product Image */}
              <Link to={`/product/${product.id}`} style={{ width: '100%', paddingTop: '80%', position: 'relative', overflow: 'hidden', borderRadius: '10px', backgroundColor: '#f8fafc', marginBottom: '0.75rem', display: 'block' }}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Link>

              {/* Remove button */}
              <button
                onClick={() => removeFromWishlist(product.id)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ef4444',
                  boxShadow: 'var(--shadow-sm)',
                }}
                title="Remove from wishlist"
              >
                <Trash2 size={16} />
              </button>

              {/* Info */}
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{product.unit}</div>
              <Link to={`/product/${product.id}`} style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {product.name}
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>₹{product.discountPrice}</span>
                {product.originalPrice > product.discountPrice && (
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>₹{product.originalPrice}</span>
                )}
              </div>

              {/* Move to Cart CTA */}
              <button
                onClick={() => handleMoveToCart(product)}
                className="btn btn-primary btn-sm btn-block"
                style={{ gap: '0.4rem', fontWeight: 700 }}
              >
                <ShoppingBag size={16} /> Move to Basket
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
