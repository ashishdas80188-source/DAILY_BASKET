import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import CartItemRow from '../components/cart/CartItemRow';

const Cart = () => {
  const {
    cart,
    totalItems,
    subtotal,
    deliveryFee,
    finalTotal,
    totalSavings,
    eligibleForFreeDelivery,
    freeDeliveryThreshold,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'FRESH20') {
      const discount = subtotal * 0.20;
      setCouponDiscount(discount);
      setAppliedCoupon({ code: 'FRESH20', discount, desc: '20% Special Grocery Discount Applied!' });
      addToast('Coupon FRESH20 applied successfully! You saved 20%', 'success');
    } else if (code === 'DAILY50') {
      const discount = Math.min(50, subtotal);
      setCouponDiscount(discount);
      setAppliedCoupon({ code: 'DAILY50', discount, desc: '₹50 Flat Welcome Discount' });
      addToast('Coupon DAILY50 applied! ₹50 off', 'success');
    } else {
      addToast('Invalid coupon code. Try FRESH20 or DAILY50', 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
    addToast('Coupon removed', 'info');
  };

  const adjustedTotal = Math.max(0, finalTotal - couponDiscount);
  const totalCombinedSavings = totalSavings + couponDiscount;

  if (cart.items.length === 0) {
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
            backgroundColor: '#ecfdf5',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <ShoppingBag size={40} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>Your Cart is Empty</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Looks like you haven't added any fresh groceries or pantry essentials to your cart yet.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg btn-block">
            Start Grocery Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Shopping Basket</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>You have <strong>{totalItems} items</strong> in your grocery basket</p>
        </div>
        <button
          onClick={clearCart}
          className="btn btn-outline-danger btn-sm"
          style={{ color: '#ef4444', borderColor: '#fee2e2', gap: '0.35rem' }}
        >
          <Trash2 size={15} /> Clear Basket
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Left: Cart Items List */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          {cart.items.map((item) => (
            <CartItemRow
              key={item.productId || item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/products" className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary & Coupons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Promo Code Box */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
              <Tag size={18} color="#10b981" /> Apply Coupon Code
            </div>

            {appliedCoupon ? (
              <div style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#065f46', fontSize: '0.9rem' }}>
                    {appliedCoupon.code}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#047857' }}>{appliedCoupon.desc}</div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Enter code: e.g. FRESH20"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="form-control"
                  style={{ textTransform: 'uppercase', fontWeight: 600 }}
                />
                <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '0.65rem 1rem' }}>
                  Apply
                </button>
              </form>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <span
                onClick={() => setCouponCode('FRESH20')}
                style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              >
                Use <strong>FRESH20</strong> (20% OFF)
              </span>
              <span
                onClick={() => setCouponCode('DAILY50')}
                style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              >
                Use <strong>DAILY50</strong> (₹50 OFF)
              </span>
            </div>
          </div>

          {/* Order Summary Box */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem' }}>Order Bill Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Item Subtotal ({totalItems} items)</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>₹{subtotal.toFixed(2)}</span>
              </div>

              {totalSavings > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
                  <span>Product MRP Discount</span>
                  <span>- ₹{totalSavings.toFixed(2)}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>- ₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Delivery Partner Fee</span>
                <span>{deliveryFee === 0 ? <strong style={{ color: '#10b981' }}>FREE</strong> : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>

              {/* Total Savings Highlighting */}
              {totalCombinedSavings > 0 && (
                <div style={{
                  backgroundColor: '#ecfdf5',
                  borderRadius: '8px',
                  padding: '0.6rem 0.85rem',
                  color: '#065f46',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginTop: '0.25rem',
                }}>
                  <Sparkles size={16} color="#10b981" />
                  <span>You are saving <strong>₹{totalCombinedSavings.toFixed(2)}</strong> on this order!</span>
                </div>
              )}

              {/* Grand Total */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#0f172a',
                borderTop: '2px dashed #e2e8f0',
                paddingTop: '1rem',
                marginTop: '0.5rem',
              }}>
                <span>To Pay</span>
                <span>₹{adjustedTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout', { state: { couponDiscount, appliedCoupon: appliedCoupon?.code } })}
              className="btn btn-primary btn-lg btn-block"
              style={{ marginTop: '1.5rem', gap: '0.5rem' }}
            >
              PROCEED TO CHECKOUT <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#94a3b8', marginTop: '1rem' }}>
              <ShieldCheck size={16} color="#10b981" /> Safe & Secure 256-Bit SSL Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
