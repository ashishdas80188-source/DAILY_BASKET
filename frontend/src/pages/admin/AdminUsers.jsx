import React, { useState, useEffect } from 'react';
import { Users, Shield, User, Mail, Phone, Calendar } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { adminService } from '../../services/adminService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    adminService.getUsers().then((res) => setUsers(res || []));
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Registered Shoppers & Administrators" />

        <div className="admin-content">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Customer Accounts ({users.length})</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Directory of registered consumers and administrators</p>
          </div>

          <div className="data-table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Date Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0f172a' }}>
                          {u.fullName?.charAt(0) || 'U'}
                        </div>
                        <div style={{ fontWeight: 700 }}>{u.fullName}</div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>
                      {u.role === 'ROLE_ADMIN' ? (
                        <span className="badge badge-success" style={{ gap: '0.2rem' }}>
                          <Shield size={12} /> Administrator
                        </span>
                      ) : (
                        <span className="badge badge-info" style={{ gap: '0.2rem' }}>
                          <User size={12} /> Shopper
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
