import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LogoutButton } from '../LogoutButton';
import { AuthProvider } from '../../../context/AuthContext';

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    delete (window as any).location;
    window.location = { href: '' } as any;
  });

  const renderLogoutButton = () => {
    return render(
      <AuthProvider>
        <LogoutButton />
      </AuthProvider>
    );
  };

  it('should render the logout button', () => {
    renderLogoutButton();
    
    const logoutButton = screen.getByRole('button', { name: /log out/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it('should clear localStorage and redirect on logout', () => {
    // Set up localStorage
    localStorage.setItem('authToken', 'test-token');
    localStorage.setItem('user', JSON.stringify({
      id: '123',
      email: 'test@example.com',
      created_at: '2025-11-18T00:00:00Z',
    }));

    renderLogoutButton();
    
    const logoutButton = screen.getByRole('button', { name: /log out/i });
    fireEvent.click(logoutButton);
    
    // Verify localStorage is cleared
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    
    // Verify redirect
    expect(window.location.href).toBe('/');
  });

  it('should have proper accessibility attributes', () => {
    renderLogoutButton();
    
    const logoutButton = screen.getByRole('button', { name: /log out/i });
    expect(logoutButton).toHaveAttribute('aria-label', 'Log out');
  });
});
