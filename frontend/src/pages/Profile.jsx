import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  Package,
  Heart,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Save,
  Key,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';

const Profile = () => {
  const { user, updateUser, logout, isAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('personal');
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
  });
  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    streetAddress: '',
    landmark: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '',
    addressType: 'HOME',
    isDefault: false,
  });

  useEffect(() => {
    if (user) {
      setProfileForm((prev) => ({
        ...prev,
        fullName: user.fullName || '',
        phone: user.phone || '',
      }));
    }

    authService.getAddresses().then((res) => setAddresses(res || []));
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await authService.updateProfile(profileForm);
      updateUser(updated);
      addToast('Profile updated successfully!', 'success');
      setProfileForm((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const saved = await authService.addAddress(newAddress);
      setAddresses((prev) => [...prev, saved]);
      setIsAddingAddress(false);
      setNewAddress({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        streetAddress: '',
        landmark: '',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '',
        addressType: 'HOME',
        isDefault: false,
      });
      addToast('Address added to your address book!', 'success');
    } catch (err) {
      addToast('Failed to add address', 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await authService.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      addToast('Address removed', 'info');
    } catch (err) {
      addToast('Failed to delete address', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem', maxWidth: '1020px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Account & Settings</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage your profile details, address book, and security settings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Side Navigation Menu */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>{user?.fullName || 'My Account'}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{user?.email}</div>
            {isAdmin && <span className="badge badge-success" style={{ marginTop: '0.4rem' }}>Admin Account</span>}
          </div>

          <button
            onClick={() => setActiveTab('personal')}
            className={`btn ${activeTab === 'personal' ? 'btn-primary' : 'btn-outline'}`}
            style={{ justifyContent: 'flex-start', border: 'none', borderRadius: '10px', padding: '0.75rem 1rem' }}
          >
            <User size={18} /> Personal Info
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`btn ${activeTab === 'addresses' ? 'btn-primary' : 'btn-outline'}`}
            style={{ justifyContent: 'flex-start', border: 'none', borderRadius: '10px', padding: '0.75rem 1rem' }}
          >
            <MapPin size={18} /> Saved Addresses
          </button>

          <Link
            to="/orders"
            className="btn btn-outline"
            style={{ justifyContent: 'flex-start', border: 'none', borderRadius: '10px', padding: '0.75rem 1rem' }}
          >
            <Package size={18} /> My Orders
          </Link>

          <Link
            to="/wishlist"
            className="btn btn-outline"
            style={{ justifyContent: 'flex-start', border: 'none', borderRadius: '10px', padding: '0.75rem 1rem' }}
          >
            <Heart size={18} /> My Wishlist
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="btn btn-outline-primary"
              style={{ justifyContent: 'flex-start', borderRadius: '10px', padding: '0.75rem 1rem', marginTop: '0.5rem' }}
            >
              <ShieldAlert size={18} /> Admin Dashboard
            </Link>
          )}

          <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
            <button
              onClick={handleLogout}
              className="btn btn-block"
              style={{ justifyContent: 'flex-start', color: '#ef4444', backgroundColor: '#fee2e2', border: 'none', borderRadius: '10px', padding: '0.75rem 1rem' }}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Right Side: Tab Content */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '2rem' }}>
          {/* TAB 1: Personal Info */}
          {activeTab === 'personal' && (
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                Personal Information
              </h2>

              <form onSubmit={handleUpdateProfile}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address (Read-only)</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="form-control"
                      style={{ backgroundColor: '#f8fafc', cursor: 'not-allowed' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="form-control"
                    placeholder="+91 9876543210"
                  />
                </div>

                {/* Password Change Section */}
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Key size={18} color="#10b981" /> Change Password (Optional)
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        value={profileForm.currentPassword}
                        onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                        className="form-control"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        value={profileForm.newPassword}
                        onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                        className="form-control"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem', gap: '0.4rem' }}>
                  <Save size={18} /> Save Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Saved Addresses */}
          {activeTab === 'addresses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Saved Delivery Addresses</h2>
                {!isAddingAddress && (
                  <button onClick={() => setIsAddingAddress(true)} className="btn btn-primary btn-sm" style={{ gap: '0.3rem' }}>
                    <Plus size={16} /> Add Address
                  </button>
                )}
              </div>

              {isAddingAddress ? (
                <form onSubmit={handleAddAddress}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className="form-control"
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
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Street Address *</label>
                    <textarea
                      required
                      rows={2}
                      value={newAddress.streetAddress}
                      onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="form-control"
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
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary">Save Address</button>
                    <button type="button" onClick={() => setIsAddingAddress(false)} className="btn btn-outline">Cancel</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 800 }}>{addr.fullName}</span>
                          <span className="badge badge-info">{addr.addressType}</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                          {addr.streetAddress}, {addr.city} - <strong>{addr.pinCode}</strong>
                        </div>
                        <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '0.2rem' }}>
                          Phone: {addr.phone}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                        title="Delete Address"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
