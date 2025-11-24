import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from '../LoginPage';
import { AuthProvider } from '../../../context/AuthContext';
import * as authService from '../../../services/authService';

// Mock the authService
vi.mock('../../../services/authService');

const REMEMBER_USERNAME_KEY = 'legends-ascend-remember-username';

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    delete (window as Window & { location: unknown }).location;
    (window as Window & { location: { href: string } }).location = { href: '' };
  });

  const renderLoginPage = () => {
    return render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
  };

  it('should render the login form', () => {
    renderLoginPage();
    
    expect(screen.getByText('⚽ Legends Ascend')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('should display a link to register page', () => {
    renderLoginPage();
    
    const registerLink = screen.getByText('Register');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });

  it('should validate password is required', async () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('should call login API with valid credentials', async () => {
    const mockLoginUser = vi.spyOn(authService, 'loginUser').mockResolvedValue({
      token: 'test-token',
      user: {
        id: '123',
        email: 'test@example.com',
        created_at: '2025-11-18T00:00:00Z',
      },
    });

    renderLoginPage();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
      });
    });
  });

  it('should display error message on login failure', async () => {
    vi.spyOn(authService, 'loginUser').mockRejectedValue(new Error('Invalid credentials'));

    renderLoginPage();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('should disable form during submission', async () => {
    vi.spyOn(authService, 'loginUser').mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    renderLoginPage();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  it('should have proper ARIA attributes for accessibility', () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    expect(emailInput).toHaveAttribute('id', 'email');
    expect(passwordInput).toHaveAttribute('id', 'password');
  });

  describe('Remember username functionality', () => {
    it('should render remember username checkbox', () => {
      renderLoginPage();
      
      const checkbox = screen.getByLabelText('Remember username');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('type', 'checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should load remembered username on mount', () => {
      localStorage.setItem(REMEMBER_USERNAME_KEY, 'remembered@example.com');
      
      renderLoginPage();
      
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      const checkbox = screen.getByLabelText('Remember username') as HTMLInputElement;
      
      expect(emailInput.value).toBe('remembered@example.com');
      expect(checkbox.checked).toBe(true);
    });

    it('should save username to localStorage when checkbox is checked', async () => {
      const mockLoginUser = vi.spyOn(authService, 'loginUser').mockResolvedValue({
        token: 'test-token',
        user: {
          id: '123',
          email: 'test@example.com',
          created_at: '2025-11-18T00:00:00Z',
        },
      });

      renderLoginPage();
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const checkbox = screen.getByLabelText('Remember username');
      const submitButton = screen.getByRole('button', { name: /log in/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.click(checkbox);
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalled();
      });

      expect(localStorage.getItem(REMEMBER_USERNAME_KEY)).toBe('test@example.com');
    });

    it('should remove username from localStorage when checkbox is unchecked', async () => {
      localStorage.setItem(REMEMBER_USERNAME_KEY, 'old@example.com');

      const mockLoginUser = vi.spyOn(authService, 'loginUser').mockResolvedValue({
        token: 'test-token',
        user: {
          id: '123',
          email: 'test@example.com',
          created_at: '2025-11-18T00:00:00Z',
        },
      });

      renderLoginPage();
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const checkbox = screen.getByLabelText('Remember username') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /log in/i });
      
      // Checkbox should be checked because username was loaded
      expect(checkbox.checked).toBe(true);
      
      // Change email and uncheck the box
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.click(checkbox); // Uncheck
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalled();
      });

      expect(localStorage.getItem(REMEMBER_USERNAME_KEY)).toBeNull();
    });

    it('should have proper label association for checkbox accessibility', () => {
      renderLoginPage();
      
      const checkbox = screen.getByLabelText('Remember username');
      expect(checkbox).toHaveAttribute('id', 'remember-username');
    });

    it('should disable checkbox during form submission', async () => {
      vi.spyOn(authService, 'loginUser').mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderLoginPage();
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const checkbox = screen.getByLabelText('Remember username');
      const submitButton = screen.getByRole('button', { name: /log in/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(checkbox).toBeDisabled();
      });
    });

    it('should update remembered username when user changes email and logs in successfully', async () => {
      localStorage.setItem(REMEMBER_USERNAME_KEY, 'old@example.com');

      const mockLoginUser = vi.spyOn(authService, 'loginUser').mockResolvedValue({
        token: 'test-token',
        user: {
          id: '123',
          email: 'new@example.com',
          created_at: '2025-11-18T00:00:00Z',
        },
      });

      renderLoginPage();
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /log in/i });
      
      // Email should be pre-filled with old value
      expect((emailInput as HTMLInputElement).value).toBe('old@example.com');
      
      // Change to new email
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalled();
      });

      // Should update localStorage with new email
      expect(localStorage.getItem(REMEMBER_USERNAME_KEY)).toBe('new@example.com');
    });

    it('should not save username on failed login even if checkbox is checked', async () => {
      vi.spyOn(authService, 'loginUser').mockRejectedValue(new Error('Invalid credentials'));

      renderLoginPage();
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const checkbox = screen.getByLabelText('Remember username');
      const submitButton = screen.getByRole('button', { name: /log in/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(checkbox);
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });

      // Should not save username on failed login
      expect(localStorage.getItem(REMEMBER_USERNAME_KEY)).toBeNull();
    });

    it('should handle empty string in localStorage gracefully', () => {
      localStorage.setItem(REMEMBER_USERNAME_KEY, '');
      
      renderLoginPage();
      
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      const checkbox = screen.getByLabelText('Remember username') as HTMLInputElement;
      
      // Empty string is falsy, so should not pre-fill
      expect(emailInput.value).toBe('');
      expect(checkbox.checked).toBe(false);
    });

    it('should allow toggling checkbox multiple times before submission', () => {
      renderLoginPage();
      
      const checkbox = screen.getByLabelText('Remember username') as HTMLInputElement;
      
      expect(checkbox.checked).toBe(false);
      
      // Toggle multiple times
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
      
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(false);
      
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
    });

    it('should maintain checkbox state after validation error', async () => {
      renderLoginPage();
      
      const emailInput = screen.getByLabelText('Email');
      const checkbox = screen.getByLabelText('Remember username') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /log in/i });
      
      // Check the remember username box
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
      
      // Submit with invalid data
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
      
      // Checkbox should still be checked
      expect(checkbox.checked).toBe(true);
    });

    it('should maintain remembered username through validation errors', async () => {
      localStorage.setItem(REMEMBER_USERNAME_KEY, 'test@example.com');
      
      renderLoginPage();
      
      const submitButton = screen.getByRole('button', { name: /log in/i });
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      
      // Email should be pre-filled
      expect(emailInput.value).toBe('test@example.com');
      
      // Submit without password to trigger validation
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        // Should show password validation error
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
      
      // Email should still be populated
      expect(emailInput.value).toBe('test@example.com');
    });

    it('should store username with special characters correctly', async () => {
      const specialEmail = "test+tag@example.com";
      
      const mockLoginUser = vi.spyOn(authService, 'loginUser').mockResolvedValue({
        token: 'test-token',
        user: {
          id: '123',
          email: specialEmail,
          created_at: '2025-11-18T00:00:00Z',
        },
      });

      renderLoginPage();
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const checkbox = screen.getByLabelText('Remember username');
      const submitButton = screen.getByRole('button', { name: /log in/i });
      
      fireEvent.change(emailInput, { target: { value: specialEmail } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.click(checkbox);
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalled();
      });

      expect(localStorage.getItem(REMEMBER_USERNAME_KEY)).toBe(specialEmail);
    });

    it('should handle very long email addresses', async () => {
      // Test with email length near common localStorage limits (250 chars for local part)
      // This ensures the feature works with edge case email lengths
      const longEmail = 'a'.repeat(250) + '@example.com';
      
      const mockLoginUser = vi.spyOn(authService, 'loginUser').mockResolvedValue({
        token: 'test-token',
        user: {
          id: '123',
          email: longEmail,
          created_at: '2025-11-18T00:00:00Z',
        },
      });

      renderLoginPage();
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const checkbox = screen.getByLabelText('Remember username');
      const submitButton = screen.getByRole('button', { name: /log in/i });
      
      fireEvent.change(emailInput, { target: { value: longEmail } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.click(checkbox);
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalled();
      });

      expect(localStorage.getItem(REMEMBER_USERNAME_KEY)).toBe(longEmail);
    });
  });

  describe('Register link functionality', () => {
    it('should have correct href for register link', () => {
      renderLoginPage();
      
      const registerLink = screen.getByText('Register');
      expect(registerLink).toBeInTheDocument();
      expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
    });
  });
});
