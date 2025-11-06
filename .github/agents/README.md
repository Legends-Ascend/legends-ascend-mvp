- The BA agent will automatically generate a comprehensive DoR-compliant user story as a new GitHub issue.
- The generated issue will contain ALL sections (Context, Requirements, Acceptance Criteria, Technical Notes, etc.) in ONE document.
- Use the generated issue directly for development - no additional files or PRs needed.Legends Ascend Custom Copilot
-
- # Legends Ascend Custom Copilot AgentsAgents

## How to Use the Copilot BA, Coding, and Testing Agents

### 1. For Business Analysis (BA) Request Issues
- Open a BA request issue using `.github/ISSUE_TEMPLATE/ba_story_request.yml` (or the form).
- In the right sidebar, look for the Copilot panel.
- Choose `business-analyst-agent` from the agent list.
- Click `Run` to have Copilot generate a DoR-compliant user story.
- Copilot will post the output as a comment. (You can then promote it to a backlog issue or use it as input for the coding/testing agents.)

### 2. For Pull Requests (Code/Review)
- On a PR (feature branch or bugfix) open the right sidebar.
- Use Copilot panel to:
  - Assign `coding-agent` for architecture/coding review and suggestions.
  - Assign `testing-agent` for test coverage and test code suggestions.

### Key Agent Files
- `.github/agents/business-analyst-agent.yaml` – Requirements analysis and user story generation
- `.github/agents/coding-agent.yaml` – Code and architecture enforcement
- `.github/agents/testing-agent.yaml` – Automated and manual test generation

## Reference Project Docs
- All agents reference (do not duplicate):
  - `/docs/DEFINITION_OF_READY.md`
  - `/docs/TECHNICAL_ARCHITECTURE.md`
  - `/docs/BRANDING_GUIDELINE.md`
  - `/docs/ACCESSIBILITY_REQUIREMENTS.md`
  - `/docs/AI_PROMPT_ENGINEERING.md`

## Notes
- Agents do not run via "actions" workflows; they operate through GitHub's UI Copilot sidebar (Assign Copilot to issue/PR).
- Use them to transform requirements, enforce standards, and generate/test code—all within the GitHub web UI.
- If your Copilot panel doesn’t appear, ensure your repo & plan support Copilot Agents (beta feature as of late 2025).

---
This README guides contributors in using the full power of custom Copilot agents for consistent football game development and requirements engineering.
