# Fix Pre-Existing ESLint Errors in Game Components

**Status:** Ready for Development  
**Priority:** Medium  
**Labels:** `bug`, `code-quality`, `good first issue`, `technical-debt`

## Description

During testing of PR #72, 28 pre-existing ESLint errors were identified in various game components. These errors should be addressed to improve code quality and maintain clean linting standards.

## Affected Files and Errors

### Unused Error Variables (21 errors)

**Leaderboard.tsx (1 error):**
- Line 142: `'err' is defined but never used` (@typescript-eslint/no-unused-vars)

**MatchSimulator.tsx (5 errors):**
- Line 168: `'err' is defined but never used`
- Line 177: `'err' is defined but never used`
- Line 200: `'err' is defined but never used`
- Line 229: `'err' is defined but never used`

**PlayerRoster.tsx (3 errors):**
- Line 187: `'err' is defined but never used`
- Line 211: `'err' is defined but never used`
- Line 221: `'err' is defined but never used`

**TeamLineup.tsx (6 errors):**
- Line 189: `'err' is defined but never used`
- Line 198: `'err' is defined but never used`
- Line 210: `'err' is defined but never used`
- Line 226: `'err' is defined but never used`
- Line 237: `'err' is defined but never used`
- Line 247: `'err' is defined but never used`

### React Hooks Warnings (1 warning)

**TeamLineup.tsx:**
- Line 183: React Hook useEffect has missing dependency: 'fetchLineup' (react-hooks/exhaustive-deps)

### TypeScript Type Errors (13 errors)

**EmailSignupForm.test.tsx:**
- Multiple instances of `Unexpected any. Specify a different type` (@typescript-eslint/no-explicit-any)
- Lines: 96, 137, 165, 194, 223, 245, 301, 348, 380, 406, 425, 436, 459

## Recommended Fixes

### For Unused Error Variables
Either:
1. Use the error variable for logging: `console.error('Operation failed:', err);`
2. Prefix with underscore if intentionally unused: `catch (_err)`
3. Remove the catch parameter if not needed: `catch { /* handle error */ }`

### For useEffect Dependency
Add `fetchLineup` to the dependency array or use `useCallback` to memoize the function.

### For TypeScript Any Types
Replace `any` with proper types, for example:
- `Error` for error objects
- `React.FormEvent<HTMLFormElement>` for form events
- Specific mock types for test mocks

## Acceptance Criteria

- [ ] All 28 ESLint errors resolved
- [ ] `npm run lint` passes with 0 errors
- [ ] No new functionality broken
- [ ] All existing tests still pass

## Priority

**Medium** - These are code quality issues that don't block functionality but should be addressed to maintain standards.

## Related

- Found during testing of PR #72 (Privacy Policy implementation)
- See: PR-72-TEST-REPORT.md, Section 9 "Issues Found"
- Does NOT block PR #72 merge
- Should be addressed in separate PR

## How to Implement

1. Check out a new branch from `main`
2. Fix errors in each file following the recommended approaches above
3. Run `npm run lint` to verify all errors are resolved
4. Run `npm run test` to ensure no tests broken
5. Create PR with fixes
6. Reference this issue in the PR description

## Files to Modify

- `frontend/src/components/Leaderboard/Leaderboard.tsx`
- `frontend/src/components/MatchSimulator/MatchSimulator.tsx`
- `frontend/src/components/PlayerRoster/PlayerRoster.tsx`
- `frontend/src/components/TeamLineup/TeamLineup.tsx`
- `frontend/src/components/landing/__tests__/EmailSignupForm.test.tsx`
