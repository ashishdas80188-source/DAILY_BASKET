import React from 'react';
import { Zap, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

const ValueProps = () => {
  const values = [
    {
      icon: <Zap size={28} color="#10b981" />,
      title: '15-30 Min Rapid Delivery',
      desc: 'Hyper-local fulfillment centers near your neighborhood ensure order arrives fresh and fast.',
    },
    {
      icon: <ShieldCheck size={28} color="#10b981" />,
      title: '100% Quality Guarantee',
      desc: 'If you are not satisfied with the freshness of any item, instant replacement or zero-questions refund.',
    },
    {
      icon: <Award size={28} color="#10b981" />,
      title: 'Direct Farm Harvests',
      desc: 'Sourced daily from verified organic farm partners without long cold-storage transit delays.',
    },
    {
      icon: <HeartHandshake size={28} color="#10b981" />,
      title: 'Best Everyday Wholesale Prices',
      desc: 'Unbeatable daily prices, combo bundle discounts, and free delivery thresholds for every family.',
    },
  ];

  return (
    <section className="container" style={{ margin: '4rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 className="section-title" style={{ justifyContent: 'center' }}>
          Why Millions Trust DailyBasket
        </h2>
        <p className="section-subtitle">Delivering joy, freshness, and convenience to 500,000+ happy households</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
      }}>
        {values.map((v, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              borderTop: '4px solid #10b981',
            }}
          >
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {v.icon}
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{v.title}</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ValueProps;
