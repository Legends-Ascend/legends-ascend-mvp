/**
 * Authentication Context Provider
 * Following TECHNICAL_ARCHITECTURE.md - React 18+ patterns
 * Implements session state management per US-045 FR-3
 */

import { createContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { AuthContextValue, User } from '../types/auth';
import { loginUser, registerUser, verifyToken } from '../services/authService';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          // Try to use stored user data first for faster initialization
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } catch {
            // If stored user data is invalid, verify token with backend
            const userData = await verifyToken(token);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        }
      } catch {
        // Token is invalid or expired, clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user: userData } = await loginUser({ email, password });
    
    // Store token and user data
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (email: string, password: string) => {
    const { token, user: userData } = await registerUser({ email, password });
    
    // Store token and user data
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Clear user state
    setUser(null);
    
    // Redirect to landing page
    window.location.href = '/';
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
