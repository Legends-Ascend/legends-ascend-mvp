import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider } from '../AuthContext';
import { useAuth } from '../../hooks/useAuth';
import * as authService from '../../services/authService';

// Mock the authService
vi.mock('../../services/authService');

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    delete (window as any).location;
    window.location = { href: '' } as any;
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('should initialize with unauthenticated state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should restore user from localStorage', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      created_at: '2025-11-18T00:00:00Z',
    };

    localStorage.setItem('authToken', 'test-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it('should login successfully', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      created_at: '2025-11-18T00:00:00Z',
    };

    vi.spyOn(authService, 'loginUser').mockResolvedValue({
      token: 'test-token',
      user: mockUser,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.login('test@example.com', 'Password123');

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });

    expect(localStorage.getItem('authToken')).toBe('test-token');
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
  });

  it('should register successfully', async () => {
    const mockUser = {
      id: '456',
      email: 'newuser@example.com',
      created_at: '2025-11-18T00:00:00Z',
    };

    vi.spyOn(authService, 'registerUser').mockResolvedValue({
      token: 'new-token',
      user: mockUser,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.register('newuser@example.com', 'Password123');

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });

    expect(localStorage.getItem('authToken')).toBe('new-token');
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
  });

  it('should logout successfully', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      created_at: '2025-11-18T00:00:00Z',
    };

    localStorage.setItem('authToken', 'test-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    result.current.logout();

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(window.location.href).toBe('/');
  });

  it('should clear localStorage on invalid token', async () => {
    localStorage.setItem('authToken', 'invalid-token');
    localStorage.setItem('user', 'invalid-json');

    vi.spyOn(authService, 'verifyToken').mockRejectedValue(new Error('Invalid token'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
