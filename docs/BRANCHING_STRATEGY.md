# Branching Strategy

**Legends Ascend Football Management Game**  
**Version:** 1.0  
**Last Updated:** 14 November 2025

---

## Overview

This document defines the Git branching strategy for Legends Ascend MVP. We use a simplified Git Flow variant optimized for AI-driven development with automatic deployments to preview environments and manual GitHub releases for production.

**Key Principle:** All AI agents operate autonomously on feature branches. Only human review and GitHub releases control what reaches production.

---

## Branch Structure

### **Main Branches**

#### `main` (Default Branch)
- **Purpose:** Integration branch for completed features
- **Deployments:** Automatic to Vercel Preview on every commit
- **Merges From:** Feature branches via Pull Requests (after testing-agent validation)
- **Protection:** Requires PR review before merge
- **CI/CD:** Full test suite, build, and Vercel preview deployment

#### `production` (Release Branch)
- **Purpose:** Production-ready code associated with GitHub releases
- **Deployments:** Manual via GitHub Release creation → Vercel Production environment
- **Merges From:** `main` only (via GitHub Release workflow)
- **Protection:** Tagged releases only, manually triggered
- **CI/CD:** Runs full test suite, creates release artifacts

### **Temporary Branches**

#### Feature/Fix Branches (Named by AI agents)
- **Format:** `<type>/<us-id>-<description>` (e.g., `feat/us-001-landing-page`)
- **From:** Branch off `main`
- **Naming Convention:**
  - `feat/` - New feature implementation
  - `fix/` - Bug fixes
  - `refactor/` - Code refactoring
  - `docs/` - Documentation updates
  - `test/` - Test improvements

#### AI Agent Branches (Automatically created)
- **Created by:** Coding Agent when delegated tasks
- **Naming:** `copilot/<task-description>` or auto-generated
- **Auto-cleanup:** Closed after PR is merged or rejected

---

## Workflow: From Development to Production

### **Phase 1: Feature Development**

```
1. BA Agent creates user story issue (from BA request)
2. Coding Agent is assigned the user story
3. Coding Agent:
   - Creates feature branch from `main`
   - Implements feature per acceptance criteria
   - Commits with conventional commits format
   - Creates Pull Request
4. Testing Agent reviews PR:
   - Validates against DEFINITION_OF_DONE.md
   - Posts test suggestions and coverage report
   - Creates child PR if needed (for test implementations)
5. Human review (optional):
   - Reviews testing-agent validation report
   - Merges to `main` when tests pass and DoD met
```

### **Phase 2: Preview Environment (Automatic)**

```
1. PR merged to `main`
2. GitHub Actions triggers on push to `main`
3. CI/CD Pipeline:
   - Runs full test suite
   - Builds Next.js application
   - Deploys to Vercel Preview environment
   - Tests pass/fail on commit
4. Preview URL automatically available
5. Stakeholders can review in preview environment
```

### **Phase 3: Production Release (Manual)**

```
1. When ready to release:
   - Navigate to GitHub Releases page
   - Click "Create a new release"
   - Tag version (e.g., v0.1.0) from `main`
   - GitHub Release triggers workflow:
     a) Creates release notes from commit history
     b) Tags commit with version
     c) Deploys tagged version to Vercel Production
     d) Archives release assets
2. Production deployment complete
3. Release visible at github.com/Legends-Ascend/legends-ascend-mvp/releases
```

---

## Commit Message Format (Conventional Commits)

All commits must follow conventional commits format for automated changelog generation:

```
type(scope): description

[optional body]

[optional footer]
```

### **Types**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting, semi-colons, etc.)
- `refactor` - Code refactoring
- `test` - Test additions/updates
- `chore` - Build, dependencies, tooling
- `perf` - Performance improvements

### **Examples**
```
feat(landing): add hero section with video background
fix(auth): resolve GDPR consent workflow bug
docs(dod): add Definition of Done checklist
refactor(api): simplify email validation logic
```

---

## Merge Strategy

### **Default: Squash and Merge**
- **Rationale:** Keeps `main` history clean, one commit per feature
- **Result:** Single commit on `main` regardless of feature branch commits
- **Changelog:** Automatically generated from commit messages

### **When to Merge**
1. ✅ PR has passed all automated tests
2. ✅ Testing Agent has validated DoD
3. ✅ Code coverage meets 80% minimum
4. ✅ No merge conflicts
5. ✅ Accessibility and security scans pass

### **Blocking Issues**
- ❌ DoD validation fails
- ❌ Tests failing
- ❌ Security vulnerabilities found
- ❌ Code coverage below 80%
- ❌ Unresolved merge conflicts

---

## Branch Protection Rules

### **`main` Branch Protection**
- Require pull request reviews before merging
- Require status checks to pass (GitHub Actions)
- Require branches to be up to date before merging
- Dismiss stale PR approvals when new commits pushed
- Require code review from Testing Agent (via DoD validation)
- Require linear history (no merge commits)

### **`production` Branch Protection**
- Require PR before any changes
- All status checks must pass
- At least one review required
- Tags only from `main` via releases

---

## AI Agent Workflow Integration

### **Coding Agent**
1. Receives user story assignment
2. Creates feature branch from `main`
3. Implements feature
4. Opens PR with:
   - Descriptive title (feat/US-ID format)
   - Reference to user story issue
   - Link to acceptance criteria
5. Awaits testing-agent review

### **Testing Agent**
1. Automatically notified of PR
2. Reviews against DEFINITION_OF_DONE.md
3. Generates test suggestions
4. Posts validation report
5. Suggests improvements via PR comments

### **Approval Flow**
```
Feature Branch → PR Created → Testing Agent Review → 
  Tests Pass? → Human Merge to `main` → Vercel Preview Deploy
```

---

## Release Process (GitHub Releases)

### **Creating a Release**

1. **On GitHub Web Interface:**
   - Navigate to Releases tab
   - Click "Create a new release"
   - Tag: `v{MAJOR}.{MINOR}.{PATCH}` (e.g., v0.1.0)
   - Release title: Version name (e.g., "Landing Page MVP")
   - Description: Auto-generated or custom release notes
   - Target: `main` (latest commit)
   - Publish release

2. **Automated Actions:**
   - GitHub Actions workflow triggers
   - Creates release tag and archives
   - Deploys to Vercel Production
   - Sends deployment notifications

3. **Post-Release:**
   - Version available at: `github.com/Legends-Ascend/legends-ascend-mvp/releases`
   - Vercel Production updated
   - Database migrations (if any) applied

### **Semantic Versioning**
```
v{MAJOR}.{MINOR}.{PATCH}

v0.1.0 - First MVP release (Landing page)
v0.1.1 - Patch fix
v0.2.0 - New features added
v1.0.0 - Production launch
```

---

## Hot Fixes for Production

**Scenario:** Critical bug found in production that can't wait for next release

1. **Create hotfix branch from `production`:**
   ```bash
   git checkout production
   git pull origin production
   git checkout -b hotfix/us-xxx-description
   ```

2. **Fix and commit:**
   - Make the fix
   - Test locally
   - Commit with `fix(scope): description` format

3. **Submit PR to `production`:**
   - PR must include testing-agent validation
   - Must pass all tests

4. **Merge to both `production` and `main`:**
   - First merge to `production`
   - Then merge same commit to `main` (to keep history aligned)

5. **Create release tag:**
   - Increment patch version (v0.1.0 → v0.1.1)
   - Deploy to production

---

## Branch Naming Best Practices

✅ **DO:**
- Use kebab-case for branch names
- Include user story ID: `feat/us-001-landing-page`
- Be descriptive: `fix/auth-gdpr-consent-bug`
- Keep branch names short but clear

❌ **DON'T:**
- Use uppercase: `Feat/US-001-Landing-Page`
- Use underscores: `feat_us_001_landing_page`
- Use random names: `fix/stuff`, `update/branch`
- Use special characters except `/` and `-`

---

## Repository Integration

This branching strategy works with:
- **DEFINITION_OF_DONE.md** - DoD validation before merge
- **DEFINITION_OF_READY.md** - Story readiness before development
- **GitHub Releases** - Manual version control for production
- **Vercel Deployment** - Automatic preview on `main`, manual production
- **GitHub Actions** - CI/CD pipeline automation

---

## Cleanup Policy

### **Automatic Cleanup**
- Feature branches deleted after PR merge
- AI Agent branches cleaned up after 7 days
- Stale branches (30+ days) manually reviewed

### **Manual Cleanup**
```bash
# View local branches
git branch -a

# Delete merged branches
git branch -d branch-name

# Force delete unmerged branches
git branch -D branch-name

# Sync with remote
git fetch --prune
```

---

## Questions?

For questions or clarifications:
- Check DEPLOYMENT_GUIDE.md for Vercel configuration
- See DEFINITION_OF_DONE.md for merge requirements
- Reference DEFINITION_OF_READY.md for story preparation
- Create an issue with the `documentation` label
