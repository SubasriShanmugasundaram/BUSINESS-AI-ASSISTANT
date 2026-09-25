import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import SaleDetailModal from '../components/SaleDetailModal';
import {
  SearchIcon,
  FilterIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  PrinterIcon,
  RefreshIcon
} from '../components/Icons';
import { api } from '../services/api';

export default function SalesHistoryPage({ showToast, businessInfo, globalSearch = '' }) {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(globalSearch);
  const [filterCustomer, setFilterCustomer] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Modals
  const [selectedSale, setSelectedSale] = useState(null);
  const [editSale, setEditSale] = useState(null);
  const [deleteSale, setDeleteSale] = useState(null);

  useEffect(() => {
    if (globalSearch) setSearch(globalSearch);
  }, [globalSearch]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const [salesData, custData] = await Promise.all([
        api.getSales(),
        api.getCustomers()
      ]);
      setSales(salesData || []);
      setCustomers(custData || []);
    } catch (err) {
      showToast('Failed to load sales history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const handleUpdateSale = async (e) => {
    e.preventDefault();
    try {
      await api.updateSale(editSale.id, {
        paymentMethod: editSale.paymentMethod,
        notes: editSale.notes,
        status: editSale.status
      });
      showToast('Sale record updated', 'success');
      setEditSale(null);
      fetchSalesData();
    } catch (err) {
      showToast('Failed to update sale record', 'error');
    }
  };

  const handleDeleteSale = async () => {
    try {
      await api.deleteSale(deleteSale.id);
      showToast('Sale record deleted successfully', 'success');
      setDeleteSale(null);
      fetchSalesData();
    } catch (err) {
      showToast('Failed to delete sale record', 'error');
    }
  };

  // Filter Sales
  const filteredSales = sales.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch =
      s.saleNumber?.toLowerCase().includes(q) ||
      s.customerName?.toLowerCase().includes(q) ||
      s.paymentMethod?.toLowerCase().includes(q) ||
      s.items?.some(i => i.productName?.toLowerCase().includes(q));

    const matchesCustomer =
      filterCustomer === 'All' || String(s.customerId) === String(filterCustomer);

    const matchesPayment =
      filterPayment === 'All' || s.paymentMethod === filterPayment;

    const saleDateStr = s.saleDate || s.createdAt?.split(' ')[0] || '';
    const matchesDateFrom = !filterDateFrom || saleDateStr >= filterDateFrom;
    const matchesDateTo = !filterDateTo || saleDateStr <= filterDateTo;

    return matchesSearch && matchesCustomer && matchesPayment && matchesDateFrom && matchesDateTo;
  });

  const totalFilteredAmount = filteredSales.reduce((sum, s) => sum + Number(s.totalAmount), 0);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Sales History & Invoices
          </h1>
          <p className="page-subtitle">
            Search, filter, view printable receipts, or manage past sales records.
          </p>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary" onClick={fetchSalesData} title="Refresh">
            <RefreshIcon size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-toolbar" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-input-wrapper">
            <SearchIcon size={16} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by invoice number, customer name, product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '160px' }}
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
          >
            <option value="All">All Customers</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '140px' }}
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
          >
            <option value="All">All Payments</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Date Range:</span>
            <input
              type="date"
              className="form-control"
              style={{ width: 'auto', padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
            <span>to</span>
            <input
              type="date"
              className="form-control"
              style={{ width: 'auto', padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
            {(filterDateFrom || filterDateTo || filterCustomer !== 'All' || filterPayment !== 'All') && (
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setFilterCustomer('All');
                  setFilterPayment('All');
                  setFilterDateFrom('');
                  setFilterDateTo('');
                  setSearch('');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          <div style={{ fontSize: '0.85rem' }}>
            Found <strong>{filteredSales.length}</strong> sales • Total: <strong style={{ color: 'var(--primary)' }}>₹{totalFilteredAmount.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Sales History Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sale ID / Invoice</th>
                <th>Customer Name</th>
                <th>Items</th>
                <th style={{ textAlign: 'right' }}>Total Amount</th>
                <th>Payment</th>
                <th>Sale Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => {
                  const itemCount = sale.items ? sale.items.reduce((s, i) => s + i.quantity, 0) : 1;
                  return (
                    <tr key={sale.id}>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        {sale.saleNumber || `#${sale.id}`}
                      </td>
                      <td>
                        <strong>{sale.customerName || 'Walk-in Customer'}</strong>
                      </td>
                      <td>
                        <span className="badge badge-secondary">{itemCount} items</span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-main)' }}>
                        ₹{Number(sale.totalAmount).toFixed(2)}
                      </td>
                      <td>
                        <span className="badge badge-primary">{sale.paymentMethod}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {sale.saleDate || sale.createdAt?.split(' ')[0]}
                      </td>
                      <td>
                        <span className="badge badge-success">{sale.status || 'Completed'}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setSelectedSale(sale)}
                            title="View Printable Invoice"
                          >
                            <EyeIcon size={14} /> View
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditSale(sale)}
                            title="Edit Record"
                          >
                            <EditIcon size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-danger-outline"
                            onClick={() => setDeleteSale(sale)}
                            title="Delete Record"
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
                    <p>No sales history matches the selected filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Printable Invoice Modal */}
      {selectedSale && (
        <SaleDetailModal
          isOpen={!!selectedSale}
          onClose={() => setSelectedSale(null)}
          sale={selectedSale}
          businessInfo={businessInfo}
        />
      )}

      {/* Edit Sale Modal */}
      {editSale && (
        <Modal
          isOpen={!!editSale}
          onClose={() => setEditSale(null)}
          title={`Edit Sale Record - ${editSale.saleNumber || '#' + editSale.id}`}
          maxWidth="480px"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setEditSale(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdateSale}>
                Save Changes
              </button>
            </>
          }
        >
          <form onSubmit={handleUpdateSale}>
            <div className="form-group">
              <label>Customer:</label>
              <input type="text" className="form-control" value={editSale.customerName} disabled />
            </div>
            <div className="form-group">
              <label>Total Amount:</label>
              <input type="text" className="form-control" value={`₹${Number(editSale.totalAmount).toFixed(2)}`} disabled />
            </div>
            <div className="form-group">
              <label>Payment Method:</label>
              <select
                className="form-select"
                value={editSale.paymentMethod}
                onChange={(e) => setEditSale({ ...editSale, paymentMethod: e.target.value })}
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select
                className="form-select"
                value={editSale.status || 'Completed'}
                onChange={(e) => setEditSale({ ...editSale, status: e.target.value })}
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="form-group">
              <label>Notes:</label>
              <textarea
                className="form-control"
                rows="2"
                value={editSale.notes || ''}
                onChange={(e) => setEditSale({ ...editSale, notes: e.target.value })}
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteSale && (
        <Modal
          isOpen={!!deleteSale}
          onClose={() => setDeleteSale(null)}
          title="Delete Sale Transaction"
          maxWidth="440px"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setDeleteSale(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteSale}>
                Confirm Delete
              </button>
            </>
          }
        >
          <p>
            Are you sure you want to permanently delete sale{' '}
            <strong>{deleteSale.saleNumber || `#${deleteSale.id}`}</strong>?
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '0.5rem' }}>
            Warning: This will remove the transaction from dashboard sales figures and reports.
          </p>
        </Modal>
      )}
    </div>
  );
}
