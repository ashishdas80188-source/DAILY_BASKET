import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  Share2,
  Sparkles,
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductGrid from '../components/product/ProductGrid';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, openDrawer } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const prod = await productService.getProductById(id);
        setProduct(prod);
        setQuantity(1);

        if (prod?.categoryId) {
          const related = await productService.getProductsByCategory(prod.categoryId);
          setRelatedProducts(related.filter((p) => p.id !== prod.id).slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          <div className="skeleton" style={{ height: '420px', borderRadius: '16px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton" style={{ width: '40%', height: '24px' }} />
            <div className="skeleton" style={{ width: '80%', height: '36px' }} />
            <div className="skeleton" style={{ width: '30%', height: '24px' }} />
            <div className="skeleton" style={{ width: '50%', height: '32px' }} />
            <div className="skeleton" style={{ width: '100%', height: '120px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1.5rem' }}>The grocery item you requested does not exist or has been discontinued.</p>
        <Link to="/products" className="btn btn-primary">Back to Groceries</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, false);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="container" style={{ padding: '1.5rem 1.25rem 4rem' }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '2rem' }}>
        <Link to="/" style={{ color: '#64748b' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/products" style={{ color: '#64748b' }}>Groceries</Link>
        <ChevronRight size={14} />
        <Link to={`/products?category=${product.categoryId}`} style={{ color: '#64748b' }}>
          {product.categoryName || 'Category'}
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: '#0f172a', fontWeight: 700 }}>{product.name}</span>
      </div>

      {/* Main Product Details Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '3rem',
        marginBottom: '4rem',
        alignItems: 'start',
      }}>
        {/* Left Column: Image Box */}
        <div style={{ position: 'sticky', top: '110px' }}>
          <div style={{
            position: 'relative',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            padding: '1.5rem',
            textAlign: 'center',
          }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                transition: 'transform 0.3s ease',
              }}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80";
              }}
            />

            {/* Badges */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {product.discountPercentage > 0 && (
                <span className="badge badge-discount">{product.discountPercentage}% OFF</span>
              )}
              {product.dealOfTheDay && (
                <span className="badge badge-deal">⚡ DEAL OF THE DAY</span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`product-wishlist-btn ${inWishlist ? 'active' : ''}`}
              style={{ top: '16px', right: '16px', width: '38px', height: '38px' }}
              title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={20} fill={inWishlist ? "#ef4444" : "none"} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {product.brand || 'DailyBasket Fresh'}
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{product.categoryName}</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: '0.75rem' }}>
            {product.name}
          </h1>

          {/* Unit / Weight Pill */}
          <div style={{ display: 'inline-block', backgroundColor: '#f1f5f9', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 700, color: '#475569', marginBottom: '1rem' }}>
            Net Quantity: {product.unit}
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#fef3c7', padding: '0.3rem 0.6rem', borderRadius: '6px', color: '#b45309', fontWeight: 700, fontSize: '0.85rem' }}>
              <Star size={14} fill="#d97706" color="#d97706" />
              <span>{product.rating || 4.5}</span>
            </div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              <strong>{product.reviewCount || 14}</strong> verified customer reviews
            </span>
          </div>

          {/* Pricing Banner */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                ₹{product.discountPrice}
              </span>
              {product.originalPrice && product.originalPrice > product.discountPrice && (
                <>
                  <span style={{ fontSize: '1.1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹{product.originalPrice}
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981' }}>
                    Save ₹{(product.originalPrice - product.discountPrice).toFixed(0)} ({product.discountPercentage}% OFF)
                  </span>
                </>
              )}
            </div>
            <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
              Inclusive of all taxes. Free delivery on orders over ₹499.
            </div>
          </div>

          {/* Stock & Quantity Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Quantity
              </div>
              <div className="quantity-stepper" style={{ height: '38px' }}>
                <button
                  type="button"
                  className="stepper-btn"
                  style={{ width: '36px' }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus size={16} />
                </button>
                <span className="stepper-value" style={{ minWidth: '32px', fontSize: '1rem' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  className="stepper-btn"
                  style={{ width: '36px' }}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Availability
              </div>
              {product.inStock ? (
                <div style={{ color: '#15803d', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Check size={18} color="#15803d" /> In Stock ({product.stockQuantity || 50} units ready)
                </div>
              ) : (
                <div style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.9rem' }}>
                  Out of Stock
                </div>
              )}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-lg"
              style={{ flex: 1, minWidth: '180px', gap: '0.6rem' }}
            >
              <ShoppingBag size={20} /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="btn btn-secondary btn-lg"
              style={{ flex: 1, minWidth: '180px' }}
            >
              ⚡ Instant Buy Now
            </button>
            <button
              onClick={handleShare}
              className="btn btn-outline"
              style={{ padding: '0.85rem' }}
              title="Share product"
            >
              <Share2 size={20} />
            </button>
          </div>

          {/* Delivery & Trust Guarantee Badges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '2rem',
          }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Truck size={22} color="#10b981" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>15-30 Min Delivery</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Delivered fresh in eco-bags</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <ShieldCheck size={22} color="#10b981" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>100% Quality Check</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Sorted & hygienically packed</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <RotateCcw size={22} color="#10b981" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Instant Replacement</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>No questions asked refund</div>
              </div>
            </div>
          </div>

          {/* Description & Product Details */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>About this product</h3>
            <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {product.description}
            </p>

            {product.ingredients && (
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Key Ingredients / Composition: </span>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{product.ingredients}</span>
              </div>
            )}

            {product.origin && (
              <div>
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Origin / Source: </span>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{product.origin}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: '3rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Customers Also Bought</h2>
              <p className="section-subtitle">Similar fresh grocery staples in this category</p>
            </div>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
