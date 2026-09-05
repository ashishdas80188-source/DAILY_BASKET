import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  MapPin,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  Settings,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import SearchBar from './SearchBar';
import LocationModal from './LocationModal';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems, subtotal, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Bengaluru, Indiranagar');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const categoriesNav = [
    { name: 'All Products', path: '/products' },
    { name: 'Fruits & Veg', path: '/products?category=1' },
    { name: 'Dairy & Breakfast', path: '/products?category=2' },
    { name: 'Rice & Grains', path: '/products?category=3' },
    { name: 'Atta & Flour', path: '/products?category=4' },
    { name: 'Snacks & Munchies', path: '/products?category=5' },
    { name: 'Beverages', path: '/products?category=6' },
    { name: 'Household', path: '/products?category=7' },
  ];

  return (
    <header className="navbar-sticky">
      {/* Top Banner */}
      <div className="navbar-top-banner">
        <span>⚡ Superfast 15-30 Min Grocery Delivery • FREE Delivery on orders above ₹499! • Use code <strong>FRESH20</strong> for 20% OFF</span>
      </div>

      {/* Main Navbar */}
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" onClick={() => setIsMobileMenuOpen(false)}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            borderRadius: '12px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(16, 185, 129, 0.35)'
          }}>
            <ShoppingBag size={22} strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', fontSize: '1.4rem' }}>
            DAILY<span style={{ color: '#10b981' }}>BASKET</span>
          </span>
        </Link>

        {/* Deliver To Location Selector */}
        <button
          className="nav-location-btn"
          onClick={() => setIsLocationModalOpen(true)}
          title="Change delivery location"
        >
          <div style={{
            backgroundColor: '#ecfdf5',
            padding: '6px',
            borderRadius: '8px',
            color: '#10b981',
            display: 'flex'
          }}>
            <MapPin size={18} />
          </div>
          <div>
            <div className="nav-location-title">Deliver To</div>
            <div className="nav-location-val" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              {selectedLocation} <ChevronDown size={14} color="#64748b" />
            </div>
          </div>
        </button>

        {/* Center Search Bar */}
        <SearchBar />

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Admin Portal Shortcut if Admin */}
          {isAdmin && (
            <Link
              to="/admin"
              className="btn btn-sm btn-secondary"
              style={{ gap: '0.35rem', backgroundColor: '#0f172a', border: 'none' }}
            >
              <ShieldAlert size={15} color="#10b981" /> Admin
            </Link>
          )}

          {/* Account Dropdown */}
          <div style={{ position: 'relative' }}>
            {isAuthenticated ? (
              <div>
                <button
                  className="nav-action-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div style={{
                    backgroundColor: '#f1f5f9',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f172a'
                  }}>
                    <User size={16} />
                  </div>
                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.fullName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {isUserMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                      minWidth: '210px',
                      padding: '0.5rem',
                      zIndex: 120,
                    }}
                  >
                    <div style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{user.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#334155',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <User size={16} color="#64748b" /> My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#334155',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Package size={16} color="#64748b" /> Order History
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#334155',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Heart size={16} color="#64748b" /> My Wishlist
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#059669',
                          backgroundColor: '#ecfdf5',
                        }}
                      >
                        <ShieldAlert size={16} color="#059669" /> Admin Dashboard
                      </Link>
                    )}

                    <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.3rem', paddingTop: '0.3rem' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          width: '100%',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#ef4444',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <LogOut size={16} color="#ef4444" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline btn-sm" style={{ fontWeight: 700 }}>
                <User size={16} /> Login
              </Link>
            )}
          </div>

          {/* Wishlist Link */}
          <Link to="/wishlist" className="nav-action-btn" title="View Wishlist">
            <Heart size={20} />
            <span style={{ display: 'none' }}>Wishlist</span>
            {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
          </Link>

          {/* Cart Button with Count & Subtotal */}
          <button
            onClick={openDrawer}
            className="nav-action-btn cart-btn"
            title="Open Shopping Basket"
            style={{ fontWeight: 700 }}
          >
            <ShoppingCart size={20} color="#059669" />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
              <span style={{ fontSize: '0.75rem', color: '#065f46' }}>{totalItems} items</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>₹{subtotal.toFixed(0)}</span>
            </div>
            {totalItems > 0 && <span className="badge-count" style={{ marginLeft: '2px' }}>{totalItems}</span>}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#0f172a',
            }}
            className="mobile-nav-toggle"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Categories Horizontal Subnav */}
      <nav className="subnav">
        <div className="subnav-container">
          {categoriesNav.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.path}
              className={`subnav-link ${location.pathname + location.search === cat.path ? 'active' : ''}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />
    </header>
  );
};

export default Navbar;
