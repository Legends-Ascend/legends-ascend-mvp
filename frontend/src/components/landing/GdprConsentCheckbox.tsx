import React from 'react';

interface GdprConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

/**
 * GDPR Consent Checkbox Component
 * Per US-001 requirements: explicit consent with Privacy Policy link
 * Enhanced error visibility per WCAG 2.1 AA and ACCESSIBILITY_REQUIREMENTS.md
 */
export const GdprConsentCheckbox: React.FC<GdprConsentCheckboxProps> = ({
  checked,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-2">
      {/* Wrapper with error state visual feedback */}
      <div 
        className={`flex items-start p-3 rounded-md transition-colors ${
          error 
            ? 'bg-error-red/10 border-2 border-error-red' 
            : 'border-2 border-transparent'
        }`}
      >
        <div className="flex items-center h-5">
          <input
            id="gdpr-consent"
            name="gdpr-consent"
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className={`h-5 w-5 text-primary-blue rounded focus:ring-2 focus:ring-primary-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue ${
              error ? 'border-2 border-error-red' : 'border-2 border-dark-navy'
            }`}
            aria-describedby={error ? 'gdpr-consent-description gdpr-consent-error' : 'gdpr-consent-description'}
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
                onClick={(e) => {
                  e.preventDefault();
                  window.open('/privacy-policy', '_blank', 'noopener,noreferrer');
                }}
                className="text-primary-blue hover:text-primary-blue/80 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue font-semibold cursor-pointer"
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>
      </div>
      {/* Enhanced error message with icon, prominent styling, and screen reader support */}
      {error && (
        <div
          id="gdpr-consent-error"
          className="flex items-start gap-2 p-3 bg-error-red/15 border-l-4 border-error-red rounded"
          role="alert"
          aria-live="polite"
        >
          <span className="text-error-red text-lg flex-shrink-0" aria-hidden="true">
            ⚠️
          </span>
          <p className="text-error-red text-sm font-semibold leading-tight">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};
