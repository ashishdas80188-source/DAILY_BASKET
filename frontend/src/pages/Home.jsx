import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Hero from '../components/home/Hero';
import CategoryGrid from '../components/home/CategoryGrid';
import DealsSection from '../components/home/DealsSection';
import ValueProps from '../components/home/ValueProps';
import Newsletter from '../components/home/Newsletter';
import ProductGrid from '../components/product/ProductGrid';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [dairyProducts, setDairyProducts] = useState([]);
  const [fruitsVegProducts, setFruitsVegProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [cats, dealItems, featItems, dairyItems, vegItems] = await Promise.all([
          categoryService.getCategories(),
          productService.getDealsOfTheDay(),
          productService.getFeaturedProducts(),
          productService.getProductsByCategory(2), // Dairy & Breakfast
          productService.getProductsByCategory(1), // Fruits & Veg
        ]);

        setCategories(cats || []);
        setDeals(dealItems || []);
        setFeatured(featItems || []);
        setDairyProducts(dairyItems || []);
        setFruitsVegProducts(vegItems || []);
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div>
      {/* 1. Hero Banner */}
      <Hero />

      {/* 2. Categories Grid */}
      <CategoryGrid categories={categories} />

      {/* 3. Today's Super Deals */}
      <DealsSection deals={deals} />

      {/* 4. Popular / Featured Products */}
      <section className="container" style={{ margin: '3.5rem auto' }}>
        <div className="section-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <Sparkles size={16} /> POPULAR CHOICES
            </div>
            <h2 className="section-title">Trending Daily Essentials</h2>
            <p className="section-subtitle">Most loved groceries ordered by our customers this week</p>
          </div>
          <Link to="/products" className="view-all-link">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <ProductGrid products={featured.slice(0, 8)} loading={loading} />
      </section>

      {/* 5. Fresh Fruits & Vegetables Showcase */}
      <section className="container" style={{ margin: '3.5rem auto' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Fresh Fruits & Vegetables</h2>
            <p className="section-subtitle">Harvested at dawn, delivered to your kitchen fresh</p>
          </div>
          <Link to="/products?category=1" className="view-all-link">
            See More Fresh Produce <ArrowRight size={16} />
          </Link>
        </div>
        <ProductGrid products={fruitsVegProducts.slice(0, 4)} loading={loading} />
      </section>

      {/* 6. Dairy & Breakfast Favorites */}
      <section className="container" style={{ margin: '3.5rem auto' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Dairy & Breakfast Staples</h2>
            <p className="section-subtitle">Fresh milk, creamy paneer, farm eggs & artisan breads</p>
          </div>
          <Link to="/products?category=2" className="view-all-link">
            Explore Breakfast Items <ArrowRight size={16} />
          </Link>
        </div>
        <ProductGrid products={dairyProducts.slice(0, 4)} loading={loading} />
      </section>

      {/* 7. Why Shop With Us (Value Props) */}
      <ValueProps />

      {/* 8. Newsletter */}
      <Newsletter />
    </div>
  );
};

export default Home;
