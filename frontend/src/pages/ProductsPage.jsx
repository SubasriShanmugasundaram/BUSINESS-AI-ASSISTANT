import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  ProductsIcon,
  RefreshIcon
} from '../components/Icons';
import { api } from '../services/api';

const CATEGORIES = [
  'All Categories',
  'Groceries',
  'Electronics',
  'Textiles',
  'Stationery',
  'Hardware',
  'FMCG',
  'Other'
];

export default function ProductsPage({ showToast, globalSearch = '' }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(globalSearch);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Current Item
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Groceries',
    sellingPrice: '',
    purchasePrice: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (globalSearch) setSearch(globalSearch);
  }, [globalSearch]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }
    const sellPrice = parseFloat(formData.sellingPrice);
    if (isNaN(sellPrice) || sellPrice <= 0) {
      errors.sellingPrice = 'Selling price must be greater than 0';
    }
    const purchPrice = parseFloat(formData.purchasePrice);
    if (formData.purchasePrice !== '' && (isNaN(purchPrice) || purchPrice < 0)) {
      errors.purchasePrice = 'Purchase price cannot be negative';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setCurrentProduct(null);
    setFormData({
      name: '',
      category: 'Groceries',
      sellingPrice: '',
      purchasePrice: '',
      description: ''
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setCurrentProduct(prod);
    setFormData({
      name: prod.name || '',
      category: prod.category || 'Groceries',
      sellingPrice: prod.sellingPrice || '',
      purchasePrice: prod.purchasePrice || '',
      description: prod.description || ''
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenView = (prod) => {
    setCurrentProduct(prod);
    setIsViewModalOpen(true);
  };

  const handleOpenDelete = (prod) => {
    setCurrentProduct(prod);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (currentProduct) {
        await api.updateProduct(currentProduct.id, formData);
        showToast('Product updated successfully!', 'success');
      } else {
        await api.createProduct(formData);
        showToast('New product added to catalog!', 'success');
      }
      setIsFormModalOpen(false);
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Error saving product', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteProduct(currentProduct.id);
      showToast('Product removed from catalog', 'success');
      setIsDeleteModalOpen(false);
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Error deleting product', 'error');
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q);
    const matchesCategory =
      selectedCategory === 'All Categories' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Product Catalog
          </h1>
          <p className="page-subtitle">
            Configure items, pricing structures, categories, and future inventory links.
          </p>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary" onClick={fetchProducts} title="Refresh">
            <RefreshIcon size={16} />
          </button>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <PlusIcon size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-toolbar">
        <div className="search-input-wrapper">
          <SearchIcon size={16} />
          <input
            type="text"
            className="form-control"
            placeholder="Search products by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-actions">
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredProducts.length}</strong> items
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Selling Price</th>
                <th style={{ textAlign: 'right' }}>Cost Price</th>
                <th style={{ textAlign: 'right' }}>Margin</th>
                <th>Added Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => {
                  const sell = Number(prod.sellingPrice || 0);
                  const cost = Number(prod.purchasePrice || 0);
                  const margin = sell > 0 ? (((sell - cost) / sell) * 100).toFixed(0) : 0;

                  return (
                    <tr key={prod.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-subtle)' }}>
                        PROD-{String(prod.id).padStart(4, '0')}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {prod.name}
                        </div>
                        {prod.description && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prod.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-primary">{prod.category}</span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>
                        ₹{sell.toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                        ₹{cost.toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`badge ${margin > 25 ? 'badge-success' : 'badge-secondary'}`}>
                          {margin}%
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {prod.createdAt ? prod.createdAt.split(' ')[0] : '—'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleOpenView(prod)}
                            title="View Details"
                          >
                            <EyeIcon size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleOpenEdit(prod)}
                            title="Edit Product"
                          >
                            <EditIcon size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-danger-outline"
                            onClick={() => handleOpenDelete(prod)}
                            title="Delete Product"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="table-empty-state">
                    <ProductsIcon size={36} />
                    <p>No products found matching the criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={currentProduct ? 'Edit Product' : 'Add New Product'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              {currentProduct ? 'Update Product' : 'Save Product'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>
              Product Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Premium Basmati Rice 5kg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {formErrors.name && <div className="form-error-msg">{formErrors.name}</div>}
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label>
                Category <span className="required">*</span>
              </label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.filter(c => c !== 'All Categories').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                Selling Price (₹) <span className="required">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="550.00"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
              />
              {formErrors.sellingPrice && <div className="form-error-msg">{formErrors.sellingPrice}</div>}
            </div>

            <div className="form-group">
              <label>Purchase Price (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="420.00"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
              />
              {formErrors.purchasePrice && <div className="form-error-msg">{formErrors.purchasePrice}</div>}
            </div>
          </div>

          <div className="form-group">
            <label>Description & Specifications</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Unit size, brand details, packaging, shelf life notes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* View Product Modal */}
      {currentProduct && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`Product Details: ${currentProduct.name}`}
          footer={
            <button className="btn btn-primary" onClick={() => setIsViewModalOpen(false)}>
              Done
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Product ID:</span>
              <strong>PROD-{String(currentProduct.id).padStart(4, '0')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Category:</span>
              <span className="badge badge-primary">{currentProduct.category}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Selling Price:</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>₹{Number(currentProduct.sellingPrice).toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Purchase / Cost Price:</span>
              <strong>₹{Number(currentProduct.purchasePrice || 0).toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Margin:</span>
              <strong style={{ color: 'var(--success)' }}>
                ₹{(Number(currentProduct.sellingPrice) - Number(currentProduct.purchasePrice || 0)).toFixed(2)}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Description:</span>
              <span style={{ maxWidth: '60%', textAlign: 'right' }}>{currentProduct.description || 'No description provided'}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {currentProduct && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Delete Product"
          maxWidth="440px"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete Product
              </button>
            </>
          }
        >
          <p>
            Are you sure you want to remove <strong>{currentProduct.name}</strong> from catalog?
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Note: Existing historical sales records will retain this item name.
          </p>
        </Modal>
      )}
    </div>
  );
}
