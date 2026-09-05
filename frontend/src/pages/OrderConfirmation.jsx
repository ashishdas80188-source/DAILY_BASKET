import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ShoppingBag,
  Check,
  Download,
} from 'lucide-react';
import { orderService } from '../services/orderService';

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      orderService.getOrderDetails(id)
        .then((res) => setOrder(res))
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  const steps = [
    { key: 'PLACED', label: 'Order Placed', icon: '1' },
    { key: 'CONFIRMED', label: 'Confirmed', icon: '2' },
    { key: 'PACKED', label: 'Packed Fresh', icon: '3' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: '4' },
    { key: 'DELIVERED', label: 'Delivered', icon: '5' },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'PLACED': return 0;
      case 'CONFIRMED': return 1;
      case 'PACKED': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  const currentStatusIndex = getStepIndex(order?.orderStatus || 'PLACED');

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 5rem', maxWidth: '860px' }}>
      {/* Top Celebration Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        padding: '3rem 2rem',
        textAlign: 'center',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          backgroundColor: '#ecfdf5',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
        }}>
          <CheckCircle size={44} strokeWidth={2.5} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
          ORDER PLACED SUCCESSFULLY!
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1rem' }}>
          Thank you for shopping with <strong>DAILYBASKET</strong>. Your items are being packed fresh from our local store.
        </p>

        <div style={{
          display: 'inline-block',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px',
          padding: '0.5rem 1rem',
          fontSize: '0.95rem',
          fontWeight: 700,
          color: '#0f172a',
          letterSpacing: '0.02em',
        }}>
          Order Number: <span style={{ color: '#10b981' }}>{order?.orderNumber || id}</span>
        </div>

        {/* 5-Step Order Status Progress Bar */}
        <div style={{ margin: '2.5rem 0 1rem' }}>
          <div className="order-status-tracker">
            <div
              className="order-status-progress-bar"
              style={{ width: `${(currentStatusIndex / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStatusIndex;
              const isActive = idx === currentStatusIndex;
              return (
                <div
                  key={step.key}
                  className={`tracker-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                >
                  <div className="tracker-icon">
                    {isCompleted ? <Check size={18} /> : step.icon}
                  </div>
                  <div className="tracker-label">{step.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem',
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
          Delivery & Receipt Summary
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Delivery Details */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Shipping Address
            </div>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{order?.shippingFullName}</div>
            <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
              {order?.shippingAddress}, {order?.shippingCity} - {order?.shippingPinCode}
            </div>
            <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '0.25rem' }}>
              Phone: {order?.shippingPhone}
            </div>
          </div>

          {/* Delivery Slot & Payment */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Delivery Slot & Payment
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.35rem' }}>
              <Clock size={16} color="#10b981" /> {order?.deliverySlot || 'Instant Delivery'}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#475569' }}>
              Payment Mode: <strong>{order?.paymentMethod || 'CASH_ON_DELIVERY'}</strong>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#475569' }}>
              Payment Status: <span style={{ color: order?.paymentStatus === 'COMPLETED' ? '#15803d' : '#b45309', fontWeight: 700 }}>{order?.paymentStatus || 'PENDING'}</span>
            </div>
          </div>
        </div>

        {/* Ordered Items List */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Items in Order ({order?.items?.length || 0})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {order?.items?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid #f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.productName} style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px' }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.productName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Qty: {item.quantity} {item.productUnit && `• ${item.productUnit}`}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  ₹{(item.subtotal || item.unitPrice * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Bill Details */}
        <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
            <span>Subtotal</span>
            <span>₹{order?.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          {order?.discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
              <span>Total Savings & Discounts</span>
              <span>- ₹{order?.discountAmount?.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
            <span>Delivery Fee</span>
            <span>{order?.deliveryFee === 0 ? 'FREE' : `₹${order?.deliveryFee?.toFixed(2)}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
            <span>Total Paid / Payable</span>
            <span>₹{order?.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/orders" className="btn btn-secondary btn-lg" style={{ gap: '0.4rem' }}>
          <Package size={18} /> View All Orders
        </Link>
        <Link to="/products" className="btn btn-primary btn-lg" style={{ gap: '0.4rem' }}>
          <ShoppingBag size={18} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
