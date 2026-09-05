import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import CategoryModal from '../../components/admin/CategoryModal';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { addToast } = useToast();

  const loadCategories = async () => {
    try {
      const list = await categoryService.getCategories();
      setCategories(list || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSaveCategory = async (catData) => {
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, catData);
        addToast('Category updated!', 'success');
      } else {
        await categoryService.createCategory(catData);
        addToast('Category created!', 'success');
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      loadCategories();
    } catch (err) {
      addToast('Failed to save category', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await categoryService.deleteCategory(id);
        addToast('Category deleted', 'info');
        loadCategories();
      } catch (err) {
        addToast('Failed to delete category', 'error');
      }
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Category Hierarchy & Departments" />

        <div className="admin-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Grocery Departments ({categories.length})</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Organize the store catalog into distinct shopper aisles</p>
            </div>
            <button
              onClick={() => {
                setEditingCategory(null);
                setIsModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ gap: '0.4rem' }}
            >
              <Plus size={18} /> Add Category
            </button>
          </div>

          <div className="data-table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Order Seq</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{cat.name}</td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{cat.slug}</td>
                    <td style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '300px' }}>{cat.description}</td>
                    <td style={{ fontWeight: 600 }}>{cat.displayOrder || 1}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsModalOpen(true);
                          }}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.6rem' }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.6rem', color: '#ef4444' }}
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

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </div>
  );
};

export default AdminCategories;
