import React, { useState, useEffect, useRef } from 'react';
import { EmailSignupForm } from './EmailSignupForm';

/**
 * Hero Section Component
 * Per US-001 requirements: Full-viewport hero with professional typography, background media, logo, headline, and signup form
 * Enhanced with professional fonts and typography improvements
 * 
 * Easter Egg Feature: Click the logo 5 times within 3 seconds to reveal login/register links
 */
export const Hero: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [easterEggActivated, setEasterEggActivated] = useState(false);
    const lastClickTimeRef = useRef<number>(0);

        useEffect(() => {
                  setIsVisible(true);
                  // Check if Easter egg was previously activated in this session
                  const activated = sessionStorage.getItem('easterEggActivated');
                  if (activated === 'true') {
                    setEasterEggActivated(true);
                  }
                }, []);

  /**
   * Handle logo click for Easter egg activation
   * Requires 5 clicks within 3 seconds to activate
   */
  const handleLogoClick = () => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    
    let newCount: number;
    
    // Reset counter if more than 3 seconds have passed
    if (timeSinceLastClick > 3000) {
      newCount = 1;
    } else {
      newCount = clickCount + 1;
    }
    
    setClickCount(newCount);
    
    // Trigger Easter egg on 5th click
    if (newCount >= 5) {
      setEasterEggActivated(true);
      sessionStorage.setItem('easterEggActivated', 'true');
      setClickCount(0); // Reset counter after activation
    }
    
    lastClickTimeRef.current = now;
  };

  /**
   * Handle keyboard navigation for Easter egg
   * Enter key triggers the same behavior as clicking
   */
  const handleLogoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogoClick();
    }
  };

  /**
   * Navigate to login or register page
   */
  const handleNavigate = (path: string) => {
    window.location.href = path;
  };
  
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
        {/* Semi-opaque container for improved text/form visibility and contrast */}
        <div className="text-center max-w-4xl mx-auto bg-dark-navy/80 backdrop-blur-md rounded-2xl px-6 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16 shadow-2xl border border-white/10">
          {/* Logo with Easter Egg Click Handler */}
          <div className="mb-8">
            <img
              src="/assets/branding/legends-ascend-logo-transparent.png"
              alt="Legends Ascend"
              className={`h-32 sm:h-40 md:h-56 mx-auto mb-4 md:mb-8 object-contain cursor-pointer transition-all duration-300 ${
                clickCount > 0 ? 'brightness-110 scale-105' : ''
              } ${
                easterEggActivated ? 'drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]' : ''
              }`}
              onClick={handleLogoClick}
              onKeyDown={handleLogoKeyDown}
              tabIndex={0}
              role="button"
              aria-label="Legends Ascend logo (click 5 times for hidden menu)"
            />
          </div>

          {/* Headline - Professional typography with improved contrast */}
          <h1 className={`font-display text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight drop-shadow-2xl mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Forge Your Football Legacy
          </h1>

          {/* Subheadline - Enhanced typography with improved contrast */}
          <p className={`font-sans text-lg sm:text-xl md:text-2xl text-white max-w-2xl mx-auto leading-relaxed drop-shadow-2xl mb-8 md:mb-12 transition-all duration-1000 delay-200 ${
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

          {/* Easter Egg: Hidden Login/Register Links */}
          {easterEggActivated && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn">
              <button
                onClick={() => handleNavigate('/login')}
                className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
                aria-label="Sign in to your account"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavigate('/register')}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                aria-label="Create a new account"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
