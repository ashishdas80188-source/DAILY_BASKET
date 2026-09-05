import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, ChevronRight, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const list = await orderService.getUserOrders();
        setOrders(list || []);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="badge badge-success">✓ Delivered</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="badge badge-info">🚚 Out for Delivery</span>;
      case 'PACKED':
        return <span className="badge badge-warning">📦 Packed Fresh</span>;
      case 'CONFIRMED':
        return <span className="badge badge-info">✓ Confirmed</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">✕ Cancelled</span>;
      default:
        return <span className="badge badge-deal">● Placed</span>;
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 5rem', maxWidth: '980px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Grocery Orders</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Track, view, and reorder past grocery purchases</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="card skeleton" style={{ height: '140px', borderRadius: '16px' }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 1.5rem',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Package size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Orders Found</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>You haven't placed any orders yet. Fill your basket today!</p>
          <Link to="/products" className="btn btn-primary">
            Browse Groceries <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              className="card"
              style={{
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Order Card Top Bar */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.75rem',
                borderBottom: '1px solid #f1f5f9',
                paddingBottom: '1rem',
                marginBottom: '1rem',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>
                      {order.orderNumber || `Order #${order.id}`}
                    </span>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Placed on: {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    ₹{order.totalAmount?.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {order.items?.length || 0} items • {order.paymentMethod || 'COD'}
                  </div>
                </div>
              </div>

              {/* Items Preview */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.25rem 0' }}>
                  {order.items?.slice(0, 4).map((item, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                          title={item.productName}
                        />
                      ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                          Item
                        </div>
                      )}
                      {item.quantity > 1 && (
                        <span style={{ position: 'absolute', bottom: '-4px', right: '-4px', backgroundColor: '#0f172a', color: '#fff', fontSize: '0.65rem', fontWeight: 700, borderRadius: '999px', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {item.quantity}
                        </span>
                      )}
                    </div>
                  ))}
                  {order.items?.length > 4 && (
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                <Link
                  to={`/order-success/${order.orderNumber || order.id}`}
                  state={{ order }}
                  className="btn btn-outline-primary btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  View Details & Track <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
