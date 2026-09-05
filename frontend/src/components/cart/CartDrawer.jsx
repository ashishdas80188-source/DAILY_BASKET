import React from 'react';
import { X, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItemRow from './CartItemRow';

const CartDrawer = () => {
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
    isDrawerOpen,
    closeDrawer,
  } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  const handleCheckoutClick = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    closeDrawer();
    navigate('/cart');
  };

  return (
    <div className="drawer-backdrop" onClick={closeDrawer}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: '#ecfdf5', padding: '6px', borderRadius: '8px', color: '#10b981', display: 'flex' }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>My Basket</h3>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{totalItems} items in cart</div>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div style={{ padding: '0.85rem 1.25rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            {eligibleForFreeDelivery ? (
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Sparkles size={14} /> Congratulations! You got FREE Delivery!
              </span>
            ) : (
              <span>Add <strong>₹{remainingForFreeDelivery.toFixed(0)}</strong> more for <strong>FREE Delivery</strong></span>
            )}
            <span style={{ color: '#64748b' }}>{freeDeliveryProgress.toFixed(0)}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${freeDeliveryProgress}%`,
                height: '100%',
                backgroundColor: '#10b981',
                borderRadius: '999px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.25rem' }}>
          {cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={28} />
              </div>
              <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Your basket is empty</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Explore our fresh groceries and deals to get started!</p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  closeDrawer();
                  navigate('/products');
                }}
                style={{ marginTop: '0.5rem' }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <CartItemRow
                key={item.productId || item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))
          )}
        </div>

        {/* Drawer Footer (Only if items exist) */}
        {cart.items.length > 0 && (
          <div style={{
            padding: '1.25rem',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.03)',
          }}>
            {/* Bill Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>₹{subtotal.toFixed(2)}</span>
              </div>
              {totalSavings > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
                  <span>Total Savings</span>
                  <span>- ₹{totalSavings.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Delivery Charge</span>
                <span>{deliveryFee === 0 ? <strong style={{ color: '#10b981' }}>FREE</strong> : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', borderTop: '1px dashed #e2e8f0', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                <span>Grand Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                className="btn btn-primary btn-block"
                onClick={handleCheckoutClick}
                style={{ gap: '0.5rem', fontSize: '1rem', padding: '0.8rem' }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>
              <button
                className="btn btn-outline btn-block btn-sm"
                onClick={handleViewCartClick}
              >
                View Full Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
