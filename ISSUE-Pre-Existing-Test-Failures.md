# Fix Pre-Existing Test Failures in Landing Page Components

**Status:** Ready for Development  
**Priority:** Medium  
**Labels:** `bug`, `testing`, `good first issue`, `technical-debt`

## Description

During testing of PR #72, 5 pre-existing test failures were identified in landing page component tests. These tests are failing due to outdated expectations that don't match the current implementation.

## Affected Files and Failures

### FormContrast.test.tsx (2 failures)

**1. Email Input Border Contrast**
- **Test:** `should have email input with enhanced border contrast`
- **Location:** Line 29, Column 36
- **Issue:** Test expects `border-dark-navy/40` but component uses `border-dark-navy`
- **Current class:** `"w-full px-4 py-2 border-2 border-dark-navy rounded-md bg-white..."`
- **Expected class:** Should include `border-dark-navy/40`

**2. Checkbox Border Contrast**
- **Test:** `should have checkbox with enhanced border contrast`
- **Location:** Line 96, Column 35
- **Issue:** Test expects `border-dark-navy/40` but component uses `border-dark-navy`
- **Current class:** `"h-5 w-5 text-primary-blue border-2 border-dark-navy rounded..."`
- **Expected class:** Should include `border-dark-navy/40`

### Hero.test.tsx (3 failures)

**1. Logo Sizing Classes**
- **Test:** `should have responsive logo sizing classes`
- **Location:** Line 32, Column 27
- **Issue:** Test expects `md:h-48` but component uses `md:h-56`
- **Current class:** `"h-32 sm:h-40 md:h-56 mx-auto mb-4 md:mb-8 object-contain"`
- **Expected class:** Should include `md:h-48` and `lg:h-56`

**2. Main Headline Text**
- **Test:** `should render the main headline`
- **Location:** Line 50, Column 24
- **Issue:** Test expects "Build Your Football Legacy" but component shows "Forge Your Football Legacy"
- **Current text:** "Forge Your Football Legacy"
- **Expected text:** "Build Your Football Legacy"

**3. Subheadline Text**
- **Test:** `should render the subheadline`
- **Location:** Line 56, Column 34
- **Issue:** Test expects `/AI-powered football management game/i` but component text is structured differently
- **Current text:** "Experience the AI-powered football management game where every choice defines your journey."
- **Expected pattern:** Text should match the regex pattern for "AI-powered football management game"

## Recommended Fixes

### Option 1: Update Tests to Match Current Implementation (Recommended)
Update the test expectations to match the current component implementations, which appear to be the intentional design choices:

**FormContrast.test.tsx:**
- Change expectations from `border-dark-navy/40` to `border-dark-navy`
- Verify that the solid border provides sufficient contrast (meets WCAG 2.1 AA)

**Hero.test.tsx:**
- Update logo size expectation from `md:h-48` to `md:h-56`
- Update headline expectation from "Build" to "Forge"
- Update subheadline regex to match current text structure

### Option 2: Update Components to Match Tests
If the tests represent the intended design, update the components:

**EmailSignupForm and GdprConsentCheckbox:**
- Change border classes to use opacity: `border-dark-navy/40`
- Verify accessibility contrast requirements still met

**Hero:**
- Change logo sizing to `md:h-48 lg:h-56`
- Change headline text to "Build Your Football Legacy"
- Adjust subheadline text structure

## Acceptance Criteria

- [ ] All 5 test failures resolved
- [ ] `npm run test` passes with 0 failures
- [ ] Design decisions documented (if components are updated)
- [ ] Accessibility still meets WCAG 2.1 AA standards
- [ ] Visual regression testing completed (if components are updated)
- [ ] Branding guidelines still followed

## Priority

**Medium** - These are test quality issues that should be addressed to maintain test reliability, but don't block current functionality.

## Related

- Found during testing of PR #72 (Privacy Policy implementation)
- See: PR-72-TEST-REPORT.md, Section 9 "Issues Found"
- Does NOT block PR #72 merge
- Should be addressed in separate PR
- Consider design review if changing component implementations

## How to Implement

### If Updating Tests (Option 1 - Recommended):
1. Check out a new branch from `main`
2. Update `frontend/src/components/landing/__tests__/FormContrast.test.tsx`:
   - Lines 29 and 96: Change expected class from `border-dark-navy/40` to `border-dark-navy`
3. Update `frontend/src/components/landing/__tests__/Hero.test.tsx`:
   - Line 32: Change expectation to `md:h-56` (remove `md:h-48` expectation, verify `lg:h-56` exists)
   - Line 50: Change expected text to "Forge Your Football Legacy"
   - Line 56: Update regex pattern to match full subheadline text
4. Run `npm run test` to verify all tests pass
5. Create PR with fixes

### If Updating Components (Option 2):
1. Consult with design team on intended values
2. Update components to match test expectations
3. Verify WCAG 2.1 AA compliance maintained
4. Run visual regression tests
5. Update branding documentation if needed

## Files to Modify

**Option 1 (Update Tests):**
- `frontend/src/components/landing/__tests__/FormContrast.test.tsx`
- `frontend/src/components/landing/__tests__/Hero.test.tsx`

**Option 2 (Update Components):**
- `frontend/src/components/landing/EmailSignupForm.tsx`
- `frontend/src/components/landing/GdprConsentCheckbox.tsx`
- `frontend/src/components/landing/Hero.tsx`
