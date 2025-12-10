/**
 * Authentication Context Provider
 * Following TECHNICAL_ARCHITECTURE.md - React 18+ patterns
 * Implements session state management per US-045 FR-3
 * Implements US-051 admin authentication and redirect logic
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
      const token = localStorage.getItem('authToken');

      if (!token) {
        // No token available, ensure we start from a clean state
        localStorage.removeItem('user');
        setLoading(false);
        return;
      }

      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        // Optimistically hydrate UI while backend validation runs
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch {
          localStorage.removeItem('user');
        }
      }

      try {
        // Always verify token with backend before trusting persisted state
        const verifiedUser = await verifyToken(token);
        setUser(verifiedUser);
        localStorage.setItem('user', JSON.stringify(verifiedUser));
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

    // Redirect based on role (US-051 FR-7, FR-8)
    if (userData.role === 'admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/game/lineup';
    }
  };

  const register = async (email: string, password: string, newsletterOptIn: boolean = false) => {
    const { token, user: userData } = await registerUser({ email, password, newsletterOptIn });
    
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
      isAdmin: user?.role === 'admin',
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
