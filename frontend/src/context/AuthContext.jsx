import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  schoolLogin,
  schoolLogout,
  schoolRegister,
  getSchoolMe,
} from '../services/auth.service';

// ── Context Creation ───────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Helper: Persist user to localStorage ──────────────────────────────────────
const LS_USER_KEY  = 'baio_user';
const LS_TOKEN_KEY = 'baio_token';

const saveUser  = (user)  => localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
const clearUser = ()      => { localStorage.removeItem(LS_USER_KEY); localStorage.removeItem(LS_TOKEN_KEY); };
const loadUser  = ()      => {
  try { return JSON.parse(localStorage.getItem(LS_USER_KEY)); }
  catch { return null; }
};

// ── Provider ───────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(loadUser);
  const [loading, setLoading] = useState(true);

  // On mount: verify token still valid against the API
  useEffect(() => {
    const verify = async () => {
      const stored = loadUser();
      if (!stored) { setLoading(false); return; }

      try {
        const res   = await getSchoolMe();
        const fresh = res.data?.data;
        setUser(fresh);
        saveUser({ ...fresh, role: 'school' });
      } catch {
        clearUser();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  // ── Actions ──────────────────────────────────────────────────────────────────

  const loginSchool = useCallback(async (credentials) => {
    const res   = await schoolLogin(credentials);
    const data  = res.data?.data;
    const token = data?.token;
    const me    = data?.school || data?.user || data;

    if (token) localStorage.setItem(LS_TOKEN_KEY, token);
    const enriched = { ...me, role: 'school' };
    setUser(enriched);
    saveUser(enriched);
    return enriched;
  }, []);

  const registerSchool = useCallback(async (payload) => {
    const res = await schoolRegister(payload);
    return res.data;
  }, []);

  const logoutSchool = useCallback(async () => {
    try { await schoolLogout(); } catch { /* ignore */ }
    clearUser();
    setUser(null);
  }, []);

  // ── Derived Helpers ───────────────────────────────────────────────────────────
  const isAuthenticated = Boolean(user);
  const isSchool        = user?.role === 'school';

  const value = {
    user,
    loading,
    isAuthenticated,
    isSchool,
    loginSchool,
    registerSchool,
    logoutSchool,
    logout: logoutSchool,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Consumer Hook ──────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
