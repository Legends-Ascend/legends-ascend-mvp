> **MANDATORY COMPLIANCE NOTICE**
> All code contributions, AI agent outputs, prompts, and automation workflows MUST actively reference and comply with BOTH ACCESSIBILITY_REQUIREMENTS.md and BRANDING_GUIDELINE.md in the docs folder. Compliance with these documents is mandatory for every PR, agent suggestion, and code merge. All contributors, including custom/copilot agents, must cross-check outputs and document brand and accessibility adherence in their change description.

# AI Prompt Engineering Guide for Legends Ascend MVP

## Overview

This document provides tested prompts, best practices, and guidelines for interacting with GitHub Copilot Agent and other AI coding assistants within the Legends Ascend MVP project. All prompts and AI-generated code must align with our [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) standards.

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Test Prompts & Evaluations](#test-prompts--evaluations)
3. [Best Practices](#best-practices)
4. [Prompt Engineering Tips](#prompt-engineering-tips)
5. [Policy Compliance Checklist](#policy-compliance-checklist)
6. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
7. [Optimizations & Fine-Tuning](#optimizations--fine-tuning)

---

## Core Principles

### 1. Always Reference Technical Architecture

- **Before prompting**: Review [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) for current standards
- **In prompts**: Explicitly reference relevant architecture sections
- **After generation**: Validate against architecture requirements

### 2. Context is King

- Provide file paths, component relationships, and dependencies
- Reference existing patterns from the codebase
- Include relevant type definitions and interfaces

### 3. Specificity Over Generality

- Request specific implementations, not generic templates
- Define expected inputs, outputs, and edge cases
- Specify testing requirements upfront

---

## Test Prompts & Evaluations

### Test 1: Component Generation

**Prompt Template:**

```
Generate a [component-type] for [feature-name] following the Legends Ascend MVP technical architecture:

- Tech Stack: TypeScript, Next.js 14+ (App Router), React 18+
- Naming: PascalCase for components, camelCase for functions
- Structure: Place in src/components/[category]/[ComponentName]
- Include: TypeScript interfaces, prop validation, error handling
- Testing: Add unit tests using Jest and React Testing Library

Requirements:
[List specific requirements]
```

**Evaluation Criteria:**

- ✅ Follows TypeScript strict mode
- ✅ Uses proper naming conventions
- ✅ Includes JSDoc comments
- ✅ Proper error handling
- ✅ Responsive to architecture standards

**Example Prompt:**

```
Create a UserProfile component for displaying user information:
- Location: src/components/profile/UserProfile.tsx
- Props: userId (string), showEmail (boolean)
- Fetch user data from /api/users/{userId}
- Display: avatar, name, email (if showEmail=true), join date
- Handle loading and error states
- Include unit tests with mocked API calls
```

---

### Test 2: API Endpoint Creation

**Prompt Template:**

```
Create a [HTTP-method] API endpoint for [resource] following Legends Ascend architecture:

- Framework: Express/Fastify on Node.js
- Path: /api/v1/[resource]
- Auth: [authentication-method]
- Validation: Zod schema for request/response
- Error handling: Standard error format
- Database: PostgreSQL with proper transactions
- Testing: Integration tests with supertest

Requirements:
[Specific business logic]
```

**Evaluation Criteria:**

- ✅ Follows RESTful conventions
- ✅ Input validation with Zod
- ✅ Proper HTTP status codes
- ✅ Transaction safety
- ✅ Integration tests included

---

### Test 3: Data Transformation Script

**Prompt Template:**

```
Write a Python data transformation script for [purpose]:

- Input: [data-source]
- Output: [data-destination]
- Libraries: pandas, pySpark (if large dataset)
- Error handling: Retry logic, logging
- Testing: Unit tests with sample data
- Documentation: Docstrings and README

Transformation steps:
[List steps]
```

**Evaluation Criteria:**

- ✅ Efficient for dataset size
- ✅ Handles edge cases
- ✅ Proper logging
- ✅ Unit tests cover key scenarios
- ✅ Clear documentation

---

## Best Practices

### 1. Reference Architecture in Every Prompt

**Good:**

```
Create a React component following our Next.js 14 App Router architecture
as defined in TECHNICAL_ARCHITECTURE.md. Use TypeScript strict mode,
PascalCase naming, and include unit tests.
```

**Bad:**

```
Create a React component.
```

### 2. Provide Context and Examples

**Good:**

```
Add a new endpoint to our user service (see src/services/user.ts for existing patterns).
Follow the same error handling approach used in getUserById() but for email lookup.
```

**Bad:**

```
Add a user lookup endpoint.
```

### 3. Specify Testing Requirements Upfront

**Good:**

```
Implement password reset logic with:
- Unit tests for token generation and validation
- Integration test for full reset flow
- Edge cases: expired tokens, invalid emails
```

**Bad:**

```
Implement password reset.
```

### 4. Request Incremental Changes

**Good:**

```
Step 1: Add email validation to the registration form.
Step 2: Add backend validation for the same rules.
Step 3: Add integration test covering both.
```

**Bad:**

```
Build a complete authentication system.
```

---

## Prompt Engineering Tips

### Structure Your Prompts

```
[Context]: What exists and where
[Task]: What you need
[Constraints]: Technical requirements from TECHNICAL_ARCHITECTURE.md
[Acceptance Criteria]: Definition of done
```

### Use Role-Based Prompting

```
You are a senior TypeScript developer working on the Legends Ascend MVP.
Review TECHNICAL_ARCHITECTURE.md and generate...
```

### Chain of Thought

For complex tasks:

```
Let's approach this step-by-step:
1. First, review the existing [component/endpoint]
2. Identify what needs to change
3. Propose the changes with rationale
4. Implement with tests
```

### Iterative Refinement

1. Start with a basic prompt
2. Review the output
3. Add constraints and context
4. Regenerate
5. Repeat until aligned with architecture

---

## Policy Compliance Checklist

Before accepting AI-generated code, verify:

- [ ] **Architecture Compliance**: Matches [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)
- [ ] **Naming Conventions**: Follows project standards
- [ ] **Type Safety**: TypeScript strict mode, no `any` types
- [ ] **Testing**: Unit/integration tests included
- [ ] **Error Handling**: Proper try/catch, error messages
- [ ] **Documentation**: JSDoc/docstrings present
- [ ] **Security**: No hardcoded secrets, proper input validation
- [ ] **Performance**: No obvious bottlenecks
- [ ] **Dependencies**: Only approved packages (see architecture doc)

---

## Common Pitfalls & Solutions

### Pitfall 1: Generic Code

**Problem:** AI generates boilerplate that doesn't match our stack.

**Solution:** Always specify our exact tech stack in prompts.

### Pitfall 2: Missing Tests

**Problem:** Code is generated without tests.

**Solution:** Explicitly request tests in the initial prompt.

### Pitfall 3: Outdated Patterns

**Problem:** AI suggests deprecated approaches.

**Solution:** Reference specific versions (e.g., "Next.js 14 App Router, not Pages Router").

### Pitfall 4: Over-Engineering

**Problem:** Solution is more complex than needed.

**Solution:** Specify "minimal implementation" or "MVP approach."

### Pitfall 5: Ignoring Existing Code

**Problem:** New code doesn't integrate with existing patterns.

**Solution:** Provide file references and ask to "follow existing patterns in [file]."

---

## Optimizations & Fine-Tuning

### For GitHub Copilot Agent

1. **Context Files**: Keep TECHNICAL_ARCHITECTURE.md open while coding
2. **Inline Comments**: Use TODO comments to guide generation
3. **Chat Mode**: For complex tasks, use Copilot Chat with architecture context

### For Custom Agents

1. **System Prompts**: Include architecture rules in agent system prompt
2. **Validation Hooks**: Automate checks against architecture doc
3. **Feedback Loops**: Track what prompts produce compliant code

### Continuous Improvement

- **Prompt Library**: Save successful prompts for reuse
- **Anti-Patterns Log**: Document what doesn't work
- **Architecture Updates**: When architecture changes, update prompt templates

---

## Appendix: Quick Reference

### Our Tech Stack (Always Reference This)

- **Languages**: TypeScript (primary), Python (data/ML)
- **Frontend**: React 18+, Next.js 14+ (App Router)
- **Backend**: Express/Fastify on Node.js LTS
- **Database**: PostgreSQL 15, Redis 7
- **Testing**: Jest, React Testing Library, Supertest
- **Package Managers**: pnpm (JS/TS), uv/pip (Python)

### Prompt Starters

**Component:**

```
Generate a TypeScript React component following TECHNICAL_ARCHITECTURE.md...
```

**API:**

```
Create a RESTful endpoint following our Express/Fastify patterns in TECHNICAL_ARCHITECTURE.md...
```

**Test:**

```
Write Jest unit tests for [component/function] following our testing standards...
```

**Refactor:**

```
Refactor [file] to align with TECHNICAL_ARCHITECTURE.md naming and structure conventions...
```

---

## Revision History

- **2025-01-15**: Initial version
- **2025-01-20**: Added Test Prompts section
- **2025-01-25**: Expanded Best Practices
- **2025-02-01**: Added Copilot-specific optimizations

---

**Remember**: This guide evolves with our architecture. Always cross-reference [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) for the latest technical standards.
