/**
 * Admin Account Constants
 * Per US-051 specification - centralized admin credentials
 * 
 * NOTE: These credentials are specified in the US-051 requirements.
 * Admin credentials are defined here rather than environment variables 
 * to ensure consistent deployment across all environments.
 * 
 * For production deployments, consider migrating to a more secure 
 * configuration management approach (e.g., AWS Secrets Manager, Vault).
 */

export const ADMIN_USERNAME = 'supersaiyan';
export const ADMIN_PASSWORD = 'wh4t15myd35t1ny!';
export const SALT_ROUNDS = 10;
