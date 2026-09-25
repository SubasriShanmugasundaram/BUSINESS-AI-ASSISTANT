import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('msme_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      localStorage.removeItem('msme_auth_user');
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('msme_auth_token') || null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const resp = await api.login(email, password);
      if (resp && resp.token) {
        localStorage.setItem('msme_auth_token', resp.token);
        localStorage.setItem('msme_auth_user', JSON.stringify({
          id: resp.id,
          name: resp.name,
          email: resp.email,
          role: resp.role,
          businessName: resp.businessProfile?.businessName || 'Lakshmi Enterprise'
        }));
        if (resp.businessProfile) {
          localStorage.setItem('msme_business_info', JSON.stringify(resp.businessProfile));
        }
        setToken(resp.token);
        setCurrentUser({
          id: resp.id,
          name: resp.name,
          email: resp.email,
          role: resp.role,
          businessName: resp.businessProfile?.businessName || 'Lakshmi Enterprise'
        });
        return { success: true };
      }
      throw new Error('Invalid server response');
    } catch (err) {
      // Local fallback for offline demo testing
      if (email === 'admin@bizpartner.ai' && password === 'password123') {
        const demoUser = {
          id: 1,
          name: 'Pranesh Sivakumar',
          email: 'admin@bizpartner.ai',
          role: 'ROLE_OWNER',
          businessName: 'Lakshmi Enterprise'
        };
        localStorage.setItem('msme_auth_token', 'demo-token-' + Date.now());
        localStorage.setItem('msme_auth_user', JSON.stringify(demoUser));
        setToken('demo-token-' + Date.now());
        setCurrentUser(demoUser);
        return { success: true };
      }
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const resp = await api.register(data);
      if (resp && resp.token) {
        localStorage.setItem('msme_auth_token', resp.token);
        localStorage.setItem('msme_auth_user', JSON.stringify({
          id: resp.id,
          name: resp.name,
          email: resp.email,
          role: resp.role,
          businessName: data.businessName || 'My Business'
        }));
        setToken(resp.token);
        setCurrentUser({
          id: resp.id,
          name: resp.name,
          email: resp.email,
          role: resp.role,
          businessName: data.businessName || 'My Business'
        });
        return { success: true };
      }
      throw new Error('Registration failed');
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      api.logout();
    } catch (e) {
      // Ignore
    }
    localStorage.removeItem('msme_auth_token');
    localStorage.removeItem('msme_auth_user');
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
