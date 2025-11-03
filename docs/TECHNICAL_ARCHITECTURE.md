# Technical Architecture and Unified Development Principles

> **Document Version:** Updated November 3, 2025  
> **Latest Update:** Added Copilot Model Configuration section to document organization-approved AI models for all Coding and Testing Agents.

This document defines the unified technical standards for all contributors and agents (GitHub Copilot, OpenAI Codex, Databricks Spark/ML agents, and human developers) working in this repository. It establishes binding conventions for code, data, APIs, tooling, CI/CD, and change control. Agents MUST proactively cross-check outputs against this standard before proposing changes. Agents and humans MUST NOT silently introduce incompatible approaches. All architectural changes MUST go through the documented decision process below.

---

## 1. Tech Stack

- Languages: TypeScript (primary), Python (data/ML and automation), Bash (ops scripts).
- Runtimes: Node.js LTS (v20.x), Python 3.11.
- Frameworks: Express/Fastify (backend), React/Next.js (frontend) if applicable; PySpark/Spark 3.5 for data jobs.
- Package managers: pnpm (JS/TS), uv/pip (Python). No npm/yarn or conda.
- Datastores: PostgreSQL 15 (primary OLTP), Redis 7 (caching/queues). Local dev via Docker.
- Messaging/Events: Kafka (if used) with Protobuf schema registry.
- Infra: Docker + Docker Compose for dev; GitHub Actions for CI; IaC via Terraform (HCL2) if infra is managed here.

## 2. Repository Layout

```
/                                 Root
├─ apps/                          Executables and deployable services
│  ├─ api/                        Backend service(s)
│  └─ web/                        Frontend web app
├─ packages/                      Shared libraries (publishable or internal)
├─ data/                          Data jobs, ETL, Spark code
├─ infra/                         Terraform and deployment configs
├─ scripts/                       Dev/ops scripts
├─ docs/                          Documentation (this file lives here)
└─ .github/                       Workflows, issue/pr templates
```

- New code MUST fit this structure. If a folder is not present, propose its creation via PR with justification.

## 3. Naming Conventions

- Files: kebab-case for config and scripts (build-tools.mjs), PascalCase for React components, snake_case for Python.
- Folders: kebab-case.
- Types/Interfaces (TS): PascalCase, prefix domain where helpful (UserId, OrderId).
- Env vars: SCREAMING_SNAKE_CASE; app-specific prefix (API_, WEB_, DATA_).
- Branches: feature/<ticket-id>-<short-name>, fix/<ticket-id>-<short-name>, chore/<desc>.
- Commits: Conventional Commits (feat:, fix:, chore:, docs:, refactor:, test:, build:, ci:, perf:, revert:). Scope optional but encouraged.

## 4. APIs and Data Formats

- External APIs MUST be versioned with URI or header: /v1/...
- Wire formats: JSON for REST; if streaming or events, use Protobuf with versioned schemas.
- OpenAPI 3.1 specs for REST endpoints under docs/openapi/*.yaml kept in lockstep with implementation.
- Pagination: cursor-based (preferred) or limit/offset with max page size documented.
- Idempotency: unsafe endpoints MUST support idempotency keys via Idempotency-Key header.
- Authentication: OAuth2/OIDC or signed tokens (JWT) with short TTL; rotate keys regularly.
- Validation: Zod (TS) or Pydantic (Python) at boundaries. Reject invalid input with 400 and machine-readable error body.
- Timestamps: RFC 3339 UTC; transmit and store as UTC.

### Standard Error Body (REST JSON)

```json
{
  "error": {
    "code": "string",            // machine code, kebab-case
    "message": "human message",
    "details": { ... },           // optional structured details
    "trace_id": "uuid"           // propagate across services
  }
}
```

- Never leak secrets or stack traces. Include trace_id for correlation.

## 5. Error Handling and Observability

- Use structured logging: JSON logs via pino (Node.js) or structlog (Python). Include trace_id, service, environment, level, timestamp.
- Instrument with OpenTelemetry: traces and metrics. Export to OTLP-compatible collector.
- Errors MUST be classified: 4xx (client), 5xx (server), retryable vs. permanent.
- Test data: deterministic, no PII; seed via fixtures.

## 6. Testing Strategy

- Unit tests: Jest/Vitest (TS), pytest (Python). 80%+ coverage for core logic.
- Integration tests: testcontainers for DB/Redis/Kafka.
- E2E: Playwright or Cypress for critical flows.
- Contract tests: Pact or similar for external integrations.
- Test data: deterministic, no PII; seed via fixtures.

## 7. Linting, Formatting, and Enforcement

- TypeScript: eslint + @typescript-eslint, biome or prettier for formatting. Enforce noImplicitAny, exactOptionalPropertyTypes, strictNullChecks.
- Python: ruff (lint) + black (format) + mypy (type check with strict). Target 3.11.
- Commit hooks: lefthook or husky + lint-staged to run format/lint/tests on staged files.
- Secrets: gitleaks pre-commit and CI.

## 8. CI Pipeline (GitHub Actions)

- On PR: install, lint, type-check, test, build, and security scan (npm audit/OSS Review Toolkit or pip-audit + safety). Upload coverage.
- On main: same gates + build artifacts and container images (SBOM via syft), sign with cosign, push to registry.
- Required checks: build, test, lint, type-check, security-scan must pass before merge.
- Caching: setup-node with pnpm cache, actions/cache for Python/pip and pytest.

## 9. Agent Compliance Rules (Copilot, Codex, Spark) and Human Collaboration

- Agents MUST:
  - Read this TECHNICAL_ARCHITECTURE.md and actively validate suggestions against it.
  - Prefer existing patterns over introducing new libraries or paradigms.
  - Propose alternatives if constraints conflict, but DO NOT implement without approval.
  - Include a brief compliance note in PR descriptions summarizing checks against this standard.
- Agents MUST NOT:
  - Introduce incompatible tools (e.g., npm/yarn, different linters, alternate frameworks) without an approved ADR.
  - Bypass tests, lint, or type checks; DO NOT disable rules to "make it pass".
  - Commit secrets, tokens, or PII.

## 10. Copilot Model Configuration

**Official Organization-Approved AI Models:**

All Coding and Testing Agents in this repository MUST use the following approved models:

- **Anthropic Claude Sonnet 4**
- **Anthropic Claude Sonnet 4.5**
- **Google Gemini 2.5 Pro**
- **OpenAI GPT-5**
- **OpenAI GPT-5-Codex**

### Guidelines for Agents and Contributors

1. **Model Preference:** When configuring GitHub Copilot, AI-assisted coding tools, or automated testing agents, always select from the approved models listed above.

2. **Prompt Templates:** All prompt engineering templates and AI interaction patterns MUST be designed and tested against these approved models. See `docs/AI_PROMPT_ENGINEERING.md` for detailed guidance.

3. **Project Documentation:** When referencing AI capabilities or suggesting model usage in documentation, READMEs, or comments, cite only the approved models.

4. **Model Selection Priority:**
   - For **code generation and refactoring:** Prefer Claude Sonnet 4.5 or GPT-5-Codex
   - For **testing and test generation:** Prefer GPT-5-Codex or Claude Sonnet 4
   - For **documentation and explanations:** Prefer Gemini 2.5 Pro or Claude Sonnet 4.5
   - For **complex architectural decisions:** Prefer Claude Sonnet 4.5 or GPT-5

5. **Compliance Verification:** Contributors MUST verify their AI tooling configuration uses approved models before submitting PRs. Include a note in PR descriptions confirming compliance.

6. **Updates and Changes:** This model list is maintained by the organization. Any proposed changes require an ADR and approval from technical leadership.

### Rationale

These models have been evaluated and approved by the organization for:
- Code quality and consistency
- Security and compliance standards
- Performance and cost optimization
- Integration with our development workflows
- Support for our tech stack and coding standards

## 11. Feedback Loop

- Every PR MUST include:
  - Scope and rationale, linked to issue(s).
  - Architecture impact: affected packages/services, contracts, migrations.
  - Compliance note: list of checked sections (stack, layout, naming, API, errors, tests, lint/format, CI, agent rules).
  - Observability plan: logs/metrics/traces changes.
- Reviewers provide structured feedback referencing this standard. Disagreements escalate to an ADR (see below).

## 12. Architectural Decision Records (ADR) Process

- Use docs/adr/NNNN-title.md with Markdown template (status, context, decision, consequences, alternatives).
- New or changed architecture (stack changes, cross-cutting libs, data models, service boundaries) REQUIRES an ADR PR.
- Link ADRs in affected code and in README/docs.
- Status values: Proposed → Accepted/Rejected → Superseded.

## 13. Documentation Obligations

- Each service/package MUST have a README with: purpose, setup, environment variables, run/test commands, and troubleshooting.
- Keep docs in docs/ and code-level docs via TSDoc/Docstring. Autogenerate API docs from OpenAPI/Protobuf where applicable.
- Update diagrams (PlantUML/Mermaid) when behavior or boundaries change.

## 14. Security & Compliance

- Principle of least privilege for secrets and IAM. Use .env.example and GitHub Environments/Secrets.
- SBOM generation and image signing on release. Dependabot enabled; security updates prioritized.
- Data handling: classify datasets; ensure retention policies and encryption at rest/in transit.

## 15. Local Development

- Single-command bootstrap: scripts/dev.sh to start services via docker compose.
- Use .tool-versions or .nvmrc/.node-version and .python-version to pin runtimes.
- Provide Makefile or task runner (just/task) shortcuts for common workflows.

---

## Changelog

### November 3, 2025
- Added Section 10: Copilot Model Configuration
- Documented organization-approved AI models (Claude Sonnet 4/4.5, Gemini 2.5 Pro, GPT-5, GPT-5-Codex)
- Added model selection guidelines and compliance requirements for agents and contributors
- Renumbered subsequent sections (previous Section 10 → Section 11, etc.)

---

**Compliance Statement**

All contributors and agents acknowledge this standard. Deviations require ADR approval. Violations may be reverted.

**References**

- Conventional Commits: https://www.conventionalcommits.org
- OpenAPI: https://www.openapis.org
- OTel: https://opentelemetry.io
- Protobuf: https://protobuf.dev

**Issue**

This document addresses and closes #19.
