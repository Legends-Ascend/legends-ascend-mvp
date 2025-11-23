import React, { useState } from 'react';
import { SubscribeFormSchema, type SubscribeFormData, type SubscribeResponse } from '../types/subscribe';
import { GdprConsentCheckbox } from './landing/GdprConsentCheckbox';
import { getApiUrl, isProductionMisconfigured } from '../config/apiConfig';

export interface NewsletterSubscriptionProps {
  /**
   * EmailOctopus tag to apply to subscribers
   * @default 'beta'
   */
  tag?: string;
  
  /**
   * Custom button text for the submit button
   * @default 'Join the Waitlist'
   */
  submitButtonText?: string;
  
  /**
   * Custom success message
   * If not provided, uses the message from the API response
   */
  successMessage?: string;
  
  /**
   * Callback fired when subscription succeeds
   */
  onSuccess?: (email: string) => void;
  
  /**
   * Callback fired when subscription fails
   */
  onError?: (error: string) => void;
  
  /**
   * Additional CSS classes for the form container
   */
  className?: string;
}

/**
 * Reusable Newsletter Subscription Component
 * 
 * A flexible component for capturing email subscriptions with GDPR compliance.
 * Allows configuring the EmailOctopus tag to segment subscribers.
 * 
 * @example
 * // Basic usage with default 'beta' tag
 * <NewsletterSubscription />
 * 
 * @example
 * // Custom tag for early access program
 * <NewsletterSubscription tag="early-access" submitButtonText="Join Early Access" />
 * 
 * @example
 * // Newsletter signup with custom callbacks
 * <NewsletterSubscription
 *   tag="newsletter"
 *   onSuccess={(email) => console.log(`Subscribed: ${email}`)}
 *   onError={(error) => console.error(error)}
 * />
 */
export const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  tag = 'beta',
  submitButtonText = 'Join the Waitlist',
  successMessage,
  onSuccess,
  onError,
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [consentError, setConsentError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const shouldLogEmailOctopusDebug =
    import.meta.env.VITE_ENABLE_EMAILOCTOPUS_DEBUG !== 'false' || !import.meta.env.PROD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setEmailError('');
    setConsentError('');
    setSubmitStatus('idle');

    // Validate form
    const formData: SubscribeFormData = {
      email,
      gdprConsent,
    };

    const validationResult = SubscribeFormSchema.safeParse(formData);

    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0] === 'email') {
          setEmailError(issue.message);
        } else if (issue.path[0] === 'gdprConsent') {
          setConsentError(issue.message);
        }
      });
      return;
    }

    // Submit to API
    setIsSubmitting(true);

    try {
      // Get API URL from configuration
      const apiUrl = getApiUrl();
      
      const response = await fetch(`${apiUrl}/v1/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: validationResult.data.email,
          gdprConsent: validationResult.data.gdprConsent,
          timestamp: new Date().toISOString(),
          tag, // Pass the configurable tag
        }),
      });

      // Check if response has content before parsing JSON
      const contentType = response.headers.get('content-type');
      const hasJsonContent = contentType && contentType.includes('application/json');
      
      // Handle HTTP error responses
      if (!response.ok) {
        let errorMessage = 'Something went wrong. Please try again.';
        
        // Try to parse error response if it's JSON
        if (hasJsonContent) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;

            if (shouldLogEmailOctopusDebug && errorData?.debug) {
              console.info('EmailOctopus debug (error response):', errorData.debug);
            } else if (shouldLogEmailOctopusDebug) {
              console.info('EmailOctopus response (error):', {
                status: response.status,
                body: errorData,
                debugAvailable: Boolean(errorData?.debug),
              });
            }
          } catch {
            // If JSON parsing fails, use default message
          }
        } else if (response.status === 405) {
          // Method Not Allowed - likely API configuration issue
          errorMessage = 'The subscription service is not configured correctly. Please contact support.';
          
          // Only log detailed configuration help in production when actually misconfigured
          if (isProductionMisconfigured()) {
            console.error(
              '❌ 405 Method Not Allowed Error:\n' +
              'This error typically means VITE_API_URL is not configured correctly.\n\n' +
              'Current API URL: ' + getApiUrl() + '\n' +
              'Request attempted to: ' + getApiUrl() + '/v1/subscribe\n\n' +
              'If this is a production deployment, VITE_API_URL must be set to your backend API URL.\n' +
              'Steps to fix:\n' +
              '1. Deploy your backend API to Vercel, Railway, or another hosting provider\n' +
              '2. Note the backend URL (e.g., https://your-backend.vercel.app)\n' +
              '3. In Vercel dashboard for your FRONTEND project:\n' +
              '   - Go to Settings > Environment Variables\n' +
              '   - Add: VITE_API_URL = https://your-backend.vercel.app/api\n' +
              '4. Redeploy your frontend\n\n' +
              'See DEPLOYMENT.md for detailed instructions.'
            );
          }
        }
        
        setSubmitStatus('error');
        setStatusMessage(errorMessage);
        onError?.(errorMessage);
        return;
      }

      // Parse successful response
      let data: SubscribeResponse;
      if (hasJsonContent) {
        data = await response.json();
      } else {
        // No JSON content in response
        throw new Error('Invalid response format from server');
      }

      if (shouldLogEmailOctopusDebug && data.debug) {
        console.info('EmailOctopus debug (success response):', data.debug);
      } else if (shouldLogEmailOctopusDebug) {
        console.info('EmailOctopus response (success):', {
          status: response.status,
          debugAvailable: Boolean(data.debug),
        });
      }

      if (data.success) {
        setSubmitStatus('success');
        const finalMessage = successMessage || data.message;
        setStatusMessage(finalMessage);
        setEmail('');
        setGdprConsent(false);
        onSuccess?.(validationResult.data.email);
      } else {
        setSubmitStatus('error');
        setStatusMessage(data.message);
        onError?.(data.message);
      }
    } catch (error) {
      setSubmitStatus('error');
      
      // Provide more specific error messages based on the error type
      let errorMessage = 'Unable to connect. Please try again later.';
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to reach the server. Please check your internet connection or try disabling ad blockers.';
      } else if (error instanceof SyntaxError && error.message.includes('JSON')) {
        // JSON parsing error - likely API configuration issue
        errorMessage = 'Service configuration error. Please contact support.';
        console.error('API configuration error: Invalid JSON response. Check VITE_API_URL environment variable.');
      } else if (error instanceof Error) {
        console.error('Subscription error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
      }
      
      setStatusMessage(errorMessage);
      onError?.(errorMessage);
      console.error('Subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div
        className={`bg-white/95 backdrop-blur-sm rounded-lg p-6 text-center shadow-xl ${className}`}
        role="status"
        aria-live="polite"
      >
        <svg
          className="mx-auto h-12 w-12 text-success-green mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-dark-navy mb-2">Success!</h3>
        <p className="text-medium-gray">{statusMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`bg-white/95 backdrop-blur-sm rounded-lg p-6 space-y-4 w-full max-w-md shadow-xl border-2 border-dark-navy/10 ${className}`}>
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-dark-navy mb-1">
          Email Address <span className="text-error-red">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border-2 border-dark-navy rounded-md bg-white text-dark-navy placeholder:text-medium-gray focus:ring-2 focus:ring-primary-blue focus:border-primary-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
          placeholder="your@email.com"
          required
          aria-required="true"
          aria-invalid={!!emailError}
          aria-describedby={emailError ? 'email-error' : undefined}
        />
        {emailError && (
          <p id="email-error" className="text-error-red text-sm mt-1" role="alert">
            {emailError}
          </p>
        )}
      </div>

      {/* GDPR Consent */}
      <GdprConsentCheckbox
        checked={gdprConsent}
        onChange={setGdprConsent}
        error={consentError}
      />

      {/* Regional Disclosure */}
      <p className="text-xs text-dark-navy/80">
        For EU residents: Your data is protected under GDPR. We store only your email address and consent timestamp.
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          backgroundColor: isSubmitting ? '#64748B' : '#1E3A8A',
          color: '#FFFFFF',
        }}
        className="w-full text-white font-bold py-3 px-6 rounded-md transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl border-2 border-primary-blue hover:border-dark-navy hover:!bg-dark-navy"
        onMouseEnter={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.backgroundColor = '#0F172A';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.backgroundColor = '#1E3A8A';
          }
        }}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? 'Joining...' : submitButtonText}
      </button>

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div
          className="bg-error-red/10 border border-error-red text-error-red px-4 py-3 rounded"
          role="alert"
        >
          {statusMessage}
        </div>
      )}
    </form>
  );
};
