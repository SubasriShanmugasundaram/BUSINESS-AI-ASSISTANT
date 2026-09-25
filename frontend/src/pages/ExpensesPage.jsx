import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  RefreshIcon,
  CheckIcon
} from '../components/Icons';
import { api } from '../services/api';

const EXPENSE_CATEGORIES = [
  'All Categories',
  'Rent',
  'Salary',
  'Electricity',
  'Purchase',
  'Transportation',
  'Marketing',
  'Maintenance',
  'Other'
];

const PAYMENT_METHODS = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Other'];

export default function ExpensesPage({ showToast }) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Rent',
    amount: '',
    paymentMethod: 'UPI',
    expenseDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Net Profit stats
  const [dashboardStats, setDashboardStats] = useState(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const [expList, expSum, stats] = await Promise.all([
        api.request ? api.request(`/expenses?category=${categoryFilter === 'All Categories' ? '' : categoryFilter}&startDate=${startDate}&endDate=${endDate}&search=${encodeURIComponent(search)}`) : api.getExpenses(),
        api.request ? api.request('/expenses/summary') : Promise.resolve(null),
        api.getDashboardStats().catch(() => null)
      ]);

      setExpenses(expList || []);
      if (expSum) setSummary(expSum);
      if (stats) setDashboardStats(stats);
    } catch (err) {
      console.error(err);
      showToast('Error loading expenses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [categoryFilter, startDate, endDate]);

  const handleOpenAdd = () => {
    setSelectedExpense(null);
    setFormData({
      title: '',
      category: 'Rent',
      amount: '',
      paymentMethod: 'UPI',
      expenseDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setSelectedExpense(exp);
    setFormData({
      title: exp.title || '',
      category: exp.category || 'Rent',
      amount: exp.amount || '',
      paymentMethod: exp.paymentMethod || 'UPI',
      expenseDate: exp.expenseDate || new Date().toISOString().split('T')[0],
      notes: exp.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (exp) => {
    setSelectedExpense(exp);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || Number(formData.amount) <= 0) {
      showToast('Please enter a valid title and positive amount', 'error');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.title,
        category: formData.category,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        expenseDate: formData.expenseDate,
        notes: formData.notes
      };

      if (selectedExpense) {
        await api.updateExpense(selectedExpense.id, payload);
        showToast('Expense updated successfully!', 'success');
      } else {
        await api.createExpense(payload);
        showToast('Expense recorded successfully!', 'success');
      }

      setIsModalOpen(false);
      fetchExpenses();
    } catch (err) {
      showToast(err.message || 'Error saving expense', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedExpense) return;
    try {
      await api.deleteExpense(selectedExpense.id);
      showToast('Expense removed', 'success');
      setIsDeleteModalOpen(false);
      fetchExpenses();
    } catch (err) {
      showToast(err.message || 'Error deleting expense', 'error');
    }
  };

  const totalFilteredExpense = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalRevenue = Number(dashboardStats?.totalRevenue || 0);
  const totalSystemExpenses = Number(dashboardStats?.totalExpenses || summary?.totalExpenses || totalFilteredExpense);
  const netProfit = totalRevenue - totalSystemExpenses;

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Expense Management & Cost Control</h1>
          <p className="page-subtitle">
            Track operational store outlays (Rent, Salary, Utilities) and calculate real-time Net Business Profit.
          </p>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary" onClick={fetchExpenses} title="Refresh">
            <RefreshIcon size={16} />
          </button>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <PlusIcon size={16} /> Record Expense
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-label">Total Store Expenses</div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>
            ₹{totalSystemExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="stat-caption">All recorded expenditures</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Gross Sales Revenue</div>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>
            ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="stat-caption">From POS & customer orders</div>
        </div>

        <div className="stat-card" style={{ borderColor: netProfit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
          <div className="stat-label">Net Operating Profit</div>
          <div className="stat-value" style={{ color: netProfit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            ₹{netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="stat-caption">Formula: Revenue - Operating Expenses</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Top Expense Category</div>
          <div className="stat-value" style={{ color: 'var(--text-main)', fontSize: '1.15rem' }}>
            {summary?.highestExpenseCategory || 'Rent'}
          </div>
          <div className="stat-caption">
            ₹{summary ? Number(summary.highestCategoryAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'}
          </div>
        </div>
      </div>

      {/* Category Breakdown Badges */}
      {summary?.expensesByCategory && Object.keys(summary.expensesByCategory).length > 0 && (
        <div className="card" style={{ marginBottom: '1rem', padding: '0.85rem 1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            EXPENDITURE BREAKDOWN BY CATEGORY
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {Object.entries(summary.expensesByCategory).map(([cat, amt]) => (
              <div
                key={cat}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.825rem',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: 600 }}>{cat}:</span>
                <span style={{ color: 'var(--danger)', fontWeight: 700 }}>
                  ₹{Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="filter-toolbar" style={{ flexWrap: 'wrap' }}>
        <div className="search-input-wrapper">
          <SearchIcon size={16} />
          <input
            type="text"
            className="form-control"
            placeholder="Search expense description or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchExpenses()}
          />
        </div>

        <div className="filter-actions" style={{ flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {EXPENSE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="date"
            className="form-control"
            style={{ width: 'auto' }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            title="Start Date"
          />

          <input
            type="date"
            className="form-control"
            style={{ width: 'auto' }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            title="End Date"
          />

          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong>{expenses.length}</strong> items (Total: ₹{totalFilteredExpense.toFixed(2)})
          </span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Expense Description</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th>Payment Mode</th>
                <th>Notes / Bill Ref</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length > 0 ? (
                expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {exp.expenseDate}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {exp.title}
                    </td>
                    <td>
                      <span className="badge badge-secondary">{exp.category}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--danger)', fontSize: '0.95rem' }}>
                      ₹{Number(exp.amount || 0).toFixed(2)}
                    </td>
                    <td>
                      <span className="badge badge-primary">{exp.paymentMethod || 'UPI'}</span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '250px' }}>
                      {exp.notes || '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleOpenEdit(exp)}
                          title="Edit"
                        >
                          <EditIcon size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger-outline"
                          onClick={() => handleOpenDelete(exp)}
                          title="Delete"
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
                    <p>No expense records found matching criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedExpense ? 'Edit Expense Record' : 'Record New Expense'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              <CheckIcon size={16} /> {selectedExpense ? 'Update Expense' : 'Save Expense'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Expense Title / Purpose <span className="required">*</span></label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Monthly Warehouse Rent for Sept"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Category <span className="required">*</span></label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {EXPENSE_CATEGORIES.filter(c => c !== 'All Categories').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount (₹) <span className="required">*</span></label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-control"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Payment Method</label>
              <select
                className="form-select"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date of Expense</label>
              <input
                type="date"
                className="form-control"
                value={formData.expenseDate}
                onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notes / Voucher / Bill Number</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="e.g. Receipt voucher #V-2026-90"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Expense Record"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Confirm Delete
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to delete the expense <strong>{selectedExpense?.title}</strong> for{' '}
          <strong>₹{selectedExpense?.amount}</strong>? This will automatically recalculate Net Profit.
        </p>
      </Modal>
    </div>
  );
}
