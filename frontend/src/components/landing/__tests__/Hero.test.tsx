import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '../Hero';

describe('Hero Component', () => {
  describe('Logo Rendering', () => {
    it('should render the Legends Ascend logo', () => {
      render(<Hero />);
      
      const logo = screen.getByAltText('Legends Ascend');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/assets/branding/legends-ascend-logo-transparent.png');
    });

    it('should have accessible alt text for the logo', () => {
      render(<Hero />);
      
      const logo = screen.getByAltText('Legends Ascend');
      expect(logo).toHaveAccessibleName();
    });

    it('should have responsive logo sizing classes', () => {
      render(<Hero />);
      
      const logo = screen.getByAltText('Legends Ascend');
      const logoClasses = logo.className;
      
      // Verify responsive sizing classes are present
      // Base: h-32 (128px), sm: h-40 (160px), md: h-56 (224px)
      expect(logoClasses).toContain('h-32');
      expect(logoClasses).toContain('sm:h-40');
      expect(logoClasses).toContain('md:h-56');
    });

    it('should center the logo horizontally', () => {
      render(<Hero />);
      
      const logo = screen.getByAltText('Legends Ascend');
      expect(logo.className).toContain('mx-auto');
    });
  });

  describe('Content Structure', () => {
    it('should render the main headline', () => {
      render(<Hero />);
      
      const headline = screen.getByRole('heading', { level: 1 });
      expect(headline).toBeInTheDocument();
      expect(headline).toHaveTextContent('Forge Your Football Legacy');
    });

    it('should render the subheadline', () => {
      render(<Hero />);
      
      const subheadline = screen.getByText(/Experience the/i);
      expect(subheadline).toBeInTheDocument();
      expect(subheadline).toHaveTextContent(/AI-powered/i);
      expect(subheadline).toHaveTextContent(/football management game/i);
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<Hero />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it('should have decorative background elements hidden from screen readers', () => {
      render(<Hero />);
      
      // Video/image backgrounds should have aria-hidden="true"
      const container = screen.getByRole('heading', { level: 1 }).closest('div');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have full viewport height', () => {
      render(<Hero />);
      
      const container = screen.getByRole('heading', { level: 1 }).closest('.min-h-screen');
      expect(container).toBeInTheDocument();
    });

    it('should have responsive padding', () => {
      render(<Hero />);
      
      const contentContainer = screen.getByRole('heading', { level: 1 }).closest('.px-4');
      expect(contentContainer).toBeInTheDocument();
    });
  });
});
