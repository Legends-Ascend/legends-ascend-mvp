import React, { useState } from 'react';
import { SubscribeFormSchema, type SubscribeFormData, type SubscribeResponse } from '../../types/subscribe';
import { GdprConsentCheckbox } from './GdprConsentCheckbox';

/**
 * Email Signup Form Component
 * Per US-001 requirements: email capture with GDPR compliance
 */
export const EmailSignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [consentError, setConsentError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/v1/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: validationResult.data.email,
          gdprConsent: validationResult.data.gdprConsent,
          timestamp: new Date().toISOString(),
        }),
      });

      const data: SubscribeResponse = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setStatusMessage(data.message);
        setEmail('');
        setGdprConsent(false);
      } else {
        setSubmitStatus('error');
        setStatusMessage(data.message);
      }
    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage('Unable to connect. Please try again later.');
      console.error('Subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div
        className="bg-soft-gray rounded-lg p-6 text-center"
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
    <form onSubmit={handleSubmit} className="bg-soft-gray/90 backdrop-blur-sm rounded-lg p-6 space-y-4 w-full max-w-md">
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
          className="w-full px-4 py-2 border border-medium-gray rounded-md focus:ring-2 focus:ring-primary-blue focus:border-primary-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
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
      <p className="text-xs text-medium-gray">
        For EU residents: Your data is protected under GDPR. We store only your email address and consent timestamp.
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary-blue hover:bg-accent-gold text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue disabled:opacity-50 disabled:cursor-not-allowed"
        aria-busy={isSubmitting}
      >
        {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
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
