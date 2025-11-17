import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PrivacyPolicy } from '../PrivacyPolicy';

describe('PrivacyPolicy Component', () => {
  beforeEach(() => {
    // Mock scrollTo
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering and Structure', () => {
    it('should render the Privacy Policy page', () => {
      render(<PrivacyPolicy />);
      expect(screen.getByRole('heading', { name: /privacy policy/i, level: 1 })).toBeInTheDocument();
    });

    it('should display version control information', () => {
      render(<PrivacyPolicy />);
      expect(screen.getAllByText(/Effective Date:/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Last Updated:/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Version:/i).length).toBeGreaterThan(0);
    });

    it('should display all 15 required GDPR sections', () => {
      render(<PrivacyPolicy />);
      
      // Check for all section headings
      expect(screen.getByRole('heading', { name: /1\. Introduction/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /2\. Data Controller Information/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /3\. Data We Collect/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /4\. How We Collect Data/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /5\. Legal Basis for Processing/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /6\. How We Use Your Data/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /7\. Data Sharing and Third-Party Services/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /8\. International Data Transfers/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /9\. Data Retention/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /10\. Your Rights Under GDPR/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /11\. Cookies and Tracking Technologies/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /12\. Security Measures/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /13\. Children's Privacy/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /14\. Changes to This Privacy Policy/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /15\. Contact Us/i })).toBeInTheDocument();
    });

    it('should have proper semantic HTML structure', () => {
      render(<PrivacyPolicy />);
      
      // Check for main semantic elements (some may appear multiple times)
      expect(screen.getAllByRole('banner').length).toBeGreaterThan(0); // header (page and article headers)
      expect(screen.getByRole('main')).toBeInTheDocument(); // main
      expect(screen.getByRole('article')).toBeInTheDocument(); // article
      expect(screen.getAllByRole('navigation').length).toBeGreaterThanOrEqual(2); // breadcrumb and TOC
    });

    it('should display breadcrumb navigation', () => {
      render(<PrivacyPolicy />);
      
      const breadcrumb = screen.getByRole('navigation', { name: /breadcrumb/i });
      expect(breadcrumb).toBeInTheDocument();
      expect(screen.getAllByText(/Home/i).length).toBeGreaterThan(0);
      // Privacy Policy appears in heading and breadcrumb
      expect(screen.getAllByText(/Privacy Policy/i).length).toBeGreaterThan(0);
    });
  });

  describe('Table of Contents', () => {
    it('should render Table of Contents with all sections', () => {
      render(<PrivacyPolicy />);
      
      const toc = screen.getByRole('navigation', { name: /table of contents/i });
      expect(toc).toBeInTheDocument();
      
      // Check for TOC items
      expect(screen.getByRole('button', { name: /Introduction/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Data Controller Information/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Your Rights Under GDPR/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Contact Us/i })).toBeInTheDocument();
    });

    it('should scroll to section when TOC link is clicked', () => {
      render(<PrivacyPolicy />);
      
      const introButton = screen.getByRole('button', { name: /Introduction/i });
      fireEvent.click(introButton);
      
      // Check if the section exists
      const introSection = document.getElementById('introduction');
      expect(introSection).toBeInTheDocument();
    });

    it('should open and close mobile TOC', () => {
      render(<PrivacyPolicy />);
      
      const toggleButton = screen.getByRole('button', { name: /toggle table of contents/i });
      expect(toggleButton).toBeInTheDocument();
      
      // Initially closed
      expect(toggleButton).toHaveTextContent(/Contents/i);
      
      // Click to open
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveTextContent(/Close Menu/i);
      
      // Click to close
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveTextContent(/Contents/i);
    });
  });

  describe('Accessibility Features', () => {
    it('should have a skip link to main content', () => {
      render(<PrivacyPolicy />);
      
      const skipLink = screen.getByRole('link', { name: /skip to main content/i });
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('should have proper heading hierarchy', () => {
      render(<PrivacyPolicy />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent(/Privacy Policy/i);
      
      const h2Headings = screen.getAllByRole('heading', { level: 2 });
      expect(h2Headings.length).toBeGreaterThan(0);
      
      const h3Headings = screen.getAllByRole('heading', { level: 3 });
      expect(h3Headings.length).toBeGreaterThan(0);
    });

    it('should have proper ARIA labels for navigation', () => {
      render(<PrivacyPolicy />);
      
      expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: /table of contents/i })).toBeInTheDocument();
    });

    it('should have accessible links with proper attributes', () => {
      render(<PrivacyPolicy />);
      
      const homeLink = screen.getByRole('link', { name: /Legends Ascend - Return to home/i });
      expect(homeLink).toHaveAttribute('href', '/');
      
      const emailLink = screen.getAllByRole('link', { name: /privacy@legends-ascend.com/i })[0];
      expect(emailLink).toHaveAttribute('href', 'mailto:privacy@legends-ascend.com');
    });

    it('should have external links with proper rel attributes', () => {
      render(<PrivacyPolicy />);
      
      const emailOctopusLink = screen.getByRole('link', { name: /View EmailOctopus Privacy Policy/i });
      expect(emailOctopusLink).toHaveAttribute('target', '_blank');
      expect(emailOctopusLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('GDPR Content Requirements', () => {
    it('should display EmailOctopus as third-party service', () => {
      render(<PrivacyPolicy />);
      
      expect(screen.getAllByText(/EmailOctopus/i).length).toBeGreaterThan(0);
      expect(screen.getByRole('link', { name: /View EmailOctopus Privacy Policy/i })).toBeInTheDocument();
    });

    it('should list all GDPR rights', () => {
      render(<PrivacyPolicy />);
      
      expect(screen.getAllByText(/Right to Access/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Right to Rectification/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Right to Erasure/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Right to Restrict Processing/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Right to Data Portability/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Right to Object/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Right to Withdraw Consent/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Right to Lodge a Complaint/i).length).toBeGreaterThan(0);
    });

    it('should mention GDPR legal basis for processing', () => {
      render(<PrivacyPolicy />);
      
      expect(screen.getByText(/Consent \(Article 6\(1\)\(a\)\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Legitimate Interests \(Article 6\(1\)\(f\)\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Contract Fulfilment \(Article 6\(1\)\(b\)\)/i)).toBeInTheDocument();
    });

    it('should display privacy contact email', () => {
      render(<PrivacyPolicy />);
      
      const emailLinks = screen.getAllByRole('link', { name: /privacy@legends-ascend.com/i });
      expect(emailLinks.length).toBeGreaterThan(0);
      emailLinks.forEach(link => {
        expect(link).toHaveAttribute('href', 'mailto:privacy@legends-ascend.com');
      });
    });

    it('should mention UK ICO for complaints', () => {
      render(<PrivacyPolicy />);
      
      expect(screen.getByText(/Information Commissioner's Office \(ICO\)/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /ico.org.uk/i })).toBeInTheDocument();
    });

    it('should mention data retention policies', () => {
      render(<PrivacyPolicy />);
      
      expect(screen.getByText(/Email Addresses \(Marketing\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Security Logs/i)).toBeInTheDocument();
      expect(screen.getByText(/Backup Data/i)).toBeInTheDocument();
    });

    it('should state minimum age requirement', () => {
      render(<PrivacyPolicy />);
      
      expect(screen.getAllByText(/13 years/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/GDPR and COPPA compliance/i).length).toBeGreaterThan(0);
    });
  });

  describe('Interactive Features', () => {
    it('should show back-to-top button when scrolling', async () => {
      render(<PrivacyPolicy />);
      
      // Initially button should not be visible (showBackToTop is false)
      // We can't easily test this without actually scrolling in jsdom
      // But we can check the button exists when it should appear
      
      // Simulate scroll event
      Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
      fireEvent.scroll(window);
      
      await waitFor(() => {
        const backToTopButton = screen.getByRole('button', { name: /back to top/i });
        expect(backToTopButton).toBeInTheDocument();
      });
    });

    it('should scroll to top when back-to-top button is clicked', async () => {
      render(<PrivacyPolicy />);
      
      // Set scroll position
      Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
      fireEvent.scroll(window);
      
      await waitFor(() => {
        const backToTopButton = screen.getByRole('button', { name: /back to top/i });
        fireEvent.click(backToTopButton);
        expect(window.scrollTo).toHaveBeenCalled();
      });
    });
  });

  describe('Navigation Links', () => {
    it('should have a working "Back to Home" link', () => {
      render(<PrivacyPolicy />);
      
      const backLink = screen.getByRole('link', { name: /Back to Home/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/');
    });

    it('should have logo linking to home', () => {
      render(<PrivacyPolicy />);
      
      const logoLink = screen.getByRole('link', { name: /Legends Ascend - Return to home/i });
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveAttribute('href', '/');
    });
  });

  describe('Branding Compliance', () => {
    it('should use brand colors from Tailwind config', () => {
      const { container } = render(<PrivacyPolicy />);
      
      // Check that brand color classes are used
      expect(container.querySelector('.text-primary-blue')).toBeInTheDocument();
      expect(container.querySelector('.text-dark-navy')).toBeInTheDocument();
      expect(container.querySelector('.bg-soft-gray')).toBeInTheDocument();
    });

    it('should have proper font styling', () => {
      const { container } = render(<PrivacyPolicy />);
      
      expect(container.querySelector('.font-heading')).toBeInTheDocument();
      expect(container.querySelector('.font-semibold')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should show desktop TOC on large screens', () => {
      render(<PrivacyPolicy />);
      
      const desktopTOC = document.querySelector('.lg\\:block');
      expect(desktopTOC).toBeInTheDocument();
    });

    it('should have mobile TOC toggle button', () => {
      render(<PrivacyPolicy />);
      
      const mobileToggle = screen.getByRole('button', { name: /toggle table of contents/i });
      expect(mobileToggle).toBeInTheDocument();
    });
  });

  describe('Print Styles', () => {
    it('should include print stylesheet', () => {
      const { container } = render(<PrivacyPolicy />);
      
      const styleTag = container.querySelector('style');
      expect(styleTag).toBeInTheDocument();
      expect(styleTag?.textContent).toContain('@media print');
    });
  });

  describe('Date Formatting', () => {
    it('should display dates in UK format (DD/MM/YYYY)', () => {
      render(<PrivacyPolicy />);
      
      // Check for dates in DD/MM/YYYY format - dates appear multiple times in the document
      expect(screen.getAllByText(/06\/11\/2025/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/17\/11\/2025/).length).toBeGreaterThan(0);
    });

    it('should display version number', () => {
      render(<PrivacyPolicy />);
      
      expect(screen.getAllByText(/1\.0/i).length).toBeGreaterThan(0);
    });
  });
});
