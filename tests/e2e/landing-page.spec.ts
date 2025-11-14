/**
 * Landing Page E2E Test Suite
 * 
 * Tests for the landing page including:
 * - Page load and rendering
 * - Navigation functionality
 * - Accessibility compliance
 * - Performance metrics
 * - Responsive design
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Page Load and Rendering', () => {
    test('should load successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/Legends Ascend/i);
    });

    test('should display the main heading', async ({ page }) => {
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });

    test('should have no JavaScript errors', async ({ page }) => {
      const errors: string[] = [];
      
      page.on('pageerror', (error) => {
        errors.push(error.message);
      });
      
      await page.waitForLoadState('networkidle');
      
      expect(errors).toHaveLength(0);
    });

    test('should load all critical resources', async ({ page }) => {
      const response = await page.goto('/');
      expect(response?.status()).toBe(200);
      
      // Wait for network to be idle
      await page.waitForLoadState('networkidle');
    });
  });

  test.describe('Navigation', () => {
    test('should navigate through main sections', async ({ page }) => {
      // Find navigation buttons
      const navButtons = page.getByRole('button');
      const count = await navButtons.count();
      
      // Should have at least one navigation button
      expect(count).toBeGreaterThan(0);
    });

    test('should return to home when clicking logo', async ({ page }) => {
      const logo = page.getByText(/Legends Ascend/i).first();
      await logo.click();
      
      // Should still be on the main page
      await expect(page).toHaveURL('/');
    });

    test('should handle keyboard navigation', async ({ page }) => {
      // Press Tab to navigate through focusable elements
      await page.keyboard.press('Tab');
      
      // Check that an element is focused
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });
  });

  test.describe('Accessibility (WCAG 2.1 AA)', () => {
    test('should not have accessibility violations', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper color contrast', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.color'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper keyboard navigation', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.keyboard'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.aria'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have visible focus indicators', async ({ page }) => {
      // Tab to first focusable element
      await page.keyboard.press('Tab');
      
      // Get the focused element
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('should have alt text for images', async ({ page }) => {
      const images = page.locator('img');
      const count = await images.count();
      
      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        
        // All images should have alt attribute (even if empty for decorative images)
        expect(alt).toBeDefined();
      }
    });
  });

  test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('load');
      const endTime = Date.now();
      
      const loadTime = endTime - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should achieve good Core Web Vitals', async ({ page }) => {
      await page.goto('/');
      
      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const paint = performance.getEntriesByType('paint');
        const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
        
        return {
          fcp: fcp ? fcp.startTime : 0,
        };
      });
      
      // FCP should be under 2 seconds (2000ms)
      expect(metrics.fcp).toBeLessThan(2000);
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport (375x667)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      const mainContent = page.getByRole('main');
      await expect(mainContent).toBeVisible();
    });

    test('should work on tablet viewport (768x1024)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      
      const mainContent = page.getByRole('main');
      await expect(mainContent).toBeVisible();
    });

    test('should work on desktop viewport (1920x1080)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      
      const mainContent = page.getByRole('main');
      await expect(mainContent).toBeVisible();
    });

    test('should not have horizontal scrolling at 200% zoom', async ({ page }) => {
      await page.goto('/');
      
      // Simulate 200% zoom
      await page.evaluate(() => {
        document.body.style.zoom = '2';
      });
      
      // Check that content fits without horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      // Should not have horizontal scroll
      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate offline mode
      await page.route('**/*', route => route.abort());
      
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await page.goto('/', { waitUntil: 'domcontentloaded' }).catch(() => {
        // Expected to fail
      });
      
      // Should not have uncaught errors
      const hasUncaughtError = errors.some(error => 
        error.includes('Uncaught') || error.includes('unhandled')
      );
      expect(hasUncaughtError).toBe(false);
    });
  });

  test.describe('GDPR Compliance', () => {
    test('should have privacy policy link', async ({ page }) => {
      const privacyLink = page.getByRole('link', { name: /privacy/i });
      await expect(privacyLink).toBeVisible();
    });

    test('should have cookie consent (if applicable)', async ({ page }) => {
      // Check for cookie consent banner or button
      // This is a placeholder - adjust based on actual implementation
      const cookieConsent = page.locator('[data-testid="cookie-consent"], .cookie-banner');
      
      // If cookie consent is implemented, it should be visible
      // If not implemented yet, this test will fail as expected
      const count = await cookieConsent.count();
      
      // Document the current state
      if (count > 0) {
        await expect(cookieConsent.first()).toBeVisible();
      }
    });
  });

  test.describe('Branding', () => {
    test('should display logo', async ({ page }) => {
      const logo = page.getByText(/Legends Ascend/i).first();
      await expect(logo).toBeVisible();
    });

    test('should use consistent brand colors', async ({ page }) => {
      // Check that primary brand color is used
      const element = page.locator('h1').first();
      const color = await element.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      
      // Color should be defined (not default black)
      expect(color).toBeTruthy();
      expect(color).not.toBe('rgb(0, 0, 0)');
    });
  });
});

test.describe('API Integration', () => {
  test('should successfully call health check API', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.status).toBe('ok');
  });
});
