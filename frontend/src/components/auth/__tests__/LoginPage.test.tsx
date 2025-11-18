import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from '../LoginPage';
import { AuthProvider } from '../../../context/AuthContext';
import * as authService from '../../../services/authService';

// Mock the authService
vi.mock('../../../services/authService');

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
