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
 * Note: In development, relative URLs (/api) are valid due to Vite proxy configuration.
 * In production, relative URLs are also valid for monorepo deployments with server rewrites.
 */
export function validateApiConfig(): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const apiUrl = getApiUrl();
  
  // Skip validation in development mode - Vite proxy handles /api
  if (!import.meta.env.PROD) {
    return { isValid: true, warnings: [] };
  }
  
  // In production, relative URLs (/api) are valid for monorepo deployments
  // where the frontend and backend are deployed together with server rewrites.
  // We no longer warn about this since it's a supported deployment pattern.
  
  // Check if API URL looks like a frontend URL (common misconfiguration)
  // Only warn if explicitly configured to point to wrong URL
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
 * Returns false for valid deployment patterns (dev mode, monorepo deployments)
 */
export function isProductionMisconfigured(): boolean {
  // In development, relative URLs are handled by Vite proxy - not a misconfiguration
  if (!import.meta.env.PROD) {
    return false;
  }
  
  const apiUrl = getApiUrl();
  
  // Relative URLs are valid in production for monorepo deployments with rewrites
  // Only flag as misconfigured if pointing to an obviously wrong frontend URL
  if (apiUrl.includes('vercel.app') && !apiUrl.includes('backend') && !apiUrl.includes('api.')) {
    return true;
  }
  
  return false;
}
