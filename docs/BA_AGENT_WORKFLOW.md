# Business Analyst Agent Workflow

This document describes the correct workflow for using the GitHub Copilot Business Analyst Agent to create user stories for the Legends Ascend MVP project.

## Overview

The BA Agent workflow is a **manual + automated** process that combines:
1. Manual invocation of the BA Agent via GitHub issue comments
2. BA Agent generating comprehensive user story documentation
3. Automated conversion of user story documents into lean reference issues

## Why This Workflow?

GitHub does **not** currently provide a `github/copilot/agents/run@v1` action for GitHub Actions. The BA Agent can only be invoked:
- ✅ Through the GitHub UI (issue comments, chat interface)
- ✅ Via the GitHub API manually
- ❌ NOT via automated GitHub Actions workflows

## The Correct Workflow

### Step 1: Create a Requirement Issue

1. Create a new GitHub issue with a title starting with `BA:` (e.g., `BA: User login with OAuth`)
2. In the issue body, include:
   - **Raw requirement**: Brief description of what you need
   - Any context, constraints, or specific requirements
   - Reference to related issues or epics

Example:
```markdown
BA: User can reset their password

## Raw requirement
Allow users to reset their forgotten password via email verification.

## Context
- Must comply with security best practices
- Should integrate with our existing email service (EmailOctopus)
- Part of Epic 3: User Authentication & Account Management
```

### Step 2: BA Reminder Workflow Triggers

The `ba-reminder.yml` workflow automatically adds a comment to your issue reminding you to assign the BA Agent:

```
👋 BA Request Detected!

To generate a comprehensive user story, please assign this to the BA Agent by commenting:

@business-analyst-agent Please refine this requirement into a DoR-compliant user story.
```

### Step 3: Manually Invoke the BA Agent

Add a comment to the issue:

```
@business-analyst-agent Please refine the following requirement into a full DoR-compliant user story.
```

The BA Agent will:
- Read your requirement
- Reference `/docs/TECHNICAL_ARCHITECTURE.md`, `/docs/BRANDING_GUIDELINE.md`, `/docs/ACCESSIBILITY_REQUIREMENTS.md`, and `/docs/DEFINITION_OF_READY.md`
- Generate a comprehensive user story with:
  - Full user story format
  - Context and assumptions
  - Functional and non-functional requirements
  - Acceptance criteria with test scenarios
  - Technical notes
  - Task breakdown for coding and testing agents

### Step 4: BA Agent Creates Files

The BA Agent will create markdown files in `/docs/user-stories/` with the pattern:
- `US-XXX-full-specification.md` (main document)
- `US-XXX-ARCHITECTURE-DIAGRAM.md` (if needed)
- `US-XXX-EXECUTIVE-SUMMARY.md`
- `US-XXX-NAVIGATION-GUIDE.md`
- `US-XXX-SUMMARY.md`

These files are created in the BA Agent's workspace and must be committed to your repository.

###  Step 5: Create a Pull Request

1. The BA Agent may create a PR automatically, or you may need to create one manually
2. The PR should contain all the user story files from `/docs/user-stories/`
3. Title the PR: `docs: Add user story US-XXX - [Story Title]`
4. Review the generated content for accuracy and completeness

### Step 6: Automated Issue Creation (promote-copilot-story.yml)

When the PR is opened, the `promote-copilot-story.yml` workflow automatically:
1. Detects new/modified files in `/docs/user-stories/`
2. Groups files by US-XXX identifier
3. Creates a **lean reference issue** for each user story with:
   - Title extracted from the main document
   - Body containing links to all related documents
   - Labels: `user-story`, `generated`, `us-xxx`
   - Instructions for the Coding Agent

Example lean reference issue:
```markdown
US: User can reset password via email

This is a lean reference issue for US-042.

The BA agent produced a comprehensive specification stored in repository files. 
Use the documents below as the single source of truth.

## Documents in repo
- `docs/user-stories/US-042-password-reset.md`
- `docs/user-stories/US-042-ARCHITECTURE-DIAGRAM.md`
- `docs/user-stories/US-042-SUMMARY.md`

## Notes for Coding Agent
- Read all files listed above for full requirements, ACs, diagrams, and guides.
- Adhere to TECHNICAL_ARCHITECTURE.md, BRANDING_GUIDELINE.md, ACCESSIBILITY_REQUIREMENTS.md.
```

### Step 7: Merge and Close

1. Once the PR is reviewed and approved, merge it to `main`
2. The lean reference issues are now available in your backlog
3. Close the original `BA:` requirement issue
4. The lean reference issues can be assigned to the Coding Agent for implementation

## Workflow Diagram

```
[Create Issue with BA: prefix]
          ↓
[ba-reminder.yml adds reminder comment]
          ↓
[Manually invoke @business-analyst-agent]
          ↓
[BA Agent generates comprehensive docs in /docs/user-stories/]
          ↓
[Create/Review PR with user story files]
          ↓
[Open PR triggers promote-copilot-story.yml]
          ↓
[Workflow creates lean reference issues automatically]
          ↓
[Merge PR to main]
          ↓
[Lean reference issues ready for Coding Agent]
```

## Key Benefits

✅ **Single source of truth**: All detailed requirements live in repository files  
✅ **Lean GitHub issues**: Issues reference files instead of duplicating content  
✅ **Version controlled**: User stories are tracked in Git with full history  
✅ **Automated issue creation**: No manual copy-paste from documents to issues  
✅ **Coding Agent ready**: Issues are pre-formatted with instructions for implementation  

## Troubleshooting

### BA Agent doesn't respond
- Ensure you mentioned `@business-analyst-agent` correctly
- Check that the issue has a clear requirement description
- Try rephrasing your request

### promote-copilot-story.yml doesn't create issues
- Verify files are in `/docs/user-stories/` directory
- Check that filenames follow the `US-XXX-*.md` pattern
- Ensure the PR is opened (not draft)
- Review GitHub Actions logs for errors

### Generated user story is incomplete
- The BA Agent references foundation documents - ensure they exist and are up-to-date
- Provide more context in your original requirement
- Ask the BA Agent follow-up questions to clarify or expand sections

## Related Files

- **BA Agent Configuration**: `/.github/agents/business-analyst-agent.md`
- **BA Reminder Workflow**: `/.github/workflows/ba-reminder.yml`
- **Promote Workflow**: `/.github/workflows/promote-copilot-story.yml`
- **Definition of Ready**: `/docs/DEFINITION_OF_READY.md`
- **Technical Architecture**: `/docs/TECHNICAL_ARCHITECTURE.md`
- **Branding Guidelines**: `/docs/BRANDING_GUIDELINE.md`
- **Accessibility Requirements**: `/docs/ACCESSIBILITY_REQUIREMENTS.md`

## Best Practices

1. **Be specific** in your requirement issues - the more detail you provide, the better the BA Agent's output
2. **Review generated docs** thoroughly before merging the PR
3. **Update foundation documents** regularly so the BA Agent has current information
4. **Use consistent US-XXX numbering** to keep user stories organized
5. **Close the original BA: issue** after the lean reference issue is created
6. **Assign lean reference issues** to the appropriate agent (Coding, Testing, Compliance) for implementation

## Changelog

- **2025-11-06**: Initial documentation of BA Agent workflow
- **2025-11-06**: Removed broken `ba-story-generation.yml` workflow
- **2025-11-06**: Restored `promote-copilot-story.yml` workflow for automated issue creation
