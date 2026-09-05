import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronRight, X, Sparkles } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilterSidebar from '../components/product/ProductFilterSidebar';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters State
  const categoryParam = searchParams.get('category');
  const queryParam = searchParams.get('query') || '';
  const dealParam = searchParams.get('deal');

  const [selectedCategory, setSelectedCategory] = useState(categoryParam ? Number(categoryParam) : null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 600 });
  const [selectedRating, setSelectedRating] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('id');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(Number(categoryParam));
    } else {
      setSelectedCategory(null);
    }
  }, [categoryParam]);

  // Load Categories
  useEffect(() => {
    categoryService.getCategories().then((res) => setCategories(res || []));
  }, []);

  // Fetch Products based on all active filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          categoryId: selectedCategory,
          query: queryParam,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          inStock: inStockOnly ? true : undefined,
          minRating: selectedRating,
          sortBy: sortBy,
          size: 24,
        };

        if (dealParam === 'true') {
          const dealList = await productService.getDealsOfTheDay();
          setProducts(dealList || []);
          setTotalCount(dealList?.length || 0);
        } else {
          const data = await productService.getProducts(params);
          setProducts(data.content || []);
          setTotalCount(data.totalElements || data.content?.length || 0);
        }
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, queryParam, dealParam, priceRange, selectedRating, inStockOnly, sortBy]);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    if (catId) {
      searchParams.set('category', catId);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setPriceRange({ min: 0, max: 600 });
    setSelectedRating(null);
    setInStockOnly(false);
    setSortBy('id');
    setSearchParams({});
  };

  const currentCategoryName = categories.find((c) => c.id === selectedCategory)?.name;

  return (
    <div className="container" style={{ padding: '1.5rem 1.25rem 4rem' }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
        <Link to="/" style={{ color: '#64748b' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/products" style={{ color: selectedCategory ? '#64748b' : '#0f172a', fontWeight: selectedCategory ? 500 : 700 }}>
          Groceries
        </Link>
        {currentCategoryName && (
          <>
            <ChevronRight size={14} />
            <span style={{ color: '#0f172a', fontWeight: 700 }}>{currentCategoryName}</span>
          </>
        )}
      </div>

      {/* Page Header Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {queryParam ? `Search: "${queryParam}"` : dealParam ? "Today's Hot Deals" : currentCategoryName || "All Grocery Products"}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Showing <strong>{products.length}</strong> of <strong>{totalCount}</strong> grocery essentials
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn btn-outline btn-sm mobile-filter-btn"
            onClick={() => setIsMobileFilterOpen(true)}
            style={{ display: 'none', gap: '0.4rem' }}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem', fontWeight: 600 }}
            >
              <option value="id">Featured & Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills */}
      {(queryParam || selectedCategory || inStockOnly || selectedRating) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {queryParam && (
            <span className="badge badge-info" style={{ gap: '0.4rem', padding: '0.35rem 0.75rem', textTransform: 'none' }}>
              Query: "{queryParam}"
              <X size={14} style={{ cursor: 'pointer' }} onClick={() => { searchParams.delete('query'); setSearchParams(searchParams); }} />
            </span>
          )}
          {currentCategoryName && (
            <span className="badge badge-success" style={{ gap: '0.4rem', padding: '0.35rem 0.75rem', textTransform: 'none' }}>
              Category: {currentCategoryName}
              <X size={14} style={{ cursor: 'pointer' }} onClick={() => handleSelectCategory(null)} />
            </span>
          )}
          {inStockOnly && (
            <span className="badge badge-warning" style={{ gap: '0.4rem', padding: '0.35rem 0.75rem', textTransform: 'none' }}>
              In Stock Only
              <X size={14} style={{ cursor: 'pointer' }} onClick={() => setInStockOnly(false)} />
            </span>
          )}
          {selectedRating && (
            <span className="badge badge-discount" style={{ gap: '0.4rem', padding: '0.35rem 0.75rem', textTransform: 'none' }}>
              Rating: {selectedRating}★ & above
              <X size={14} style={{ cursor: 'pointer' }} onClick={() => setSelectedRating(null)} />
            </span>
          )}
        </div>
      )}

      {/* Layout Grid: Sidebar + Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.75rem', alignItems: 'start' }}>
        {/* Desktop Filter Sidebar */}
        <ProductFilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          priceRange={priceRange}
          onChangePriceRange={setPriceRange}
          selectedRating={selectedRating}
          onSelectRating={setSelectedRating}
          inStockOnly={inStockOnly}
          onToggleInStock={setInStockOnly}
          onResetFilters={handleResetFilters}
          isOpenOnMobile={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        {/* Product Grid */}
        <div>
          <ProductGrid
            products={products}
            loading={loading}
            emptyMessage="No groceries match your selected filters. Try broadening your search or resetting filters."
          />
        </div>
      </div>
    </div>
  );
};

export default Products;
