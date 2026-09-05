import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import ProductCard from '../product/ProductCard';

const DealsSection = ({ deals = [] }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num) => String(num).padStart(2, '0');

  return (
    <section className="container" style={{ margin: '3.5rem auto' }}>
      <div style={{
        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
        border: '1.5px solid #fde68a',
        borderRadius: '20px',
        padding: '2rem',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <Flame size={18} /> LIMITED TIME PROMOTIONS
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#78350f', marginTop: '0.2rem' }}>
              Today's Super Deals
            </h2>
          </div>

          {/* Countdown Clock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#92400e', fontWeight: 700, fontSize: '0.85rem' }}>
              <Clock size={16} /> Ends in:
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ backgroundColor: '#78350f', color: '#ffffff', fontWeight: 800, padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.9rem' }}>
                {formatDigit(timeLeft.hours)}h
              </span>
              <span style={{ backgroundColor: '#78350f', color: '#ffffff', fontWeight: 800, padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.9rem' }}>
                {formatDigit(timeLeft.minutes)}m
              </span>
              <span style={{ backgroundColor: '#78350f', color: '#ffffff', fontWeight: 800, padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.9rem' }}>
                {formatDigit(timeLeft.seconds)}s
              </span>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="product-grid">
          {deals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
