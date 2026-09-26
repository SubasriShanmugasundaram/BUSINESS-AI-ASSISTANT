import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import SaleDetailModal from '../components/SaleDetailModal';
import {
  PlusIcon,
  TrashIcon,
  PrinterIcon,
  CheckIcon,
  EyeIcon,
  UserIcon
} from '../components/Icons';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function SalesPage({ showToast, setActiveTab, businessInfo }) {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sale Header State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');

  // Line items state
  const [items, setItems] = useState([]);

  // Selected item row being added
  const [currentProductId, setCurrentProductId] = useState('');
  const [currentQty, setCurrentQty] = useState(1);
  const [currentPrice, setCurrentPrice] = useState('');

  // Quick Add Customer Modal
  const [isQuickCustomerOpen, setIsQuickCustomerOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({ name: '', phone: '', email: '', address: '' });

  // Post-sale completion modal
  const [completedSale, setCompletedSale] = useState(null);

  useEffect(() => {
    loadPrerequisites();
  }, []);

  const loadPrerequisites = async () => {
    try {
      setLoading(true);
      const [custList, prodList] = await Promise.all([
        api.getCustomers(),
        api.getProducts()
      ]);
      setCustomers(custList || []);
      setProducts(prodList || []);

      // Default to first customer if available
      if (custList && custList.length > 0 && !selectedCustomerId) {
        setSelectedCustomerId(custList[0].id);
      }
    } catch (err) {
      showToast('Failed to load initial sales catalog data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // When product dropdown changes, auto-fill price
  const handleProductSelect = (prodId) => {
    setCurrentProductId(prodId);
    if (!prodId) {
      setCurrentPrice('');
      return;
    }
    const found = products.find(p => String(p.id) === String(prodId));
    if (found) {
      setCurrentPrice(found.sellingPrice);
    }
  };

  // Add Item to sale
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!currentProductId) {
      showToast('Please select a product first', 'error');
      return;
    }
    const qty = parseInt(currentQty, 10);
    if (isNaN(qty) || qty <= 0) {
      showToast('Quantity must be at least 1', 'error');
      return;
    }
    const price = parseFloat(currentPrice);
    if (isNaN(price) || price <= 0) {
      showToast('Price must be greater than 0', 'error');
      return;
    }

    const prod = products.find(p => String(p.id) === String(currentProductId));
    const newItem = {
      productId: parseInt(currentProductId),
      productName: prod ? prod.name : 'Selected Item',
      category: prod ? prod.category : 'General',
      quantity: qty,
      sellingPrice: price,
      totalAmount: qty * price
    };

    setItems([...items, newItem]);
    // Reset picker
    setCurrentProductId('');
    setCurrentQty(1);
    setCurrentPrice('');
  };

  // Remove Item
  const handleRemoveItem = (index) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalAmount = subtotal; // Ready for taxes/discounts

  // Save Sale
  const handleSaveSale = async () => {
    if (!selectedCustomerId) {
      showToast('Please select a customer for this invoice', 'error');
      return;
    }
    if (items.length === 0) {
      showToast('Please add at least one product to the sale', 'error');
      return;
    }

    try {
      const payload = {
        customerId: selectedCustomerId,
        saleDate,
        paymentMethod,
        notes,
        items
      };

      const result = await api.createSale(payload);
      showToast(`Sale #${result.saleNumber || result.id} created successfully!`, 'success');
      setCompletedSale(result);

      // Reset form
      setItems([]);
      setNotes('');
    } catch (err) {
      showToast(err.message || 'Error recording sale transaction', 'error');
    }
  };

  // Handle Quick Add Customer
  const handleQuickAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomerData.name.trim() || !newCustomerData.phone.trim()) {
      showToast('Customer Name and Phone are required', 'error');
      return;
    }
    try {
      const created = await api.createCustomer(newCustomerData);
      setCustomers([...customers, created]);
      setSelectedCustomerId(created.id);
      setIsQuickCustomerOpen(false);
      setNewCustomerData({ name: '', phone: '', email: '', address: '' });
      showToast('Customer created and selected!', 'success');
    } catch (err) {
      showToast('Error saving new customer', 'error');
    }
  };

  const selectedCustomerObj = customers.find(c => String(c.id) === String(selectedCustomerId));

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            {t('Record New Sale')}
          </h1>
          <p className="page-subtitle">
            {t('Create multi-item customer invoices, compute taxes, and issue receipts.')}
          </p>
        </div>
      </div>

      <div className="sale-composer-grid">
        {/* Left Column: Line Items & Customer */}
        <div>
          {/* Customer & Transaction Info Card */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>{t('1. Customer & Date')}</h3>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => setIsQuickCustomerOpen(true)}
              >
                <PlusIcon size={14} /> {t('+ New Customer')}
              </button>
            </div>

            <div className="grid-2">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>{t('Select Customer')} <span className="required">*</span></label>
                <select
                  className="form-select"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                >
                  <option value="">-- {t('Select Customer')} --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
                {selectedCustomerObj && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    📍 {selectedCustomerObj.address || 'No registered address'}
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>{t('Sale / Invoice Date')} <span className="required">*</span></label>
                <input
                  type="date"
                  className="form-control"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Product Line Item Picker Card */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>{t('2. Add Products to Cart')}</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {t('Select item from catalog or customize rate')}
              </span>
            </div>

            {/* Picker Form */}
            <form onSubmit={handleAddItem} className="item-picker-bar">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.75rem' }}>{t('Product')}</label>
                <select
                  className="form-select"
                  value={currentProductId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                >
                  <option value="">-- {t('Select Product')} --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{Number(p.sellingPrice).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.75rem' }}>{t('Quantity')}</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={currentQty}
                  onChange={(e) => setCurrentQty(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.75rem' }}>{t('Unit Price (₹)')}</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="0.00"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ height: '38px' }}>
                <PlusIcon size={16} /> {t('Add Item')}
              </button>
            </form>

            {/* Added Items Table */}
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Price</th>
                    <th style={{ textAlign: 'center' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td style={{ fontWeight: 600 }}>{item.productName}</td>
                        <td><span className="badge badge-secondary">{item.category}</span></td>
                        <td style={{ textAlign: 'right' }}>₹{item.sellingPrice.toFixed(2)}</td>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{item.totalAmount.toFixed(2)}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger-outline"
                            onClick={() => handleRemoveItem(idx)}
                            title="Remove Line Item"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                        Cart is empty. Use the product picker above to add items to this sale.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div>
          <div className="card order-summary-card">
            <div className="card-header">
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{t('Billing Summary')}</h3>
              <span className="badge badge-primary">{items.length} {t('Items')}</span>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div className="summary-row">
                <span style={{ color: 'var(--text-muted)' }}>{t('Item Subtotal:')}</span>
                <span style={{ fontWeight: 600 }}>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span style={{ color: 'var(--text-muted)' }}>{t('Discounts:')}</span>
                <span>₹0.00</span>
              </div>
              <div className="summary-row">
                <span style={{ color: 'var(--text-muted)' }}>{t('GST (0%):')}</span>
                <span>₹0.00</span>
              </div>
              <div className="summary-row grand-total">
                <span>{t('Grand Total:')}</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="form-group">
              <label>{t('Payment Method')} <span className="required">*</span></label>
              <div className="payment-method-selector">
                {['UPI', 'Cash', 'Card', 'Other'].map(method => (
                  <button
                    key={method}
                    type="button"
                    className={`payment-pill ${paymentMethod === method ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method === 'UPI' && '⚡ '}
                    {method === 'Cash' && '💵 '}
                    {method === 'Card' && '💳 '}
                    {method === 'Other' && '🏦 '}
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>{t('Invoice Notes / PO Number')}</label>
              <input
                type="text"
                className="form-control"
                placeholder="Optional customer reference or note"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-success"
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', fontWeight: 600 }}
              onClick={handleSaveSale}
              disabled={items.length === 0}
            >
              <CheckIcon size={18} /> {t('Confirm & Save Sale')}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add Customer Modal */}
      <Modal
        isOpen={isQuickCustomerOpen}
        onClose={() => setIsQuickCustomerOpen(false)}
        title="Quick Add Customer"
        maxWidth="460px"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsQuickCustomerOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleQuickAddCustomer}>
              Create & Select
            </button>
          </>
        }
      >
        <form onSubmit={handleQuickAddCustomer}>
          <div className="form-group">
            <label>Customer Name <span className="required">*</span></label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Modern Retailers"
              value={newCustomerData.name}
              onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number <span className="required">*</span></label>
            <input
              type="text"
              className="form-control"
              placeholder="9876543210"
              value={newCustomerData.phone}
              onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="Area / City"
              value={newCustomerData.address}
              onChange={(e) => setNewCustomerData({ ...newCustomerData, address: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Sale Completion Receipt Modal */}
      {completedSale && (
        <SaleDetailModal
          isOpen={!!completedSale}
          onClose={() => setCompletedSale(null)}
          sale={completedSale}
          businessInfo={businessInfo}
        />
      )}
    </div>
  );
}
