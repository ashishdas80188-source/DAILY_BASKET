import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Warehouse,
  ArrowLeft,
  ShoppingBasket,
} from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Layers size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Warehouse size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div style={{
          backgroundColor: '#10b981',
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
        }}>
          <ShoppingBasket size={20} />
        </div>
        <span>DAILY<span style={{ color: '#10b981' }}>BASKET</span> Admin</span>
      </div>

      <nav className="admin-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid #1e293b' }}>
        <Link
          to="/"
          className="btn btn-outline btn-block btn-sm"
          style={{
            borderColor: '#334155',
            color: '#94a3b8',
            gap: '0.4rem',
            backgroundColor: 'transparent',
          }}
        >
          <ArrowLeft size={16} /> Back to Store
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
