import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryGrid = ({ categories = [] }) => {
  return (
    <section className="container" style={{ margin: '3.5rem auto' }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Handpicked fresh daily essentials for your pantry</p>
        </div>
        <Link to="/products" className="view-all-link">
          All Categories <ArrowRight size={16} />
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: '1rem',
      }}>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.id}`}
            className="category-card"
          >
            <div className="category-img-box">
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="category-img"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=80";
                }}
              />
            </div>
            <div>
              <div className="category-title">{cat.name}</div>
              <div className="category-count">{cat.productCount || 6}+ items</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
