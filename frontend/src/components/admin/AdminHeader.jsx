import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, ShieldCheck, User } from 'lucide-react';

const AdminHeader = ({ title = "Dashboard Overview" }) => {
  const { user } = useAuth();

  return (
    <header className="admin-topbar">
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
          }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>
              {user?.fullName || 'Administrator'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Store Manager</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
