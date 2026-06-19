import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, setAuthToken, setUnauthorizedHandler } from '../services/api';
import { getStoredToken, removeStoredToken, setStoredToken } from '../services/tokenStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);

  const forceLogout = React.useCallback(async () => {
    await removeStoredToken();
    setAuthToken(null);
    setToken(null);
    setProfile(null);
    setShowWelcomeToast(false);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(forceLogout);
    return () => setUnauthorizedHandler(null);
  }, [forceLogout]);

  useEffect(() => {
    (async () => {
      const savedToken = await getStoredToken();
      if (!savedToken) {
        setLoading(false);
        return;
      }

      setAuthToken(savedToken);
      setToken(savedToken);

      try {
        const me = await getMe();
        setProfile(me.data || me);
      } catch {
        await forceLogout();
      } finally {
        setLoading(false);
      }
    })();
  }, [forceLogout]);

  const value = useMemo(() => ({
    token,
    profile,
    loading,
    showWelcomeToast,
    isAdmin: Array.isArray(profile?.roles) && profile.roles.includes('ROLE_ADMIN'),
    login: async (newToken) => {
      setAuthToken(newToken);
      setToken(newToken);
      await setStoredToken(newToken);

      try {
        const me = await getMe();
        setProfile(me.data || me);
        setShowWelcomeToast(true);
      } catch (error) {
        await forceLogout();
        throw error;
      }
    },
    dismissWelcomeToast: () => setShowWelcomeToast(false),
    logout: forceLogout,
  }), [token, profile, loading, showWelcomeToast, forceLogout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
