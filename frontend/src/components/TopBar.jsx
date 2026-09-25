import React, { useState, useEffect } from 'react';
import { SearchIcon, BellIcon, MenuIcon, UserIcon, BotIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export default function TopBar({ businessName, onSearch, setMobileOpen, onOpenProfile, onOpenAi }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Fetch live business alerts
    api.getAlerts()
      .then(data => {
        if (data && Array.isArray(data)) {
          setAlerts(data);
        }
      })
      .catch(() => {
        // Fallback default alerts
        setAlerts([
          { id: 1, title: 'Basmati Rice Low Stock', message: 'Current stock is 6 units, below reorder level (10).', severity: 'WARNING' },
          { id: 2, title: 'GST GSTR-3B Reminder', message: 'Monthly return filing is due on 20th of the month.', severity: 'INFO' }
        ]);
      });
  }, []);

  const unreadAlerts = alerts.filter(a => !a.read);

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
        >
          <MenuIcon size={22} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            {businessName || 'Lakshmi Enterprise'}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Digital Business Partner
          </span>
        </div>
      </div>

      <div className="topbar-search">
        <SearchIcon size={16} />
        <input
          type="text"
          placeholder="Quick search across records..."
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>

      <div className="topbar-right">
        {/* Language Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <select
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            className="form-select"
            style={{
              padding: '0.35rem 0.6rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              width: 'auto',
              cursor: 'pointer',
              background: 'var(--bg-subtle)'
            }}
            title="Switch Language (23 Languages)"
          >
            {availableLanguages.map(l => (
              <option key={l.code} value={l.code}>
                {l.native} ({l.name})
              </option>
            ))}
          </select>
        </div>

        {/* Theme Toggle Button */}
        <button
          className="topbar-icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* AI Assistant Button */}
        <button
          className="btn btn-sm btn-primary"
          onClick={onOpenAi}
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem' }}
          title="Open AI Business Assistant"
        >
          <BotIcon size={16} />
          <span>AI Assist</span>
        </button>

        {/* Alerts & Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            className="topbar-icon-btn"
            onClick={() => setShowNotifications(prev => !prev)}
            title="Business Alerts"
          >
            <BellIcon size={20} />
            {unreadAlerts.length > 0 && <span className="topbar-badge-dot" />}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '320px',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '1rem',
                zIndex: 100
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Business Alerts</span>
                <span className="badge badge-primary">{alerts.length} Active</span>
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-main)',
                      borderBottom: '1px solid var(--border-color)',
                      padding: '0.5rem 0'
                    }}
                  >
                    <div style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span>{alert.title}</span>
                      <span className={`badge ${alert.severity === 'CRITICAL' ? 'badge-danger' : alert.severity === 'WARNING' ? 'badge-warning' : 'badge-primary'}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {alert.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="topbar-profile" onClick={onOpenProfile} title="Business Profile">
          <div className="profile-avatar">
            <UserIcon size={18} />
          </div>
          <div className="profile-info">
            <span className="profile-name">Owner Portal</span>
            <span className="profile-role">MSME Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
