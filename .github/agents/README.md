# Legends Ascend Custom Copilot Agents

## Overview

This repository uses GitHub Copilot custom agents to automate business analysis, coding, and testing tasks. The agents are configured to follow project standards defined in our foundation documents.

**Key Features:**
- **BA Agent**: Generates DoR-compliant user stories as GitHub issues
- **Coding Agent**: Reviews code architecture and provides coding suggestions
- **Testing Agent**: Reviews test coverage and validates Definition of Done compliance

---

## How to Use the Copilot Agents

### 1. For Business Analysis (BA) Request Issues

To generate a DoR-compliant user story:

1. Open a BA request issue using `.github/ISSUE_TEMPLATE/ba_story_request.yml` (or the form)
2. In the right sidebar, look for the **Copilot panel**
3. Choose `business-analyst-agent` from the agent list
4. Click `Run` to have Copilot generate a DoR-compliant user story
5. Copilot will post the output as a comment (you can then use it as input for coding/testing agents)

**Output:** The BA agent will automatically generate a comprehensive DoR-compliant user story as a new GitHub issue containing ALL sections (Context, Requirements, Acceptance Criteria, Technical Notes, etc.) in ONE document.

---

### 2. For Pull Requests (Code Review)

There are two ways to use custom agents on pull requests:

#### **Method A: Request Copilot Code Review (Built-in)**

For general code review using the built-in Copilot reviewer:

1. Navigate to an existing pull request
2. Open the **Reviewers** menu (right sidebar)
3. Select **Copilot**
4. Copilot will review your PR and post suggestions as comments

**Note:** This is the built-in Copilot code review feature, not a custom agent.

#### **Method B: Invoke Custom Agents via Comments**

To invoke a specific custom agent (`coding-agent` or `testing-agent`) on a PR:

1. Navigate to the pull request
2. Leave a **comment** on the PR mentioning the agent
3. Use this format:

```
@copilot coding-agent

Please review this PR for:
- Architecture and coding standards compliance
- TECHNICAL_ARCHITECTURE.md adherence
- Code quality and best practices
```

Or for testing:

```
@copilot testing-agent

Please review this PR against the Definition of Done:
- Test coverage meets 80% minimum
- Acceptance criteria verified with tests
- Negative test cases included
- Accessibility compliance (WCAG 2.1 AA)
- Branding guideline compliance
- Security checks pass
- Performance thresholds met

Reference: docs/DEFINITION_OF_DONE.md
```

**What happens:**
- Copilot will open a **child pull request** using the existing PR's branch as the base
- The specified custom agent will process your request
- It will leave a comment linking to the new PR with results
- Once finished, it will request a review from you

---

### 3. Using the Agents Panel for New Tasks

To create a completely new task with a custom agent:

1. Click the **Agents** button in the top navigation bar of github.com
2. This opens the **Agents Panel** (lightweight overlay)
3. In the prompt box dropdown, select your repository
4. Click the **Custom agent** dropdown and select:
   - `business-analyst-agent` - for generating user stories
   - `coding-agent` - for coding tasks
   - `testing-agent` - for testing tasks
5. Enter your task description
6. Click **Start task** or press Enter
7. Copilot will create a pull request and work on the task in the background

**Monitoring:** You can track all agent sessions at https://github.com/copilot/agents

---

## Key Agent Files

- `.github/agents/business-analyst-agent.yaml` – Requirements analysis and user story generation
- `.github/agents/coding-agent.yaml` – Code and architecture enforcement
- `.github/agents/testing-agent.yaml` – Automated and manual test generation

---

## Reference Project Docs

All agents reference (do not duplicate) the following foundation documents:

- `/docs/DEFINITION_OF_READY.md` – Criteria for stories before development
- `/docs/DEFINITION_OF_DONE.md` – Criteria for features before merge/deployment
- `/docs/TECHNICAL_ARCHITECTURE.md` – Technical standards and patterns
- `/docs/BRANDING_GUIDELINE.md` – Brand and visual design requirements
- `/docs/ACCESSIBILITY_REQUIREMENTS.md` – WCAG 2.1 AA compliance standards
- `/docs/AI_PROMPT_ENGINEERING.md` – AI integration and prompt design patterns

---

## Important Notes

1. **Agents operate via GitHub UI**, not GitHub Actions workflows
2. **Custom agents are invoked by:**
   - Mentioning `@copilot <agent-name>` in PR comments
   - Using the Agents Panel (top navigation → Agents button)
   - Assigning issues to Copilot (for BA requests)
3. **If the Copilot panel doesn't appear**, ensure:
   - Your repository supports Copilot Agents (beta feature as of 2025)
   - You have appropriate GitHub Copilot access/permissions
4. **For custom agent tasks**, Copilot creates child pull requests with results linked in comments
5. **Transparency & Collaboration:** All agent work appears in commits, PRs, and logs for full visibility and team collaboration

---

## Workflow Summary

| Task | Method | Input | Output |
|------|--------|-------|--------|
| Generate user story | BA issue + Copilot panel | BA request form | GitHub issue with comprehensive story |
| Code review | PR comment or Reviewers menu | `@copilot coding-agent` or select Copilot reviewer | Suggestions as PR comments |
| Test review | PR comment | `@copilot testing-agent` | Child PR with test suggestions & DoD report |
| New coding task | Agents Panel | Prompt + coding-agent selection | New PR with code changes |
| New testing task | Agents Panel | Prompt + testing-agent selection | New PR with test implementations |

---

## Example: Testing Agent DoD Validation

To validate a PR against the Definition of Done using the testing agent:

```
@copilot testing-agent

Review PR #56 (US-001) against Definition of Done:

1. ✓ Code compiles and lints pass
2. ✓ Test coverage ≥80%
3. ✓ Positive AND negative test cases for all AC
4. ✓ Acceptance criteria traceability
5. ✓ GDPR compliance implemented and tested
6. ✓ WCAG 2.1 AA accessibility checks pass
7. ✓ Branding guideline compliance
8. ✓ Security audit: 0 high/critical vulns
9. ✓ Performance benchmarks met
10. ✓ All existing tests pass (no regression)

Reference: docs/DEFINITION_OF_DONE.md
Generate a DoD validation report.
```

The testing agent will:
- Run all automated tests
- Verify test coverage
- Check acceptance criteria
- Validate compliance criteria
- Generate a structured DoD report

---

## Questions or Issues?

For questions or suggestions:
- Create a GitHub Issue with the `documentation` label
- Reference the agent configuration files in `.github/agents/`
- Check foundation documents in `/docs/`
