# Production Release Process

**Legends Ascend Football Management Game**  
**Version:** 1.0  
**Last Updated:** 14 November 2025

---

## Overview

This document describes how to release features to production using GitHub Releases. Releases are the ONLY way to deploy to production - there is no manual Vercel promotion. The process is automated, trackable, and version-controlled.

**Key Principle:** GitHub Releases are the single source of truth for production deployments. Every release is tied to a specific git commit with semantic versioning.

---

## Prerequisites

Before you can create a release:

1. ✅ Feature branch merged to `main`
2. ✅ All CI/CD checks passed
3. ✅ Testing Agent validated Definition of Done
4. ✅ Feature deployed to Vercel Preview successfully
5. ✅ Stakeholder approval (optional, based on your process)

---

## Step-by-Step: Creating a Production Release

### **Step 1: Prepare for Release**

Before creating a release, ensure you know what version number to use:

```
Current Version: v0.1.0

For bug fixes: v0.1.1  (patch version bump)
For new features: v0.2.0  (minor version bump)
For major changes: v1.0.0  (major version bump)
```

See [Semantic Versioning](#semantic-versioning) section below for more details.

### **Step 2: Navigate to Releases Page**

1. Go to your repository on GitHub
2. Click on "**Releases**" tab (under the code tab)
3. Or navigate directly to: `github.com/Legends-Ascend/legends-ascend-mvp/releases`

### **Step 3: Create a New Release**

1. Click "**Create a new release**" button
2. Or click "**Draft a new release**" if available

### **Step 4: Fill in Release Details**

#### **Tag Version**
- Enter the version number (e.g., `v0.1.0`)
- Format: `v{MAJOR}.{MINOR}.{PATCH}`
- Examples:
  - `v0.1.0` - First MVP release
  - `v0.1.1` - Patch fix
  - `v0.2.0` - New features
  - `v1.0.0` - Production launch

#### **Release Title**
- Enter a human-readable title
- Examples:
  - "Landing Page MVP"
  - "Email Signup & GDPR Compliance"
  - "Performance Optimization Patch"
  - "Season 1 Launch"

#### **Target Branch**
- Select `main` (default)
- This is the branch to tag for release

#### **Release Notes / Description**

You have two options:

**Option A: Auto-generated (Recommended)**
- Click "**Generate release notes**" button
- GitHub will automatically create notes from PR titles and descriptions
- Review and edit if needed

**Option B: Manual**
- Write custom release notes
- Include:
  - New features added
  - Bug fixes
  - Breaking changes
  - Dependencies updated
  - Migration instructions (if any)

**Template for release notes:**

```markdown
## What's New in v0.1.0

### 🌟 Features
- Landing page with hero section and video background
- Email signup form with EmailOctopus integration
- GDPR consent workflow and compliance

### 🐛 Bug Fixes
- Fixed responsive layout on mobile devices
- Corrected WCAG accessibility issues in forms

### 🛠️ Breaking Changes
None

### 💾 Dependencies
- Updated Next.js to 14.1.0
- Added EmailOctopus SDK

### 🗐️ Migration Guide
No database migrations required for this release.

### 🔗 Links
- Deployment: https://legends-ascend.vercel.app
- GitHub compare: https://github.com/Legends-Ascend/legends-ascend-mvp/compare/v0.0.1...v0.1.0
```

### **Step 5: Publish Release**

1. Review all information one more time
2. Choose publication option:
   - **Publish release** - Make immediately visible and active
   - **Save as draft** - Keep private, publish later
3. Click appropriate button

### **Step 6: Verify Deployment**

After publishing:

1. GitHub automatically:
   - Creates git tag `v0.1.0`
   - Triggers GitHub Actions workflow
   - Deploys to Vercel Production
   - Sends notifications

2. Check deployment status:
   - Visit Vercel dashboard: https://vercel.com
   - Navigate to Legends Ascend project
   - Confirm Production deployment succeeded
   - Check production domain is accessible

3. Verify in production:
   - Navigate to production domain
   - Test critical features
   - Verify no errors in browser console
   - Check server logs for issues

---

## Semantic Versioning

Legends Ascend uses Semantic Versioning (SemVer) for all releases.

```
v{MAJOR}.{MINOR}.{PATCH}

Example: v1.2.3
         ^  ^  ^
         |  |  +-- Patch: Bug fixes, no new features
         |  +------ Minor: New features, backward compatible
         +--------- Major: Breaking changes
```

### **When to Bump Versions**

**PATCH** (v0.1.0 → v0.1.1)
- Bug fixes
- Performance improvements
- Documentation updates
- Security patches
- No API changes
- No database schema changes

**MINOR** (v0.1.0 → v0.2.0)
- New features
- UI improvements
- Backward compatible changes
- New API endpoints (with old ones still working)
- Database schema migrations (with compatibility layer)

**MAJOR** (v0.1.0 → v1.0.0)
- Breaking API changes
- Removed features
- Significant architecture changes
- Major version milestones (MVP → Alpha → Beta → Production)

### **Pre-release Versions**

For testing before production release:

```
v0.1.0-alpha   (Early testing)
v0.1.0-beta    (Wider testing)
v0.1.0-rc1     (Release candidate)
v0.1.0         (Final production release)
```

---

## Automated Deployment Pipeline

When you publish a release, this happens automatically:

```
1. GitHub Release Published
   ↓
2. GitHub Actions Workflow Triggered
   ↓
3. Build Application
   - npm ci
   - npm run build
   - All tests pass
   ↓
4. Create Release Assets
   - Build artifacts
   - Source code archive
   ↓
5. Deploy to Production
   - Vercel receives deployment
   - Production domain updated
   - CDN cache invalidated
   ↓
6. Notify Team
   - Deployment notifications sent
   - Release available in GitHub
   - Production URL accessible
```

**You don't need to do anything** in Vercel. Everything is automated via GitHub.

---

## Checking Release Status

### **On GitHub**

1. Navigate to Releases tab
2. Click on your release
3. You'll see:
   - Release notes
   - Git tag and commit
   - Release assets (if any)
   - Download links

### **On Vercel**

1. Go to your Vercel project: https://vercel.com
2. Check **Deployments** tab
3. Look for deployment matching your release tag
4. Verify status is "Ready"
5. Check production URL is working

### **Via GitHub API**

Get release info programmatically:

```bash
curl https://api.github.com/repos/Legends-Ascend/legends-ascend-mvp/releases/latest
```

---

## Rollback Procedure

If a release has a critical issue:

### **Option 1: Hotfix (Recommended)**

1. Create hotfix branch from the release tag
2. Fix the issue
3. Create new patch release (v0.1.1)
4. Deploy as normal

### **Option 2: Revert Release**

1. On GitHub, delete the release tag
2. In Vercel, manually redeploy previous production version
3. Document the reason for rollback
4. Create new patch release once fixed

---

## Troubleshooting

### **Release Doesn't Deploy to Production**

**Symptoms:**
- Release created but Vercel not updating
- Production shows old version

**Solutions:**
1. Check GitHub Actions workflow status
2. Review workflow logs for errors
3. Verify Vercel deployment hook is configured
4. Check if main branch protection rules are blocking
5. Manually redeploy in Vercel as fallback

### **Build Fails on Release**

**Symptoms:**
- GitHub Actions shows red X
- Deployment doesn't proceed

**Solutions:**
1. Check build logs in GitHub Actions
2. Verify all tests pass locally
3. Check for missing environment variables
4. Ensure all dependencies are installed
5. Fix issue and create new patch release

### **Version Tag Already Exists**

**Symptoms:**
- "Tag v0.1.0 already exists" error

**Solutions:**
1. Use next version number (v0.1.1)
2. Or delete the existing tag and try again
3. ```bash
   git push origin :refs/tags/v0.1.0  # Delete tag
   ```

---

## Release Checklist

Before releasing, verify:

- [ ] All features merged to `main`
- [ ] All tests passing
- [ ] Testing Agent validated DoD
- [ ] Feature works in Vercel preview
- [ ] Stakeholders approved release (if required)
- [ ] Version number decided (major/minor/patch)
- [ ] Release notes prepared
- [ ] No database migrations needed (or documented)
- [ ] Environment variables configured in Vercel
- [ ] Domain/SSL working (if using custom domain)

---

## Release Documentation

### **Related Documents**

- **BRANCHING_STRATEGY.md** - How branches map to environments
- **DEFINITION_OF_DONE.md** - What must be completed before release
- **DEFINITION_OF_READY.md** - Story preparation before development

### **External Resources**

- [GitHub Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
- [Semantic Versioning](https://semver.org/)
- [Vercel Deployments](https://vercel.com/docs/deployments/overview)

---

## Questions?

For questions about releases:
- Check BRANCHING_STRATEGY.md for branching overview
- See Vercel dashboard for deployment status
- Review GitHub Actions logs for automation details
- Create an issue with the `documentation` label
