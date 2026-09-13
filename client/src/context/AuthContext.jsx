import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check initial token on page load
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('pixelresolve_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.auth.getMe();
        setUser(data.user);
      } catch (err) {
        console.error('Session expired or invalid:', err);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await api.auth.login({ email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (name, email, password) => {
    const data = await api.auth.signup({ name, email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  const updateUserStats = (updatedUser) => {
    if (updatedUser) {
      setUser((prev) => ({ ...prev, ...updatedUser }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUserStats
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
