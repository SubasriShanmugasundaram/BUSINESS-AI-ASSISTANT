import React from 'react';
import {
  DashboardIcon,
  CustomersIcon,
  ProductsIcon,
  SalesIcon,
  HistoryIcon,
  ReportsIcon,
  SettingsIcon,
  LogOutIcon,
  BotIcon,
  InventoryIcon,
  ExpenseIcon,
  GstIcon
} from './Icons';

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen, onLogout, onOpenAi }) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: DashboardIcon },
    { id: 'history', label: 'Sales', icon: HistoryIcon },
    { id: 'sales', label: 'POS Counter', icon: SalesIcon },
    { id: 'products', label: 'Products', icon: ProductsIcon },
    { id: 'inventory', label: 'Inventory', icon: InventoryIcon },
    { id: 'customers', label: 'Customers', icon: CustomersIcon },
    { id: 'expenses', label: 'Expenses', icon: ExpenseIcon },
    { id: 'reports', label: 'Reports', icon: ReportsIcon },
    { id: 'gst', label: 'GST Compliance', icon: GstIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">AI</div>
          <div>
            <div className="sidebar-brand-title">BizPartner AI</div>
            <div className="sidebar-brand-subtitle">Business Intelligence</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Operations & Data</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="nav-section-label" style={{ marginTop: '0.75rem' }}>AI Intelligence</div>
          <button
            className="nav-item"
            onClick={onOpenAi}
            style={{
              color: 'var(--color-accent-strong)',
              background: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border-subtle)'
            }}
          >
            <BotIcon size={17} />
            <span>AI Assistant</span>
          </button>
        </nav>

        {/* AI Assistant Quick Launcher */}
        <div style={{ padding: '0.75rem 1rem' }}>
          <button
            className="btn btn-primary"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem 0.75rem',
              fontSize: '0.84rem'
            }}
            onClick={onOpenAi}
          >
            <BotIcon size={17} />
            <span>Ask Business Partner</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-module-badge" style={{ marginBottom: '0.75rem' }}>
            <span className="dot" />
            <span>Live Data Sync</span>
          </div>
          <button
            className="nav-item"
            style={{ color: 'var(--color-danger)', padding: '0.5rem 0.75rem' }}
            onClick={onLogout}
          >
            <LogOutIcon size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
