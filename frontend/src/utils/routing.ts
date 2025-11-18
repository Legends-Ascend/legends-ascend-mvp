/**
 * Check if landing page is enabled via environment variable
 * @returns true if landing page should be enforced, false otherwise
 */
export const isLandingPageEnabled = (): boolean => {
  const envValue = import.meta.env.VITE_LANDING_PAGE_ENABLED;
  return envValue === 'true' || envValue === true;
};
