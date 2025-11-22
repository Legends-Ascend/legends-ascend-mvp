import React from 'react';
import { NewsletterSubscription } from '../NewsletterSubscription';

/**
 * Email Signup Form Component
 * Per US-001 requirements: email capture with GDPR compliance
 * 
 * Now uses the reusable NewsletterSubscription component with 'beta' tag
 * for backwards compatibility with existing landing page implementation.
 */
export const EmailSignupForm: React.FC = () => {
  return <NewsletterSubscription tag="beta" submitButtonText="Join the Waitlist" />;
};
