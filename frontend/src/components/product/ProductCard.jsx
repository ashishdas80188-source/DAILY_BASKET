import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const currentQuantity = getItemQuantity(product.id);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, currentQuantity - 1);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="product-card">
      {/* Top Image Box */}
      <Link to={`/product/${product.id}`} className="product-card-top">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80";
          }}
        />

        {/* Badges */}
        <div className="product-badges">
          {product.discountPercentage > 0 && (
            <span className="badge badge-discount">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.dealOfTheDay && (
            <span className="badge badge-deal">
              ⚡ HOT DEAL
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          className={`product-wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={handleWishlistClick}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={inWishlist ? "#ef4444" : "none"} strokeWidth={2} />
        </button>
      </Link>

      {/* Body Information */}
      <div className="product-card-body">
        <div className="product-unit">{product.unit || 'Standard Pack'}</div>
        <Link to={`/product/${product.id}`} className="product-name" title={product.name}>
          {product.name}
        </Link>

        {/* Rating */}
        <div className="product-rating">
          <Star size={13} fill="#d97706" color="#d97706" />
          <span>{product.rating || 4.5}</span>
          <span style={{ color: '#94a3b8', fontWeight: 500 }}>({product.reviewCount || 12})</span>
        </div>

        {/* Card Footer: Price & Add / Quantity Stepper */}
        <div className="product-card-footer">
          <div className="product-price-box">
            <span className="product-price">₹{product.discountPrice}</span>
            {product.originalPrice && product.originalPrice > product.discountPrice && (
              <span className="product-original-price">₹{product.originalPrice}</span>
            )}
          </div>

          {/* Add / Stepper Control */}
          {currentQuantity > 0 ? (
            <div className="quantity-stepper">
              <button
                type="button"
                className="stepper-btn"
                onClick={handleDecrement}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="stepper-value">{currentQuantity}</span>
              <button
                type="button"
                className="stepper-btn"
                onClick={handleIncrement}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleAdd}
              style={{ fontWeight: 700, padding: '0.45rem 1rem' }}
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
