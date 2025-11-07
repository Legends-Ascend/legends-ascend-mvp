import React from 'react';

/**
 * Privacy Policy Page (Placeholder)
 * Per US-001 requirements: GDPR compliance requires Privacy Policy
 */
export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-dark-navy mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg text-medium-gray space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-dark-navy mb-4">Overview</h2>
            <p>
              Legends Ascend ("we", "our", or "us") is committed to protecting your privacy and ensuring
              transparency in how we collect, use, and protect your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-dark-navy mb-4">Data We Collect</h2>
            <p>When you subscribe to our email list, we collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your email address</li>
              <li>Timestamp of your consent</li>
              <li>IP address (hashed for security purposes)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-dark-navy mb-4">How We Use Your Data</h2>
            <p>We use your email address solely to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Send you updates about Legends Ascend game launch and features</li>
              <li>Provide early access information and exclusive content</li>
              <li>Communicate important announcements related to the game</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-dark-navy mb-4">Your Rights (GDPR)</h2>
            <p>Under GDPR and international data protection standards, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate personal data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Withdraw Consent:</strong> Unsubscribe at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-dark-navy mb-4">Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal data,
              including encryption (TLS 1.3), secure storage, and regular security audits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-dark-navy mb-4">Third-Party Services</h2>
            <p>
              We use EmailOctopus to manage our email communications. Your data is processed
              in accordance with their privacy policy and GDPR requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-dark-navy mb-4">Contact Us</h2>
            <p>
              For any privacy-related questions or to exercise your data rights, please contact us at:
              <br />
              <a href="mailto:privacy@legends-ascend.com" className="text-primary-blue hover:underline">
                privacy@legends-ascend.com
              </a>
            </p>
          </section>

          <section>
            <p className="text-sm text-medium-gray mt-8">
              Last updated: November 2025
            </p>
          </section>
        </div>

        <div className="mt-12">
          <a
            href="/"
            className="text-primary-blue hover:text-accent-gold font-medium inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};
