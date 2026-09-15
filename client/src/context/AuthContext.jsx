import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const data = await api.auth.getProfile();
      if (data.profile) {
        setUser(data.profile);
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  // Check initial token on page load
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('pixelresolve_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.auth.getProfile();
        setUser(data.profile || data.user);
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

  const login = async (identifier, password) => {
    const data = await api.auth.login({ identifier, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (name, email, username, password) => {
    const data = await api.auth.signup({ name, email, username, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const data = await api.auth.updateProfile(profileData);
    if (data.user) {
      setUser((prev) => ({ ...prev, ...data.user }));
    }
    return data.user;
  };

  const verifyEmail = async () => {
    const data = await api.auth.verifyEmail();
    setUser((prev) => ({ ...prev, email_verification_status: 'verified' }));
    return data;
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
        updateProfile,
        verifyEmail,
        refreshProfile,
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
