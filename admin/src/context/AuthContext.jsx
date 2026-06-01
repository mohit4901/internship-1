import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminLogin, adminLogout, getAdminMe } from '../services/auth.service';

const AuthContext = createContext(null);

const LS_TOKEN = 'baio_admin_token';
const LS_USER  = 'baio_admin_user';

const saveUser  = (u) => localStorage.setItem(LS_USER, JSON.stringify(u));
const clearAuth = ()  => { localStorage.removeItem(LS_TOKEN); localStorage.removeItem(LS_USER); };
const loadUser  = ()  => { try { return JSON.parse(localStorage.getItem(LS_USER)); } catch { return null; } };

export function AdminAuthProvider({ children }) {
  const [admin,   setAdmin]   = useState(loadUser);
  const [loading, setLoading] = useState(true);

  // Verify session on mount
  useEffect(() => {
    const verify = async () => {
      if (!loadUser()) { setLoading(false); return; }
      try {
        const res   = await getAdminMe();
        const fresh = res.data?.data;
        setAdmin(fresh);
        saveUser(fresh);
      } catch {
        clearAuth();
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  const login = useCallback(async (credentials) => {
    const res   = await adminLogin(credentials);
    const data  = res.data?.data;
    const token = data?.token;
    const me    = data?.admin || data?.user || data;

    if (token) localStorage.setItem(LS_TOKEN, token);
    setAdmin(me);
    saveUser(me);
    return me;
  }, []);

  const logout = useCallback(async () => {
    try { await adminLogout(); } catch { /* ignore */ }
    clearAuth();
    setAdmin(null);
  }, []);

  const value = {
    admin,
    loading,
    isAuthenticated: Boolean(admin),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAdminAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>');
  return ctx;
};

export default AuthContext;
