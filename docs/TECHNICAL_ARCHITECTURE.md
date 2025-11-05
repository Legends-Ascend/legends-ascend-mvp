> **MANDATORY COMPLIANCE NOTICE**
> All code contributions, AI agent outputs, prompts, and automation workflows MUST actively reference and comply with BOTH ACCESSIBILITY_REQUIREMENTS.md and BRANDING_GUIDELINE.md in the docs folder. Compliance with these documents is mandatory for every PR, agent suggestion, and code merge. All contributors, including custom/copilot agents, must cross-check outputs and document brand and accessibility adherence in their change description.

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
