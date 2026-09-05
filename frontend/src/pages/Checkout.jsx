import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  MapPin,
  CheckCircle2,
  CreditCard,
  Banknote,
  Truck,
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';

const Checkout = () => {
  const { cart, subtotal, deliveryFee, finalTotal, totalSavings, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const couponDiscount = location.state?.couponDiscount || 0;
  const appliedCoupon = location.state?.appliedCoupon || null;

  // Checkout State
  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [deliverySlot, setDeliverySlot] = useState('Instant Express (15-30 mins)');
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // New Address Form State
  const [newAddress, setNewAddress] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    streetAddress: '',
    landmark: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '',
    addressType: 'HOME',
    isDefault: true,
  });

  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    const loadAddresses = async () => {
      try {
        const list = await authService.getAddresses();
        setAddresses(list || []);
        if (list && list.length > 0) {
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          setSelectedAddressId(defaultAddr.id);
        } else {
          setIsAddingAddress(true);
        }
      } catch (err) {
        console.error("Failed to load addresses", err);
      }
    };

    loadAddresses();
  }, [cart.items.length, navigate]);

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.phone || !newAddress.streetAddress || !newAddress.pinCode) {
      addToast('Please fill all mandatory address fields.', 'error');
      return;
    }

    try {
      const saved = await authService.addAddress(newAddress);
      setAddresses((prev) => [...prev, saved]);
      setSelectedAddressId(saved.id);
      setIsAddingAddress(false);
      addToast('New delivery address saved!', 'success');
    } catch (err) {
      addToast('Failed to save address', 'error');
    }
  };

  const handlePlaceOrder = async () => {
    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
    if (!selectedAddr) {
      addToast('Please select or add a delivery address first.', 'error');
      setCurrentStep(1);
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        addressId: selectedAddr.id,
        shippingFullName: selectedAddr.fullName,
        shippingPhone: selectedAddr.phone,
        shippingStreetAddress: selectedAddr.streetAddress,
        shippingLandmark: selectedAddr.landmark,
        shippingCity: selectedAddr.city,
        shippingState: selectedAddr.state,
        shippingPinCode: selectedAddr.pinCode,
        deliverySlot: deliverySlot,
        paymentMethod: paymentMethod,
        items: cart.items,
        subtotal: subtotal,
        discountAmount: totalSavings + couponDiscount,
        deliveryFee: deliveryFee,
        totalAmount: Math.max(0, finalTotal - couponDiscount),
      };

      const createdOrder = await orderService.createOrder(orderPayload);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      clearCart();
      addToast('Order Placed Successfully!', 'success');
      navigate(`/order-success/${createdOrder.orderNumber || createdOrder.id}`, { state: { order: createdOrder } });
    } catch (err) {
      addToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const grandTotal = Math.max(0, finalTotal - couponDiscount);
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 5rem' }}>
      {/* Checkout Progress Steps */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        marginBottom: '3rem',
      }}>
        <div
          onClick={() => setCurrentStep(1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontWeight: 700,
            color: currentStep >= 1 ? '#10b981' : '#94a3b8',
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: currentStep >= 1 ? '#10b981' : '#e2e8f0',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
          }}>
            1
          </div>
          <span>Delivery Address</span>
        </div>

        <div style={{ width: '40px', height: '2px', backgroundColor: currentStep >= 2 ? '#10b981' : '#e2e8f0' }} />

        <div
          onClick={() => selectedAddress && setCurrentStep(2)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: selectedAddress ? 'pointer' : 'not-allowed',
            fontWeight: 700,
            color: currentStep >= 2 ? '#10b981' : '#94a3b8',
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: currentStep >= 2 ? '#10b981' : '#e2e8f0',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
          }}>
            2
          </div>
          <span>Payment & Review</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
        {/* Left Side: Step Content */}
        <div>
          {/* STEP 1: Address Selection */}
          {currentStep === 1 && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={22} color="#10b981" /> 1. Select Delivery Address
                </h2>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="btn btn-outline-primary btn-sm"
                    style={{ gap: '0.3rem' }}
                  >
                    <Plus size={16} /> Add New Address
                  </button>
                )}
              </div>

              {isAddingAddress ? (
                /* New Address Form */
                <form onSubmit={handleSaveNewAddress} style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className="form-control"
                        placeholder="Sarah Jenkins"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="form-control"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">House / Flat / Street Address *</label>
                    <textarea
                      required
                      rows={2}
                      value={newAddress.streetAddress}
                      onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                      className="form-control"
                      placeholder="Flat 402, Green Meadows, 5th Main Road"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Landmark (Optional)</label>
                      <input
                        type="text"
                        value={newAddress.landmark}
                        onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                        className="form-control"
                        placeholder="Near Metro Station"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">PIN Code *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.pinCode}
                        onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value })}
                        className="form-control"
                        placeholder="560034"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary">
                      Save & Deliver Here
                    </button>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                /* Saved Address Cards */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      style={{
                        border: selectedAddressId === addr.id ? '2px solid #10b981' : '1px solid #e2e8f0',
                        backgroundColor: selectedAddressId === addr.id ? '#ecfdf5' : '#ffffff',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 800, color: '#0f172a' }}>{addr.fullName}</span>
                          <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{addr.addressType || 'HOME'}</span>
                          {addr.isDefault && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Default</span>}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                          {addr.streetAddress}{addr.landmark ? `, ${addr.landmark}` : ''}, {addr.city}, {addr.state} - <strong>{addr.pinCode}</strong>
                        </div>
                        <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '0.35rem' }}>
                          Phone: <strong>{addr.phone}</strong>
                        </div>
                      </div>

                      {selectedAddressId === addr.id && (
                        <CheckCircle2 size={22} color="#10b981" />
                      )}
                    </div>
                  ))}

                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!selectedAddressId}
                    className="btn btn-primary btn-lg"
                    style={{ marginTop: '1.5rem', gap: '0.5rem' }}
                  >
                    Continue to Payment <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Delivery Slot & Payment */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Delivery Address Summary Bar */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Delivering To:
                  </div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                    {selectedAddress?.fullName} • {selectedAddress?.streetAddress}, {selectedAddress?.city}
                  </div>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.8rem' }}
                >
                  Change
                </button>
              </div>

              {/* Delivery Slot Selector */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Truck size={20} color="#10b981" /> Choose Delivery Slot
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  {[
                    { label: 'Instant Express (15-30 mins)', tag: '⚡ FASTEST', sub: 'Packed from nearest hub' },
                    { label: 'Tomorrow Morning (7 AM - 10 AM)', tag: 'FRESH HARVEST', sub: 'Fresh milk & veggies' },
                    { label: 'Tomorrow Evening (5 PM - 9 PM)', tag: 'CONVENIENT', sub: 'After work drop' },
                  ].map((slot, idx) => (
                    <div
                      key={idx}
                      onClick={() => setDeliverySlot(slot.label)}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        border: deliverySlot === slot.label ? '2px solid #10b981' : '1px solid #e2e8f0',
                        backgroundColor: deliverySlot === slot.label ? '#ecfdf5' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', marginBottom: '0.25rem' }}>
                        {slot.tag}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{slot.label.split('(')[0]}</div>
                      <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{slot.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <CreditCard size={20} color="#10b981" /> Select Payment Method
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* COD */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: paymentMethod === 'CASH_ON_DELIVERY' ? '2px solid #10b981' : '1px solid #e2e8f0',
                      backgroundColor: paymentMethod === 'CASH_ON_DELIVERY' ? '#ecfdf5' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'CASH_ON_DELIVERY'}
                      onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                      style={{ accentColor: '#10b981', width: '18px', height: '18px' }}
                    />
                    <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '8px', display: 'flex' }}>
                      <Banknote size={20} color="#10b981" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>Cash on Delivery (COD)</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pay in cash or UPI when your grocery bag arrives at doorstep</div>
                    </div>
                  </label>

                  {/* Simulated Online Payment (UPI / Cards) */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: paymentMethod === 'ONLINE_SIMULATED' ? '2px solid #10b981' : '1px solid #e2e8f0',
                      backgroundColor: paymentMethod === 'ONLINE_SIMULATED' ? '#ecfdf5' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'ONLINE_SIMULATED'}
                      onChange={() => setPaymentMethod('ONLINE_SIMULATED')}
                      style={{ accentColor: '#10b981', width: '18px', height: '18px' }}
                    />
                    <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '8px', display: 'flex' }}>
                      <CreditCard size={20} color="#10b981" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Online Payment (UPI, Cards, NetBanking)
                        <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Instant Simulated Sandbox</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Integration ready for Razorpay / Stripe payment gateway
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Order Summary Card */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>Order Items ({cart.totalItems})</h3>

          {/* Items Preview */}
          <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            {cart.items.map((item) => (
              <div key={item.productId || item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 0 }}>
                  <img src={item.imageUrl} alt={item.productName} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 600 }}>{item.productName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Qty: {item.quantity} × ₹{item.discountPrice}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: '#0f172a', paddingLeft: '0.5rem' }}>
                  ₹{(item.discountPrice * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Bill Calculation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>₹{subtotal.toFixed(2)}</span>
            </div>

            {totalSavings > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
                <span>Item MRP Discounts</span>
                <span>- ₹{totalSavings.toFixed(2)}</span>
              </div>
            )}

            {couponDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
                <span>Coupon ({appliedCoupon})</span>
                <span>- ₹{couponDiscount.toFixed(2)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? <strong style={{ color: '#10b981' }}>FREE</strong> : `₹${deliveryFee.toFixed(2)}`}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#0f172a',
              borderTop: '2px dashed #e2e8f0',
              paddingTop: '0.85rem',
              marginTop: '0.35rem',
            }}>
              <span>Total Payable</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Button */}
          {currentStep === 2 ? (
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="btn btn-primary btn-lg btn-block"
              style={{ marginTop: '1.5rem', gap: '0.5rem', fontSize: '1.05rem', padding: '0.9rem' }}
            >
              {isPlacingOrder ? 'Confirming Order...' : `PLACE ORDER • ₹${grandTotal.toFixed(2)}`}
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!selectedAddressId}
              className="btn btn-primary btn-lg btn-block"
              style={{ marginTop: '1.5rem', gap: '0.5rem' }}
            >
              Continue to Step 2 <ArrowRight size={18} />
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#94a3b8', marginTop: '1rem' }}>
            <ShieldCheck size={16} color="#10b981" /> 100% Genuine Products • Freshness Guarantee
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
