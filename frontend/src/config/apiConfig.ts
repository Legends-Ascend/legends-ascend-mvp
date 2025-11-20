/**
 * API Configuration and Validation
 * 
 * This module handles API URL configuration and provides deployment validation
 * to catch common misconfigurations early.
 */

/**
 * Get the configured API URL
 * Returns the VITE_API_URL environment variable or falls back to '/api' for development
 */
export function getApiUrl(): string {
  return import.meta.env.VITE_API_URL || '/api';
}

/**
 * Validate API configuration for production deployments
 * This helps catch the common issue where VITE_API_URL is not set in production
 * 
 * Note: In development, relative URLs (/api) are valid due to Vite proxy configuration
 */
export function validateApiConfig(): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const apiUrl = getApiUrl();
  
  // Only validate in production builds
  // In development, the Vite proxy handles /api requests correctly
  if (!import.meta.env.PROD) {
    return { isValid: true, warnings: [] };
  }
  
  // In production builds, check if we're using a relative URL
  // This indicates VITE_API_URL was not set at build time
  if (apiUrl.startsWith('/')) {
    warnings.push(
      'VITE_API_URL is not configured. API requests will fail in production. ' +
      'Please set VITE_API_URL in your deployment environment variables to your backend API URL ' +
      '(e.g., https://your-backend.vercel.app/api)'
    );
  }
  
  // Check if API URL looks like a frontend URL (common misconfiguration)
  if (apiUrl.includes('vercel.app') && !apiUrl.includes('backend') && !apiUrl.includes('api.')) {
    warnings.push(
      'VITE_API_URL appears to point to a frontend deployment. ' +
      'It should point to your backend API deployment instead.'
    );
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
  };
}

/**
 * Log configuration warnings to console
 * Should be called on app initialization
 */
export function logConfigWarnings(): void {
  const { warnings } = validateApiConfig();
  
  if (warnings.length > 0) {
    console.warn('⚠️ API Configuration Issues Detected:');
    warnings.forEach((warning, index) => {
      console.warn(`${index + 1}. ${warning}`);
    });
    console.warn('\nFor deployment instructions, see: DEPLOYMENT.md');
  }
}

/**
 * Check if we're in a production environment with invalid configuration
 * Returns false in development mode since Vite proxy handles /api correctly
 */
export function isProductionMisconfigured(): boolean {
  // In development, relative URLs are handled by Vite proxy - not a misconfiguration
  if (!import.meta.env.PROD) {
    return false;
  }
  
  const apiUrl = getApiUrl();
  
  // Production should use absolute URLs
  return apiUrl.startsWith('/');
}
