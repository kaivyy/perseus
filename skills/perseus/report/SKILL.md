---
name: perseus-report
description: "Use when synthesizing scan, audit, exploit, and specialist findings into a CVSS-scored executive security report with language-specific remediation guidance for JavaScript, Go, PHP, Python, Rust, Java, Ruby, and C# codebases."
---

# Perseus Report (Phase 4)

## Context & Authorization

**IMPORTANT:** This skill generates a professional security report for the **user's own codebase**. The report is intended to help developers and stakeholders understand and remediate security issues in their own software.

---

Synthesizes findings from Scan, Audit, Exploit, and Specialist phases into a professional executive report with CVSS-inspired severity scoring and language-specific remediation.

**Supported frameworks:** Express, Fastify, Next.js, Nest.js, Gin, Echo, Fiber, Chi, Laravel, Symfony, Slim, FastAPI, Django, Flask, Actix-web, Axum, Rocket, Spring Boot, Quarkus, Rails, Sinatra, ASP.NET Core.

## Execution Instructions

### Step 1: Collect All Deliverables

Verify all required deliverables exist in `deliverables/` before proceeding. If any are missing, note gaps in the report.

**Core Phase Deliverables:**
- `engagement_profile.md` (Mode, scope, constraints)
- `code_analysis_deliverable.md` (Scan)
- All `*_analysis.md` files (Audit)
- `exploitation_report.md` (Exploit)
- `verification_scope.md` (Verification limits and approved window)

**Specialist Deliverables (if present):**
- `api_security_analysis.md`, `injection_deep_analysis.md`, `crypto_security_analysis.md`
- `supply_chain_analysis.md`, `file_security_analysis.md`, `business_logic_analysis.md`
- `client_side_analysis.md`, `config_security_analysis.md`

### Step 2: Calculate Risk Metrics

**Severity Scoring (CVSS-inspired):**

| Severity | Criteria | Score |
|----------|----------|-------|
| Critical | RCE, Auth Bypass, SQLi with data access, Admin takeover, Container escape, AI prompt injection leading to RCE | 9.0-10.0 |
| High | Stored XSS, SSRF to internal, Privilege Escalation, Sensitive data exposure, CI/CD injection, Public cloud storage | 7.0-8.9 |
| Medium | Reflected XSS, CSRF, Information disclosure, Missing security headers, Outdated dependencies, Docker misconfig | 4.0-6.9 |
| Low | Minor info leak, Best practice violations, Verbose errors, License issues | 0.1-3.9 |

**Scoring formula:** `base_score × exploitability × confidence × verification_context`

| Factor | Condition | Multiplier |
|--------|-----------|------------|
| Exploitability | VERIFIED / POTENTIAL / THEORETICAL | 1.0 / 0.7 / 0.4 |
| Confidence | High / Medium / Low | 1.0 / 0.75 / 0.5 |
| Verification Context | PRODUCTION_SAFE / STAGING_ACTIVE / LAB_FULL / LAB_RED_TEAM / POTENTIAL-PROD-BLOCKED | 1.0 / 0.9 / 0.85 / 0.8 / 0.7 |

**Example:** Critical SQLi (9.5) VERIFIED in STAGING_ACTIVE with High confidence: `9.5 × 1.0 × 1.0 × 0.9 = 8.55`

### Step 3: Generate Report

Create `deliverables/SECURITY_REPORT.md` using the template in [REPORT_TEMPLATE.md](REPORT_TEMPLATE.md).

**Validation before finalizing:**
- All verified exploits documented with evidence
- All findings have language-specific remediation guidance
- Severity ratings are consistent with scoring formula
- Infrastructure findings included (Docker, CI/CD, Cloud, K8s)
- AI/LLM findings included (if applicable)
- Supply chain summary is complete
- No sensitive data (real credentials, PII) is included

## Tone & Style

*   **Professional:** Objective and factual. No hyperbole or fear-mongering.
*   **Actionable:** Every finding has a language-specific remediation.
*   **Developer-Focused:** Code examples for fixes in the detected language.
*   **Business-Aware:** Explain impact in business terms, not just technical.

**Assessment Complete.** Report saved to `deliverables/SECURITY_REPORT.md`.
