# Definition of Done (DoD) Validation System

This directory contains the automated validation tools for ensuring all Definition of Done criteria are met before deploying code to production.

## Overview

The DoD Validation System provides automated checks for:

- ✅ Test Coverage (80% minimum)
- ✅ All Tests Passing
- ✅ Security Audit (0 high/critical vulnerabilities)
- ✅ Code Quality (linting)
- ✅ Build Success
- ✅ Accessibility Compliance (WCAG 2.1 AA)
- ✅ GDPR Compliance
- ✅ Branding Guidelines

## Quick Start

### Run Full DoD Validation

```bash
npm run validate:dod
```

This will run all DoD checks and generate a comprehensive report.

### Run Individual Validations

```bash
# Test coverage check
npm run validate:coverage

# Security scan
npm run validate:security

# Accessibility tests
npm run validate:a11y
```

## Test Infrastructure

### Frontend Testing (Vitest)

**Location:** `frontend/src/**/*.test.tsx`

**Configuration:** `frontend/vitest.config.ts`

**Run Tests:**
```bash
cd frontend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
npm run test:ui       # UI mode
```

**Test Setup:**
- **Framework:** Vitest
- **Testing Library:** React Testing Library
- **Accessibility:** jest-axe, @axe-core/react
- **Coverage:** 80% minimum threshold configured

### Backend Testing (Jest)

**Location:** `backend/src/__tests__/**/*.test.ts`

**Configuration:** `backend/jest.config.js`

**Run Tests:**
```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
npm run test:ci       # CI mode
```

**Test Setup:**
- **Framework:** Jest with ts-jest
- **API Testing:** Supertest
- **Coverage:** 80% minimum threshold configured

### E2E Testing (Playwright)

**Location:** `tests/e2e/**/*.spec.ts`

**Configuration:** `playwright.config.ts`

**Run Tests:**
```bash
npm run test:e2e      # Run E2E tests
npm run test:e2e:ui   # UI mode
```

**Test Setup:**
- **Framework:** Playwright
- **Browsers:** Chromium, Firefox, WebKit
- **Mobile:** iPhone 12, Pixel 5
- **Accessibility:** @axe-core/playwright

## Coverage Requirements

All code must meet minimum 80% coverage across:

- **Lines:** 80%
- **Functions:** 80%
- **Branches:** 80%
- **Statements:** 80%

Coverage reports are generated in multiple formats:
- **Console:** Terminal output
- **HTML:** `coverage/index.html`
- **LCOV:** For CI/CD integration
- **JSON:** Machine-readable format
- **JUnit XML:** For test result reporting

## Accessibility Testing

Automated accessibility tests check for:

- ✅ WCAG 2.1 Level AA compliance
- ✅ Color contrast ratios (4.5:1 for normal text)
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Focus indicators
- ✅ Semantic HTML
- ✅ ARIA attributes

**Manual Testing Required:**
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- 200% zoom verification
- Mobile accessibility

## Security Scanning

Automated security checks:

```bash
# NPM audit
npm audit --audit-level=high

# Frontend
cd frontend && npm audit

# Backend
cd backend && npm audit
```

**Requirements:**
- **0** high-severity vulnerabilities
- **0** critical-severity vulnerabilities

## Performance Thresholds

| Metric | Target | Tool |
|--------|--------|------|
| Page Load Time | < 3s | Lighthouse |
| Time to Interactive | < 5s | Lighthouse |
| First Contentful Paint | < 2s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| API Response (p95) | < 500ms | Load testing |

## GDPR Compliance Checklist

Manual verification required for:

- [ ] Data minimization
- [ ] Consent management
- [ ] Data encryption (HTTPS + at-rest)
- [ ] Privacy by design
- [ ] Right to access
- [ ] Right to deletion
- [ ] Data portability
- [ ] Privacy policy updated
- [ ] Cookie compliance

## Branding Guidelines Checklist

Manual verification required for:

- [ ] Color palette compliance
- [ ] Typography usage
- [ ] Logo placement and sizing
- [ ] Spacing and layout
- [ ] UI component consistency
- [ ] Responsive design (320px - 2560px)

## DoD Validation Report

The validation script generates a comprehensive report:

```bash
npm run report:dod
```

**Report includes:**
- ✅ Overall pass/fail status
- ✅ Individual check results
- ✅ Coverage metrics
- ✅ Security vulnerabilities
- ✅ Failed test details
- ✅ Recommendations

**Report Location:** `reports/dod-validation-report.json`

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
name: DoD Validation

on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          npm install
          cd frontend && npm install
          cd ../backend && npm install
      
      - name: Run DoD Validation
        run: npm run validate:dod
      
      - name: Upload Coverage Reports
        uses: actions/upload-artifact@v3
        with:
          name: coverage-reports
          path: |
            frontend/coverage/
            backend/coverage/
```

## Writing Tests

### Frontend Component Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render without crashing', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Backend API Test Example

```typescript
import request from 'supertest';
import app from './app';

describe('GET /api/endpoint', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/api/endpoint');
    expect(response.status).toBe(200);
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should be accessible', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

## Troubleshooting

### Tests Timing Out

If tests timeout, increase the timeout in the test:

```typescript
it('slow test', async () => {
  // test code
}, 10000); // 10 second timeout
```

### Coverage Not Meeting Threshold

Add more tests for:
1. Untested branches (if/else, switch)
2. Untested functions
3. Error handling paths
4. Edge cases

### Accessibility Violations

1. Check contrast ratios
2. Add ARIA labels
3. Use semantic HTML
4. Add keyboard navigation
5. Test with screen reader

## Best Practices

1. **Write tests first** (TDD approach)
2. **Test behavior, not implementation**
3. **Use descriptive test names**
4. **Keep tests isolated and independent**
5. **Mock external dependencies**
6. **Test edge cases and errors**
7. **Run tests before committing**
8. **Maintain 80%+ coverage**

## Resources

- [DEFINITION_OF_DONE.md](../../docs/DEFINITION_OF_DONE.md) - Full DoD criteria
- [ACCESSIBILITY_REQUIREMENTS.md](../../docs/ACCESSIBILITY_REQUIREMENTS.md) - Accessibility standards
- [BRANDING_GUIDELINE.md](../../docs/BRANDING_GUIDELINE.md) - Branding requirements
- [Vitest Documentation](https://vitest.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Support

For questions or issues with the DoD validation system:

1. Check this README
2. Review test examples in codebase
3. Create an issue with `testing` label
4. Contact the testing team

---

**Last Updated:** 14 November 2025  
**Version:** 1.0
