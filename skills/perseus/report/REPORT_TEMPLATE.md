# Security Assessment Report Template

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
