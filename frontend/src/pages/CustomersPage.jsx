import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  CustomersIcon,
  RefreshIcon
} from '../components/Icons';
import { api } from '../services/api';

export default function CustomersPage({ showToast, globalSearch = '' }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState(globalSearch);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Active Customer for edit/view/delete
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (globalSearch) setSearch(globalSearch);
  }, [globalSearch]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await api.getCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Customer name is required';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s]{7,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Enter a valid phone number (e.g. 9876543210)';
    }
    if (formData.email && formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Enter a valid email address';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setCurrentCustomer(null);
    setFormData({ name: '', phone: '', email: '', address: '' });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (cust) => {
    setCurrentCustomer(cust);
    setFormData({
      name: cust.name || '',
      phone: cust.phone || '',
      email: cust.email || '',
      address: cust.address || ''
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open View Modal
  const handleOpenView = (cust) => {
    setCurrentCustomer(cust);
    setIsViewModalOpen(true);
  };

  // Open Delete Confirmation
  const handleOpenDelete = (cust) => {
    setCurrentCustomer(cust);
    setIsDeleteModalOpen(true);
  };

  // Save Customer (Add or Edit)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (currentCustomer) {
        await api.updateCustomer(currentCustomer.id, formData);
        showToast('Customer updated successfully!', 'success');
      } else {
        await api.createCustomer(formData);
        showToast('New customer added successfully!', 'success');
      }
      setIsFormModalOpen(false);
      fetchCustomers();
    } catch (err) {
      showToast(err.message || 'Error saving customer', 'error');
    }
  };

  // Delete Customer
  const handleDelete = async () => {
    try {
      await api.deleteCustomer(currentCustomer.id);
      showToast('Customer removed from records', 'success');
      setIsDeleteModalOpen(false);
      fetchCustomers();
    } catch (err) {
      showToast(err.message || 'Error deleting customer', 'error');
    }
  };

  // Filtered List
  const filteredCustomers = customers.filter(c => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.address?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Customer Directory
          </h1>
          <p className="page-subtitle">
            Manage your client contacts, wholesale buyers, and commercial accounts.
          </p>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary" onClick={fetchCustomers} title="Refresh">
            <RefreshIcon size={16} />
          </button>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <PlusIcon size={16} /> Add Customer
          </button>
        </div>
      </div>

      {/* Toolbar Filter */}
      <div className="filter-toolbar">
        <div className="search-input-wrapper">
          <SearchIcon size={16} />
          <input
            type="text"
            className="form-control"
            placeholder="Search customer by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredCustomers.length}</strong> of {customers.length} customers
        </div>
      </div>

      {/* Customers Data Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Address</th>
                <th>Date Added</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-subtle)' }}>
                      CUST-{String(cust.id).padStart(4, '0')}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {cust.name}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>
                        {cust.phone}
                      </span>
                    </td>
                    <td>
                      {cust.email ? (
                        <a href={`mailto:${cust.email}`}>{cust.email}</a>
                      ) : (
                        <span style={{ color: 'var(--text-subtle)' }}>—</span>
                      )}
                    </td>
                    <td style={{ maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cust.address || '—'}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {cust.createdAt ? cust.createdAt.split(' ')[0] : '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleOpenView(cust)}
                          title="View Customer"
                        >
                          <EyeIcon size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleOpenEdit(cust)}
                          title="Edit Customer"
                        >
                          <EditIcon size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger-outline"
                          onClick={() => handleOpenDelete(cust)}
                          title="Delete Customer"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="table-empty-state">
                    <CustomersIcon size={36} />
                    <p>No customers match your search criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={currentCustomer ? 'Edit Customer' : 'Add New Customer'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              {currentCustomer ? 'Update Customer' : 'Save Customer'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>
              Customer / Business Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Ananya Boutique"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {formErrors.name && <div className="form-error-msg">{formErrors.name}</div>}
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>
                Phone Number <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {formErrors.phone && <div className="form-error-msg">{formErrors.phone}</div>}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="e.g. contact@business.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {formErrors.email && <div className="form-error-msg">{formErrors.email}</div>}
            </div>
          </div>

          <div className="form-group">
            <label>Billing & Delivery Address</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Street name, landmark, area, city, pincode..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* View Customer Details Modal */}
      {currentCustomer && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`Customer: ${currentCustomer.name}`}
          footer={
            <button className="btn btn-primary" onClick={() => setIsViewModalOpen(false)}>
              Done
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Customer ID:</span>
              <strong>CUST-{String(currentCustomer.id).padStart(4, '0')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
              <strong>{currentCustomer.phone}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Email:</span>
              <strong>{currentCustomer.email || 'Not provided'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Address:</span>
              <strong style={{ maxWidth: '60%', textAlign: 'right' }}>{currentCustomer.address || 'Not provided'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Account Created:</span>
              <span>{currentCustomer.createdAt || 'N/A'}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {currentCustomer && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Delete Customer"
          maxWidth="440px"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete Customer
              </button>
            </>
          }
        >
          <p>
            Are you sure you want to remove <strong>{currentCustomer.name}</strong> from your customer records?
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            This action cannot be undone if there are no linked active sales orders.
          </p>
        </Modal>
      )}
    </div>
  );
}
