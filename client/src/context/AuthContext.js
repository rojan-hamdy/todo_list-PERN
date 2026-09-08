import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('pern_todo_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const { showSuccess, showInfo, showError } = useToast();

  useEffect(() => {
    if (user) {
      localStorage.setItem('pern_todo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pern_todo_user');
    }
  }, [user]);

  const login = (email, password) => {
    // Frontend login handling
    if (!email || !password) {
      showError("Please fill in all fields.");
      return false;
    }

    // Generate mock user session
    const mockUser = {
      email,
      name: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()),
      token: 'mock-jwt-token-' + Date.now()
    };

    setUser(mockUser);
    showSuccess(`Welcome back, ${mockUser.name}!`);
    return true;
  };

  const register = (name, email, password) => {
    if (!name || !email || !password) {
      showError("Please fill in all registration fields.");
      return false;
    }

    const newUser = {
      name,
      email,
      token: 'mock-jwt-token-' + Date.now()
    };

    setUser(newUser);
    showSuccess(`Account created! Welcome, ${name}!`);
    return true;
  };

  const logout = () => {
    setUser(null);
    showInfo("Logged out successfully.");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
