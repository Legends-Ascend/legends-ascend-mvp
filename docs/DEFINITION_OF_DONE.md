# Definition of Done (DoD)

**Legends Ascend Football Management Game**  
**Version:** 1.0  
**Last Updated:** 14 November 2025  
**Effective From:** Current Sprint

---

## Purpose

The Definition of Done (DoD) establishes the quality gates that every user story, task, and feature must meet before being considered complete and ready for deployment. This ensures consistent quality, maintainability, and compliance with project standards for the Legends Ascend MVP.

**Key Principle:** A feature is not done until ALL DoD criteria are met. No exceptions unless explicitly documented and approved.

---

## When to Apply

The DoD must be satisfied for:
- ✅ All user stories before marking as complete
- ✅ Technical tasks and refactoring work before merge
- ✅ Bug fixes classified as P0 (Critical) or P1 (High)
- ✅ All features before deployment to production

---

## Definition of Done Checklist

A user story or task is considered **Done** when ALL of the following criteria are met:

### 1. **Code Quality & Standards** 🔥

- [ ] **Code follows architecture standards:** Complies with [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)
- [ ] **Naming conventions:** Follows project naming standards (kebab-case, PascalCase, snake_case as specified)
- [ ] **TypeScript strict mode:** All TypeScript code passes strict type checking
- [ ] **Linting passes:** No linting errors (ESLint for TypeScript, appropriate linters for other languages)
- [ ] **No console warnings:** No unintended console.log statements in production code
- [ ] **Code is DRY:** No significant code duplication without justification
- [ ] **Comments where needed:** Complex logic is documented with clear comments
- [ ] **Error handling:** All error cases are properly handled with appropriate error messages

---

### 2. **Testing & Quality Assurance** 🔥

- [ ] **Test coverage ≥80%:** Unit and integration tests achieve minimum 80% code coverage
- [ ] **Unit tests pass:** All unit tests pass successfully
- [ ] **Integration tests pass:** All integration tests pass successfully
- [ ] **E2E tests pass:** All end-to-end tests pass successfully (where applicable)
- [ ] **Negative test cases included:** Error scenarios and edge cases are tested
- [ ] **Test reports generated:** Tests produce both console output and JUnit XML reports
- [ ] **Manual testing completed:** Feature has been manually tested in development environment
- [ ] **Cross-browser testing:** Tested on Chrome, Firefox, Safari, Edge (for UI features)
- [ ] **Responsive testing:** Tested on mobile, tablet, and desktop viewports (for UI features)
- [ ] **Performance testing:** No performance regressions introduced

---

### 3. **Acceptance Criteria** 🔥

- [ ] **All ACs met:** Every acceptance criterion in the user story is satisfied
- [ ] **Functionality verified:** Feature works as specified in all scenarios
- [ ] **Edge cases handled:** Boundary conditions and error states work correctly
- [ ] **User flows complete:** All user journeys can be completed successfully
- [ ] **Data validation:** Input validation works correctly (client and server-side)
- [ ] **Success and error messages:** Clear feedback is provided to users

---

### 4. **Accessibility (WCAG 2.1 AA)** 🔥

- [ ] **Keyboard navigation:** All interactive elements accessible via keyboard (Tab, Enter, Space)
- [ ] **Screen reader compatible:** Tested with screen readers (NVDA, JAWS, or VoiceOver)
- [ ] **Color contrast:** Text meets WCAG AA standards (4.5:1 normal, 3:1 large text)
- [ ] **Focus indicators:** All focusable elements have visible focus styles (2px outline)
- [ ] **Semantic HTML:** Proper use of headings, landmarks, and ARIA roles
- [ ] **Alt text:** All images have appropriate alt attributes
- [ ] **Form labels:** All form inputs have associated labels
- [ ] **Error announcements:** Error messages use `role="alert"` for screen reader announcements
- [ ] **Zoom support:** Functionality works at 200% browser zoom
- [ ] **Reduced motion support:** Respects `prefers-reduced-motion` setting (where applicable)
- [ ] **Automated accessibility tests:** Passes axe-core or equivalent automated accessibility tests

---

### 5. **Branding Guidelines** 🔥

- [ ] **Color palette compliance:** Uses approved colors from [BRANDING_GUIDELINE.md](./BRANDING_GUIDELINE.md)
  - Primary Blue: `#1E3A8A`
  - Accent Gold: `#F59E0B`
  - Dark Navy: `#0F172A`
  - Soft Gray: `#F1F5F9`
- [ ] **Typography standards:** Uses approved fonts (Inter/Poppins) with correct weights
- [ ] **Logo usage:** Logo used correctly with proper clear space and sizing
- [ ] **Consistent spacing:** Follows spacing and layout guidelines
- [ ] **Visual consistency:** UI elements match existing design patterns
- [ ] **Responsive design:** Branding elements adapt correctly to all screen sizes

---

### 6. **Security Audit** 🔥

- [ ] **Input validation:** All user inputs validated (client and server-side)
- [ ] **XSS protection:** User input is sanitized to prevent cross-site scripting
- [ ] **SQL injection protection:** Database queries use parameterized queries or ORM
- [ ] **CSRF protection:** Cross-site request forgery protection enabled
- [ ] **Authentication/Authorization:** Proper access controls in place (where applicable)
- [ ] **Sensitive data handling:** Secrets not committed to repository (use environment variables)
- [ ] **Rate limiting:** API endpoints have appropriate rate limiting (where applicable)
- [ ] **HTTPS enforcement:** HTTPS used for all sensitive communications
- [ ] **Security headers:** CSP, X-Frame-Options, X-Content-Type-Options configured
- [ ] **Dependency vulnerabilities:** No known security vulnerabilities in dependencies
- [ ] **Data encryption:** Sensitive data encrypted in transit and at rest (where applicable)

---

### 7. **Performance Thresholds** 🔥

- [ ] **Core Web Vitals met:**
  - Largest Contentful Paint (LCP): < 2.5 seconds
  - Cumulative Layout Shift (CLS): < 0.1
  - First Input Delay (FID) / Interaction to Next Paint (INP): < 100ms
- [ ] **Lighthouse scores:** 90+ for Performance, Accessibility, Best Practices, SEO
- [ ] **Image optimization:** Images optimized (WebP format, responsive sizes, lazy loading)
- [ ] **Asset optimization:** CSS/JS minified and bundled for production
- [ ] **API response times:** API endpoints respond within acceptable thresholds (< 500ms for most)
- [ ] **Database query optimization:** No N+1 queries or slow queries
- [ ] **Caching implemented:** Appropriate caching strategies in place
- [ ] **No memory leaks:** No memory leaks detected in long-running tests

---

### 8. **Documentation** ✏️

- [ ] **Code comments:** Complex logic documented with clear comments
- [ ] **API documentation:** API endpoints documented (OpenAPI/Swagger or inline)
- [ ] **README updated:** README reflects new features or changes (if applicable)
- [ ] **Setup instructions:** Installation and configuration steps documented
- [ ] **Environment variables:** Required environment variables documented in `.env.example`
- [ ] **Architecture diagrams:** Updated if architectural changes made
- [ ] **User documentation:** End-user documentation updated (if user-facing feature)

---

### 9. **Deployment Readiness**

- [ ] **Environment configuration:** Required environment variables set for all environments
- [ ] **Database migrations:** Migrations tested and ready (if applicable)
- [ ] **Feature flags:** Feature flags configured correctly (if applicable)
- [ ] **Monitoring/Logging:** Appropriate logging and monitoring in place
- [ ] **Rollback plan:** Rollback procedure documented
- [ ] **Zero downtime deployment:** Deployment strategy minimizes downtime
- [ ] **Production data safety:** No risk to production data

---

### 10. **Internationalization (i18n)**

- [ ] **UK English standard:** All text uses UK spelling and terminology
- [ ] **Football terminology:** Uses international football terms (football not soccer, pitch not field, etc.)
- [ ] **Metric system:** All measurements use metric units (where applicable)
- [ ] **Date/time formatting:** Uses UK/International formats (DD/MM/YYYY)
- [ ] **Externalized strings:** Text strings can be externalized for future translation
- [ ] **Locale-ready structure:** Code structured to support multiple locales in future

---

### 11. **Code Review & Approval**

- [ ] **Peer review completed:** Code reviewed by at least one other developer or automated review
- [ ] **Review comments addressed:** All review feedback incorporated or discussed
- [ ] **No merge conflicts:** Branch is up-to-date with target branch
- [ ] **CI/CD pipeline passes:** All automated checks pass (build, lint, test, security scan)
- [ ] **Approval obtained:** Required approvals obtained per project workflow

---

## Test Coverage Requirements

### Minimum Coverage Thresholds:
- **Overall code coverage:** ≥80%
- **Critical paths:** 100% (authentication, payment, data integrity)
- **Business logic:** ≥90%
- **UI components:** ≥80%
- **Utility functions:** ≥80%

### Test Types Required:

#### **Unit Tests**
- Test individual functions and components in isolation
- Mock external dependencies
- Focus on edge cases and boundary conditions
- Fast execution (< 1 second per test suite)

#### **Integration Tests**
- Test interaction between components/modules
- Test API endpoints with database interactions
- Test service integrations (EmailOctopus, external APIs)
- Verify data flow through the system

#### **End-to-End (E2E) Tests**
- Test complete user workflows
- Happy path scenarios
- Critical error scenarios
- Cross-browser testing

#### **Performance Tests**
- Lighthouse audits for frontend
- API response time testing
- Load testing for critical endpoints (optional for MVP)

#### **Accessibility Tests**
- Automated: axe-core, WAVE, Lighthouse
- Manual: Keyboard navigation, screen reader testing
- Color contrast verification

---

## Quality Gates Summary

| Gate | Timing | Owner | Outcome |
|------|--------|-------|---------|
| **Linting & Type Checking** | During Development | Developer + CI | Code quality standards met |
| **Unit Tests** | During Development | Developer + CI | Individual components work correctly |
| **Integration Tests** | Before Commit | Developer + CI | Components work together correctly |
| **Code Review** | Before Merge | Peer Reviewer + AI Review | Code quality and standards compliance |
| **E2E Tests** | After Merge to Dev | CI Pipeline | User flows work end-to-end |
| **Accessibility Audit** | Before Release | Developer + QA | WCAG 2.1 AA compliance verified |
| **Security Audit** | Before Release | Developer + Security Tools | No security vulnerabilities |
| **Performance Audit** | Before Release | Developer + Lighthouse | Performance thresholds met |
| **Definition of Done** | Before Release | Product Owner + Team | Feature ready for production |

---

## DoD Exceptions

In rare cases, DoD criteria may be waived with documented justification:

### **Acceptable Exceptions:**
- **Critical Production Bug (P0):** May skip some criteria with immediate follow-up task
- **Security Patch:** May fast-track with reduced testing scope
- **Time-Sensitive Fix:** Must document technical debt and create follow-up tasks

### **Never Acceptable Exceptions:**
- ❌ Skipping security validation
- ❌ Skipping accessibility requirements
- ❌ Deploying broken functionality
- ❌ Committing secrets or sensitive data

**All exceptions must be:**
1. Documented in pull request description
2. Approved by tech lead or product owner
3. Tracked with follow-up tasks in backlog

---

## DoD Validation Process

### Before Marking Story as Done:
1. **Self-review:** Developer checks all DoD criteria
2. **Automated validation:** CI pipeline runs all automated checks
3. **Manual validation:** Test critical functionality manually
4. **Documentation review:** Ensure all documentation is complete
5. **Demo preparation:** Prepare to demonstrate feature to stakeholders

### Pull Request Checklist:
```markdown
## DoD Verification

### Code Quality
- [ ] Passes linting and type checking
- [ ] Follows architecture standards
- [ ] No code duplication

### Testing
- [ ] Test coverage ≥80%
- [ ] All tests passing
- [ ] Negative test cases included

### Acceptance Criteria
- [ ] All ACs met
- [ ] Edge cases handled

### Accessibility
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

### Branding
- [ ] Follows branding guidelines
- [ ] Responsive design verified

### Security
- [ ] Input validation complete
- [ ] No vulnerabilities introduced

### Performance
- [ ] Core Web Vitals met
- [ ] Lighthouse score ≥90

### Documentation
- [ ] Code documented
- [ ] README updated (if needed)
```

---

## Related Documents

This DoD works in conjunction with:

- **[DEFINITION_OF_READY.md](./DEFINITION_OF_READY.md)** - Story readiness criteria before development
- **[TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)** - Technical standards and implementation guidelines
- **[BRANDING_GUIDELINE.md](./BRANDING_GUIDELINE.md)** - Brand consistency and visual design requirements
- **[ACCESSIBILITY_REQUIREMENTS.md](./ACCESSIBILITY_REQUIREMENTS.md)** - WCAG compliance and inclusive design
- **[AI_PROMPT_ENGINEERING.md](./AI_PROMPT_ENGINEERING.md)** - AI integration and prompt design patterns

---

## Continuous Improvement

The DoD should be reviewed and updated regularly based on:
- Retrospective feedback
- Lessons learned from production issues
- New regulatory or compliance requirements
- Technology stack updates
- Team capabilities and tooling improvements

**Review Frequency:** Quarterly or after major releases

---

## Questions or Feedback?

For questions about the DoD or suggestions for improvement:
- **GitHub Issues:** Create issue with `documentation` label for DoD improvements
- **Code Reviews:** Discuss DoD compliance during pull request reviews
- **Retrospectives:** Regular review and refinement of DoD criteria

---

**Remember:** The Definition of Done ensures that every feature we ship meets our high standards for quality, accessibility, security, and performance. It's not about bureaucracy—it's about delivering excellence to our users.

---

**Version History**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 14 Nov 2025 | Initial Definition of Done for Legends Ascend MVP. Established comprehensive quality gates for code, testing, accessibility, security, and performance. | Testing Agent |
