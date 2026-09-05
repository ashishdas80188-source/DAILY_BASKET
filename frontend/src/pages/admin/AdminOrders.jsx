import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, CheckCircle2, Clock, Truck, Package, XCircle } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllOrders(statusFilter);
      setOrders(data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      addToast(`Order #${orderId} status set to ${newStatus}`, 'success');
      loadOrders();
    } catch (err) {
      addToast('Failed to change status', 'error');
    }
  };

  const statusOptions = ['ALL', 'PLACED', 'CONFIRMED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Customer Orders & Dispatch Center" />

        <div className="admin-content">
          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: '20px', fontSize: '0.8rem', padding: '0.4rem 1rem' }}
              >
                {status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <div className="data-table-card">
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order Number</th>
                    <th>Customer Name</th>
                    <th>Shipping City</th>
                    <th>Total</th>
                    <th>Payment Method</th>
                    <th>Update Status</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 800, color: '#10b981' }}>{order.orderNumber || order.id}</td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{order.shippingFullName || order.userFullName || 'Sarah Jenkins'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{order.shippingPhone || '+91 9123456780'}</div>
                      </td>
                      <td>{order.shippingCity || 'Bengaluru'}</td>
                      <td style={{ fontWeight: 800 }}>₹{order.totalAmount?.toFixed(2)}</td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                          {order.paymentMethod || 'COD'}
                        </span>
                      </td>
                      <td>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="form-control"
                          style={{
                            width: 'auto',
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.825rem',
                            fontWeight: 700,
                            borderColor: order.orderStatus === 'DELIVERED' ? '#10b981' : '#cbd5e1',
                          }}
                        >
                          <option value="PLACED">PLACED</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PACKED">PACKED FRESH</option>
                          <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td>
                        <Link
                          to={`/order-success/${order.orderNumber || order.id}`}
                          state={{ order }}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.65rem' }}
                        >
                          <Eye size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
