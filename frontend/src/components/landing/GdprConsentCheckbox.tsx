import React from 'react';

interface GdprConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

/**
 * GDPR Consent Checkbox Component
 * Per US-001 requirements: explicit consent with Privacy Policy link
 */
export const GdprConsentCheckbox: React.FC<GdprConsentCheckboxProps> = ({
  checked,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="gdpr-consent"
            name="gdpr-consent"
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="h-5 w-5 text-primary-blue border-2 border-dark-navy rounded focus:ring-2 focus:ring-primary-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
            aria-describedby="gdpr-consent-description"
            aria-invalid={!!error}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="gdpr-consent" className="font-medium text-dark-navy">
            <span id="gdpr-consent-description">
              I consent to receive marketing emails from Legends Ascend and understand that I can
              unsubscribe at any time. By providing my email, I acknowledge that my data will be
              processed in accordance with the{' '}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-blue hover:text-primary-blue/80 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue font-semibold"
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>
      </div>
      {error && (
        <p className="text-error-red text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
