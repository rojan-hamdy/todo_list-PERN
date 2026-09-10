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

  // On initial mount, verify auth cookie with backend /me endpoint
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include"
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem('pern_todo_user', JSON.stringify(userData));
        }
      } catch (err) {
        console.error("Auth check failed:", err.message);
      }
    };
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pern_todo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pern_todo_user');
    }
  }, [user]);

  const login = async (email, password) => {
    if (!email || !password) {
      showError("Please fill in all fields.");
      return false;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.message || "Login failed.");
        return false;
      }

      setUser(data.user);
      showSuccess(`Welcome back, ${data.user.name}!`);
      return true;
    } catch (err) {
      console.error("Login error:", err.message);
      showError("Server error during login. Please try again.");
      return false;
    }
  };

  const register = async (name, email, password) => {
    if (!name || !email || !password) {
      showError("Please fill in all registration fields.");
      return false;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.message || "Registration failed.");
        return false;
      }

      setUser(data.user);
      showSuccess(`Account created! Welcome, ${data.user.name}!`);
      return true;
    } catch (err) {
      console.error("Register error:", err.message);
      showError("Server error during registration.");
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.error("Logout error:", err.message);
    } finally {
      setUser(null);
      showInfo("Logged out successfully.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
