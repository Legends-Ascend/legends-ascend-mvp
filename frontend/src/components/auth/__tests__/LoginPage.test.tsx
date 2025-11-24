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
  });
});
