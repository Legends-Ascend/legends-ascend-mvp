# US-001 Navigation Guide

**Where to Start Based on Your Role**

---

## Quick Links

| Document | Size | Purpose | Primary Audience |
|----------|------|---------|------------------|
| [Executive Summary](./US-001-EXECUTIVE-SUMMARY.md) | 11KB | Business overview, ROI, timeline | Stakeholders, Product Owners, Management |
| [Quick Summary](./US-001-SUMMARY.md) | 9.4KB | Technical overview, rapid reference | Developers, QA Engineers |
| [Full User Story](./US-001-landing-page-hero-emailoctopus-gdpr.md) | 40KB | Complete specification | All team members |
| [Architecture Diagrams](./US-001-ARCHITECTURE-DIAGRAM.md) | 38KB | Visual system design, flows | Architects, Senior Developers |
| [Directory Index](./README.md) | 3.6KB | Overview of all user stories | Everyone |

**Total Documentation:** 102KB | 2,354 lines | 5 documents

---

## Navigation by Role

### 🎯 Product Owner / Stakeholder
**Goal:** Understand business value and approve for development

**Read in this order:**
1. **[Executive Summary](./US-001-EXECUTIVE-SUMMARY.md)** (5-10 min read)
   - What we're building and why
   - Business value and ROI
   - Timeline and resources
   - Risk mitigation
   - Action items for stakeholders
   
2. **[Quick Summary](./US-001-SUMMARY.md)** (optional, 3 min read)
   - Technical overview in plain language
   - Key features at a glance
   - Success criteria

**Decision Point:** Approve/reject/request changes

---

### 💻 Developer (Coding Agent)
**Goal:** Implement the feature according to specification

**Read in this order:**
1. **[Quick Summary](./US-001-SUMMARY.md)** (5 min read)
   - Overview of what you're building
   - API design reference
   - Task breakdown
   - Environment variables needed
   
2. **[Full User Story](./US-001-landing-page-hero-emailoctopus-gdpr.md)** (20-30 min read)
   - Detailed functional requirements (FR-1 through FR-6)
   - Non-functional requirements (performance, security, accessibility)
   - Acceptance criteria (what "done" looks like)
   - Technical notes (API design, data model, failure modes)
   - Task breakdown for Phase 1-6
   
3. **[Architecture Diagrams](./US-001-ARCHITECTURE-DIAGRAM.md)** (10 min browse)
   - System architecture
   - Component hierarchy
   - Data flow (request/response)
   - Error handling patterns

**Bookmark for reference:**
- API request/response schemas (in Full User Story, Technical Notes section)
- Component file paths (in Architecture Diagrams, Component Hierarchy)
- Environment variables (in Quick Summary)

---

### 🧪 QA Engineer / Testing Agent
**Goal:** Test the feature comprehensively

**Read in this order:**
1. **[Quick Summary](./US-001-SUMMARY.md)** (5 min read)
   - What the feature does
   - 8 acceptance criteria overview
   - 10 test scenarios overview
   
2. **[Full User Story](./US-001-landing-page-hero-emailoctopus-gdpr.md)** (30-40 min read)
   - Focus on: **Acceptance Criteria** section (AC-1 through AC-8)
   - Focus on: **Test Scenarios** section (TS-1 through TS-10)
   - Focus on: **Edge Cases** (listed under each AC)
   - Reference: **Non-Functional Requirements** for performance/accessibility testing
   - Task breakdown Phase 7 (Testing)
   
3. **[Architecture Diagrams](./US-001-ARCHITECTURE-DIAGRAM.md)** (10 min browse)
   - User flow diagram (understand happy path)
   - Error handling flow (understand failure modes)
   - Accessibility flow (keyboard navigation testing)

**Testing Checklist:**
- [ ] TS-1: Happy path subscription
- [ ] TS-2: Validation error – missing consent
- [ ] TS-3: Validation error – invalid email
- [ ] TS-4: Network error handling
- [ ] TS-5: Keyboard navigation
- [ ] TS-6: Screen reader compatibility
- [ ] TS-7: Reduced motion support
- [ ] TS-8: Responsive design – mobile
- [ ] TS-9: Performance – Core Web Vitals
- [ ] TS-10: GDPR compliance

---

### 🎨 Designer / UX
**Goal:** Ensure brand and accessibility compliance

**Read in this order:**
1. **[Quick Summary](./US-001-SUMMARY.md)** (5 min read)
   - Visual overview
   - Branding section (colors, typography)
   - Accessibility section
   
2. **[Full User Story](./US-001-landing-page-hero-emailoctopus-gdpr.md)** (focus on specific sections)
   - **FR-1: Hero Section** – Visual layout and content
   - **FR-2: Email Capture Form** – Form design
   - **FR-5: Responsive Design** – Breakpoints and adaptations
   - **Non-Functional: Branding** – Color palette, typography, logo usage
   - **Non-Functional: Accessibility** – WCAG 2.1 AA requirements

**Review checklist:**
- [ ] Brand colors match BRANDING_GUIDELINE.md
- [ ] Typography follows guidelines (Inter/Poppins)
- [ ] Logo usage correct (20px clear space)
- [ ] Responsive design works at all breakpoints
- [ ] Color contrast meets 4.5:1 ratio (normal text)
- [ ] Focus indicators visible and consistent
- [ ] Touch targets minimum 44x44px

---

### 🔒 Security / Compliance
**Goal:** Verify GDPR and security compliance

**Read in this order:**
1. **[Executive Summary](./US-001-EXECUTIVE-SUMMARY.md)** (skip to risk sections)
   - Risk Mitigation section
   
2. **[Full User Story](./US-001-landing-page-hero-emailoctopus-gdpr.md)** (focus on specific sections)
   - **FR-3: EmailOctopus API Integration** – Rate limiting, logging
   - **FR-4: GDPR Compliance and Privacy** – Consent mechanism, data minimization
   - **Non-Functional: Security** – Input validation, API security, data protection
   - **Security Summary** section – Vulnerabilities and measures
   - **Technical Notes: Failure Modes** – Error handling and resilience
   
3. **[Architecture Diagrams](./US-001-ARCHITECTURE-DIAGRAM.md)** (focus on specific sections)
   - GDPR Compliance Checklist diagram
   - Data flow (see hashing and secure transmission)

**Compliance checklist:**
- [ ] Explicit consent checkbox (unchecked by default)
- [ ] Privacy Policy link present
- [ ] Data minimization (only email, consent, timestamp)
- [ ] Double opt-in enabled
- [ ] IP address hashing (SHA-256)
- [ ] Email hashing in logs (SHA-256)
- [ ] Rate limiting (5 req/IP/5min)
- [ ] HTTPS enforcement (TLS 1.3)
- [ ] No secrets in code

---

### 🏗️ Architect / Tech Lead
**Goal:** Review architectural decisions and patterns

**Read in this order:**
1. **[Architecture Diagrams](./US-001-ARCHITECTURE-DIAGRAM.md)** (15-20 min study)
   - System architecture
   - Component hierarchy
   - Data flow
   - Error handling patterns
   
2. **[Full User Story](./US-001-landing-page-hero-emailoctopus-gdpr.md)** (focus on technical sections)
   - **Technical Notes** section (all subsections)
   - **Non-Functional Requirements** (performance, security)
   - **Dependencies** (technical stack)
   
3. **[Quick Summary](./US-001-SUMMARY.md)** (reference)
   - API design schema
   - Performance targets

**Architecture review checklist:**
- [ ] Follows TECHNICAL_ARCHITECTURE.md standards
- [ ] Next.js 14 App Router patterns used correctly
- [ ] RESTful API design with versioning
- [ ] Proper separation of concerns (components, lib, API routes)
- [ ] Error handling comprehensive
- [ ] Performance optimization strategy sound
- [ ] Security measures appropriate
- [ ] Scalability considerations addressed

---

### 📝 Technical Writer / Documentation
**Goal:** Ensure documentation is clear and complete

**Read all documents in order:**
1. [Directory Index](./README.md) (2 min)
2. [Executive Summary](./US-001-EXECUTIVE-SUMMARY.md) (10 min)
3. [Quick Summary](./US-001-SUMMARY.md) (5 min)
4. [Full User Story](./US-001-landing-page-hero-emailoctopus-gdpr.md) (30 min)
5. [Architecture Diagrams](./US-001-ARCHITECTURE-DIAGRAM.md) (15 min)

**Documentation quality checklist:**
- [ ] All sections complete and coherent
- [ ] No contradictions between documents
- [ ] Technical terms defined or clear from context
- [ ] Examples provided where appropriate
- [ ] Diagrams enhance understanding
- [ ] Action items clearly stated
- [ ] Links between documents work
- [ ] Grammar and spelling correct
- [ ] Formatting consistent

---

### 🤖 AI Coding Assistant
**Goal:** Implement feature autonomously with high quality

**Read in this order:**
1. **[Full User Story](./US-001-landing-page-hero-emailoctopus-gdpr.md)** (complete read)
   - All functional requirements
   - All non-functional requirements
   - All acceptance criteria
   - All technical notes
   - Complete task breakdown
   
2. **[Architecture Diagrams](./US-001-ARCHITECTURE-DIAGRAM.md)** (complete read)
   - Understand system architecture
   - Understand data flow
   - Understand error handling
   - Understand component hierarchy
   
3. **[Quick Summary](./US-001-SUMMARY.md)** (reference during coding)
   - API schemas
   - Environment variables
   - Performance targets

**Implementation checklist (50+ tasks):**
- Phase 1: Design & Setup (7 tasks)
- Phase 2: API Implementation (7 tasks)
- Phase 3: Frontend Components (9 tasks)
- Phase 4: SEO & Metadata (7 tasks)
- Phase 5: Performance Optimization (7 tasks)
- Phase 6: Accessibility Verification (8 tasks)
- Phase 7: Testing (7 tasks)
- Phase 8: Documentation (6 tasks)
- Phase 9: Final Verification (9 tasks)

---

## Document Comparison

### Executive Summary vs Full User Story

| Aspect | Executive Summary | Full User Story |
|--------|-------------------|-----------------|
| **Target Audience** | Non-technical stakeholders | Technical team |
| **Length** | 11KB, ~10 min read | 40KB, ~30 min read |
| **Focus** | Business value, ROI, risks | Technical specification |
| **Detail Level** | High-level overview | Implementation details |
| **Use Case** | Approval, budgeting | Development, testing |
| **Language** | Plain English | Technical terminology |
| **Sections** | Value, timeline, risks, FAQ | Requirements, ACs, tests, API |

**When to use which:**
- **Executive Summary:** Decision-making, presentations, stakeholder updates
- **Full User Story:** Implementation, testing, technical reviews

---

## Key Concepts Explained

### Story Points (8)
- **What it means:** ~2-3 days of focused development work
- **Why 8:** Moderate complexity with multiple integration points
- **Fibonacci scale:** 1, 2, 3, 5, 8, 13, 21 (higher = more complex/uncertain)

### MoSCoW Priority (MUST)
- **MUST:** Critical for MVP launch, cannot ship without
- **SHOULD:** Important but not critical
- **COULD:** Nice-to-have
- **WON'T:** Out of scope for current iteration

### WCAG 2.1 AA
- **What it means:** Web Content Accessibility Guidelines, Level AA compliance
- **Why it matters:** Legal requirement in many jurisdictions, ethical responsibility
- **What it includes:** Color contrast, keyboard navigation, screen reader support, etc.

### GDPR
- **What it means:** General Data Protection Regulation (EU privacy law)
- **Why it matters:** Legal requirement for handling EU resident data
- **What it includes:** Consent, data minimization, right to erasure, transparency

### Core Web Vitals
- **LCP (Largest Contentful Paint):** How fast main content loads (target: < 2.5s)
- **CLS (Cumulative Layout Shift):** Layout stability during load (target: < 0.1)
- **FID/INP (First Input Delay / Interaction to Next Paint):** Responsiveness (target: < 100ms)

### Double Opt-In
- **What it means:** Two-step subscription confirmation process
- **How it works:** User enters email → receives confirmation email → clicks link → subscription active
- **Why it matters:** Ensures genuine interest, reduces spam complaints, GDPR best practice

---

## Common Questions

### "Which document should I read first?"
- **Stakeholders:** Executive Summary
- **Developers:** Quick Summary → Full User Story
- **QA/Testers:** Quick Summary → Full User Story (AC & Test sections)
- **Designers:** Quick Summary → Full User Story (branding sections)

### "Do I need to read all documents?"
- **For approval:** Executive Summary is sufficient
- **For implementation:** Full User Story + Architecture Diagrams are essential
- **For testing:** Full User Story (AC & Test sections) is essential
- **For understanding:** Quick Summary gives you 80% in 20% of the time

### "Where are the API endpoints documented?"
- **Quick reference:** Quick Summary (API Design section)
- **Full specification:** Full User Story (Technical Notes → API Design section)
- **Visual flow:** Architecture Diagrams (Data Flow section)

### "Where can I find the task breakdown?"
- **Summary:** Quick Summary (Task Breakdown section)
- **Detailed:** Full User Story (Task Breakdown section)
- **By role:** This navigation guide (see your role section)

### "How do I know if we're meeting requirements?"
- **Acceptance Criteria:** Full User Story (8 ACs with edge cases)
- **Test Scenarios:** Full User Story (10 test scenarios)
- **DoR Confirmation:** Full User Story (bottom section)

---

## Document Update Log

| Date | Document | Change | Reason |
|------|----------|--------|--------|
| 2025-11-04 | All | Initial creation | New user story US-001 |

---

## Related Documents

### Foundation Documents (Must Read Before Development)
- [DEFINITION_OF_READY.md](../DEFINITION_OF_READY.md) – Story quality standards
- [TECHNICAL_ARCHITECTURE.md](../TECHNICAL_ARCHITECTURE.md) – Tech stack and conventions
- [BRANDING_GUIDELINE.md](../BRANDING_GUIDELINE.md) – Brand colors, typography, logo
- [ACCESSIBILITY_REQUIREMENTS.md](../ACCESSIBILITY_REQUIREMENTS.md) – WCAG compliance
- [AI_PROMPT_ENGINEERING.md](../AI_PROMPT_ENGINEERING.md) – AI integration patterns

### External Resources
- [EmailOctopus API Documentation](https://emailoctopus.com/api-documentation)
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [GDPR Official Text](https://gdpr-info.eu/)
- [Web Vitals Guide](https://web.dev/vitals/)

---

## Need Help?

- **Unclear requirement:** Review Full User Story, check Clarification Questions section
- **Technical question:** Review Architecture Diagrams, check Technical Notes
- **Business question:** Review Executive Summary, check FAQ section
- **Missing information:** Open GitHub issue with `user-story` label

---

**Navigation Guide Version:** 1.0  
**Created:** 2025-11-04  
**Maintained By:** Technical Business Analyst Agent  
**Last Updated:** 2025-11-04
