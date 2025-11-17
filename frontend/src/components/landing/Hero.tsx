import React, { useState, useEffect } from 'react';
import { EmailSignupForm } from './EmailSignupForm';

/**
 * Hero Section Component
 * Per US-001 requirements: Full-viewport hero with professional typography, background media, logo, headline, and signup form
 * Enhanced with professional fonts and typography improvements
 */
export const Hero: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

        useEffect(() => {
                  setIsVisible(true);
                }, []);
  
  return (
    <div>
      {/* Background Image */}
      <img
        src="/assets/backgrounds/stadium.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-navy/70 via-dark-navy/50 to-dark-navy/80" aria-hidden="true"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <img
              src="/assets/branding/legends-ascend-logo-transparent.png"
              alt="Legends Ascend"
              className="h-32 sm:h-40 md:h-56 mx-auto mb-4 md:mb-8 object-contain"
            />
          </div>

          {/* Headline - Professional typography */}
          <h1 className={`font-display text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight drop-shadow-lg mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Forge Your Football Legacy
          </h1>

          {/* Subheadline - Enhanced typography */}
          <p className={`font-sans text-lg sm:text-xl md:text-2xl text-white max-w-2xl mx-auto leading-relaxed drop-shadow-lg mb-8 md:mb-12 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Experience the <span className="font-bold text-cyan-400">AI-powered</span> football management game where every choice defines your journey.
          </p>

          {/* Email Signup Form */}
          <div className={`flex justify-center transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <EmailSignupForm />
          </div>
        </div>
      </div>
    </div>
  );
};
