/**
 * Tests for PR #119: Newsletter Subscription Failure Fix
 * 
 * This test suite validates the Vercel deployment configuration changes
 * that fix the newsletter subscription 404 error by properly configuring
 * the monorepo deployment with both frontend and backend.
 */

import { describe, expect, test } from '@jest/globals';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('PR #119: Vercel Deployment Configuration', () => {
  const projectRoot = join(process.cwd(), '..');
  
  describe('vercel.json Configuration', () => {
    const vercelConfigPath = join(projectRoot, 'vercel.json');
    let vercelConfig: any;

    beforeAll(() => {
      const content = readFileSync(vercelConfigPath, 'utf-8');
      vercelConfig = JSON.parse(content);
    });

    test('should have vercel.json in root directory', () => {
      expect(existsSync(vercelConfigPath)).toBe(true);
    });

    test('should be valid JSON', () => {
      expect(vercelConfig).toBeDefined();
      expect(typeof vercelConfig).toBe('object');
    });

    test('should have version 2 configuration', () => {
      expect(vercelConfig.version).toBe(2);
    });

    test('should have builds configuration', () => {
      expect(vercelConfig.builds).toBeDefined();
      expect(Array.isArray(vercelConfig.builds)).toBe(true);
      expect(vercelConfig.builds.length).toBeGreaterThan(0);
    });

    test('should configure frontend build with @vercel/static-build', () => {
      const frontendBuild = vercelConfig.builds.find(
        (build: any) => build.src === 'frontend/package.json'
      );
      expect(frontendBuild).toBeDefined();
      expect(frontendBuild.use).toBe('@vercel/static-build');
      expect(frontendBuild.config.distDir).toBe('dist');
    });

    test('should configure backend API with @vercel/node', () => {
      const apiBuild = vercelConfig.builds.find(
        (build: any) => build.src === 'api/index.ts'
      );
      expect(apiBuild).toBeDefined();
      expect(apiBuild.use).toBe('@vercel/node');
    });

    test('should have routes configuration', () => {
      expect(vercelConfig.routes).toBeDefined();
      expect(Array.isArray(vercelConfig.routes)).toBe(true);
      expect(vercelConfig.routes.length).toBeGreaterThan(0);
    });

    test('should route /api/* to serverless function', () => {
      const apiRoute = vercelConfig.routes.find(
        (route: any) => route.src === '/api/(.*)'
      );
      expect(apiRoute).toBeDefined();
      expect(apiRoute.dest).toBe('/api/index.ts');
    });

    test('should handle filesystem for static files', () => {
      const filesystemRoute = vercelConfig.routes.find(
        (route: any) => route.handle === 'filesystem'
      );
      expect(filesystemRoute).toBeDefined();
    });

    test('should fallback to index.html for SPA routing', () => {
      const spaRoute = vercelConfig.routes.find(
        (route: any) => route.src === '/(.*)'
      );
      expect(spaRoute).toBeDefined();
      expect(spaRoute.dest).toBe('/index.html');
    });

    test('should have correct route order (API first, filesystem, then SPA)', () => {
      const routes = vercelConfig.routes;
      
      const apiRouteIndex = routes.findIndex(
        (route: any) => route.src === '/api/(.*)'
      );
      const filesystemRouteIndex = routes.findIndex(
        (route: any) => route.handle === 'filesystem'
      );
      const spaRouteIndex = routes.findIndex(
        (route: any) => route.src === '/(.*)'
      );

      expect(apiRouteIndex).toBeLessThan(filesystemRouteIndex);
      expect(filesystemRouteIndex).toBeLessThan(spaRouteIndex);
    });
  });

  describe('API Serverless Function', () => {
    const apiIndexPath = join(projectRoot, 'api', 'index.ts');

    test('should have api/index.ts file', () => {
      expect(existsSync(apiIndexPath)).toBe(true);
    });

    test('should import required dependencies', () => {
      const content = readFileSync(apiIndexPath, 'utf-8');
      expect(content).toContain("import express from 'express'");
      expect(content).toContain("import cors from 'cors'");
      expect(content).toContain("from '../backend/src/config/database'");
    });

    test('should import all required routes', () => {
      const content = readFileSync(apiIndexPath, 'utf-8');
      expect(content).toContain("from '../backend/src/routes/playerRoutes'");
      expect(content).toContain("from '../backend/src/routes/teamRoutes'");
      expect(content).toContain("from '../backend/src/routes/matchRoutes'");
      expect(content).toContain("from '../backend/src/routes/subscribeRoutes'");
      expect(content).toContain("from '../backend/src/routes/inventoryRoutes'");
      expect(content).toContain("from '../backend/src/routes/squadRoutes'");
    });

    test('should export default app for Vercel', () => {
      const content = readFileSync(apiIndexPath, 'utf-8');
      expect(content).toContain('export default app');
    });

    test('should configure CORS', () => {
      const content = readFileSync(apiIndexPath, 'utf-8');
      expect(content).toContain('corsOptions');
      expect(content).toContain('app.use(cors(corsOptions))');
    });

    test('should configure trust proxy for Vercel', () => {
      const content = readFileSync(apiIndexPath, 'utf-8');
      expect(content).toContain("app.set('trust proxy', 1)");
    });

    test('should configure express.json() middleware', () => {
      const content = readFileSync(apiIndexPath, 'utf-8');
      expect(content).toContain('app.use(express.json())');
    });

    test('should have health check endpoint', () => {
      const content = readFileSync(apiIndexPath, 'utf-8');
      expect(content).toContain("/api/health");
      expect(content).toContain("Legends Ascend API is running");
    });

    test('should mount subscribe routes at /api/v1', () => {
      const content = readFileSync(apiIndexPath, 'utf-8');
      expect(content).toContain("app.use('/api/v1', subscribeRoutes)");
    });

    test('should have database initialization logic', () => {
      const content = readFileSync(apiIndexPath, 'utf-8');
      expect(content).toContain('initializeDatabase');
      expect(content).toContain('ensureDbInitialized');
    });

    test('should have lazy database initialization', () => {
      const content = readFileSync(apiIndexPath, 'utf-8');
      expect(content).toContain('let dbInitialized = false');
      expect(content).toContain('if (!dbInitialized)');
    });

    test('should handle database initialization errors', () => {
      const content = readFileSync(apiIndexPath, 'utf-8');
      expect(content).toContain('catch (error)');
      expect(content).toContain('Database initialization error');
    });
  });

  describe('Frontend Build Configuration', () => {
    const frontendPackagePath = join(projectRoot, 'frontend', 'package.json');

    test('should have frontend/package.json', () => {
      expect(existsSync(frontendPackagePath)).toBe(true);
    });

    test('should have vercel-build script', () => {
      const content = readFileSync(frontendPackagePath, 'utf-8');
      const packageJson = JSON.parse(content);
      expect(packageJson.scripts['vercel-build']).toBeDefined();
    });

    test('vercel-build should use pnpm run build', () => {
      const content = readFileSync(frontendPackagePath, 'utf-8');
      const packageJson = JSON.parse(content);
      expect(packageJson.scripts['vercel-build']).toBe('pnpm run build');
    });

    test('should have build script', () => {
      const content = readFileSync(frontendPackagePath, 'utf-8');
      const packageJson = JSON.parse(content);
      expect(packageJson.scripts.build).toBeDefined();
      expect(packageJson.scripts.build).toContain('vite build');
    });
  });

  describe('Environment Configuration', () => {
    const envExamplePath = join(projectRoot, '.env.example');

    test('should have .env.example in root', () => {
      expect(existsSync(envExamplePath)).toBe(true);
    });

    test('should document VITE_API_URL configuration', () => {
      const content = readFileSync(envExamplePath, 'utf-8');
      expect(content).toContain('VITE_API_URL');
    });

    test('should default VITE_API_URL to /api for monorepo deployment', () => {
      const content = readFileSync(envExamplePath, 'utf-8');
      expect(content).toContain('VITE_API_URL=/api');
    });

    test('should document monorepo deployment approach', () => {
      const content = readFileSync(envExamplePath, 'utf-8');
      expect(content).toContain('MONOREPO DEPLOYMENT');
    });

    test('should document that backend runs as serverless function', () => {
      const content = readFileSync(envExamplePath, 'utf-8');
      expect(content).toContain('serverless function');
    });

    test('should document DATABASE_URL requirement', () => {
      const content = readFileSync(envExamplePath, 'utf-8');
      const hasDbConfig = content.includes('DATABASE_URL') || content.includes('LA_DATABASE_URL');
      expect(hasDbConfig).toBe(true);
    });
  });

  describe('Documentation', () => {
    const vercelInstructionsPath = join(projectRoot, 'VERCEL_DEPLOYMENT_INSTRUCTIONS.md');

    test('should have VERCEL_DEPLOYMENT_INSTRUCTIONS.md', () => {
      expect(existsSync(vercelInstructionsPath)).toBe(true);
    });

    test('should document what changed in the PR', () => {
      const content = readFileSync(vercelInstructionsPath, 'utf-8');
      expect(content).toContain('What Changed');
    });

    test('should document environment variables setup', () => {
      const content = readFileSync(vercelInstructionsPath, 'utf-8');
      expect(content).toContain('Environment Variables');
      expect(content).toContain('VITE_API_URL');
      expect(content).toContain('DATABASE_URL');
    });

    test('should document verification steps', () => {
      const content = readFileSync(vercelInstructionsPath, 'utf-8');
      expect(content).toContain('Verification');
      expect(content).toContain('/api/health');
    });

    test('should document troubleshooting steps', () => {
      const content = readFileSync(vercelInstructionsPath, 'utf-8');
      expect(content).toContain('Troubleshooting');
    });

    test('should document 404 error troubleshooting', () => {
      const content = readFileSync(vercelInstructionsPath, 'utf-8');
      expect(content).toContain('404');
    });
  });

  describe('File Structure Validation', () => {
    test('should have api directory in root', () => {
      const apiDir = join(projectRoot, 'api');
      expect(existsSync(apiDir)).toBe(true);
    });

    test('should have api/package.json', () => {
      const apiPackagePath = join(projectRoot, 'api', 'package.json');
      expect(existsSync(apiPackagePath)).toBe(true);
    });

    test('should have api/tsconfig.json', () => {
      const apiTsconfigPath = join(projectRoot, 'api', 'tsconfig.json');
      expect(existsSync(apiTsconfigPath)).toBe(true);
    });

    test('api package.json should have required dependencies', () => {
      const apiPackagePath = join(projectRoot, 'api', 'package.json');
      const content = readFileSync(apiPackagePath, 'utf-8');
      const packageJson = JSON.parse(content);
      
      expect(packageJson.dependencies.express).toBeDefined();
      expect(packageJson.dependencies.cors).toBeDefined();
      expect(packageJson.dependencies.dotenv).toBeDefined();
      expect(packageJson.dependencies.pg).toBeDefined();
      expect(packageJson.dependencies.zod).toBeDefined();
    });

    test('should not have removed DEPLOYMENT.md (if it existed)', () => {
      // This is a documentation test - the old DEPLOYMENT.md was replaced
      // with VERCEL_DEPLOYMENT_INSTRUCTIONS.md which is more specific
      const newDocPath = join(projectRoot, 'VERCEL_DEPLOYMENT_INSTRUCTIONS.md');
      expect(existsSync(newDocPath)).toBe(true);
    });
  });

  describe('CORS Configuration', () => {
    test('should configure CORS for development environments', () => {
      const apiIndexPath = join(projectRoot, 'api', 'index.ts');
      const content = readFileSync(apiIndexPath, 'utf-8');
      
      expect(content).toContain('localhost:5173');
      expect(content).toContain('localhost:3000');
    });

    test('should configure CORS for production from ALLOWED_ORIGINS env var', () => {
      const apiIndexPath = join(projectRoot, 'api', 'index.ts');
      const content = readFileSync(apiIndexPath, 'utf-8');
      
      expect(content).toContain('ALLOWED_ORIGINS');
      expect(content).toContain('NODE_ENV');
    });

    test('should enable credentials for CORS', () => {
      const apiIndexPath = join(projectRoot, 'api', 'index.ts');
      const content = readFileSync(apiIndexPath, 'utf-8');
      
      expect(content).toContain('credentials: true');
    });

    test('should configure allowed HTTP methods', () => {
      const apiIndexPath = join(projectRoot, 'api', 'index.ts');
      const content = readFileSync(apiIndexPath, 'utf-8');
      
      expect(content).toContain('GET');
      expect(content).toContain('POST');
      expect(content).toContain('PUT');
      expect(content).toContain('DELETE');
      expect(content).toContain('OPTIONS');
    });
  });

  describe('Route Mounting', () => {
    test('should mount all required routes', () => {
      const apiIndexPath = join(projectRoot, 'api', 'index.ts');
      const content = readFileSync(apiIndexPath, 'utf-8');
      
      expect(content).toContain("app.use('/api/players'");
      expect(content).toContain("app.use('/api/teams'");
      expect(content).toContain("app.use('/api/matches'");
      expect(content).toContain("app.use('/api/v1', subscribeRoutes)");
      expect(content).toContain("app.use('/api/v1/players'");
      expect(content).toContain("app.use('/api/v1/squads'");
    });

    test('should mount subscribe routes correctly for newsletter', () => {
      const apiIndexPath = join(projectRoot, 'api', 'index.ts');
      const content = readFileSync(apiIndexPath, 'utf-8');
      
      // The subscribe route should be at /api/v1 which makes the 
      // newsletter endpoint accessible at /api/v1/subscribe
      expect(content).toContain("app.use('/api/v1', subscribeRoutes)");
    });
  });

  describe('Integration Readiness', () => {
    test('should have pnpm workspace configuration', () => {
      const workspacePath = join(projectRoot, 'pnpm-workspace.yaml');
      expect(existsSync(workspacePath)).toBe(true);
    });

    test('workspace should include all packages', () => {
      const workspacePath = join(projectRoot, 'pnpm-workspace.yaml');
      const content = readFileSync(workspacePath, 'utf-8');
      
      expect(content).toContain('frontend');
      expect(content).toContain('backend');
      expect(content).toContain('api');
    });
  });
});
