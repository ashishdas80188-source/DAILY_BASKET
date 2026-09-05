import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    // Load stored token & user on startup
    const storedToken = localStorage.getItem('dailybasket_token');
    const storedUser = localStorage.getItem('dailybasket_user');

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('dailybasket_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await authService.login(email, password);
      localStorage.setItem('dailybasket_token', authData.token);
      const userData = {
        id: authData.id,
        fullName: authData.fullName,
        email: authData.email,
        phone: authData.phone,
        role: authData.role,
      };
      localStorage.setItem('dailybasket_user', JSON.stringify(userData));
      setUser(userData);
      addToast(`Welcome back, ${userData.fullName}!`, 'success');
      return userData;
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const authData = await authService.register(formData);
      localStorage.setItem('dailybasket_token', authData.token);
      const userData = {
        id: authData.id,
        fullName: authData.fullName,
        email: authData.email,
        phone: authData.phone,
        role: authData.role,
      };
      localStorage.setItem('dailybasket_user', JSON.stringify(userData));
      setUser(userData);
      addToast(`Account created! Welcome to DailyBasket, ${userData.fullName}`, 'success');
      return userData;
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('dailybasket_token');
    localStorage.removeItem('dailybasket_user');
    setUser(null);
    addToast('You have been logged out.', 'info');
  };

  const updateUser = (updatedData) => {
    const updated = { ...user, ...updatedData };
    localStorage.setItem('dailybasket_user', JSON.stringify(updated));
    setUser(updated);
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
