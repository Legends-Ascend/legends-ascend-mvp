import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmailSignupForm } from '../EmailSignupForm';

/**
 * Tests for Email Signup Form Warning Behavior (PR #131)
 * 
 * These tests verify that console warnings are only shown when appropriate:
 * - No warnings in development mode
 * - Warnings only when production is misconfigured
 * - 405 errors only log detailed help when misconfigured
 */

// Mock fetch globally
global.fetch = vi.fn();

describe('EmailSignupForm - Console Warning Behavior (PR #131)', () => {
  const originalEnv = { ...import.meta.env };
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const setEnv = (overrides: Record<string, unknown>) => {
    Object.assign(import.meta.env as Record<string, unknown>, overrides);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    
    // Restore original environment
    Object.keys(import.meta.env).forEach((key) => {
      delete (import.meta.env as Record<string, unknown>)[key];
    });
    Object.assign(import.meta.env as Record<string, unknown>, originalEnv);
  });

  describe('Development Mode - No Warnings (PR #131 Fix)', () => {
    it('should not log 405 error details in development mode', async () => {
      const user = userEvent.setup();
      
      // Set development mode
      setEnv({ PROD: false, VITE_API_URL: '/api' });
      
      // Mock 405 error response
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 405,
        headers: new Headers({ 'content-type': 'text/html' }),
        json: async () => ({}),
      } as Response);

      render(<EmailSignupForm />);

      // Fill and submit form
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/not configured correctly/i);
        expect(errorMessage).toBeInTheDocument();
      });

      // Should NOT log detailed configuration help in development
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should not log configuration errors even with misconfigured-looking URL in dev', async () => {
      const user = userEvent.setup();
      
      // Set development mode with frontend-looking URL
      setEnv({ PROD: false, VITE_API_URL: 'https://frontend.vercel.app/api' });
      
      // Mock 405 error
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 405,
        headers: new Headers({ 'content-type': 'text/html' }),
        json: async () => ({}),
      } as Response);

      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/not configured correctly/i)).toBeInTheDocument();
      });

      // In dev mode, should never log warnings regardless of URL
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('Production Mode - Conditional Warnings', () => {
    it('should log detailed 405 help when production is misconfigured', async () => {
      const user = userEvent.setup();
      
      // Set production mode with misconfigured URL
      setEnv({ PROD: true, VITE_API_URL: 'https://frontend.vercel.app/api' });
      
      // Mock 405 error
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 405,
        headers: new Headers({ 'content-type': 'text/html' }),
        json: async () => ({}),
      } as Response);

      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/not configured correctly/i)).toBeInTheDocument();
      });

      // Should log detailed configuration help in production when misconfigured
      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorCalls = consoleErrorSpy.mock.calls;
      const hasConfigurationHelp = errorCalls.some((call) =>
        call.some((arg) => 
          typeof arg === 'string' && arg.includes('VITE_API_URL')
        )
      );
      expect(hasConfigurationHelp).toBe(true);
    });

    it('should NOT log 405 help when production is correctly configured', async () => {
      const user = userEvent.setup();
      
      // Set production mode with correctly configured URL
      setEnv({ PROD: true, VITE_API_URL: 'https://backend.example.com/api' });
      
      // Mock 405 error (maybe from incorrect endpoint, not misconfiguration)
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 405,
        headers: new Headers({ 'content-type': 'text/html' }),
        json: async () => ({}),
      } as Response);

      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/not configured correctly/i)).toBeInTheDocument();
      });

      // Should NOT log detailed help when properly configured
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should NOT log 405 help for monorepo deployments in production', async () => {
      const user = userEvent.setup();
      
      // Set production mode with monorepo URL (relative)
      setEnv({ PROD: true, VITE_API_URL: '/api' });
      
      // Mock 405 error
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 405,
        headers: new Headers({ 'content-type': 'text/html' }),
        json: async () => ({}),
      } as Response);

      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/not configured correctly/i)).toBeInTheDocument();
      });

      // Monorepo deployments are valid, should not log warnings
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('Other HTTP Errors - No Configuration Warnings', () => {
    it('should not log configuration help for 404 errors', async () => {
      const user = userEvent.setup();
      
      setEnv({ PROD: true, VITE_API_URL: 'https://frontend.vercel.app/api' });
      
      // Mock 404 error
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Not found' }),
      } as Response);

      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      // 404 errors should not trigger configuration help
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should not log configuration help for 500 errors', async () => {
      const user = userEvent.setup();
      
      setEnv({ PROD: true, VITE_API_URL: 'https://frontend.vercel.app/api' });
      
      // Mock 500 error
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Internal server error' }),
      } as Response);

      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      // 500 errors should not trigger configuration help
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should not log configuration help for 400 errors', async () => {
      const user = userEvent.setup();
      
      setEnv({ PROD: true, VITE_API_URL: 'https://frontend.vercel.app/api' });
      
      // Mock 400 error
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Bad request' }),
      } as Response);

      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      // 400 errors should not trigger configuration help
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('Success Scenarios - No Warnings', () => {
    it('should not log any warnings on successful submission in dev', async () => {
      const user = userEvent.setup();
      
      setEnv({ PROD: false, VITE_API_URL: '/api' });
      
      // Mock successful response
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, message: 'Subscribed!' }),
      } as Response);

      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/success/i)).toBeInTheDocument();
      });

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should not log any warnings on successful submission in production', async () => {
      const user = userEvent.setup();
      
      setEnv({ PROD: true, VITE_API_URL: 'https://backend.example.com/api' });
      
      // Mock successful response
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, message: 'Subscribed!' }),
      } as Response);

      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/success/i)).toBeInTheDocument();
      });

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('Warning Message Content Validation', () => {
    it('should include deployment instructions in 405 warnings when misconfigured', async () => {
      const user = userEvent.setup();
      
      setEnv({ PROD: true, VITE_API_URL: 'https://frontend.vercel.app/api' });
      
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 405,
        headers: new Headers({ 'content-type': 'text/html' }),
        json: async () => ({}),
      } as Response);

      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/not configured correctly/i)).toBeInTheDocument();
      });

      // Verify warning includes helpful information
      const errorCalls = consoleErrorSpy.mock.calls;
      const warningText = errorCalls.map(call => call.join(' ')).join(' ');
      
      expect(warningText).toContain('VITE_API_URL');
      expect(warningText).toContain('Steps to fix');
      expect(warningText).toContain('Vercel');
    });

    it('should include current API URL in 405 warnings', async () => {
      const user = userEvent.setup();
      
      const testUrl = 'https://frontend.vercel.app/api';
      setEnv({ PROD: true, VITE_API_URL: testUrl });
      
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 405,
        headers: new Headers({ 'content-type': 'text/html' }),
        json: async () => ({}),
      } as Response);

      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/not configured correctly/i)).toBeInTheDocument();
      });

      const errorCalls = consoleErrorSpy.mock.calls;
      const warningText = errorCalls.map(call => call.join(' ')).join(' ');
      
      expect(warningText).toContain(testUrl);
    });
  });
});
