import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMe, setAuthToken } from '../services/api';

const TOKEN_KEY = 'footlocal.token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
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
        await AsyncStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const value = useMemo(() => ({
    token,
    profile,
    loading,
    isAdmin: Array.isArray(profile?.roles) && profile.roles.includes('ROLE_ADMIN'),
    login: async (newToken) => {
      setAuthToken(newToken);
      setToken(newToken);
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      const me = await getMe();
      setProfile(me.data || me);
    },
    logout: async () => {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setAuthToken(null);
      setToken(null);
      setProfile(null);
    },
  }), [token, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
