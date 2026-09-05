import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      addToast('Thank you for subscribing! Check your inbox for your 20% OFF discount coupon.', 'success');
      setEmail('');
    }
  };

  return (
    <section className="container" style={{ margin: '4rem auto 2rem' }}>
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        color: '#ffffff',
        borderRadius: '20px',
        padding: '3rem 2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        boxShadow: '0 10px 25px -5px rgba(6, 95, 70, 0.2)',
      }}>
        <div style={{ maxWidth: '500px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a7f3d0', fontWeight: 700, fontSize: '0.825rem', marginBottom: '0.5rem' }}>
            <Mail size={16} /> STAY UPDATED WITH FRESH DEALS
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, marginBottom: '0.5rem' }}>
            Get ₹150 OFF your first order
          </h2>
          <p style={{ color: '#d1fae5', fontSize: '0.95rem' }}>
            Join our grocery newsletter for weekly farmer harvest updates, seasonal fruits alerts, and exclusive weekend discount codes.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '440px', flexWrap: 'wrap' }}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"
            style={{
              flex: 1,
              minWidth: '220px',
              backgroundColor: '#ffffff',
              border: 'none',
              padding: '0.85rem 1rem',
            }}
          />
          <button type="submit" className="btn btn-secondary" style={{ backgroundColor: '#0f172a', border: 'none', padding: '0.85rem 1.5rem', gap: '0.4rem' }}>
            Subscribe <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
