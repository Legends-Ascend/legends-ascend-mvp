/**
 * Integration Tests for Vercel Deployment Configuration
 * 
 * This test suite validates the complete routing flow from Vercel rewrites
 * through the React app to ensure all pieces work together correctly.
 * 
 * Complements:
 * - pr119-vercel-deployment.test.ts: Infrastructure validation
 * - pr147-login-register-routing.test.ts: Configuration regression checks
 */

import { describe, expect, test } from '@jest/globals';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Vercel Configuration Integration Tests', () => {
  const projectRoot = join(process.cwd(), '..');
  
  describe('End-to-End Routing Flow', () => {
    let vercelConfig: any;
    let appContent: string;

    beforeAll(() => {
      const vercelConfigPath = join(projectRoot, 'vercel.json');
      vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      
      const appPath = join(projectRoot, 'frontend', 'src', 'App.tsx');
      appContent = readFileSync(appPath, 'utf-8');
    });

    test('should route /login through complete flow: Vercel -> index.html -> App.tsx', () => {
      // Step 1: Vercel receives request for /login
      const spaRewrite = vercelConfig.rewrites.find(
        (r: any) => r.source === '/(.*)'
      );
      expect(spaRewrite).toBeDefined();
      expect(spaRewrite.destination).toBe('/index.html');
      
      // Step 2: index.html loads React app which includes App.tsx
      // Step 3: App.tsx checks window.location.pathname and renders LoginPage
      expect(appContent).toContain("path === '/login'");
      expect(appContent).toContain("setCurrentView('login')");
    });

    test('should route /register through complete flow: Vercel -> index.html -> App.tsx', () => {
      // Step 1: Vercel receives request for /register
      const spaRewrite = vercelConfig.rewrites.find(
        (r: any) => r.source === '/(.*)'
      );
      expect(spaRewrite).toBeDefined();
      
      // Step 2: App.tsx handles /register route
      expect(appContent).toContain("path === '/register'");
      expect(appContent).toContain("setCurrentView('register')");
    });

    test('should route API calls directly to backend: /api/v1/subscribe -> api/index.ts', () => {
      // API calls should NOT go through SPA catch-all
      const apiRewrite = vercelConfig.rewrites.find(
        (r: any) => r.source === '/api/:path*'
      );
      expect(apiRewrite).toBeDefined();
      expect(apiRewrite.destination).toBe('/api/index.ts');
      
      // Verify API rewrite comes before SPA catch-all
      const apiIndex = vercelConfig.rewrites.findIndex(
        (r: any) => r.source === '/api/:path*'
      );
      const spaIndex = vercelConfig.rewrites.findIndex(
        (r: any) => r.source === '/(.*)'
      );
      expect(apiIndex).toBeLessThan(spaIndex);
    });

    test('should support all SPA routes through single catch-all rewrite', () => {
      // All these routes should be caught by the SPA catch-all
      const spaRoutes = [
        '/login',
        '/register', 
        '/game',
        '/privacy-policy',
      ];
      
      // Verify core routes are explicitly handled
      spaRoutes.forEach(route => {
        expect(appContent).toContain(route);
      });
      
      // Verify /game/* dynamic routes are handled via pattern matching
      expect(appContent).toContain("path.startsWith('/game/')");
      expect(appContent).toContain("['lineup', 'gacha', 'matches', 'inventory', 'profile']");
    });
  });

  describe('Configuration Consistency Validation', () => {
    test('vercel.json rewrites should support all routes defined in App.tsx', () => {
      const vercelConfigPath = join(projectRoot, 'vercel.json');
      const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      
      const appPath = join(projectRoot, 'frontend', 'src', 'App.tsx');
      const appContent = readFileSync(appPath, 'utf-8');
      
      // Extract routes from App.tsx
      const routePatterns = [
        "path === '/privacy-policy'",
        "path === '/login'",
        "path === '/register'",
        "path === '/game'",
        "path.startsWith('/game/')",
      ];
      
      // Verify all routes are defined in App.tsx
      routePatterns.forEach(pattern => {
        expect(appContent).toContain(pattern);
      });
      
      // Verify vercel.json has catch-all to support these routes
      const spaRewrite = vercelConfig.rewrites.find(
        (r: any) => r.source === '/(.*)'
      );
      expect(spaRewrite).toBeDefined();
      expect(spaRewrite.destination).toBe('/index.html');
    });

    test('should not have any API routes that conflict with frontend routes', () => {
      const apiIndexPath = join(projectRoot, 'api', 'index.ts');
      const apiContent = readFileSync(apiIndexPath, 'utf-8');
      
      // API routes should be under /api/* namespace
      const apiRouteMounts = [
        "app.use('/api/players'",
        "app.use('/api/teams'",
        "app.use('/api/matches'",
        "app.use('/api/v1'",
      ];
      
      apiRouteMounts.forEach(mount => {
        expect(apiContent).toContain(mount);
      });
      
      // No API routes should conflict with frontend routes like /login, /register
      expect(apiContent).not.toContain("app.use('/login'");
      expect(apiContent).not.toContain("app.use('/register'");
      expect(apiContent).not.toContain("app.use('/game'");
    });
  });

  describe('Deployment Readiness Checks', () => {
    test('should have all required files for Vercel deployment', () => {
      const requiredFiles = [
        'vercel.json',
        'api/index.ts',
        'api/package.json',
        'api/tsconfig.json',
        'frontend/package.json',
        'frontend/src/App.tsx',
        'frontend/src/components/auth/LoginPage.tsx',
        'frontend/src/components/auth/RegisterPage.tsx',
      ];
      
      requiredFiles.forEach(file => {
        const filePath = join(projectRoot, file);
        const { existsSync } = require('fs');
        expect(existsSync(filePath)).toBe(true);
      });
    });

    test('should have correct build configuration for production', () => {
      const vercelConfigPath = join(projectRoot, 'vercel.json');
      const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      
      // Build command should build frontend
      expect(vercelConfig.buildCommand).toContain('frontend');
      expect(vercelConfig.buildCommand).toContain('pnpm run build');
      
      // Output directory should point to frontend build output
      expect(vercelConfig.outputDirectory).toBe('frontend/dist');
      
      // Framework should be null (using Zero Config)
      expect(vercelConfig.framework).toBe(null);
    });

    test('should not have performance-impacting misconfigurations', () => {
      const vercelConfigPath = join(projectRoot, 'vercel.json');
      const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      
      // Should not have redundant rewrites
      const uniqueSources = new Set(
        vercelConfig.rewrites.map((r: any) => r.source)
      );
      expect(uniqueSources.size).toBe(vercelConfig.rewrites.length);
      
      // Should not have circular rewrites
      vercelConfig.rewrites.forEach((rewrite: any) => {
        expect(rewrite.source).not.toBe(rewrite.destination);
      });
    });
  });

  describe('Regression Prevention Scenarios', () => {
    test('SCENARIO: Developer adds new frontend route /dashboard', () => {
      // No change to vercel.json should be needed
      // The SPA catch-all (/(.*) -> /index.html) handles all new routes
      const vercelConfigPath = join(projectRoot, 'vercel.json');
      const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      
      const spaRewrite = vercelConfig.rewrites.find(
        (r: any) => r.source === '/(.*)'
      );
      
      // This rewrite catches /dashboard automatically
      expect(spaRewrite).toBeDefined();
    });

    test('SCENARIO: Developer adds new API endpoint /api/v2/players', () => {
      // No change to vercel.json should be needed
      // The API rewrite (/api/:path* -> /api/index.ts) handles all API routes
      const vercelConfigPath = join(projectRoot, 'vercel.json');
      const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      
      const apiRewrite = vercelConfig.rewrites.find(
        (r: any) => r.source === '/api/:path*'
      );
      
      // This rewrite catches /api/v2/players automatically
      expect(apiRewrite).toBeDefined();
      expect(apiRewrite.destination).toBe('/api/index.ts');
    });

    test('SCENARIO: Developer accidentally removes SPA catch-all rewrite', () => {
      // This test will fail if someone removes the /(.*) rewrite
      const vercelConfigPath = join(projectRoot, 'vercel.json');
      const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      
      const spaRewrite = vercelConfig.rewrites.find(
        (r: any) => r.source === '/(.*)'
      );
      
      expect(spaRewrite).toBeDefined();
      // If this test fails, /login and /register will return 404
    });

    test('SCENARIO: Developer accidentally adds deprecated routes property', () => {
      // This test will fail if someone adds routes alongside rewrites
      const vercelConfigPath = join(projectRoot, 'vercel.json');
      const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
      
      expect(vercelConfig.routes).toBeUndefined();
      // If this test fails, Vercel deployment will fail
    });
  });
});
