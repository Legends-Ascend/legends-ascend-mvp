/**
 * Tests for PR #115: TypeScript Compilation Fixes
 * 
 * This test suite verifies that:
 * 1. TypeScript compilation works for both backend and api
 * 2. Export statements are correctly placed
 * 3. Configuration files are properly set up
 */

import { describe, it, expect } from '@jest/globals';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('PR #115: TypeScript Compilation Fixes', () => {
  // From backend/src/__tests__, go up three levels to reach root
  const rootDir = path.resolve(__dirname, '../../../');
  const backendDir = path.resolve(__dirname, '../../../backend');
  const apiDir = path.resolve(__dirname, '../../../api');

  describe('TypeScript Configuration', () => {
    it('should have valid tsconfig.json in backend', () => {
      const tsconfigPath = path.join(backendDir, 'tsconfig.json');
      expect(fs.existsSync(tsconfigPath)).toBe(true);
      
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.module).toBe('commonjs');
      expect(tsconfig.compilerOptions.strict).toBe(true);
    });

    it('should have valid tsconfig.json in api', () => {
      const tsconfigPath = path.join(apiDir, 'tsconfig.json');
      expect(fs.existsSync(tsconfigPath)).toBe(true);
      
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.module).toBe('commonjs');
      expect(tsconfig.compilerOptions.target).toBe('ES2020');
      expect(tsconfig.compilerOptions.strict).toBe(true);
    });

    it('should have backend src files included in api tsconfig', () => {
      const tsconfigPath = path.join(apiDir, 'tsconfig.json');
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
      
      expect(tsconfig.include).toContain('../backend/src/**/*.ts');
    });

    it('should exclude test files from api compilation', () => {
      const tsconfigPath = path.join(apiDir, 'tsconfig.json');
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
      
      expect(tsconfig.exclude).toContain('**/__tests__/**');
      expect(tsconfig.exclude).toContain('../backend/src/__tests__/**');
    });
  });

  describe('TypeScript Compilation', () => {
    it('should compile backend without errors', () => {
      expect(() => {
        // Build compiles src files only, not tests
        execSync('pnpm build', {
          cwd: backendDir,
          stdio: 'pipe',
          encoding: 'utf-8'
        });
      }).not.toThrow();
    });

    it('should compile api without errors', () => {
      expect(() => {
        execSync('npx tsc --noEmit', {
          cwd: apiDir,
          stdio: 'pipe',
          encoding: 'utf-8'
        });
      }).not.toThrow();
    });
  });

  describe('PNPM Workspace Configuration', () => {
    it('should have pnpm-workspace.yaml in root', () => {
      const workspacePath = path.join(rootDir, 'pnpm-workspace.yaml');
      expect(fs.existsSync(workspacePath)).toBe(true);
    });

    it('should include all workspace packages', () => {
      const workspacePath = path.join(rootDir, 'pnpm-workspace.yaml');
      const workspaceContent = fs.readFileSync(workspacePath, 'utf-8');
      
      expect(workspaceContent).toContain('frontend');
      expect(workspaceContent).toContain('backend');
      expect(workspaceContent).toContain('api');
    });

    it('should have pnpm-lock.yaml in root', () => {
      const lockPath = path.join(rootDir, 'pnpm-lock.yaml');
      expect(fs.existsSync(lockPath)).toBe(true);
    });

    it('should not have pnpm-lock.yaml in subdirectories', () => {
      const apiLockPath = path.join(apiDir, 'pnpm-lock.yaml');
      const backendLockPath = path.join(backendDir, 'pnpm-lock.yaml');
      
      expect(fs.existsSync(apiLockPath)).toBe(false);
      expect(fs.existsSync(backendLockPath)).toBe(false);
    });
  });

  describe('Package Dependencies', () => {
    it('should have dotenv in api package.json', () => {
      const packagePath = path.join(apiDir, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      
      expect(packageJson.dependencies).toHaveProperty('dotenv');
    });

    it('should have matching dotenv versions in backend and api', () => {
      const apiPackagePath = path.join(apiDir, 'package.json');
      const backendPackagePath = path.join(backendDir, 'package.json');
      
      const apiPackage = JSON.parse(fs.readFileSync(apiPackagePath, 'utf-8'));
      const backendPackage = JSON.parse(fs.readFileSync(backendPackagePath, 'utf-8'));
      
      expect(apiPackage.dependencies.dotenv).toBe(backendPackage.dependencies.dotenv);
    });
  });

  describe('Git Ignore Configuration', () => {
    it('should ignore subdirectory pnpm lock files', () => {
      const gitignorePath = path.join(rootDir, '.gitignore');
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
      
      expect(gitignoreContent).toContain('api/pnpm-lock.yaml');
      expect(gitignoreContent).toContain('backend/pnpm-lock.yaml');
    });
  });

  describe('Backend Export Statement', () => {
    it('should have top-level export default statement', () => {
      const indexPath = path.join(backendDir, 'src', 'index.ts');
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      
      // Export should be at top level (outside if/else blocks)
      const lines = indexContent.split('\n');
      const exportLine = lines.findIndex(line => line.includes('export default app'));
      
      // Find the last closing brace of the main if/else block
      const reversedLines = [...lines].reverse();
      const lastClosingBraceIndex = lines.length - 1 - reversedLines.findIndex(line => line.trim() === '}');
      
      expect(exportLine).toBeGreaterThan(lastClosingBraceIndex);
    });

    it('should export Express app for Vercel', () => {
      const indexPath = path.join(backendDir, 'src', 'index.ts');
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      
      expect(indexContent).toContain('export default app');
    });
  });

  describe('API Entry Point', () => {
    it('should have index.ts in api directory', () => {
      const indexPath = path.join(apiDir, 'index.ts');
      expect(fs.existsSync(indexPath)).toBe(true);
    });

    it('should import from backend source correctly', () => {
      const indexPath = path.join(apiDir, 'index.ts');
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      
      expect(indexContent).toContain("from '../backend/src/config/database'");
      expect(indexContent).toContain("from '../backend/src/routes/");
    });

    it('should export Express app for Vercel serverless', () => {
      const indexPath = path.join(apiDir, 'index.ts');
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      
      expect(indexContent).toContain('export default app');
    });

    it('should have database initialization logic', () => {
      const indexPath = path.join(apiDir, 'index.ts');
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      
      expect(indexContent).toContain('ensureDbInitialized');
      expect(indexContent).toContain('initializeDatabase');
    });

    it('should have CORS configuration', () => {
      const indexPath = path.join(apiDir, 'index.ts');
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      
      expect(indexContent).toContain('cors');
      expect(indexContent).toContain('corsOptions');
    });
  });

  describe('Module Resolution', () => {
    it('should resolve shared types from backend in api', () => {
      const indexPath = path.join(apiDir, 'index.ts');
      
      expect(() => {
        // This test verifies the TypeScript compilation can resolve imports
        execSync('npx tsc --noEmit', {
          cwd: apiDir,
          stdio: 'pipe',
          encoding: 'utf-8'
        });
      }).not.toThrow();
    });
  });

  describe('Build Output', () => {
    it('should create dist directory after backend build', () => {
      try {
        execSync('pnpm build', {
          cwd: backendDir,
          stdio: 'pipe',
          encoding: 'utf-8'
        });
        
        const distPath = path.join(backendDir, 'dist');
        expect(fs.existsSync(distPath)).toBe(true);
      } catch (error) {
        // If build fails, the test should still report it
        throw error;
      }
    });

    it('should compile index.js in backend dist', () => {
      const distIndexPath = path.join(backendDir, 'dist', 'index.js');
      if (fs.existsSync(distIndexPath)) {
        const distContent = fs.readFileSync(distIndexPath, 'utf-8');
        expect(distContent).toContain('exports.default');
      }
    });
  });

  describe('Configuration Consistency', () => {
    it('should have consistent module setting in both configs', () => {
      const backendTsconfigPath = path.join(backendDir, 'tsconfig.json');
      const apiTsconfigPath = path.join(apiDir, 'tsconfig.json');
      
      const backendTsconfig = JSON.parse(fs.readFileSync(backendTsconfigPath, 'utf-8'));
      const apiTsconfig = JSON.parse(fs.readFileSync(apiTsconfigPath, 'utf-8'));
      
      expect(backendTsconfig.compilerOptions.module).toBe(apiTsconfig.compilerOptions.module);
    });

    it('should have strict mode enabled in both configs', () => {
      const backendTsconfigPath = path.join(backendDir, 'tsconfig.json');
      const apiTsconfigPath = path.join(apiDir, 'tsconfig.json');
      
      const backendTsconfig = JSON.parse(fs.readFileSync(backendTsconfigPath, 'utf-8'));
      const apiTsconfig = JSON.parse(fs.readFileSync(apiTsconfigPath, 'utf-8'));
      
      expect(backendTsconfig.compilerOptions.strict).toBe(true);
      expect(apiTsconfig.compilerOptions.strict).toBe(true);
    });
  });
});
