import React, { useState, useEffect } from 'react';
import { Warehouse, Plus, Minus, Check, AlertTriangle, Search } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const { addToast } = useToast();

  const loadProducts = async () => {
    try {
      const res = await productService.getProducts({ size: 100 });
      setProducts(res.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAdjustStock = async (productId, delta) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    const newQty = Math.max(0, target.stockQuantity + delta);
    try {
      await productService.updateProduct(productId, {
        ...target,
        stockQuantity: newQty,
        inStock: newQty > 0,
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stockQuantity: newQty, inStock: newQty > 0 } : p))
      );
      addToast(`Updated ${target.name} stock to ${newQty} units`, 'success', 1800);
    } catch (err) {
      addToast('Failed to adjust stock', 'error');
    }
  };

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.categoryName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Inventory & Stock Replenishment" />

        <div className="admin-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="search-input-box" style={{ maxWidth: '400px', flex: 1 }}>
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Filter items for stock count..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} /> Low Stock &le; 10 units
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', marginLeft: '0.5rem' }} /> Healthy Stock
            </div>
          </div>

          <div className="data-table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Stock Quantity</th>
                  <th>Status</th>
                  <th>Quick Restock (+/-)</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                        <div style={{ fontWeight: 700 }}>{item.name}</div>
                      </div>
                    </td>
                    <td>{item.categoryName}</td>
                    <td>{item.unit}</td>
                    <td>
                      <span style={{
                        fontWeight: 800,
                        fontSize: '1rem',
                        color: item.stockQuantity <= 10 ? '#ef4444' : '#0f172a',
                      }}>
                        {item.stockQuantity} units
                      </span>
                    </td>
                    <td>
                      {item.stockQuantity <= 10 ? (
                        <span className="badge badge-danger">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">In Stock</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          onClick={() => handleAdjustStock(item.id, -5)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="Reduce 5 units"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleAdjustStock(item.id, -1)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.25rem 0.5rem' }}
                          title="Reduce 1 unit"
                        >
                          <Minus size={12} />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(item.id, 1)}
                          className="btn btn-outline-primary btn-sm"
                          style={{ padding: '0.25rem 0.5rem' }}
                          title="Add 1 unit"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(item.id, 20)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 700 }}
                          title="Add 20 batch units"
                        >
                          +20
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
  );
};

export default AdminInventory;
