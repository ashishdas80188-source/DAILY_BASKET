import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';

const Hero = () => {
  return (
    <section className="container">
      <div className="hero-section">
        {/* Left Content */}
        <div className="hero-content">
          <div className="hero-pill">
            <Zap size={15} color="#10b981" />
            <span>EXPRESS 15-MIN GROCERY DELIVERY</span>
          </div>

          <h1 className="hero-headline">
            Fresh groceries.<br />
            Delivered to your door.
          </h1>

          <p className="hero-supporting-text">
            Everything you need for your everyday life, harvested farm-fresh and delivered at lightning speed with unmatched quality.
          </p>

          <div className="hero-btn-group">
            <Link to="/products" className="btn btn-primary btn-lg" style={{ gap: '0.6rem' }}>
              SHOP NOW <ArrowRight size={18} />
            </Link>
            <Link
              to="/products?deal=true"
              className="btn btn-lg"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(6px)',
              }}
            >
              ⚡ EXPLORE DEALS
            </Link>
          </div>

          {/* Mini Trust Badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: '0.825rem',
            color: '#a7f3d0',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} /> 100% Farm Fresh Quality
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} /> Contactless Instant Drop
            </div>
          </div>
        </div>

        {/* Right Grocery Visual Artwork */}
        <div className="hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
            alt="Fresh Groceries Basket"
            className="hero-grocery-img"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
