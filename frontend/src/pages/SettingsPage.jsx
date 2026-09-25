import React, { useState, useEffect } from 'react';
import { SettingsIcon, CheckIcon, RefreshIcon } from '../components/Icons';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage({ businessInfo, setBusinessInfo, showToast }) {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    businessName: businessInfo?.name || businessInfo?.businessName || 'Lakshmi Enterprise',
    tagline: businessInfo?.tagline || 'Wholesale & Retail Commercial Trading',
    phone: businessInfo?.phone || '+91 9876543210',
    email: businessInfo?.email || 'contact@lakshmi.in',
    gstin: businessInfo?.gstin || '29ABCDE1234F1Z5',
    address: businessInfo?.address || '102 Market Road, Bengaluru - 560001'
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch profile from backend
    api.getBusinessProfile()
      .then(profile => {
        if (profile) {
          setFormData({
            businessName: profile.businessName || '',
            tagline: profile.tagline || '',
            phone: profile.phone || '',
            email: profile.email || '',
            gstin: profile.gstin || '',
            address: profile.address || ''
          });
          if (setBusinessInfo) {
            setBusinessInfo(profile);
          }
        }
      })
      .catch(err => {
        console.warn('Could not fetch backend business profile, using local state:', err.message);
      });
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateBusinessProfile(formData);
      if (setBusinessInfo) {
        setBusinessInfo(updated || formData);
      }
      localStorage.setItem('msme_business_info', JSON.stringify(updated || formData));
      showToast('Business profile updated successfully!', 'success');
    } catch (err) {
      // Fallback
      localStorage.setItem('msme_business_info', JSON.stringify(formData));
      if (setBusinessInfo) setBusinessInfo(formData);
      showToast('Business profile updated locally!', 'info');
    } finally {
      setSaving(false);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset sample records back to factory state (5 customers, 8 products, 10 sales)?')) {
      api.resetSampleData();
      showToast('Factory sample dataset restored successfully!', 'success');
      setTimeout(() => window.location.reload(), 600);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>System & Business Settings</h1>
          <p className="page-subtitle">
            Configure store identity, invoice headers, 23 Indian languages, theme preferences, and AI integrations.
          </p>
        </div>
      </div>

      <div className="grid-2">
        {/* Business Profile Details */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Store Profile & Invoice Header</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Printed on customer receipts & GST invoices</span>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label>Business / Enterprise Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Business Tagline / Nature of Trade</label>
              <input
                type="text"
                className="form-control"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Official Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Business Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>MSME Udyam / GSTIN Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Store / Warehouse Address</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              <CheckIcon size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Preferences & System Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Language & Accessibility */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Language & Regional Display</h3>
              <span className="badge badge-primary">23 Languages</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Full support for English + all 22 official Eighth Schedule Indian languages including Indian script and RTL support.
            </p>

            <div className="form-group">
              <label>Selected UI & Assistant Language</label>
              <select
                className="form-select"
                value={currentLanguage}
                onChange={(e) => {
                  changeLanguage(e.target.value);
                  showToast(`Language updated to ${e.target.selectedOptions[0].text}`, 'info');
                }}
              >
                {availableLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} — {lang.native} {lang.rtl ? '(RTL)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Theme & Display Mode */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Theme & Visual Appearance</h3>
              <span className="badge badge-secondary">{theme.toUpperCase()} MODE</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Toggle between modern SaaS Dark Mode and high-contrast Daylight Mode.
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => theme !== 'dark' && toggleTheme()}
              >
                🌙 Dark Mode
              </button>
              <button
                type="button"
                className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => theme !== 'light' && toggleTheme()}
              >
                ☀️ Light Mode
              </button>
            </div>
          </div>

          {/* User Account Info */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Active Owner Account</h3>
              <span className="badge badge-success">Authenticated</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div><strong>Name:</strong> {currentUser?.name || 'Administrator'}</div>
              <div><strong>Email:</strong> {currentUser?.email || 'admin@bizpartner.ai'}</div>
              <div><strong>Role:</strong> {currentUser?.role || 'ROLE_OWNER'}</div>
            </div>
          </div>

          {/* Factory Reset */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Data Maintenance</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Restore the factory demonstration dataset (5 customers, 8 products, 10 sales, 8 expenses).
            </p>
            <button className="btn btn-secondary" onClick={handleResetData}>
              <RefreshIcon size={16} /> Restore Factory Sample Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
