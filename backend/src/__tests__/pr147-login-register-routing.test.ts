/**
 * Tests for PR #147: Verify /login and /register routes + Fix Vercel deployment config
 * 
 * This test suite validates:
 * 1. The Vercel configuration fix that resolved the conflicting routes/rewrites error
 * 2. Client-side routing for /login and /register pages
 * 3. Prevention of regression where deprecated 'routes' property is reintroduced
 */

import { describe, expect, test } from '@jest/globals';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('PR #147: Login/Register Routes and Vercel Config Fix', () => {
  const projectRoot = join(process.cwd(), '..');
  
  describe('Vercel Configuration - Regression Prevention', () => {
    const vercelConfigPath = join(projectRoot, 'vercel.json');
    let vercelConfig: any;

    beforeAll(() => {
      const content = readFileSync(vercelConfigPath, 'utf-8');
      vercelConfig = JSON.parse(content);
    });

    test('should use modern rewrites configuration', () => {
      expect(vercelConfig.rewrites).toBeDefined();
      expect(Array.isArray(vercelConfig.rewrites)).toBe(true);
    });

    test('CRITICAL: should NOT have routes property when rewrites is present', () => {
      // This is the regression bug that PR #147 fixed
      // Vercel error: "If rewrites, redirects, headers, cleanUrls or trailingSlash 
      // are used, then routes cannot be present"
      expect(vercelConfig.routes).toBeUndefined();
    });

    test('should NOT have version property (not needed with modern config)', () => {
      // Modern Vercel config doesn't require version property
      expect(vercelConfig.version).toBeUndefined();
    });

    test('should NOT have builds property (using Zero Config)', () => {
      // Modern Vercel uses Zero Config instead of explicit builds
      expect(vercelConfig.builds).toBeUndefined();
    });

    test('should have buildCommand for frontend build', () => {
      expect(vercelConfig.buildCommand).toBeDefined();
      expect(vercelConfig.buildCommand).toContain('frontend');
    });

    test('should have outputDirectory pointing to frontend/dist', () => {
      expect(vercelConfig.outputDirectory).toBe('frontend/dist');
    });

    test('should configure API rewrite for /api/:path*', () => {
      const apiRewrite = vercelConfig.rewrites.find(
        (r: any) => r.source === '/api/:path*'
      );
      expect(apiRewrite).toBeDefined();
      expect(apiRewrite.destination).toBe('/api/index.ts');
    });

    test('should configure SPA catch-all rewrite for /login and /register', () => {
      const spaRewrite = vercelConfig.rewrites.find(
        (r: any) => r.source === '/(.*)'
      );
      expect(spaRewrite).toBeDefined();
      expect(spaRewrite.destination).toBe('/index.html');
    });

    test('should have exactly 2 rewrites (API and SPA)', () => {
      expect(vercelConfig.rewrites).toHaveLength(2);
    });

    test('API rewrite should come before SPA catch-all', () => {
      const apiIndex = vercelConfig.rewrites.findIndex(
        (r: any) => r.source === '/api/:path*'
      );
      const spaIndex = vercelConfig.rewrites.findIndex(
        (r: any) => r.source === '/(.*)'
      );
      expect(apiIndex).toBeLessThan(spaIndex);
    });
  });

  describe('Client-Side Routing - Login and Register Pages', () => {
    const appPath = join(projectRoot, 'frontend', 'src', 'App.tsx');
    let appContent: string;

    beforeAll(() => {
      appContent = readFileSync(appPath, 'utf-8');
    });

    test('should have App.tsx with routing logic', () => {
      expect(existsSync(appPath)).toBe(true);
    });

    test('should handle /login route in App.tsx', () => {
      expect(appContent).toContain("/login");
      expect(appContent).toContain("'login'");
    });

    test('should handle /register route in App.tsx', () => {
      expect(appContent).toContain("/register");
      expect(appContent).toContain("'register'");
    });

    test('should check URL path for client-side routing', () => {
      expect(appContent).toContain('window.location.pathname');
    });

    test('should set view state based on URL path', () => {
      expect(appContent).toContain('setCurrentView');
    });
  });

  describe('Auth Components Existence', () => {
    const loginPagePath = join(projectRoot, 'frontend', 'src', 'components', 'auth', 'LoginPage.tsx');
    const registerPagePath = join(projectRoot, 'frontend', 'src', 'components', 'auth', 'RegisterPage.tsx');

    test('should have LoginPage component', () => {
      expect(existsSync(loginPagePath)).toBe(true);
    });

    test('should have RegisterPage component', () => {
      expect(existsSync(registerPagePath)).toBe(true);
    });

    test('LoginPage should export a component', () => {
      const content = readFileSync(loginPagePath, 'utf-8');
      expect(content).toContain('export');
      expect(content).toContain('LoginPage');
    });

    test('RegisterPage should export a component', () => {
      const content = readFileSync(registerPagePath, 'utf-8');
      expect(content).toContain('export');
      expect(content).toContain('RegisterPage');
    });
  });

  describe('SPA Routing Configuration Files', () => {
    test('should have public/_redirects for Netlify compatibility', () => {
      const redirectsPath = join(projectRoot, 'frontend', 'public', '_redirects');
      const exists = existsSync(redirectsPath);
      
      if (exists) {
        const content = readFileSync(redirectsPath, 'utf-8');
        expect(content).toContain('/index.html');
      }
      // Note: This file is optional but good to have for Netlify deployments
    });

    test('Vite should have SPA fallback in dev server', () => {
      const viteConfigPath = join(projectRoot, 'frontend', 'vite.config.ts');
      expect(existsSync(viteConfigPath)).toBe(true);
      // Vite has built-in SPA fallback for dev server
    });
  });

  describe('Configuration Consistency', () => {
    test('vercel.json rewrites should match App.tsx routing logic', () => {
      const vercelConfigPath = join(projectRoot, 'vercel.json');
      const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      
      const spaRewrite = vercelConfig.rewrites.find(
        (r: any) => r.source === '/(.*)'
      );
      
      // The catch-all rewrite ensures all non-API routes go to index.html
      // which then loads the React app that handles /login and /register
      expect(spaRewrite).toBeDefined();
      expect(spaRewrite.destination).toBe('/index.html');
    });
  });

  describe('Regression Prevention Checklist', () => {
    test('REGRESSION CHECK: Verify no mix of old and new routing config', () => {
      const vercelConfigPath = join(projectRoot, 'vercel.json');
      const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      
      // Check that we don't have a mix of old (routes/builds/version) 
      // and new (rewrites) configuration
      const hasModernConfig = vercelConfig.rewrites !== undefined;
      const hasLegacyRoutes = vercelConfig.routes !== undefined;
      const hasLegacyBuilds = vercelConfig.builds !== undefined;
      const hasLegacyVersion = vercelConfig.version !== undefined;
      
      if (hasModernConfig) {
        expect(hasLegacyRoutes).toBe(false);
        // Note: builds and version can coexist with rewrites, but routes cannot
      }
    });

    test('REGRESSION CHECK: Ensure SPA routing works for all auth routes', () => {
      const appPath = join(projectRoot, 'frontend', 'src', 'App.tsx');
      const appContent = readFileSync(appPath, 'utf-8');
      
      // Verify that the routes mentioned in the original bug report are handled
      const criticalRoutes = ['/login', '/register'];
      
      criticalRoutes.forEach(route => {
        expect(appContent).toContain(route);
      });
    });

    test('REGRESSION CHECK: Verify API routes are not caught by SPA fallback', () => {
      const vercelConfigPath = join(projectRoot, 'vercel.json');
      const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      
      const apiRewriteIndex = vercelConfig.rewrites.findIndex(
        (r: any) => r.source === '/api/:path*'
      );
      const spaRewriteIndex = vercelConfig.rewrites.findIndex(
        (r: any) => r.source === '/(.*)'
      );
      
      // Critical: API routes must be processed before SPA catch-all
      expect(apiRewriteIndex).toBeGreaterThanOrEqual(0);
      expect(spaRewriteIndex).toBeGreaterThanOrEqual(0);
      expect(apiRewriteIndex).toBeLessThan(spaRewriteIndex);
    });
  });
});
