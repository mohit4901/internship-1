import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  studentLogin,
  studentLogout,
  studentRegister,
  getStudentMe,
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
  const [user,    setUser]    = useState(loadUser);   // { _id, name, role, ... }
  const [role,    setRole]    = useState(() => loadUser()?.role || null); // 'student' | 'school' | null
  const [loading, setLoading] = useState(true);

  // On mount: verify token still valid against the API
  useEffect(() => {
    const verify = async () => {
      const stored = loadUser();
      if (!stored) { setLoading(false); return; }

      try {
        const res = stored.role === 'student'
          ? await getStudentMe()
          : await getSchoolMe();

        const fresh = res.data?.data;
        setUser(fresh);
        setRole(fresh?.role || stored.role);
        saveUser({ ...fresh, role: fresh?.role || stored.role });
      } catch {
        clearUser();
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  // ── Actions ──────────────────────────────────────────────────────────────────

  const loginStudent = useCallback(async (credentials) => {
    const res  = await studentLogin(credentials);
    const data = res.data?.data;
    const token = data?.token;
    const me    = data?.student || data?.user || data;

    if (token) localStorage.setItem(LS_TOKEN_KEY, token);
    const enriched = { ...me, role: 'student' };
    setUser(enriched);
    setRole('student');
    saveUser(enriched);
    return enriched;
  }, []);

  const registerStudent = useCallback(async (payload) => {
    const res   = await studentRegister(payload);
    return res.data;
  }, []);

  const logoutStudent = useCallback(async () => {
    try { await studentLogout(); } catch { /* ignore */ }
    clearUser();
    setUser(null);
    setRole(null);
  }, []);

  const loginSchool = useCallback(async (credentials) => {
    const res   = await schoolLogin(credentials);
    const data  = res.data?.data;
    const token = data?.token;
    const me    = data?.school || data?.user || data;

    if (token) localStorage.setItem(LS_TOKEN_KEY, token);
    const enriched = { ...me, role: 'school' };
    setUser(enriched);
    setRole('school');
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
    setRole(null);
  }, []);

  const logout = useCallback(() => {
    if (role === 'school') return logoutSchool();
    return logoutStudent();
  }, [role, logoutSchool, logoutStudent]);

  // ── Derived Helpers ───────────────────────────────────────────────────────────
  const isAuthenticated = Boolean(user);
  const isStudent       = role === 'student';
  const isSchool        = role === 'school';

  const value = {
    user,
    role,
    loading,
    isAuthenticated,
    isStudent,
    isSchool,
    loginStudent,
    registerStudent,
    logoutStudent,
    loginSchool,
    registerSchool,
    logoutSchool,
    logout,
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
