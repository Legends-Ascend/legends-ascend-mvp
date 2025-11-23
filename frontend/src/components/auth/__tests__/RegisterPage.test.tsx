import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterPage } from '../RegisterPage';
import { AuthProvider } from '../../../context/AuthContext';
import * as authService from '../../../services/authService';

// Mock the authService
vi.mock('../../../services/authService');

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as Window & { location: unknown }).location;
    (window as Window & { location: { href: string } }).location = { href: '' };
  });

  const renderRegisterPage = () => {
    return render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );
  };

  it('should render the registration form', () => {
    renderRegisterPage();
    
    expect(screen.getByText('⚽ Legends Ascend')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('should display a link to login page', () => {
    renderRegisterPage();
    
    const loginLink = screen.getByText('Log In');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });

  it('should validate passwords match', async () => {
    renderRegisterPage();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /register/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password456' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('should call register API with valid credentials', async () => {
    const mockRegisterUser = vi.spyOn(authService, 'registerUser').mockResolvedValue({
      token: 'test-token',
      user: {
        id: '123',
        email: 'newuser@example.com',
        created_at: '2025-11-18T00:00:00Z',
      },
    });

    renderRegisterPage();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /register/i });
    
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'Password123',
        newsletterOptIn: false,
      });
    });
  });

  it('should display error message on registration failure', async () => {
    vi.spyOn(authService, 'registerUser').mockRejectedValue(new Error('Email already in use'));

    renderRegisterPage();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /register/i });
    
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email already in use')).toBeInTheDocument();
    });
  });

  it('should have proper ARIA attributes for accessibility', () => {
    renderRegisterPage();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    
    expect(emailInput).toHaveAttribute('id', 'email');
    expect(passwordInput).toHaveAttribute('id', 'password');
    expect(confirmPasswordInput).toHaveAttribute('id', 'confirmPassword');
  });
});
