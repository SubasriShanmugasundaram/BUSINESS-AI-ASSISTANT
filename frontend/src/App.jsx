import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import AiAssistantModal from './components/AiAssistantModal';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import ExpensesPage from './pages/ExpensesPage';
import GstPage from './pages/GstPage';
import SalesPage from './pages/SalesPage';
import SalesHistoryPage from './pages/SalesHistoryPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { BotIcon } from './components/Icons';
import './styles/index.css';
import './styles/components.css';

function MainApp() {
  const { currentUser, logout } = useAuth();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Business Information
  const [businessInfo, setBusinessInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('msme_business_info');
      return saved ? JSON.parse(saved) : {
        businessName: 'Lakshmi Enterprise',
        name: 'Lakshmi Enterprise',
        tagline: 'Wholesale & Retail Commercial Trading',
        phone: '+91 9876543210',
        email: 'contact@lakshmi.in',
        gstin: '29ABCDE1234F1Z5',
        address: '102 Market Road, Bengaluru - 560001'
      };
    } catch {
      return {
        businessName: 'Lakshmi Enterprise',
        name: 'Lakshmi Enterprise',
        tagline: 'Wholesale & Retail Commercial Trading',
        phone: '+91 9876543210',
        email: 'contact@lakshmi.in',
        gstin: '29ABCDE1234F1Z5',
        address: '102 Market Road, Bengaluru - 560001'
      };
    }
  });

  // Toast Notification Queue
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Keyboard shortcut to open AI Assistant: Ctrl+Space or Alt+A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.code === 'Space')) {
        e.preventDefault();
        setIsAiModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!currentUser) {
    return <LoginPage onLogin={() => showToast('Welcome to BizPartner AI!', 'success')} />;
  }

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={logout}
        onOpenAi={() => setIsAiModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <TopBar
          businessName={businessInfo.businessName || businessInfo.name}
          onSearch={(query) => setGlobalSearch(query)}
          setMobileOpen={setMobileOpen}
          onOpenProfile={() => setActiveTab('settings')}
          onOpenAi={() => setIsAiModalOpen(true)}
        />

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'dashboard' && (
            <DashboardPage
              setActiveTab={setActiveTab}
              businessInfo={businessInfo}
              showToast={showToast}
              onOpenAiModal={() => setIsAiModalOpen(true)}
            />
          )}

          {activeTab === 'sales' && (
            <SalesPage
              showToast={showToast}
              setActiveTab={setActiveTab}
              businessInfo={businessInfo}
            />
          )}

          {activeTab === 'history' && (
            <SalesHistoryPage
              showToast={showToast}
              businessInfo={businessInfo}
              globalSearch={globalSearch}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryPage
              showToast={showToast}
            />
          )}

          {activeTab === 'products' && (
            <ProductsPage
              showToast={showToast}
              globalSearch={globalSearch}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersPage
              showToast={showToast}
              globalSearch={globalSearch}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesPage
              showToast={showToast}
            />
          )}

          {activeTab === 'gst' && (
            <GstPage
              showToast={showToast}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsPage
              showToast={showToast}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              businessInfo={businessInfo}
              setBusinessInfo={setBusinessInfo}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Floating AI Assistant Floating Action Button */}
      <button
        className="floating-ai-fab"
        onClick={() => setIsAiModalOpen(true)}
        title="Open BizPartner AI Business Assistant (Alt+A)"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-accent-contrast)',
          border: 'none',
          boxShadow: 'var(--shadow-lg), 0 0 20px var(--color-accent-soft)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 90,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <BotIcon size={26} />
      </button>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Floating Toast Notification Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span>
              {toast.type === 'success' && '✓ '}
              {toast.type === 'error' && '✕ '}
              {toast.type === 'info' && 'ℹ '}
              {toast.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d1117',
          color: '#ffffff',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#fcec4d' }}>BizPartner AI Workspace</h2>
          <p style={{ color: '#8b949e', maxWidth: '520px', marginBottom: '2rem', lineHeight: 1.6 }}>
            The application encountered a display refresh requirement. Click below to clear stored cache and load cleanly:
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                background: '#fcec4d',
                color: '#000000',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Reset Session & Reload
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <MainApp />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
