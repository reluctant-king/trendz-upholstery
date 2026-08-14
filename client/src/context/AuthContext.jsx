import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('trendz_admin') || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const token = () => localStorage.getItem('trendz_token');

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    localStorage.setItem('trendz_token', data.token);
    localStorage.setItem('trendz_admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data.admin;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('trendz_token');
    localStorage.removeItem('trendz_admin');
    setAdmin(null);
  }, []);

  useEffect(() => {
    const verify = async () => {
      if (!token()) {
        setLoading(false);
        return;
      }
      try {
        const data = await authApi.me();
        localStorage.setItem('trendz_admin', JSON.stringify(data.admin));
        setAdmin(data.admin);
      } catch {
        localStorage.removeItem('trendz_token');
        localStorage.removeItem('trendz_admin');
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  const value = useMemo(
    () => ({ admin, login, logout, isAuthenticated: Boolean(admin), loading }),
    [admin, login, logout, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
