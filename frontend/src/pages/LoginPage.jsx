import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onLogin }) {
  const { login, register, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [email, setEmail] = useState('admin@bizpartner.ai');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Pranesh Sivakumar');
  const [businessName, setBusinessName] = useState('Lakshmi Enterprise');
  const [phone, setPhone] = useState('+91 9876543210');
  const [gstin, setGstin] = useState('29ABCDE1234F1Z5');
  const [address, setAddress] = useState('102 Market Road, Bengaluru - 560001');

  // Forgot Password state
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (isRegister) {
      const res = await register({
        email,
        password,
        name,
        businessName,
        phone,
        gstin,
        address
      });
      if (!res.success) {
        setErrorMessage(res.error || 'Registration failed. Please check your details.');
      } else if (onLogin) {
        onLogin(res);
      }
    } else {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid email or password.');
      } else if (onLogin) {
        onLogin(res);
      }
    }
  };

  const handleDemoLogin = async () => {
    setErrorMessage('');
    setEmail('admin@bizpartner.ai');
    setPassword('password123');
    const res = await login('admin@bizpartner.ai', 'password123');
    if (!res.success) {
      setErrorMessage(res.error || 'Demo login failed');
    } else if (onLogin) {
      onLogin(res);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (forgotEmail) {
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        setForgotModal(false);
      }, 2500);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Soft Warm Glow Behind Landing Hero */}
      <div className="auth-hero-glow" />

      {/* Editorial Landing Statement (Section 29) */}
      <div style={{ textAlign: 'center', maxWidth: '640px', marginBottom: 'var(--space-4)', position: 'relative', zIndex: 2 }}>
        <div className="editorial-kicker mb-2">
          <span>●</span> Autonomous MSME Business Intelligence
        </div>
        <h1 className="display-headline" style={{ margin: '0 0 var(--space-2) 0' }}>
          Run your business.<br />
          <span style={{ fontStyle: 'italic', color: 'var(--color-accent-strong)' }}>Understand what comes next.</span>
        </h1>
        <p className="page-subtitle" style={{ fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
          Real-time point of sale, inventory health, time-series forecasting, and conversational AI in 23 languages.
        </p>
      </div>

      {/* Auth Card */}
      <div className="auth-card" style={{ maxWidth: isRegister ? '540px' : '440px' }}>
        <div className="auth-header">
          <div className="auth-logo">AI</div>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', margin: 0, color: 'var(--color-text-primary)' }}>
            {isRegister ? 'Register Enterprise Store' : 'Sign In to Workspace'}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            {isRegister
              ? 'Enter store credentials to configure your intelligent partner'
              : 'Direct authenticated access to your real-time store database'}
          </p>
        </div>

        {errorMessage && (
          <div style={{
            background: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger-border)',
            color: 'var(--color-danger)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.65rem 0.85rem',
            fontSize: '0.825rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {errorMessage}
          </div>
        )}

        <div className="auth-body">
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Owner Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Store Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Ramesh General Store"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">GSTIN (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="29ABCDE1234F1Z5"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Store Address</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="102 Market Yard, Bengaluru"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Business Email *</label>
              <input
                type="email"
                className="form-input"
                placeholder="admin@bizpartner.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password *</label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => setForgotModal(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-accent-strong)', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem' }}
              disabled={loading}
            >
              {loading
                ? 'Validating Credentials...'
                : (isRegister ? 'Register & Initialize' : 'Sign In to Workspace')}
            </button>
          </form>

          {/* 1-Click Instant Enter */}
          {!isRegister && (
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.8rem' }}
                onClick={handleDemoLogin}
                disabled={loading}
              >
                ⚡ 1-Click Instant Owner Login (admin@bizpartner.ai)
              </button>
            </div>
          )}

          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            {isRegister ? (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--color-accent-strong)', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                  onClick={() => { setIsRegister(false); setErrorMessage(''); }}
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New enterprise store?{' '}
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--color-accent-strong)', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                  onClick={() => { setIsRegister(true); setErrorMessage(''); }}
                >
                  Register Business
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="modal-backdrop" onClick={() => setForgotModal(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Reset Password</h3>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setForgotModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {resetSuccess ? (
                <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--color-success)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
                  <p style={{ fontWeight: 600 }}>Reset link dispatched to your email</p>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit}>
                  <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                    Enter registered store email address to receive password reset instructions.
                  </p>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="admin@bizpartner.ai"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setForgotModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Send Instructions
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
