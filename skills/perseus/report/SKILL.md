---
name: perseus:report
description: Use when generating the final executive security report (Phase 4)
---

# Perseus Report (Phase 4)

## Context & Authorization

**IMPORTANT:** This skill generates a professional security report for the **user's own codebase**. The report is intended to help developers and stakeholders understand and remediate security issues in their own software.

---

## Multi-Language Support

Report generation adapts remediation guidance based on detected language/framework:

| Language | Frameworks |
|----------|------------|
| JavaScript/TypeScript | Express, Fastify, Next.js, Nest.js |
| Go | Gin, Echo, Fiber, Chi |
| PHP | Laravel, Symfony, Slim |
| Python | FastAPI, Django, Flask |
| Rust | Actix-web, Axum, Rocket |
| Java | Spring Boot, Quarkus |
| Ruby | Rails, Sinatra |
| C# | ASP.NET Core |

---

## Overview

This skill executes the **Reporting Phase** of the Perseus framework. It synthesizes findings from Scan, Audit, Exploit, and Specialist phases into a professional executive report.

**Goal:** Communicate verified risks effectively to stakeholders and drive remediation.

**Methodology:**
1.  **Collect:** Gather all deliverables from previous phases.
2.  **Verify:** Prioritize verified exploits over theoretical risks.
3.  **Contextualize:** Explain business impact, not just technical flaws.
4.  **Remediate:** Provide language-specific, actionable fixes for each finding.

## Execution Instructions

### Step 1: Collect All Deliverables

Read all files in `deliverables/`:

**Core Phase Deliverables:**
- `engagement_profile.md` (Mode, scope, constraints)
- `code_analysis_deliverable.md` (Scan)
- All `*_analysis.md` files (Audit)
- `exploitation_report.md` (Exploit)
- `verification_scope.md` (Verification limits and approved window)

**Specialist Deliverables (if present):**
- `api_security_analysis.md` (API + GraphQL + WebSocket + OAuth)
- `injection_deep_analysis.md` (NoSQL + SSTI + Log4j)
- `crypto_security_analysis.md` (JWT + Hashing + Encryption)
- `supply_chain_analysis.md` (CVEs + Typosquatting)
- `file_security_analysis.md` (Path Traversal + XXE + Zip Slip)
- `business_logic_analysis.md` (Race Conditions + AI Security)
- `client_side_analysis.md` (React/Vue/Angular + SSR)
- `config_security_analysis.md` (Docker + CI/CD + Cloud + K8s)

### Step 2: Calculate Risk Metrics

**Severity Scoring (CVSS-inspired):**

| Severity | Criteria | Score |
|----------|----------|-------|
| Critical | RCE, Auth Bypass, SQLi with data access, Admin takeover, Container escape, AI prompt injection leading to RCE | 9.0-10.0 |
| High | Stored XSS, SSRF to internal, Privilege Escalation, Sensitive data exposure, CI/CD injection, Public cloud storage | 7.0-8.9 |
| Medium | Reflected XSS, CSRF, Information disclosure, Missing security headers, Outdated dependencies, Docker misconfig | 4.0-6.9 |
| Low | Minor info leak, Best practice violations, Verbose errors, License issues | 0.1-3.9 |

**Exploitability Factor:**
- VERIFIED: Multiply by 1.0 (confirmed exploitable)
- POTENTIAL: Multiply by 0.7 (likely exploitable)
- THEORETICAL: Multiply by 0.4 (needs specific conditions)

**Confidence Factor:**
- High: Multiply by 1.0
- Medium: Multiply by 0.75
- Low: Multiply by 0.5

**Verification Context Factor:**
- VERIFIED in `PRODUCTION_SAFE`: Multiply by 1.0
- VERIFIED in `STAGING_ACTIVE`: Multiply by 0.9
- VERIFIED in `LAB_FULL`: Multiply by 0.85
- VERIFIED in `LAB_RED_TEAM`: Multiply by 0.8
- `POTENTIAL-PROD-BLOCKED`: Multiply by 0.7

### Step 3: Generate Report

Create `deliverables/SECURITY_REPORT.md` using this structure:

```markdown
# Security Assessment Report

**Project:** [Project Name]
**Assessment Date:** [Date]
**Methodology:** Perseus Security Framework v2.0
**Scope:** [Repository/Application name]
**Engagement Mode:** [PRODUCTION_SAFE/STAGING_ACTIVE/LAB_FULL/LAB_RED_TEAM]

---

## Executive Summary

### Assessment Status
[Complete/Partial] - [X] phases completed, [Y] specialists run

### Technologies Analyzed
| Category | Detected |
|----------|----------|
| Language | [e.g., TypeScript, Go, Python] |
| Framework | [e.g., Next.js 14, Gin, FastAPI] |
| Database | [e.g., PostgreSQL, MongoDB, Redis] |
| Infrastructure | [e.g., Docker, Kubernetes, AWS] |
| CI/CD | [e.g., GitHub Actions, GitLab CI] |
| AI/LLM | [e.g., OpenAI, Anthropic, LangChain] |

### Risk Overview
| Severity | Verified | Potential | Total |
|----------|----------|-----------|-------|
| Critical | X | Y | Z |
| High | X | Y | Z |
| Medium | X | Y | Z |
| Low | X | Y | Z |

### Verification Coverage
| Category | Count |
|----------|-------|
| Verified | X |
| Failed Verification | Y |
| Potential (Prod Blocked) | Z |
| Aborted (Safety Kill-Switch) | W |

### Key Findings
1. **[Most Critical Finding]** - Brief description and impact
2. **[Second Critical Finding]** - Brief description and impact
3. **[Third Critical Finding]** - Brief description and impact

### Business Impact
- **Data Breach Risk:** [High/Medium/Low] - [Explanation]
- **Service Disruption:** [High/Medium/Low] - [Explanation]
- **Compliance Impact:** [Regulations affected: GDPR, PCI-DSS, HIPAA, SOC2, etc.]
- **Reputation Risk:** [High/Medium/Low] - [Explanation]

### Top 3 Recommendations
1. [Highest priority fix]
2. [Second priority fix]
3. [Third priority fix]

---

## Attack Surface Summary

### Technology Stack
- **Language:** [e.g., TypeScript]
- **Framework:** [e.g., Next.js 14 (App Router)]
- **Database:** [e.g., MongoDB, PostgreSQL]
- **Authentication:** [e.g., JWT, NextAuth, OAuth]
- **Infrastructure:** [e.g., Docker, Kubernetes, Vercel]

### Entry Points Analyzed
| Type | Count | Critical Paths |
|------|-------|----------------|
| API Endpoints | X | `/api/auth/*`, `/api/admin/*` |
| GraphQL | X | `mutation { ... }` |
| WebSocket | X | `/ws/chat` |
| File Upload | X | `/upload` |
| Server Actions | X | `app/actions/*` |

### Dependencies
- **Total Packages:** X
- **With Known CVEs:** Y
- **Critical CVEs:** Z (list package names)

### Infrastructure
- **Docker Images:** X
- **CI/CD Pipelines:** Y
- **Cloud Resources:** Z

---

## Critical Findings (Verified Exploits)

> Only findings verified in the Exploit Phase appear here.

### CRITICAL-001: [Title]

**Severity:** Critical (9.5)
**Status:** VERIFIED EXPLOITABLE
**Category:** [Injection/Auth/Config/AI/etc.]
**Language:** [Node.js/Go/Python/etc.]

#### Description
[Clear explanation of the vulnerability]

#### Location
- **File:** `path/to/file.js`
- **Line:** 42-48
- **Endpoint:** `POST /api/vulnerable`

#### Proof of Concept
```
[Minimal reproduction steps or payload]
```

#### Evidence
[Screenshot, response, or output proving exploitation]

#### Impact
- [Specific impact: data access, RCE, etc.]
- [Business impact: what could attacker do?]

#### Remediation
```javascript
// Vulnerable code
[code snippet]

// Fixed code (language-specific)
[code snippet]
```

#### References
- [OWASP Link]
- [CWE Link]

---

### CRITICAL-002: ...

---

## Infrastructure Security Findings

> Findings from Docker, CI/CD, Cloud, and Kubernetes analysis.

### Docker Security
| Check | Status | Issue |
|-------|--------|-------|
| Non-root user | PASS/FAIL | [Details] |
| Pinned base image | PASS/FAIL | [Details] |
| No secrets in image | PASS/FAIL | [Details] |
| Minimal base | PASS/FAIL | [Details] |

### CI/CD Security
| Check | Status | Issue |
|-------|--------|-------|
| No command injection | PASS/FAIL | [Details] |
| Minimal permissions | PASS/FAIL | [Details] |
| Secrets not in logs | PASS/FAIL | [Details] |

### Cloud Security
| Resource | Issue | Severity |
|----------|-------|----------|
| S3 Bucket | Public access | Critical |
| Security Group | Open ports | High |

### Kubernetes Security
| Check | Status |
|-------|--------|
| Non-root pods | PASS/FAIL |
| Network policies | PASS/FAIL |
| RBAC configured | PASS/FAIL |
| Secrets encrypted | PASS/FAIL |

---

## AI/LLM Security Findings

> Findings from AI security analysis (if applicable).

### AI Security Status
| Check | Status | Risk |
|-------|--------|------|
| Prompt Injection Protection | PASS/FAIL | [Details] |
| Output Filtering | PASS/FAIL | [Details] |
| Tool Use Validation | PASS/FAIL | [Details] |
| RAG Access Control | PASS/FAIL | [Details] |
| Rate Limiting | PASS/FAIL | [Details] |

### AI-VULN-001: [Title]
**Type:** [Prompt Injection/Data Leakage/Tool Abuse]
...

---

## High Severity Findings

### HIGH-001: ...

---

## Medium Severity Findings

### MEDIUM-001: ...

---

## Low Severity Findings

### LOW-001: ...

---

## Potential Vulnerabilities (Unverified)

> Findings from Audit that could not be verified but remain risky.

### POTENTIAL-001: [Title]
**Severity:** [Estimated]
**Reason Not Verified:** [Why exploitation wasn't confirmed]
**Mode Constraint:** [Why blocked in current mode]
**Recommendation:** [What to do about it]

---

## Supply Chain Summary

### Vulnerability Overview
| Severity | Count | Notable Packages |
|----------|-------|------------------|
| Critical | X | [packages] |
| High | X | [packages] |
| Medium | X | [packages] |

### License Issues
| Package | License | Risk |
|---------|---------|------|
| [pkg] | GPL-3.0 | Copyleft in proprietary |

### Outdated Dependencies
| Package | Current | Latest | Gap |
|---------|---------|--------|-----|
| [pkg] | X.Y.Z | A.B.C | [major/minor] |

---

## Secure Components

> Components analyzed and found to be properly secured.

| Component | Security Measures | Notes |
|-----------|-------------------|-------|
| Authentication | bcrypt, rate limiting, MFA | Properly implemented |
| SQL Queries | Parameterized queries | No injection found |
| Docker | Non-root, minimal image | Best practices followed |
| ... | ... | ... |

---

## Strategic Recommendations

### Immediate Actions (0-7 days)
1. [Critical fix 1] - [Language-specific guidance]
2. [Critical fix 2] - [Language-specific guidance]

### Short-term (1-4 weeks)
1. [High priority improvements]
2. [Security configuration changes]
3. [Dependency updates]

### Long-term (1-3 months)
1. [Architectural improvements]
2. [Security tooling implementation]
3. [Training recommendations]

### Infrastructure Hardening
1. **Docker:** [Specific recommendations]
2. **CI/CD:** [Specific recommendations]
3. **Cloud:** [Specific recommendations]
4. **Kubernetes:** [Specific recommendations]

### Defense-in-Depth Suggestions
1. **Input Validation:** Implement schema validation (Zod, Joi, Pydantic)
2. **Output Encoding:** Use context-aware encoding
3. **Security Headers:** Implement CSP, HSTS, X-Frame-Options
4. **Monitoring:** Add security logging and alerting
5. **Dependencies:** Implement automated vulnerability scanning in CI/CD
6. **AI Security:** Implement prompt injection detection and output filtering

---

## Appendix

### A. Tools Used
- Perseus Security Framework v2.0
- Static Analysis: Code pattern matching, AST analysis
- Dynamic Testing: Safe payload verification

### B. Languages & Frameworks Analyzed
- [List all detected with versions]

### C. Scope Exclusions
- [What was not tested and why]

### D. Glossary
- **SQLi:** SQL Injection
- **XSS:** Cross-Site Scripting
- **SSRF:** Server-Side Request Forgery
- **SSTI:** Server-Side Template Injection
- **XXE:** XML External Entity
- **IDOR:** Insecure Direct Object Reference
- **BOLA:** Broken Object Level Authorization
- **RCE:** Remote Code Execution
```

## Tone & Style

*   **Professional:** Objective and factual. No hyperbole or fear-mongering.
*   **Actionable:** Every finding has a language-specific remediation.
*   **Developer-Focused:** Code examples for fixes in the detected language.
*   **Business-Aware:** Explain impact in business terms, not just technical.
*   **Infrastructure-Aware:** Include Docker, CI/CD, Cloud, K8s findings.

## Quality Checklist

Before finalizing the report, verify:
- [ ] All verified exploits are documented with evidence
- [ ] All findings have language-specific remediation guidance
- [ ] Severity ratings are consistent
- [ ] Infrastructure findings are included (Docker, CI/CD, Cloud, K8s)
- [ ] AI/LLM findings are included (if applicable)
- [ ] Supply chain summary is complete
- [ ] No sensitive data (real credentials, PII) is included
- [ ] Report can be shared with stakeholders

**Assessment Complete.** Report saved to `deliverables/SECURITY_REPORT.md`.
