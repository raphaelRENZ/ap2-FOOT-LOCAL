
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setApiToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadToken() {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        setApiToken(storedToken);
      }
      setLoading(false);
    }
    loadToken();
  }, []);

  async function login(newToken) {
    setToken(newToken);
    setApiToken(newToken);
    await AsyncStorage.setItem('token', newToken);
  }

  async function logout() {
    setToken(null);
    setApiToken(null);
    await AsyncStorage.removeItem('token');
  }

  return (
    <AuthContext.Provider value={{ token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
