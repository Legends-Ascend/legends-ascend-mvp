import React, { useEffect, useState } from 'react';
import { EmailSignupForm } from './EmailSignupForm';

/**
 * Hero Section Component
 * Per US-001 requirements: Full-viewport hero with background media, logo, headline, and signup form
 */
export const Hero: React.FC = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference (WCAG accessibility requirement)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Media */}
      {!prefersReducedMotion ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/backgrounds/stadium.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src="/assets/backgrounds/stadium.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src="/assets/backgrounds/stadium.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      )}

      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-navy/70 via-dark-navy/50 to-dark-navy/80" aria-hidden="true"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Logo */}
          <div className="mb-8">
            <img
              src="/assets/branding/legends-ascend-logo-transparent.png"
              alt="Legends Ascend"
              className="h-32 sm:h-40 md:h-48 lg:h-56 mx-auto"
            />
          </div>

          {/* Headline */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Build Your Football Legacy
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-soft-gray max-w-3xl mx-auto">
            The AI-powered football management game where every decision shapes your destiny
          </p>

          {/* Email Signup Form */}
          <div className="mt-12 flex justify-center">
            <EmailSignupForm />
          </div>
        </div>
      </div>
    </div>
  );
};
