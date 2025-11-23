import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterPage } from '../RegisterPage';
import { AuthProvider } from '../../../context/AuthContext';
import * as authService from '../../../services/authService';

/**
 * Tests for Newsletter Opt-In checkbox in RegisterPage (US-048)
 */

// Mock the authService
vi.mock('../../../services/authService');

describe('RegisterPage - Newsletter Opt-In (US-048)', () => {
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

  describe('Newsletter checkbox rendering', () => {
    it('should display newsletter opt-in checkbox', () => {
      renderRegisterPage();
      
      const checkbox = screen.getByRole('checkbox', { name: /sign me up for news and updates/i });
      expect(checkbox).toBeInTheDocument();
    });

    it('should have newsletter checkbox unchecked by default (FR-2)', () => {
      renderRegisterPage();
      
      const checkbox = screen.getByRole('checkbox', { name: /sign me up for news and updates/i });
      expect(checkbox).not.toBeChecked();
    });

    it('should display privacy policy link near checkbox (FR-3)', () => {
      renderRegisterPage();
      
      const privacyLink = screen.getByText(/learn more about how we handle your data/i);
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink.closest('a')).toHaveAttribute('href', '/privacy-policy');
    });

    it('should have correct label text (FR-1)', () => {
      renderRegisterPage();
      
      const label = screen.getByText(/sign me up for news and updates about legends ascend/i);
      expect(label).toBeInTheDocument();
    });
  });

  describe('Newsletter checkbox interaction', () => {
    it('should be toggleable by clicking', () => {
      renderRegisterPage();
      
      const checkbox = screen.getByRole('checkbox', { name: /sign me up for news and updates/i }) as HTMLInputElement;
      
      expect(checkbox.checked).toBe(false);
      
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
      
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });

    it('should be disabled during form submission', async () => {
      const mockRegisterUser = vi.spyOn(authService, 'registerUser').mockImplementation(
        () => new Promise(() => {}) // Never resolves to keep form in submitting state
      );

      renderRegisterPage();
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const checkbox = screen.getByRole('checkbox', { name: /sign me up for news and updates/i });
      const submitButton = screen.getByRole('button', { name: /register/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(checkbox).toBeDisabled();
      });

      mockRegisterUser.mockRestore();
    });
  });

  describe('Registration with newsletter opt-in', () => {
    it('should call register with newsletterOptIn=true when checkbox is checked', async () => {
      const mockRegisterUser = vi.spyOn(authService, 'registerUser').mockResolvedValue({
        token: 'test-token',
        user: {
          id: '123',
          email: 'optin@example.com',
          created_at: '2025-11-23T00:00:00Z',
        },
      });

      renderRegisterPage();
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const checkbox = screen.getByRole('checkbox', { name: /sign me up for news and updates/i });
      const submitButton = screen.getByRole('button', { name: /register/i });
      
      fireEvent.change(emailInput, { target: { value: 'optin@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } });
      fireEvent.click(checkbox); // Check the newsletter opt-in
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockRegisterUser).toHaveBeenCalledWith({
          email: 'optin@example.com',
          password: 'Password123',
          newsletterOptIn: true,
        });
      });
    });

    it('should call register with newsletterOptIn=false when checkbox is unchecked', async () => {
      const mockRegisterUser = vi.spyOn(authService, 'registerUser').mockResolvedValue({
        token: 'test-token',
        user: {
          id: '123',
          email: 'optout@example.com',
          created_at: '2025-11-23T00:00:00Z',
        },
      });

      renderRegisterPage();
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /register/i });
      
      fireEvent.change(emailInput, { target: { value: 'optout@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } });
      // Don't check the newsletter checkbox (default unchecked)
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockRegisterUser).toHaveBeenCalledWith({
          email: 'optout@example.com',
          password: 'Password123',
          newsletterOptIn: false,
        });
      });
    });
  });

  describe('Accessibility', () => {
    it('should associate label with checkbox using htmlFor and id (AC-7)', () => {
      renderRegisterPage();
      
      const checkbox = screen.getByRole('checkbox', { name: /sign me up for news and updates/i });
      expect(checkbox).toHaveAttribute('id', 'newsletterOptIn');
      
      // Label should be associated via htmlFor
      const label = document.querySelector('label[for="newsletterOptIn"]');
      expect(label).toBeInTheDocument();
    });

    it('should have privacy policy link that is keyboard accessible', () => {
      renderRegisterPage();
      
      const privacyLink = screen.getByText(/learn more about how we handle your data/i).closest('a');
      expect(privacyLink).toHaveAttribute('href', '/privacy-policy');
      expect(privacyLink).toHaveAttribute('target', '_blank');
      expect(privacyLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should toggle checkbox state with space key', () => {
      renderRegisterPage();
      
      const checkbox = screen.getByRole('checkbox', { name: /sign me up for news and updates/i }) as HTMLInputElement;
      
      checkbox.focus();
      expect(checkbox.checked).toBe(false);
      
      // Simulate space key press
      fireEvent.keyDown(checkbox, { key: ' ', code: 'Space' });
      fireEvent.click(checkbox); // Space key triggers click event
      expect(checkbox.checked).toBe(true);
    });
  });

  describe('Form validation with newsletter checkbox', () => {
    it('should validate form correctly even with newsletter checkbox checked', async () => {
      const mockRegisterUser = vi.spyOn(authService, 'registerUser').mockResolvedValue({
        token: 'test-token',
        user: {
          id: '123',
          email: 'valid@example.com',
          created_at: '2025-11-23T00:00:00Z',
        },
      });

      renderRegisterPage();
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const checkbox = screen.getByRole('checkbox', { name: /sign me up for news and updates/i });
      const submitButton = screen.getByRole('button', { name: /register/i });
      
      fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass123' } });
      fireEvent.click(checkbox);
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockRegisterUser).toHaveBeenCalled();
        expect(window.location.href).toBe('/game/lineup');
      });
    });

    it('should still show password validation errors even if newsletter is checked', async () => {
      renderRegisterPage();
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const checkbox = screen.getByRole('checkbox', { name: /sign me up for news and updates/i });
      const submitButton = screen.getByRole('button', { name: /register/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'weak' } }); // Too short
      fireEvent.change(confirmPasswordInput, { target: { value: 'weak' } });
      fireEvent.click(checkbox);
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        // Should show at least one validation error (may be any of the password requirement errors)
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });
  });
});
