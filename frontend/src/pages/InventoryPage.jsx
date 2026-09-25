import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import {
  ProductsIcon,
  SearchIcon,
  RefreshIcon,
  PlusIcon,
  EyeIcon,
  CheckIcon
} from '../components/Icons';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function InventoryPage({ showToast }) {
  const { t } = useLanguage();
  const [inventoryList, setInventoryList] = useState([]);
  const [summary, setSummary] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'movements'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Stock Adjustment Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustData, setAdjustData] = useState({
    operationType: 'RESTOCK', // RESTOCK, REMOVE, ADJUST, UPDATE_SETTINGS
    quantity: 10,
    reorderLevel: 10,
    reason: 'Routine Restock Order',
    referenceId: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invData, sumData, movData] = await Promise.all([
        statusFilter === 'LOW_STOCK'
          ? api.getLowStockInventory()
          : statusFilter === 'OUT_OF_STOCK'
          ? api.getOutOfStockInventory()
          : api.getInventory(),
        api.request ? api.request('/inventory/summary') : Promise.resolve(null),
        api.getStockMovements()
      ]);

      setInventoryList(invData || []);
      if (sumData) setSummary(sumData);
      setMovements(movData || []);
    } catch (err) {
      console.error(err);
      showToast('Error loading inventory data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleOpenAdjust = (item, opType = 'RESTOCK') => {
    setSelectedItem(item);
    setAdjustData({
      operationType: opType,
      quantity: 10,
      reorderLevel: item.reorderLevel || 10,
      reason: opType === 'RESTOCK' ? 'Supplier Shipment Restock' : 'Inventory Correction / Count',
      referenceId: 'ADJ-' + Date.now().toString().slice(-5)
    });
    setIsAdjustModalOpen(true);
  };

  const handleSaveAdjustment = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const payload = {
        productId: selectedItem.productId,
        operationType: adjustData.operationType,
        quantity: parseInt(adjustData.quantity, 10),
        reorderLevel: parseInt(adjustData.reorderLevel, 10),
        reason: adjustData.reason,
        referenceId: adjustData.referenceId
      };

      await api.request('/inventory/adjust', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      showToast(`Stock updated for ${selectedItem.productName}!`, 'success');
      setIsAdjustModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to adjust stock', 'error');
    }
  };

  const filteredInventory = inventoryList.filter(item => {
    const q = search.toLowerCase();
    const matchesSearch =
      (item.productName && item.productName.toLowerCase().includes(q)) ||
      (item.sku && item.sku.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Inventory & Stock Control</h1>
          <p className="page-subtitle">
            Real-time multi-item stock levels, automated stock deduction, reorder warnings, and audit movements.
          </p>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary" onClick={fetchData} title="Refresh Stock">
            <RefreshIcon size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-label">Total Stocked Value</div>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>
            ₹{summary ? Number(summary.totalInventoryValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'}
          </div>
          <div className="stat-caption">Warehouse cost basis</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total In-Stock Units</div>
          <div className="stat-value" style={{ color: 'var(--text-main)' }}>
            {summary ? Number(summary.totalStockUnits || 0).toLocaleString('en-IN') : '—'} units
          </div>
          <div className="stat-caption">Across all SKUs</div>
        </div>

        <div className="stat-card" style={{ borderColor: (summary?.lowStockCount || 0) > 0 ? 'var(--warning)' : 'inherit' }}>
          <div className="stat-label">Low Stock Alerts</div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>
            {summary ? summary.lowStockCount : '0'}
          </div>
          <div className="stat-caption">Needs reorder soon</div>
        </div>

        <div className="stat-card" style={{ borderColor: (summary?.outOfStockCount || 0) > 0 ? 'var(--danger)' : 'inherit' }}>
          <div className="stat-label">Out of Stock</div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>
            {summary ? summary.outOfStockCount : '0'}
          </div>
          <div className="stat-caption">Urgent restocking required</div>
        </div>
      </div>

      {/* Tabs: Catalog vs Audit Trail */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          className={`btn ${activeTab === 'catalog' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('catalog')}
        >
          Stock Inventory Catalog
        </button>
        <button
          className={`btn ${activeTab === 'movements' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('movements')}
        >
          Stock Movement Log ({movements.length})
        </button>
      </div>

      {activeTab === 'catalog' && (
        <>
          {/* Filters Bar */}
          <div className="filter-toolbar">
            <div className="search-input-wrapper">
              <SearchIcon size={16} />
              <input
                type="text"
                className="form-control"
                placeholder="Search stock by SKU, product name, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-actions">
              <select
                className="form-select"
                style={{ width: 'auto' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Stock Statuses</option>
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock (Alert)</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>

              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Showing <strong>{filteredInventory.length}</strong> items
              </span>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="table-container">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Unit Cost</th>
                    <th style={{ textAlign: 'right' }}>Current Stock</th>
                    <th style={{ textAlign: 'right' }}>Reorder Level</th>
                    <th style={{ textAlign: 'center' }}>Stock Status</th>
                    <th style={{ textAlign: 'right' }}>Total Value</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((item) => {
                      const cost = Number(item.purchasePrice || 0);
                      const current = Number(item.currentStock || 0);
                      const val = Number(item.totalValue || cost * current);
                      const isLow = item.status === 'LOW_STOCK';
                      const isOut = item.status === 'OUT_OF_STOCK';

                      return (
                        <tr key={item.id || item.productId}>
                          <td style={{ fontWeight: 600, color: 'var(--text-subtle)' }}>
                            {item.sku || `PRD-${String(item.productId).padStart(4, '0')}`}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                              {item.productName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Last Restocked: {item.lastRestockedAt ? new Date(item.lastRestockedAt).toLocaleDateString() : 'Initial Setup'}
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-primary">{item.category}</span>
                          </td>
                          <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                            ₹{cost.toFixed(2)}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '0.95rem' }}>
                            <span style={{ color: isOut ? 'var(--danger)' : isLow ? 'var(--warning)' : 'inherit' }}>
                              {current} units
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                            {item.reorderLevel} units
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span
                              className={`badge ${
                                isOut
                                  ? 'badge-danger'
                                  : isLow
                                  ? 'badge-warning'
                                  : 'badge-success'
                              }`}
                            >
                              {item.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>
                            ₹{val.toFixed(2)}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleOpenAdjust(item, 'RESTOCK')}
                                title="Restock Purchase"
                              >
                                + Restock
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => handleOpenAdjust(item, 'ADJUST')}
                                title="Manual Stock Audit"
                              >
                                Adjust
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="table-empty-state">
                        <ProductsIcon size={36} />
                        <p>No inventory records matching your selection.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'movements' && (
        <div className="table-container">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Quantity</th>
                  <th>Reference</th>
                  <th>Reason / Notes</th>
                </tr>
              </thead>
              <tbody>
                {movements.length > 0 ? (
                  movements.map((mov) => {
                    const isPositive = Number(mov.quantity) > 0;
                    return (
                      <tr key={mov.id}>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {mov.movementDate || '—'}
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {mov.productName}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              mov.movementType === 'Purchase'
                                ? 'badge-success'
                                : mov.movementType === 'Sale'
                                ? 'badge-primary'
                                : 'badge-secondary'
                            }`}
                          >
                            {mov.movementType}
                          </span>
                        </td>
                        <td
                          style={{
                            textAlign: 'right',
                            fontWeight: 700,
                            color: isPositive ? 'var(--success)' : 'var(--danger)'
                          }}
                        >
                          {isPositive ? `+${mov.quantity}` : mov.quantity} units
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                          {mov.referenceId || '—'}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {mov.reason || '—'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="table-empty-state">
                      <p>No stock movement audit records logged yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title={`Adjust Stock — ${selectedItem?.productName || ''}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAdjustModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveAdjustment}>
              <CheckIcon size={16} /> Confirm Stock Update
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveAdjustment}>
          <div style={{ background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Current Stock: <strong>{selectedItem?.currentStock || 0} units</strong></span>
              <span>Reorder Threshold: <strong>{selectedItem?.reorderLevel || 10} units</strong></span>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Operation Type <span className="required">*</span></label>
              <select
                className="form-select"
                value={adjustData.operationType}
                onChange={(e) => setAdjustData({ ...adjustData, operationType: e.target.value })}
              >
                <option value="RESTOCK">Purchase Restock (Add Units)</option>
                <option value="REMOVE">Remove Damaged/Expired</option>
                <option value="ADJUST">Exact Physical Count Override</option>
                <option value="UPDATE_SETTINGS">Update Reorder Level Only</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                {adjustData.operationType === 'ADJUST'
                  ? 'New Exact Physical Stock'
                  : 'Units to Add/Remove'}{' '}
                <span className="required">*</span>
              </label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={adjustData.quantity}
                onChange={(e) => setAdjustData({ ...adjustData, quantity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Reorder Alert Threshold</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={adjustData.reorderLevel}
                onChange={(e) => setAdjustData({ ...adjustData, reorderLevel: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Reference # / PO / Invoice</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. PO-2026-88"
                value={adjustData.referenceId}
                onChange={(e) => setAdjustData({ ...adjustData, referenceId: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Reason / Audit Log Note <span className="required">*</span></label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Supplier delivery received from APMC"
              value={adjustData.reason}
              onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
