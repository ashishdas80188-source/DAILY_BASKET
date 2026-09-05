import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  CheckCircle,
  XCircle,
  Layers,
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import ProductModal from '../../components/admin/ProductModal';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productService.getProducts({ size: 100 }),
        categoryService.getCategories(),
      ]);
      setProducts(prods.content || []);
      setCategories(cats || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        addToast('Product updated successfully!', 'success');
      } else {
        await productService.createProduct(productData);
        addToast('Product created successfully!', 'success');
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this grocery product?')) {
      try {
        await productService.deleteProduct(id);
        addToast('Product deleted', 'info');
        loadData();
      } catch (err) {
        addToast('Failed to delete product', 'error');
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !selectedCategory || String(p.categoryId) === String(selectedCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Product Inventory Management" />

        <div className="admin-content">
          {/* Action Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '540px' }}>
              <div className="search-input-box" style={{ flex: 1 }}>
                <Search size={16} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search products by name or brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-control"
                style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ gap: '0.4rem' }}
            >
              <Plus size={18} /> Add New Product
            </button>
          </div>

          {/* Products Table Card */}
          <div className="data-table-card">
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Packaging</th>
                    <th>MRP</th>
                    <th>Selling Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', backgroundColor: '#f8fafc' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{product.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{product.brand || 'DailyBasket'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                          {product.categoryName || 'General'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{product.unit}</td>
                      <td style={{ color: '#94a3b8', textDecoration: 'line-through' }}>
                        ₹{product.originalPrice}
                      </td>
                      <td style={{ fontWeight: 800, color: '#10b981' }}>
                        ₹{product.discountPrice}
                      </td>
                      <td>
                        <span style={{
                          fontWeight: 700,
                          color: product.stockQuantity <= 15 ? '#b91c1c' : '#0f172a',
                        }}>
                          {product.stockQuantity} units
                        </span>
                      </td>
                      <td>
                        {product.inStock && product.stockQuantity > 0 ? (
                          <span className="badge badge-success" style={{ gap: '0.2rem' }}>
                            <CheckCircle size={12} /> Available
                          </span>
                        ) : (
                          <span className="badge badge-danger" style={{ gap: '0.2rem' }}>
                            <XCircle size={12} /> Out of Stock
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setIsModalOpen(true);
                            }}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '0.35rem 0.6rem' }}
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '0.35rem 0.6rem', color: '#ef4444' }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Product Add/Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
      />
    </div>
  );
};

export default AdminProducts;
