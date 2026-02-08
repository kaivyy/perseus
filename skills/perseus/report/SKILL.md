---
name: perseus:report
description: Use when generating the final executive security report (Phase 5)
---

# Perseus Report (Phase 5)

## Context & Authorization

**IMPORTANT:** This skill generates a professional security report for the **user's own codebase**. The report is intended to help developers and stakeholders understand and remediate security issues in their own software.

---

## Overview

This skill executes the **Reporting Phase** of the Perseus framework. It synthesizes findings from Scan, Audit, and Exploit phases into a professional executive report.

**Goal:** Communicate verified risks effectively to stakeholders and drive remediation.

**Methodology:**
1.  **Collect:** Gather all deliverables from previous phases.
2.  **Verify:** Prioritize verified exploits over theoretical risks.
3.  **Contextualize:** Explain business impact, not just technical flaws.
4.  **Remediate:** Provide actionable fixes for each finding.

## Execution Instructions

### Step 1: Collect All Deliverables

Read all files in `deliverables/`:
- `code_analysis_deliverable.md` (Scan)
- All `*_analysis.md` files (Audit)
- `exploitation_report.md` (Exploit)

### Step 2: Calculate Risk Metrics

**Severity Scoring (CVSS-inspired):**

| Severity | Criteria | Score |
|----------|----------|-------|
| Critical | RCE, Auth Bypass, SQLi with data access, Admin takeover | 9.0-10.0 |
| High | Stored XSS, SSRF to internal, Privilege Escalation, Sensitive data exposure | 7.0-8.9 |
| Medium | Reflected XSS, CSRF, Information disclosure, Missing security headers | 4.0-6.9 |
| Low | Minor info leak, Best practice violations, Verbose errors | 0.1-3.9 |

**Exploitability Factor:**
- VERIFIED: Multiply by 1.0 (confirmed exploitable)
- POTENTIAL: Multiply by 0.7 (likely exploitable)
- THEORETICAL: Multiply by 0.4 (needs specific conditions)

### Step 3: Generate Report

Create `deliverables/SECURITY_REPORT.md` using this structure:

```markdown
# Security Assessment Report

**Project:** [Project Name]
**Assessment Date:** [Date]
**Methodology:** Perseus Security Framework
**Scope:** [Repository/Application name]

---

## Executive Summary

### Assessment Status
[Complete/Partial] - [X] phases completed

### Risk Overview
| Severity | Verified | Potential | Total |
|----------|----------|-----------|-------|
| Critical | X | Y | Z |
| High | X | Y | Z |
| Medium | X | Y | Z |
| Low | X | Y | Z |

### Key Findings
1. **[Most Critical Finding]** - Brief description and impact
2. **[Second Critical Finding]** - Brief description and impact
3. **[Third Critical Finding]** - Brief description and impact

### Business Impact
- **Data Breach Risk:** [High/Medium/Low] - [Explanation]
- **Service Disruption:** [High/Medium/Low] - [Explanation]
- **Compliance Impact:** [Regulations affected: GDPR, PCI-DSS, HIPAA, etc.]
- **Reputation Risk:** [High/Medium/Low] - [Explanation]

### Top 3 Recommendations
1. [Highest priority fix]
2. [Second priority fix]
3. [Third priority fix]

---

## Attack Surface Summary

### Technology Stack
- **Framework:** [e.g., Express.js, Django, Rails]
- **Database:** [e.g., PostgreSQL, MongoDB]
- **Authentication:** [e.g., JWT, Session-based]
- **Hosting:** [e.g., Docker, Kubernetes, Serverless]

### Entry Points Analyzed
| Type | Count | Critical Paths |
|------|-------|----------------|
| API Endpoints | X | `/api/auth/*`, `/api/admin/*` |
| GraphQL | X | `mutation { ... }` |
| WebSocket | X | `/ws/chat` |
| File Upload | X | `/upload` |

### Dependencies
- **Total Packages:** X
- **With Known CVEs:** Y
- **Critical CVEs:** Z

---

## Critical Findings (Verified Exploits)

> Only findings verified in the Exploit Phase appear here.

### CRITICAL-001: [Title]

**Severity:** Critical (9.5)
**Status:** VERIFIED EXPLOITABLE
**CVSS Vector:** [If applicable]

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

// Fixed code
[code snippet]
```

#### References
- [OWASP Link]
- [CWE Link]

---

### CRITICAL-002: ...

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
**Recommendation:** [What to do about it]

---

## Secure Components

> Components analyzed and found to be properly secured.

| Component | Security Measures | Notes |
|-----------|-------------------|-------|
| Authentication | bcrypt, rate limiting, MFA | Properly implemented |
| SQL Queries | Parameterized queries | No injection found |
| ... | ... | ... |

---

## Strategic Recommendations

### Immediate Actions (0-7 days)
1. [Critical fix 1]
2. [Critical fix 2]

### Short-term (1-4 weeks)
1. [High priority improvements]
2. [Security configuration changes]

### Long-term (1-3 months)
1. [Architectural improvements]
2. [Security tooling implementation]
3. [Training recommendations]

### Defense-in-Depth Suggestions
1. **Input Validation:** Implement schema validation on all inputs (e.g., Zod, Joi)
2. **Output Encoding:** Use context-aware encoding for all output
3. **Security Headers:** Implement CSP, HSTS, X-Frame-Options
4. **Monitoring:** Add security logging and alerting
5. **Dependencies:** Implement automated vulnerability scanning in CI/CD

---

## Appendix

### A. Tools Used
- Perseus Security Framework
- Static Analysis: [tools]
- Dynamic Testing: [tools]

### B. Scope Exclusions
- [What was not tested and why]

### C. Glossary
- **SQLi:** SQL Injection
- **XSS:** Cross-Site Scripting
- **SSRF:** Server-Side Request Forgery
- [etc.]
```

## Tone & Style

*   **Professional:** Objective and factual. No hyperbole or fear-mongering.
*   **Actionable:** Every finding has a specific remediation.
*   **Developer-Focused:** Code examples for fixes, not just descriptions.
*   **Business-Aware:** Explain impact in business terms, not just technical.

## Quality Checklist

Before finalizing the report, verify:
- [ ] All verified exploits are documented with evidence
- [ ] All findings have remediation guidance
- [ ] Severity ratings are consistent
- [ ] No sensitive data (real credentials, PII) is included
- [ ] Report can be shared with stakeholders

**Assessment Complete.** Report saved to `deliverables/SECURITY_REPORT.md`.
