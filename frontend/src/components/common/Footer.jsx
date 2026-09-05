import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin, Heart, ShieldCheck, Truck, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', borderTop: '1px solid #1e293b', marginTop: '4rem' }}>
      {/* Top Value Strip */}
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={24} />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>Superfast 15-30 Min Delivery</div>
              <div style={{ fontSize: '0.8rem' }}>Direct from our hyper-local dark stores</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>100% Quality Guaranteed</div>
              <div style={{ fontSize: '0.8rem' }}>Farm fresh veggies & certified staples</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>Open Daily 6 AM - 11 PM</div>
              <div style={{ fontSize: '0.8rem' }}>Fresh mornings & late evening snacks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '3.5rem 1.25rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Brand Info */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 800, fontSize: '1.35rem', marginBottom: '1rem' }}>
              <div style={{ background: '#10b981', borderRadius: '8px', padding: '6px', display: 'flex' }}>
                <ShoppingBag size={20} color="#fff" />
              </div>
              <span>DAILY<span style={{ color: '#10b981' }}>BASKET</span></span>
            </Link>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Your neighborhood daily grocery store delivered straight to your door with unmatched freshness, honest prices, and instant fulfillment.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="#10b981" /> +91 (800) 456-7890
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} color="#10b981" /> support@dailybasket.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={15} color="#10b981" /> Bengaluru, Karnataka 560034
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li><Link to="/products" style={{ color: '#94a3b8' }}>Browse All Groceries</Link></li>
              <li><Link to="/products?deal=true" style={{ color: '#94a3b8' }}>Today's Hot Deals</Link></li>
              <li><Link to="/profile" style={{ color: '#94a3b8' }}>My Account</Link></li>
              <li><Link to="/orders" style={{ color: '#94a3b8' }}>Order Tracking</Link></li>
              <li><Link to="/admin" style={{ color: '#94a3b8' }}>Admin Portal</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Customer Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li><a href="#help" style={{ color: '#94a3b8' }}>Help & FAQ Center</a></li>
              <li><a href="#delivery" style={{ color: '#94a3b8' }}>Delivery Information</a></li>
              <li><a href="#refunds" style={{ color: '#94a3b8' }}>Returns & Refund Policy</a></li>
              <li><a href="#terms" style={{ color: '#94a3b8' }}>Terms of Service</a></li>
              <li><a href="#privacy" style={{ color: '#94a3b8' }}>Privacy Policy</a></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Top Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li><Link to="/products?category=1" style={{ color: '#94a3b8' }}>Fresh Fruits & Veg</Link></li>
              <li><Link to="/products?category=2" style={{ color: '#94a3b8' }}>Dairy & Breakfast</Link></li>
              <li><Link to="/products?category=3" style={{ color: '#94a3b8' }}>Rice, Dal & Grains</Link></li>
              <li><Link to="/products?category=4" style={{ color: '#94a3b8' }}>Atta, Flour & Oils</Link></li>
              <li><Link to="/products?category=5" style={{ color: '#94a3b8' }}>Snacks & Munchies</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.825rem'
        }}>
          <div>
            © 2026 <strong>DAILYBASKET</strong> Technologies Inc. All rights reserved. Built with React & Spring Boot.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Secure 256-Bit SSL Checkout</span>
            <span style={{ backgroundColor: '#1e293b', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#10b981', fontWeight: 700 }}>UPI / Cards / COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
