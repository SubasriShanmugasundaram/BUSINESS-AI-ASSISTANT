import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function GstPage({ showToast }) {
  const { t } = useLanguage();
  const [gstSummary, setGstSummary] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    status: 'PENDING'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const summaryResp = await api.getGstSummary();
      const remindersResp = await api.getGstReminders();
      setGstSummary(summaryResp);
      setReminders(remindersResp || []);
    } catch (err) {
      showToast('Error loading GST compliance data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveReminder = async (e) => {
    e.preventDefault();
    try {
      await api.createGstReminder(formData);
      showToast('GST Reminder created successfully', 'success');
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        status: 'PENDING'
      });
      loadData();
    } catch (err) {
      showToast('Failed to create reminder', 'error');
    }
  };

  const handleToggleStatus = async (reminder) => {
    try {
      const newStatus = reminder.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      await api.updateGstReminder(reminder.id, { ...reminder, status: newStatus });
      showToast(`Reminder marked as ${newStatus}`, 'info');
      loadData();
    } catch (err) {
      showToast('Failed to update reminder', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this GST reminder?')) return;
    try {
      await api.deleteGstReminder(id);
      showToast('Reminder deleted', 'info');
      loadData();
    } catch (err) {
      showToast('Failed to delete reminder', 'error');
    }
  };

  if (loading && !gstSummary) {
    return <div className="page-container" style={{ padding: '2rem' }}><p>Loading GST and tax details...</p></div>;
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">GST Compliance & Tax Summary</h1>
          <p className="page-subtitle">Track taxable supplies, output GST liability, and statutory filing deadlines</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          + Add GST Reminder
        </button>
      </div>

      {/* Statutory Disclaimer */}
      <div style={{
        background: 'rgba(96, 127, 163, 0.1)',
        border: '1px solid rgba(96, 127, 163, 0.25)',
        padding: '0.85rem 1.25rem',
        borderRadius: '10px',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
        <div>
          <strong>Compliance Advisory:</strong> Computations reflect sales recorded in BizPartner AI under standard 18% GST rules. Consult your qualified GST practitioner or Chartered Accountant for final filings on gst.gov.in.
        </div>
      </div>

      {/* GST Summary KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="stat-card">
          <div className="stat-label">GSTIN / Tax ID</div>
          <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--color-accent-strong)' }}>
            {gstSummary?.gstin || 'Not Configured'}
          </div>
          <div className="stat-helper">Active MSME State Code: 29</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Taxable Sales (Net)</div>
          <div className="stat-value">₹{(gstSummary?.totalTaxableSales || 0).toLocaleString()}</div>
          <div className="stat-helper">Excludes GST component</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total GST Collected</div>
          <div className="stat-value" style={{ color: '#f89cb3' }}>
            ₹{(gstSummary?.totalGstCollected || 0).toLocaleString()}
          </div>
          <div className="stat-helper">Output Tax Liability</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">CGST (9%) + SGST (9%)</div>
          <div className="stat-value">
            ₹{(gstSummary?.totalCgst || 0).toLocaleString()} / ₹{(gstSummary?.totalSgst || 0).toLocaleString()}
          </div>
          <div className="stat-helper">Intra-State Supply Split</div>
        </div>
      </div>

      {/* GST Filing Calendar & Reminders */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Upcoming Compliance Deadlines & Reminders</h3>

        {reminders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No upcoming reminders. Click "+ Add GST Reminder" above to set deadline tracking.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {reminders.map(r => (
              <div
                key={r.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'var(--surface-color)',
                  border: '1px solid var(--border-color)',
                  opacity: r.status === 'COMPLETED' ? 0.6 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={r.status === 'COMPLETED'}
                    onChange={() => handleToggleStatus(r)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-accent)' }}
                  />
                  <div>
                    <h4 style={{
                      margin: 0,
                      fontSize: '0.98rem',
                      textDecoration: r.status === 'COMPLETED' ? 'line-through' : 'none'
                    }}>
                      {r.title}
                    </h4>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {r.description || 'Statutory filing reminder'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: r.status === 'COMPLETED' ? 'var(--color-text-muted)' : 'var(--color-accent-strong)' }}>
                      Due: {r.dueDate}
                    </div>
                    <span className={`badge ${r.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
                      {r.status}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '1.1rem'
                    }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 style={{ marginTop: 0 }}>Add GST Compliance Reminder</h3>
            <form onSubmit={handleSaveReminder}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Reminder Title *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. GSTR-3B Monthly Return"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="Details regarding return or invoice reconciliations"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Due Date *</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
