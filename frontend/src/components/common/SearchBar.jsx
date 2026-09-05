import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';

const SearchBar = ({ onSearch, placeholder = "Search for groceries, fruits, vegetables, dairy..." }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const results = await productService.getLiveSuggestions(query);
        setSuggestions(results || []);
      } catch (e) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Click outside to dismiss
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/products?query=${encodeURIComponent(query.trim())}`);
      if (onSearch) onSearch(query.trim());
    }
  };

  const handleSelectProduct = (product) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="nav-search-wrapper" ref={wrapperRef}>
      <form onSubmit={handleSearchSubmit} className="search-input-box">
        <Search size={18} color="#64748b" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}
          >
            <X size={16} />
          </button>
        )}
      </form>

      {isOpen && (suggestions.length > 0 || loading) && (
        <div className="search-suggestions-dropdown">
          <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Products Matching "{query}"
          </div>
          {suggestions.map((item) => (
            <div
              key={item.id}
              className="search-suggestion-item"
              onClick={() => handleSelectProduct(item)}
            >
              <img src={item.imageUrl} alt={item.name} className="search-suggestion-img" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {item.unit} • <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{item.discountPrice}</span>
                </div>
              </div>
              <ChevronRight size={16} color="#94a3b8" />
            </div>
          ))}
          <div
            onClick={handleSearchSubmit}
            style={{
              padding: '0.6rem',
              textAlign: 'center',
              borderTop: '1px solid #f1f5f9',
              fontSize: '0.825rem',
              fontWeight: 700,
              color: '#10b981',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
            }}
          >
            <TrendingUp size={14} /> See all results for "{query}"
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
