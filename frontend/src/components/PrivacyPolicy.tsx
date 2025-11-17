import React, { useState, useEffect } from 'react';

/**
 * Privacy Policy Page - GDPR Compliant
 * Per US-002 requirements: Comprehensive GDPR-compliant Privacy Policy with all required sections
 */
export const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);

  const effectiveDate = '06/11/2025';
  const lastUpdated = '17/11/2025';
  const version = '1.0';

  // Handle scroll events for back-to-top button and active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      // Show back-to-top button after scrolling 400px
      setShowBackToTop(window.scrollY > 400);

      // Update active section based on scroll position
      const sections = document.querySelectorAll('section[id]');
      let currentSection = '';
      
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).clientHeight;
        if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
          currentSection = section.id;
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsTocOpen(false); // Close mobile TOC after clicking
    }
  };

  const tocItems = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'data-controller', label: 'Data Controller Information' },
    { id: 'data-collection', label: 'Data We Collect' },
    { id: 'data-collection-methods', label: 'How We Collect Data' },
    { id: 'legal-basis', label: 'Legal Basis for Processing' },
    { id: 'data-usage', label: 'How We Use Your Data' },
    { id: 'data-sharing', label: 'Data Sharing and Third-Party Services' },
    { id: 'international-transfers', label: 'International Data Transfers' },
    { id: 'data-retention', label: 'Data Retention' },
    { id: 'your-rights', label: 'Your Rights Under GDPR' },
    { id: 'cookies', label: 'Cookies and Tracking Technologies' },
    { id: 'security', label: 'Security Measures' },
    { id: 'children', label: "Children's Privacy" },
    { id: 'changes', label: 'Changes to This Privacy Policy' },
    { id: 'contact', label: 'Contact Us' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-blue focus:text-white focus:rounded focus:outline-2 focus:outline-offset-2 focus:outline-primary-blue"
      >
        Skip to main content
      </a>

      {/* Header with Logo and Breadcrumb */}
      <header className="bg-soft-gray shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <a
                href="/"
                className="text-2xl font-bold text-primary-blue hover:text-accent-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
                aria-label="Legends Ascend - Return to home"
              >
                ⚽ Legends Ascend
              </a>
              <nav aria-label="Breadcrumb" className="mt-1">
                <ol className="flex text-sm text-medium-gray">
                  <li>
                    <a href="/" className="hover:text-primary-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue">
                      Home
                    </a>
                  </li>
                  <li className="mx-2">&gt;</li>
                  <li className="text-dark-navy font-medium">Privacy Policy</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex gap-8">
        {/* Desktop Sidebar Table of Contents */}
        <aside className="hidden lg:block lg:w-64 flex-shrink-0">
          <nav
            className="sticky top-24 bg-soft-gray rounded-lg p-4"
            aria-label="Table of Contents"
          >
            <h2 className="text-lg font-semibold text-dark-navy mb-4">Table of Contents</h2>
            <ul className="space-y-2">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left w-full px-3 py-2 rounded text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue ${
                      activeSection === item.id
                        ? 'bg-primary-blue text-white font-medium'
                        : 'text-medium-gray hover:bg-light-blue hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile Table of Contents Toggle */}
        <div className="lg:hidden fixed bottom-4 left-4 z-50">
          <button
            onClick={() => setIsTocOpen(!isTocOpen)}
            className="bg-primary-blue text-white px-4 py-2 rounded-lg shadow-lg hover:bg-accent-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
            aria-expanded={isTocOpen}
            aria-label="Toggle table of contents"
          >
            {isTocOpen ? 'Close Menu' : 'Contents'}
          </button>
        </div>

        {/* Mobile Table of Contents Overlay */}
        {isTocOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsTocOpen(false)}>
            <nav
              className="absolute bottom-20 left-4 right-4 bg-white rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto"
              aria-label="Table of Contents"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-dark-navy mb-4">Table of Contents</h2>
              <ul className="space-y-2">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="text-left w-full px-3 py-2 rounded text-sm text-primary-blue hover:bg-soft-gray transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main id="main-content" className="flex-1 max-w-4xl">
          <article className="prose prose-lg max-w-none">
            {/* Page Title and Version Information */}
            <header className="mb-8 pb-6 border-b-2 border-soft-gray">
              <h1 className="text-4xl font-bold text-dark-navy mb-4 font-heading">Privacy Policy</h1>
              <div className="flex flex-wrap gap-4 text-sm text-medium-gray">
                <p>
                  <strong className="text-dark-navy">Effective Date:</strong> {effectiveDate}
                </p>
                <p>
                  <strong className="text-dark-navy">Last Updated:</strong> {lastUpdated}
                </p>
                <p>
                  <strong className="text-dark-navy">Version:</strong> {version}
                </p>
              </div>
            </header>

            {/* Section 1: Introduction */}
            <section id="introduction" className="mb-8">
              <h2 className="text-3xl font-semibold text-primary-blue mb-4 font-heading">1. Introduction</h2>
              <p className="mb-4 leading-relaxed text-dark-navy">
                Welcome to Legends Ascend. We are committed to protecting your privacy and ensuring transparency in how we collect, use, and safeguard your personal data. This Privacy Policy explains our practices regarding your personal information when you use our fantasy football management platform.
              </p>
              <p className="mb-4 leading-relaxed text-dark-navy">
                Legends Ascend ("we", "our", or "us") is dedicated to complying with the General Data Protection Regulation (GDPR), UK GDPR, and other applicable data protection laws. This policy applies to all users of our website, mobile applications, and related services.
              </p>
              <p className="leading-relaxed text-dark-navy">
                By using Legends Ascend, you acknowledge that you have read and understood this Privacy Policy and consent to the collection and use of your information as described herein.
              </p>
            </section>

            {/* Section 2: Data Controller Information */}
            <section id="data-controller" className="mb-8">
              <h2 className="text-3xl font-semibold text-primary-blue mb-4 font-heading">2. Data Controller Information</h2>
              <p className="mb-4 leading-relaxed text-dark-navy">
                For the purposes of data protection legislation, the data controller is:
              </p>
              <div className="bg-soft-gray p-4 rounded-lg mb-4">
                <p className="font-medium text-dark-navy">Legends Ascend</p>
                <p className="text-dark-navy">Email: <a href="mailto:privacy@legends-ascend.com" className="text-primary-blue hover:text-accent-gold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue">privacy@legends-ascend.com</a></p>
              </div>
              <p className="leading-relaxed text-dark-navy">
                If you have any questions about how we handle your personal data or wish to exercise your data protection rights, please contact us using the details provided above.
              </p>
            </section>

            {/* Section 3: Data We Collect */}
            <section id="data-collection" className="mb-8">
              <h2 className="text-3xl font-semibold text-primary-blue mb-4 font-heading">3. Data We Collect</h2>
              <p className="mb-4 leading-relaxed text-dark-navy">
                During the MVP phase, we collect minimal personal data necessary to provide our pre-launch services:
              </p>
              
              <h3 className="text-xl font-semibold text-dark-navy mb-3">Current Data Collection (MVP):</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-dark-navy">
                <li><strong>Email Address:</strong> Collected when you sign up for launch updates</li>
                <li><strong>Consent Timestamp:</strong> Date and time when you provided consent</li>
                <li><strong>IP Address (Hashed):</strong> Used for rate limiting and security purposes only</li>
              </ul>

              <h3 className="text-xl font-semibold text-dark-navy mb-3">Future Data Collection (Post-Launch):</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-dark-navy">
                <li><strong>Account Information:</strong> Username, display name, profile picture</li>
                <li><strong>Game Progress:</strong> Team selections, match results, league standings</li>
                <li><strong>User Preferences:</strong> Notification settings, display preferences</li>
                <li><strong>Usage Data:</strong> Page views, feature interactions, session duration</li>
              </ul>

              <h3 className="text-xl font-semibold text-dark-navy mb-3">What We Do NOT Collect:</h3>
              <ul className="list-disc pl-6 space-y-2 text-dark-navy">
                <li>Passwords (when implemented, they will be securely hashed and never stored in plain text)</li>
                <li>Payment information (handled by third-party payment processors)</li>
                <li>Sensitive personal data (race, religion, health data, etc.)</li>
              </ul>
            </section>

            {/* Section 4: How We Collect Data */}
            <section id="data-collection-methods" className="mb-8">
              <h2 className="text-3xl font-semibold text-primary-blue mb-4 font-heading">4. How We Collect Data</h2>
              <p className="mb-4 leading-relaxed text-dark-navy">
                We collect your personal data through the following methods:
              </p>
              
              <h3 className="text-xl font-semibold text-dark-navy mb-3">Direct Submission:</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-dark-navy">
                <li>Email signup form on our landing page</li>
                <li>Account registration forms (future feature)</li>
                <li>Contact forms and support requests</li>
              </ul>

              <h3 className="text-xl font-semibold text-dark-navy mb-3">Automated Technologies:</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-dark-navy">
                <li>Cookies and similar tracking technologies (see Section 11)</li>
                <li>Analytics tools to understand user behavior</li>
                <li>Server logs for security and performance monitoring</li>
              </ul>

              <h3 className="text-xl font-semibold text-dark-navy mb-3">Third-Party Integrations:</h3>
              <ul className="list-disc pl-6 space-y-2 text-dark-navy">
                <li>EmailOctopus (email marketing platform)</li>
                <li>Analytics providers (if implemented)</li>
              </ul>
            </section>

            {/* Section 5: Legal Basis for Processing */}
            <section id="legal-basis" className="mb-8">
              <h2 className="text-3xl font-semibold text-primary-blue mb-4 font-heading">5. Legal Basis for Processing</h2>
              <p className="mb-4 leading-relaxed text-dark-navy">
                Under GDPR Article 6, we process your personal data based on the following legal grounds:
              </p>
              
              <div className="space-y-4">
                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Consent (Article 6(1)(a)):</h3>
                  <p className="text-dark-navy">
                    For marketing emails and launch updates. You provide explicit consent via our email signup form, and you can withdraw consent at any time by unsubscribing.
                  </p>
                </div>

                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Legitimate Interests (Article 6(1)(f)):</h3>
                  <p className="text-dark-navy">
                    For service operation, security, and fraud prevention. We have a legitimate interest in ensuring our platform operates securely and efficiently.
                  </p>
                </div>

                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Contract Fulfilment (Article 6(1)(b)):</h3>
                  <p className="text-dark-navy">
                    Future: When you create an account and use our game services, processing is necessary to perform our contract with you.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: How We Use Your Data */}
            <section id="data-usage" className="mb-8">
              <h2 className="text-3xl font-semibold text-primary-blue mb-4 font-heading">6. How We Use Your Data</h2>
              <p className="mb-4 leading-relaxed text-dark-navy">
                We use your personal data for the following purposes:
              </p>
              
              <h3 className="text-xl font-semibold text-dark-navy mb-3">Current Use (MVP):</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-dark-navy">
                <li>Send marketing emails about game launch and updates</li>
                <li>Provide early access information and exclusive content</li>
                <li>Communicate important announcements</li>
                <li>Ensure platform security and prevent abuse</li>
              </ul>

              <h3 className="text-xl font-semibold text-dark-navy mb-3">Future Use (Post-Launch):</h3>
              <ul className="list-disc pl-6 space-y-2 text-dark-navy">
                <li>Provide and improve game functionality</li>
                <li>Personalise your gaming experience</li>
                <li>Calculate league standings and match results</li>
                <li>Provide customer support</li>
                <li>Analyse usage patterns to improve our services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* Section 7: Data Sharing and Third-Party Services */}
            <section id="data-sharing" className="mb-8">
              <h2 className="text-3xl font-semibold text-primary-blue mb-4 font-heading">7. Data Sharing and Third-Party Services</h2>
              <p className="mb-4 leading-relaxed text-dark-navy">
                We do not sell your personal data to third parties. We share your data only with trusted service providers who help us operate our platform:
              </p>
              
              <div className="space-y-4 mb-4">
                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">EmailOctopus (Email Service Provider):</h3>
                  <p className="text-dark-navy mb-2">
                    We use EmailOctopus to manage our email communications. Your email address and consent data are shared with EmailOctopus to send you marketing emails.
                  </p>
                  <p className="text-dark-navy">
                    <a 
                      href="https://emailoctopus.com/legal/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-blue hover:text-accent-gold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
                    >
                      View EmailOctopus Privacy Policy →
                    </a>
                  </p>
                </div>

                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Hosting Providers:</h3>
                  <p className="text-dark-navy">
                    Our platform is hosted on secure cloud infrastructure. These providers process data on our behalf under strict data processing agreements.
                  </p>
                </div>

                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Analytics Providers (If Implemented):</h3>
                  <p className="text-dark-navy">
                    We may use analytics tools to understand user behavior and improve our services. Any analytics data is anonymised where possible.
                  </p>
                </div>
              </div>

              <p className="font-semibold text-dark-navy">
                We explicitly do NOT sell personal data to third parties for marketing purposes.
              </p>
            </section>

            {/* Section 8: International Data Transfers */}
            <section id="international-transfers" className="mb-8">
              <h2 className="text-3xl font-semibold text-primary-blue mb-4 font-heading">8. International Data Transfers</h2>
              <p className="mb-4 leading-relaxed text-dark-navy">
                Your personal data may be transferred to and processed in countries outside the European Economic Area (EEA) and the United Kingdom. When we transfer data internationally, we ensure appropriate safeguards are in place:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 mb-4 text-dark-navy">
                <li><strong>Standard Contractual Clauses (SCCs):</strong> We use EU-approved Standard Contractual Clauses with our service providers</li>
                <li><strong>Data Processing Agreements:</strong> All third-party processors sign agreements ensuring GDPR compliance</li>
                <li><strong>Adequacy Decisions:</strong> Where applicable, we rely on EU Commission adequacy decisions for certain countries</li>
              </ul>

              <p className="leading-relaxed text-dark-navy">
                EmailOctopus operates with UK/EU data centres and complies with GDPR requirements for international data transfers.
              </p>
            </section>

            {/* Section 9: Data Retention */}
            <section id="data-retention" className="mb-8">
              <h2 className="text-3xl font-semibold text-primary-blue mb-4 font-heading">9. Data Retention</h2>
              <p className="mb-4 leading-relaxed text-dark-navy">
                We retain your personal data only for as long as necessary to fulfil the purposes outlined in this Privacy Policy:
              </p>
              
              <div className="space-y-4">
                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Email Addresses (Marketing):</h3>
                  <p className="text-dark-navy">
                    Retained until you unsubscribe or withdraw consent. Upon unsubscribe, your email is deleted within 30 days.
                  </p>
                </div>

                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Account Data (Future):</h3>
                  <p className="text-dark-navy">
                    Retained for the duration of your account plus 12 months after account closure for legal and security purposes.
                  </p>
                </div>

                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Security Logs:</h3>
                  <p className="text-dark-navy">
                    Retained for 90 days for security monitoring and incident response.
                  </p>
                </div>

                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Backup Data:</h3>
                  <p className="text-dark-navy">
                    Backup copies may be retained for up to 30 days for disaster recovery purposes.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 10: Your Rights Under GDPR */}
            <section id="your-rights" className="mb-8">
              <h2 className="text-3xl font-semibold text-primary-blue mb-4 font-heading">10. Your Rights Under GDPR</h2>
              <p className="mb-4 leading-relaxed text-dark-navy">
                Under the General Data Protection Regulation (GDPR) and UK GDPR, you have the following rights:
              </p>
              
              <div className="space-y-4 mb-4">
                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Right to Access (Article 15):</h3>
                  <p className="text-dark-navy">
                    You can request a copy of all personal data we hold about you.
                  </p>
                </div>

                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Right to Rectification (Article 16):</h3>
                  <p className="text-dark-navy">
                    You can request correction of inaccurate or incomplete personal data.
                  </p>
                </div>

                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Right to Erasure / "Right to be Forgotten" (Article 17):</h3>
                  <p className="text-dark-navy">
                    You can request deletion of your personal data in certain circumstances.
                  </p>
                </div>

                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Right to Restrict Processing (Article 18):</h3>
                  <p className="text-dark-navy">
                    You can request that we limit how we use your personal data.
                  </p>
                </div>

                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Right to Data Portability (Article 20):</h3>
                  <p className="text-dark-navy">
                    You can receive your personal data in a portable, machine-readable format.
                  </p>
                </div>

                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Right to Object (Article 21):</h3>
                  <p className="text-dark-navy">
                    You can object to processing based on legitimate interests or for direct marketing purposes.
                  </p>
                </div>

                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Right to Withdraw Consent (Article 7(3)):</h3>
                  <p className="text-dark-navy">
                    You can withdraw your consent at any time by unsubscribing from emails or contacting us.
                  </p>
                </div>

                <div className="bg-soft-gray p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">Right to Lodge a Complaint (Article 77):</h3>
                  <p className="text-dark-navy mb-2">
                    You have the right to lodge a complaint with a supervisory authority:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-dark-navy">
                    <li><strong>UK:</strong> Information Commissioner's Office (ICO) - <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:text-accent-gold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue">ico.org.uk</a></li>
                    <li><strong>EU:</strong> Your local Data Protection Authority</li>
                  </ul>
                </div>
              </div>

              <div className="bg-light-blue bg-opacity-20 border-l-4 border-primary-blue p-4 rounded">
                <p className="font-semibold text-dark-navy mb-2">How to Exercise Your Rights:</p>
                <p className="text-dark-navy">
                  To exercise any of these rights, please contact us at{' '}
                  <a 
                    href="mailto:privacy@legends-ascend.com" 
                    className="text-primary-blue hover:text-accent-gold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
                  >
                    privacy@legends-ascend.com
                  </a>
                  . We will respond to your request within 30 days.
                </p>
              </div>
            </section>

            {/* Section 11: Cookies and Tracking Technologies */}
            <section id="cookies" className="mb-8">
              <h2 className="text-3xl font-semibold text-primary-blue mb-4 font-heading">11. Cookies and Tracking Technologies</h2>
              <p className="mb-4 leading-relaxed text-dark-navy">
                We use cookies and similar tracking technologies to improve your experience and understand how you use our platform.
              </p>
              
              <h3 className="text-xl font-semibold text-dark-navy mb-3">Types of Cookies We Use:</h3>
              <div className="space-y-4 mb-4">
                <div className="bg-soft-gray p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-dark-navy mb-2">Strictly Necessary Cookies:</h4>
                  <p className="text-dark-navy">
                    Essential for the website to function. These cannot be disabled as they enable core functionality like security and network management.
                  </p>
                </div>

                <div className="bg-soft-gray p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-dark-navy mb-2">Analytics Cookies (If Implemented):</h4>
                  <p className="text-dark-navy">
                    Help us understand how users interact with our platform, allowing us to improve our services.
                  </p>
                </div>

                <div className="bg-soft-gray p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-dark-navy mb-2">Marketing Cookies:</h4>
                  <p className="text-dark-navy">
                    Track your activity to deliver relevant advertisements and measure campaign effectiveness.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-dark-navy mb-3">Managing Cookie Preferences:</h3>
              <p className="leading-relaxed text-dark-navy">
                Most web browsers allow you to control cookies through browser settings. You can set your browser to refuse cookies or delete certain cookies. However, disabling necessary cookies may affect the functionality of our website.
              </p>
            </section>

            {/* Section 12: Security Measures */}
            <section id="security" className="mb-8">
              <h2 className="text-3xl font-semibold text-primary-blue mb-4 font-heading">12. Security Measures</h2>
              <p className="mb-4 leading-relaxed text-dark-navy">
                We implement industry-standard security measures to protect your personal data from unauthorised access, alteration, disclosure, or destruction:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 mb-4 text-dark-navy">
                <li><strong>Encryption:</strong> All data transmitted between your browser and our servers uses TLS 1.3 encryption</li>
                <li><strong>Secure Storage:</strong> Personal data is stored in secure, encrypted databases</li>
                <li><strong>Access Controls:</strong> Strict access controls ensure only authorised personnel can access personal data</li>
                <li><strong>Security Audits:</strong> Regular security audits and vulnerability assessments</li>
                <li><strong>Incident Response:</strong> Documented procedures for responding to security incidents</li>
                <li><strong>Employee Training:</strong> All staff receive data protection and security training</li>
              </ul>

              <div className="bg-warning-orange bg-opacity-20 border-l-4 border-warning-orange p-4 rounded">
                <p className="font-semibold text-dark-navy mb-2">Data Breach Notification:</p>
                <p className="text-dark-navy">
                  In the event of a data breach that poses a risk to your rights and freedoms, we will notify you and the relevant supervisory authority within 72 hours as required by GDPR Article 33.
                </p>
              </div>
            </section>

            {/* Section 13: Children's Privacy */}
            <section id="children" className="mb-8">
              <h2 className="text-3xl font-semibold text-primary-blue mb-4 font-heading">13. Children's Privacy</h2>
              <p className="mb-4 leading-relaxed text-dark-navy">
                Legends Ascend is intended for users aged 13 and above. We do not knowingly collect personal data from children under 13 years of age without parental consent.
              </p>
              
              <div className="bg-soft-gray p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-dark-navy mb-2">Age Requirements:</h3>
                <ul className="list-disc pl-6 space-y-2 text-dark-navy">
                  <li><strong>Minimum Age:</strong> 13 years (GDPR and COPPA compliance)</li>
                  <li><strong>Parental Consent:</strong> Users aged 13-15 in EU member states may require parental consent depending on local laws</li>
                </ul>
              </div>

              <p className="leading-relaxed text-dark-navy">
                If we become aware that we have collected personal data from a child under 13 without parental consent, we will take steps to delete that information as quickly as possible. If you believe we have collected data from a child under 13, please contact us at{' '}
                <a 
                  href="mailto:privacy@legends-ascend.com" 
                  className="text-primary-blue hover:text-accent-gold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
                >
                  privacy@legends-ascend.com
                </a>
                .
              </p>
            </section>

            {/* Section 14: Changes to This Privacy Policy */}
            <section id="changes" className="mb-8">
              <h2 className="text-3xl font-semibold text-primary-blue mb-4 font-heading">14. Changes to This Privacy Policy</h2>
              <p className="mb-4 leading-relaxed text-dark-navy">
                We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or new features. When we make material changes, we will notify you through one or more of the following methods:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 mb-4 text-dark-navy">
                <li>Email notification to registered users</li>
                <li>Prominent notice on our website</li>
                <li>Update to the "Last Updated" date at the top of this page</li>
              </ul>

              <p className="mb-4 leading-relaxed text-dark-navy">
                We encourage you to review this Privacy Policy periodically to stay informed about how we protect your personal data.
              </p>

              <div className="bg-soft-gray p-4 rounded-lg">
                <p className="font-semibold text-dark-navy mb-2">Effective Date of Changes:</p>
                <p className="text-dark-navy">
                  Any changes to this Privacy Policy will become effective when we post the revised policy. Your continued use of Legends Ascend after changes are posted constitutes your acceptance of the revised Privacy Policy.
                </p>
              </div>
            </section>

            {/* Section 15: Contact Us */}
            <section id="contact" className="mb-8">
              <h2 className="text-3xl font-semibold text-primary-blue mb-4 font-heading">15. Contact Us</h2>
              <p className="mb-4 leading-relaxed text-dark-navy">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="bg-primary-blue bg-opacity-10 border-2 border-primary-blue p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-dark-navy mb-4">Privacy Contact Information:</h3>
                <div className="space-y-2 text-dark-navy">
                  <p>
                    <strong>Email:</strong>{' '}
                    <a 
                      href="mailto:privacy@legends-ascend.com" 
                      className="text-primary-blue hover:text-accent-gold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
                    >
                      privacy@legends-ascend.com
                    </a>
                  </p>
                  <p>
                    <strong>General Enquiries:</strong>{' '}
                    <a 
                      href="mailto:hello@legends-ascend.com" 
                      className="text-primary-blue hover:text-accent-gold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
                    >
                      hello@legends-ascend.com
                    </a>
                  </p>
                </div>
              </div>

              <p className="mt-6 leading-relaxed text-dark-navy">
                We aim to respond to all privacy-related enquiries within 30 days in accordance with GDPR requirements.
              </p>
            </section>

            {/* Footer Section */}
            <footer className="mt-12 pt-6 border-t-2 border-soft-gray">
              <div className="text-sm text-medium-gray space-y-2">
                <p>
                  <strong>Effective Date:</strong> {effectiveDate}
                </p>
                <p>
                  <strong>Last Updated:</strong> {lastUpdated}
                </p>
                <p>
                  <strong>Version:</strong> {version}
                </p>
                <p className="mt-4">
                  This Privacy Policy complies with GDPR (EU) 2016/679, UK GDPR, and other applicable data protection regulations.
                </p>
              </div>
            </footer>
          </article>

          {/* Back to Home Link */}
          <div className="mt-12 mb-8">
            <a
              href="/"
              className="inline-flex items-center text-primary-blue hover:text-accent-gold font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue rounded px-2 py-1"
            >
              <span aria-hidden="true">←</span>
              <span className="ml-2">Back to Home</span>
            </a>
          </div>
        </main>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-50 bg-primary-blue text-white p-3 rounded-full shadow-lg hover:bg-accent-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
          aria-label="Back to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          header,
          aside,
          .lg\\:block,
          button,
          nav[aria-label="Breadcrumb"],
          .fixed {
            display: none !important;
          }
          
          main {
            max-width: 100% !important;
            padding: 0 !important;
          }
          
          a[href^="http"]::after {
            content: " (" attr(href) ")";
            font-size: 0.8em;
            color: #666;
          }
          
          a[href^="#"]::after {
            content: "";
          }
          
          h1, h2, h3 {
            page-break-after: avoid;
          }
          
          section {
            page-break-inside: avoid;
          }
          
          @page {
            margin: 2cm;
          }
          
          body {
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            background: #fff;
          }
        }
      `}</style>
    </div>
  );
};
