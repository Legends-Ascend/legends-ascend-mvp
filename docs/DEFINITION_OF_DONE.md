# Definition of Done (DoD)

**Legends Ascend Football Management Game**  
**Version:** 1.0  
**Last Updated:** 7 November 2025  
**Effective From:** Current Sprint

---

## Purpose

The Definition of Done (DoD) ensures that user stories and features are fully implemented, tested, and ready for production deployment in our AI-driven football management game. This document provides clear, objective, and automatable criteria that testing agents can verify programmatically, minimising human intervention while maintaining high quality standards.

**Key Principle:** The DoD is automation-first. All criteria should be verifiable by automated testing agents except where explicitly noted as requiring human judgement.

---

## When to Apply

The DoD must be satisfied before marking work as complete for:

- ✅ All user stories and features
- ✅ Bug fixes classified as P0 (Critical) or P1 (High)
- ✅ Technical tasks affecting production code
- ✅ Match engine and AI behaviour updates
- ✅ API and backend service changes

---

## Definition of Done Checklist

A user story or feature is considered **Done** when ALL of the following criteria are met:

### 1. **Code Implementation** 🤖

**Automation Status:** ✅ Fully Automatable

- [ ] **Feature Complete:** All acceptance criteria from user story are implemented
- [ ] **Code Compiles:** No compilation errors, TypeScript type checking passes
- [ ] **Linting Passes:** ESLint and Prettier rules satisfied with zero errors
- [ ] **No Console Errors:** No console.error() or console.warn() in production code
- [ ] **Foundation Document Compliance:**
  - Follows TECHNICAL_ARCHITECTURE.md patterns and structure
  - Uses approved technology stack (TypeScript, Node.js, React/Next.js, PostgreSQL, Redis)
  - Adheres to naming conventions and repository layout

**Testing Agent Actions:**
```bash
npm run build  # Must succeed
npm run lint   # Must pass with 0 errors
npm run type-check  # TypeScript must pass
```

---

### 2. **Acceptance Criteria Verification** 🤖

**Automation Status:** ✅ Fully Automatable

- [ ] **All AC Met:** Every acceptance criterion has corresponding test coverage
- [ ] **Positive Test Cases:** Happy path scenarios pass for all AC
- [ ] **Negative Test Cases:** Error conditions, validation failures, and edge cases are tested
- [ ] **Boundary Conditions:** Min/max values, empty states, null handling tested
- [ ] **User Story Traceability:** Tests reference specific AC numbers/IDs

**Testing Agent Actions:**
```bash
# Review test files for AC coverage
# Verify test descriptions match AC from user story
# Confirm both positive and negative scenarios tested
```

---

### 3. **Automated Test Coverage** 🤖 🔥

**Automation Status:** ✅ Fully Automatable

- [ ] **Minimum 80% Code Coverage:** Unit and integration tests achieve ≥80% coverage
- [ ] **Unit Tests:** All business logic, utilities, and helper functions tested
- [ ] **Integration Tests:** API endpoints, database operations, service integrations tested
- [ ] **End-to-End Tests (where applicable):** Critical user flows tested with Playwright
- [ ] **Test Quality:**
  - Tests are isolated and independent
  - No flaky tests (tests pass consistently)
  - Mocks/stubs used appropriately
  - Test names clearly describe what they verify

**Testing Agent Actions:**
```bash
npm run test:coverage  # Must show ≥80%
npm run test:unit     # All tests pass
npm run test:integration  # All tests pass
npm run test:e2e     # Critical flows pass
```

**Coverage Report Requirements:**
- Statements: ≥80%
- Branches: ≥80%
- Functions: ≥80%
- Lines: ≥80%

---

### 4. **Branding & Accessibility Compliance** 🤖

**Automation Status:** ✅ Mostly Automatable (automated checks + spot verification)

- [ ] **Branding Guidelines:** Follows BRANDING_GUIDELINE.md
  - Correct colour palette used (from design tokens/CSS variables)
  - Typography adheres to defined font families and scales
  - Spacing follows design system (4px/8px grid)
  - Logo usage complies with brand guidelines

- [ ] **Accessibility Requirements:** Meets ACCESSIBILITY_REQUIREMENTS.md (WCAG 2.1 AA)
  - Automated accessibility tests pass (axe-core, Pa11y)
  - Semantic HTML elements used correctly
  - ARIA attributes present where required
  - Keyboard navigation functional (tab order, focus management)
  - Colour contrast ratios meet WCAG AA standards (4.5:1 text, 3:1 UI)
  - Form inputs have associated labels
  - Images have alt text
  - Screen reader compatibility verified

**Testing Agent Actions:**
```bash
npm run test:a11y    # Automated accessibility tests
npm run test:visual  # Visual regression tests
npm run validate:branding  # Automated brand compliance check
```

**Automated Checks:**
- Run axe-core accessibility scanner
- Verify colour contrast ratios programmatically
- Check for ARIA attributes in DOM
- Validate semantic HTML structure
- Test keyboard navigation paths

---

### 5. **Football Game Logic & Data Integrity** 🤖

**Automation Status:** ✅ Fully Automatable

**Required for features affecting game mechanics:**

- [ ] **Game Logic Correctness:**
  - Algorithms produce expected outputs for known inputs
  - Statistical calculations verified against test fixtures
  - Match simulation results are consistent and deterministic (for same seed)
  - Player/team stat updates are accurate

- [ ] **Data Persistence:**
  - Database migrations run successfully
  - Data models match schema definitions
  - CRUD operations work correctly
  - Data validation rules enforced
  - Foreign key relationships maintained

- [ ] **Game Balance:**
  - No game-breaking exploits identified
  - Feature doesn't create unfair advantages
  - AI opponent behaviour remains competitive

**Testing Agent Actions:**
```bash
npm run test:game-logic  # Game mechanics tests
npm run migrate:test     # Test migrations
npm run test:db         # Database integration tests
npm run test:simulation  # Match engine tests
```

---

### 6. **Internationalization & Localization** 🤖

**Automation Status:** ✅ Fully Automatable

- [ ] **UK English Standard:** All user-facing text uses UK English spelling
  - "Football" not "Soccer"
  - "Pitch" not "Field"
  - "Kit" not "Jersey"
  - "Manager" not "Coach"
  - Colour, favour, centre, etc. (UK spelling)

- [ ] **Metric System:** All measurements use metric units (metres, km, kg)
- [ ] **Date/Time Format:** UK format (DD/MM/YYYY)
- [ ] **Currency:** GBP (£) as primary display
- [ ] **Externalized Strings:** No hardcoded text in components (use i18n system)

**Testing Agent Actions:**
```bash
npm run test:i18n     # Internationalization tests
npm run lint:text     # Check for American English spellings
grep -r "soccer" src/  # Should return no matches
grep -r "coach" src/ --exclude="*test*"  # Should return no matches in non-test files
```

---

### 7. **Performance & Optimization** 🤖

**Automation Status:** ✅ Fully Automatable

- [ ] **API Performance:**
  - API endpoints respond within 200ms for GET requests
  - API endpoints respond within 500ms for POST/PUT/DELETE
  - Database queries optimized (no N+1 queries)
  - Appropriate indexes exist for query patterns

- [ ] **Frontend Performance:**
  - Lighthouse performance score ≥90
  - First Contentful Paint (FCP) <1.8s
  - Time to Interactive (TTI) <3.8s
  - No unnecessary re-renders
  - Images optimized and lazy-loaded

- [ ] **Match Simulation Performance:**
  - Match simulation completes within acceptable time (<2s for single match)
  - Bulk operations handle expected data volumes

**Testing Agent Actions:**
```bash
npm run test:performance  # Performance tests
npm run lighthouse       # Lighthouse CI
npm run test:load        # Load testing for APIs
```

---

### 8. **Error Handling & Edge Cases** 🤖

**Automation Status:** ✅ Fully Automatable

- [ ] **Error Scenarios Handled:**
  - Invalid input validation with clear error messages
  - Network failures handled gracefully
  - Database connection errors caught
  - API rate limiting respected
  - Timeout scenarios handled

- [ ] **User Feedback:**
  - Loading states shown during async operations
  - Error messages are user-friendly (not technical stack traces)
  - Success confirmations displayed

- [ ] **Edge Cases Tested:**
  - Empty data states
  - Null/undefined handling
  - Maximum/minimum boundary values
  - Concurrent operations
  - Race conditions prevented

**Testing Agent Actions:**
```bash
npm run test:errors      # Error handling tests
npm run test:edge-cases  # Boundary condition tests
```

---

### 9. **Security & Data Protection** 🤖

**Automation Status:** ✅ Mostly Automatable

- [ ] **Input Validation:**
  - All user inputs sanitized
  - SQL injection prevention (parameterized queries)
  - XSS protection applied
  - CSRF tokens used for state-changing operations

- [ ] **Authentication & Authorization:**
  - Protected routes require authentication
  - Authorization checks enforce correct permissions
  - JWT tokens properly validated
  - Session management secure

- [ ] **Data Privacy:**
  - No sensitive data logged
  - Personal data handling complies with GDPR
  - API keys/secrets not exposed in client code
  - Environment variables used for configuration

- [ ] **Dependencies:**
  - No known security vulnerabilities in dependencies
  - Dependencies up to date (or documented exceptions)

**Testing Agent Actions:**
```bash
npm audit  # Must show 0 high/critical vulnerabilities
npm run test:security  # Security tests
npm run test:auth     # Authentication/authorization tests
grep -r "password" src/ --exclude="*test*"  # Check for hardcoded credentials
grep -r "api_key" src/ --exclude="*test*"  # Check for exposed API keys
```

---

### 10. **Documentation** 👁️

**Automation Status:** ❌ Requires Human Review (but can be automated for basic checks)

- [ ] **Code Comments:** Complex logic has explanatory comments
- [ ] **API Documentation:** Public APIs documented (JSDoc/TSDoc)
- [ ] **README Updates:** Feature-specific README sections updated if needed
- [ ] **CHANGELOG Updated:** Changes logged in CHANGELOG.md following Keep a Changelog format

**Testing Agent Actions:**
```bash
# Check for JSDoc comments on exported functions
# Verify CHANGELOG.md has entry for this feature
# Confirm README.md references updated documentation
```

**Note:** While testing agents can check for presence of documentation, quality assessment may require human review for critical features.

---

### 11. **No Regression** 🤖

**Automation Status:** ✅ Fully Automatable

- [ ] **All Existing Tests Pass:** Full test suite passes without failures
- [ ] **No Breaking Changes:** Existing functionality remains intact
- [ ] **Backward Compatibility:** API changes don't break existing integrations (or deprecation path provided)
- [ ] **Visual Regression Tests:** UI changes don't break existing pages

**Testing Agent Actions:**
```bash
npm run test:all         # Complete test suite
npm run test:regression  # Regression tests
npm run test:visual-regression  # Visual regression tests
```

---

### 12. **CI/CD Pipeline Success** 🤖

**Automation Status:** ✅ Fully Automatable

- [ ] **Build Passes:** GitHub Actions CI build completes successfully
- [ ] **All Checks Pass:** Linting, testing, type checking, security scans all green
- [ ] **No Warnings:** Build produces no warnings
- [ ] **Preview Deployment:** Vercel preview deployment succeeds

**Testing Agent Actions:**
```bash
# Review GitHub Actions workflow status
# Confirm all checks show green checkmarks
# Verify Vercel preview deployment link is accessible
```

---

### 13. **Git & Version Control** 🤖

**Automation Status:** ✅ Fully Automatable

- [ ] **Conventional Commits:** Commit messages follow conventional commits format
  - Format: `type(scope): description`
  - Types: feat, fix, docs, style, refactor, test, chore
- [ ] **PR Description:** Pull request has clear description of changes
- [ ] **No Debug Code:** No console.log, debugger statements, commented-out code
- [ ] **No Merge Conflicts:** Branch is up to date with main, no conflicts
- [ ] **Small, Focused Commits:** Commits are logical units of work

**Testing Agent Actions:**
```bash
# Validate commit message format
grep -r "console.log" src/ --exclude="*test*"  # Should return no matches
grep -r "debugger" src/  # Should return no matches
# Check for commented-out code blocks
```

---

## DoD Exception Criteria

### **When Can DoD Be Relaxed?**

**Critical Production Bugs (P0):**
- 80% test coverage requirement may be reduced to 60% (with follow-up story)
- Documentation can be added in immediate follow-up
- Must still pass all security and regression tests

**Experimental Features (Behind Feature Flag):**
- May have reduced test coverage if properly isolated
- Must not affect existing functionality
- Full DoD required before removing feature flag

**Technical Debt Items:**
- May have different DoD based on agreed scope
- Must be clearly marked as technical debt in backlog

---

## Automation Scripts for Testing Agents

The following NPM scripts should be available for testing agents to execute:

```json
{
  "scripts": {
    "test:all": "Run complete test suite",
    "test:unit": "Run unit tests",
    "test:integration": "Run integration tests",
    "test:e2e": "Run end-to-end tests with Playwright",
    "test:coverage": "Generate coverage report",
    "test:a11y": "Run accessibility tests",
    "test:security": "Run security tests",
    "test:performance": "Run performance benchmarks",
    "test:regression": "Run regression test suite",
    "test:game-logic": "Run game mechanics tests",
    "lint": "Run ESLint",
    "lint:fix": "Auto-fix linting issues",
    "type-check": "Run TypeScript type checking",
    "build": "Build production bundle",
    "lighthouse": "Run Lighthouse CI",
    "validate:branding": "Check brand compliance",
    "validate:dod": "Run all DoD validation checks"
  }
}
```

---

## Testing Agent DoD Validation Workflow

**Step-by-Step Automated Validation:**

1. **Pull Latest Code:**
   ```bash
   git checkout <feature-branch>
   git pull origin <feature-branch>
   npm ci  # Clean install dependencies
   ```

2. **Code Quality Checks:**
   ```bash
   npm run build
   npm run lint
   npm run type-check
   ```

3. **Automated Test Execution:**
   ```bash
   npm run test:unit
   npm run test:integration
   npm run test:coverage  # Verify ≥80%
   ```

4. **Acceptance Criteria Verification:**
   - Parse user story from issue/PR
   - Match test descriptions to AC numbers
   - Confirm positive and negative test cases exist

5. **Compliance Checks:**
   ```bash
   npm run test:a11y
   npm audit
   npm run validate:branding
   ```

6. **Performance Validation:**
   ```bash
   npm run test:performance
   npm run lighthouse
   ```

7. **Regression Testing:**
   ```bash
   npm run test:regression
   npm run test:visual-regression
   ```

8. **Code Scan for Common Issues:**
   ```bash
   grep -r "console.log" src/ --exclude="*test*"
   grep -r "debugger" src/
   grep -r "TODO" src/  # List TODOs
   grep -r "FIXME" src/  # List FIXMEs
   ```

9. **Generate DoD Report:**
   - Create markdown report with all check results
   - Include pass/fail status for each criterion
   - Link to coverage reports, test results
   - Post as comment on Pull Request

---

## DoD Report Template

The testing agent should generate a report in this format:

```markdown
## Definition of Done - Validation Report

**User Story:** US-001: Landing page with hero section
**PR:** #56
**Validation Date:** 2025-11-07
**Overall Status:** ✅ PASS / ❌ FAIL

### Automated Checks

| Category | Criterion | Status | Details |
|----------|-----------|--------|----------|
| Code Implementation | Build Success | ✅ | Build completed in 45s |
| Code Implementation | Linting | ✅ | 0 errors, 0 warnings |
| Code Implementation | Type Check | ✅ | No TypeScript errors |
| Test Coverage | Unit Tests | ✅ | 156 tests passing |
| Test Coverage | Coverage | ✅ | 87.3% (target: 80%) |
| Test Coverage | Integration Tests | ✅ | 24 tests passing |
| Accessibility | axe-core | ✅ | 0 violations |
| Accessibility | Contrast | ✅ | All ratios pass WCAG AA |
| Security | npm audit | ✅ | 0 high/critical vulnerabilities |
| Performance | Lighthouse | ✅ | Score: 94/100 |
| Regression | All Tests | ✅ | 180/180 tests passing |

### Acceptance Criteria Verification

- ✅ AC1: Hero section displays on landing page (test: `hero.spec.ts:12`)
- ✅ AC2: Email signup form with validation (test: `email-signup.spec.ts:25`)
- ✅ AC3: GDPR consent flow (test: `gdpr-consent.spec.ts:8`)
- ✅ AC4: Mobile responsive design (test: `responsive.spec.ts:15`)

### Negative Test Cases

- ✅ Invalid email format rejected (test: `email-signup.spec.ts:45`)
- ✅ Empty form submission prevented (test: `email-signup.spec.ts:52`)
- ✅ GDPR consent required before submission (test: `gdpr-consent.spec.ts:18`)

### Code Quality Metrics

- Lines of Code: 487
- Test Lines: 623
- Test/Code Ratio: 1.28:1
- Cyclomatic Complexity: Average 3.2

### Recommendations

✅ **All Definition of Done criteria met. Ready for merge.**

---

**Generated by:** testing-agent v1.0  
**Report Time:** 2025-11-07 09:15:23 CET
```

---

## Quality Gates Summary

| Gate | Timing | Owner | Automation | Outcome |
|------|--------|-------|------------|---------|
| **Definition of Ready** | Before Development | BA Agent | Manual/AI | Story ready for development |
| **Code Review** | During Development | Copilot/AI | Automated | Code quality verified |
| **Testing** | End of Development | Testing Agent | Automated | Feature functionality verified |
| **Definition of Done** | Before Merge | Testing Agent | Automated | Feature ready for deployment |
| **Production Deployment** | After Merge | CI/CD | Automated | Feature live in production |

---

## Items Explicitly REMOVED from DoD

**The following items are NOT required in our AI-driven workflow:**

❌ **Manual Code Review by Humans:** AI agents perform code review  
❌ **Manual QA Testing:** Automated testing agents handle QA  
❌ **Stakeholder Sign-off:** Automated DoD validation determines readiness  
❌ **Manual Deployment Approval:** CI/CD handles deployments automatically  
❌ **Product Owner Acceptance:** Automated AC verification sufficient  

**Rationale:** Our AI-driven workflow replaces manual human intervention with comprehensive automated validation. The testing agent serves as the final arbiter of quality before merge.

---

## Critical Discussion Items

**The following items would typically require human intervention but have been removed per your requirements:**

1. **Manual Security Review:** While automated security scans are included, critical infrastructure changes may benefit from human security review
2. **UX/Design Review:** Visual design quality and brand consistency checks are automated, but subjective design decisions may need human input
3. **Product Strategy Alignment:** Automated checks verify technical requirements but not strategic fit

**Recommendation:** Consider these items for quarterly human review cycles rather than per-PR basis.

---

## Related Documents

This DoD works in conjunction with:

- **[DEFINITION_OF_READY.md](./DEFINITION_OF_READY.md)** - Story preparation criteria before development
- **[TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)** - Technical standards and patterns
- **[BRANDING_GUIDELINE.md](./BRANDING_GUIDELINE.md)** - Brand and visual design requirements
- **[ACCESSIBILITY_REQUIREMENTS.md](./ACCESSIBILITY_REQUIREMENTS.md)** - WCAG compliance standards
- **[testing-agent.yaml](../.github/agents/testing-agent.yaml)** - Testing agent configuration

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 7 Nov 2025 | Initial Definition of Done for Legends Ascend. Automation-first approach designed for testing agent execution. Removed all items requiring human intervention per project requirements. | AI Development Team |

---

## Questions or Feedback?

For questions about the DoD or suggestions for improvement:

- **GitHub Issues:** Create issue with `documentation` label
- **Pull Request Reviews:** Discuss DoD compliance during PR reviews
- **Retrospectives:** Regular review and refinement based on development learnings

**Remember:** The DoD exists to ensure quality through comprehensive automated validation. The testing agent is the primary consumer of this document and should be able to execute all checks programmatically.
