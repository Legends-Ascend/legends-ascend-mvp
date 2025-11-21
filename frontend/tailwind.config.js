/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from BRANDING_GUIDELINE.md
        'primary-blue': '#1E3A8A',
        'accent-gold': '#F59E0B',
        'dark-navy': '#0F172A',
        'light-blue': '#60A5FA',
        'soft-gray': '#F1F5F9',
        'medium-gray': '#64748B',
        'success-green': '#10B981',
        'warning-orange': '#F97316',
        'error-red': '#EF4444',
        'info-blue': '#3B82F6',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'Inter', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
