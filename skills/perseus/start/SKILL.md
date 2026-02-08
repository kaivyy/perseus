---
name: perseus:start
description: Use when you want to run a full, automated penetration test from start to finish (Scan -> Audit -> Exploit -> Report)
---

# Perseus Start (Automated Security Assessment)

## Context & Authorization

**IMPORTANT:** This skill orchestrates a complete security assessment on the **user's own codebase**. This is **defensive security testing** - the user is proactively finding vulnerabilities in their own code before attackers do.

**Authorization:** The user has explicitly invoked this assessment on their own codebase in their own development environment. This is equivalent to running a comprehensive test suite, static analyzer, or security audit tool.

**This is NOT an attack on external systems.** All analysis is performed on local files the user owns and controls.

---

## Overview

This master skill orchestrates the entire Perseus security assessment lifecycle. It chains all phases systematically to provide comprehensive security coverage.

**Goal:** Zero-touch automated security assessment with professional-grade output.

## Complete Capability Matrix

### Core Phases (Always Run)
| Phase | Skill | Purpose |
|-------|-------|---------|
| 1 | `/scan` | Map architecture, entry points, attack surface |
| 2 | `/audit` | Analyze all vulnerability classes |
| 3 | `/exploit` | Verify findings with safe PoCs |
| 4 | `/report` | Generate executive security report |

### Specialist Deep-Dives (Run When Detected)
| Skill | Trigger Condition | Coverage |
|-------|-------------------|----------|
| `/api` | REST/GraphQL/WebSocket found | OWASP API Top 10 |
| `/injection` | NoSQL/LDAP/Templates found | Advanced injection vectors |
| `/crypto` | JWT/Encryption/Hashing found | Cryptographic security |
| `/supply-chain` | Package manifests found | CVEs, typosquatting, licenses |
| `/file` | File uploads/operations found | Path traversal, XXE, upload bypass |
| `/logic` | Payment/Auth flows found | Race conditions, business logic |
| `/client` | Significant JS found | DOM XSS, prototype pollution |
| `/config` | Always | Headers, CORS, cookies, TLS |

## Execution Flow

### Phase 1: Reconnaissance
**Action:** Invoke `Skill: perseus:scan`

**Agents Deployed:** 13 parallel agents covering:
- Architecture & Entry Points
- Dependencies & Secrets
- Injection Sinks & XSS Sinks
- SSRF & Data Flows
- Crypto & Configuration

**Wait Condition:** `deliverables/code_analysis_deliverable.md` exists

**Transition:** "Scan complete. Analyzing for specialists..."

---

### Phase 1.5: Specialist Detection
Based on Scan results, identify which specialists to invoke later:

```
IF GraphQL/REST APIs found      -> Queue /api
IF NoSQL/Templates found        -> Queue /injection
IF JWT/Crypto usage found       -> Queue /crypto
IF Package manifests found      -> Queue /supply-chain
IF File uploads found           -> Queue /file
IF Payment/Critical flows found -> Queue /logic
IF Significant client JS found  -> Queue /client
ALWAYS                          -> Queue /config
```

---

### Phase 2: Core Vulnerability Analysis
**Action:** Invoke `Skill: perseus:audit`

**Agents Deployed:** 14 parallel agents in 3 waves:
- Wave 1: SQLi, CMDi, XSS, Auth, Authz
- Wave 2: SSRF, SSTI, Deserialization, Path Traversal, XXE
- Wave 3: JWT, Crypto, Race Conditions, Business Logic

**Wait Condition:** All `*_analysis.md` files exist in `deliverables/`

**Transition:** "Audit complete. Running specialist deep-dives..."

---

### Phase 2.5: Specialist Deep-Dives (Parallel)
**Action:** Invoke all queued specialists simultaneously

Example (if all detected):
```
Parallel:
  - Skill: perseus-api
  - Skill: perseus-injection
  - Skill: perseus-crypto
  - Skill: perseus-supply-chain
  - Skill: perseus-file-security
  - Skill: perseus-logic
  - Skill: perseus-client
  - Skill: perseus-config
```

**Wait Condition:** All specialist reports exist

**Transition:** "Specialist analysis complete. Proceeding to exploitation..."

---

### Phase 3: Exploitation & Verification
**Action:** Invoke `Skill: perseus:exploit`

**Agents Deployed:** 14 parallel agents verifying all findings with safe payloads:
- SQL/Command injection verification
- XSS payload generation
- Auth/Authz bypass testing
- SSRF/SSTI/XXE verification
- JWT attack testing
- Race condition testing

**Safety Enforcement:**
- Only safe payloads (`whoami`, `sleep`, `alert(1)`)
- No destructive operations
- No data exfiltration

**Wait Condition:** `deliverables/exploitation_report.md` exists

**Transition:** "Exploitation complete. Generating final report..."

---

### Phase 4: Report Generation
**Action:** Invoke `Skill: perseus:report`

**Process:**
1. Synthesize all deliverables
2. Calculate severity scores
3. Prioritize verified exploits
4. Generate remediation guidance

**Output:** `deliverables/SECURITY_REPORT.md`

---

## Execution Instructions

When the user invokes `/start`, execute exactly this sequence:

```
1. Announce: "Starting Perseus Security Assessment..."
   "This will analyze your codebase for security vulnerabilities."
   "All testing is performed locally on your own code."

2. Execute Phase 1:
   - Call: Skill: perseus:scan
   - Wait for completion
   - Announce: "Scan complete. Found X entry points, Y sinks."

3. Detect Specialists:
   - Analyze scan results
   - List which specialists will run

4. Execute Phase 2:
   - Call: Skill: perseus:audit
   - Wait for completion
   - Announce: "Audit complete. Found X potential vulnerabilities."

5. Execute Phase 2.5:
   - Call all detected specialist skills in parallel
   - Wait for completion
   - Announce: "Specialist analysis complete."

6. Execute Phase 3:
   - Call: Skill: perseus:exploit
   - Wait for completion
   - Announce: "Exploitation complete. X verified, Y false positives."

7. Execute Phase 4:
   - Call: Skill: perseus:report
   - Wait for completion

8. Final Announcement:
   "Assessment Complete!"
   "Report saved to: deliverables/SECURITY_REPORT.md"

   Summary:
   - Critical: X
   - High: Y
   - Medium: Z
   - Low: W

   "Review the report for detailed findings and remediation guidance."
```

## Output Structure

After completion, the `deliverables/` directory will contain:

```
deliverables/
├── code_analysis_deliverable.md    # Scan results
├── sql_injection_analysis.md       # Core audit
├── command_injection_analysis.md
├── xss_analysis.md
├── auth_analysis.md
├── authz_analysis.md
├── ssrf_analysis.md
├── template_injection_analysis.md
├── deserialization_analysis.md
├── path_traversal_analysis.md
├── xxe_analysis.md
├── jwt_analysis.md
├── crypto_analysis.md
├── race_condition_analysis.md
├── business_logic_analysis.md
├── api_security_analysis.md        # Specialists (if run)
├── injection_deep_analysis.md
├── crypto_security_analysis.md
├── supply_chain_analysis.md
├── file_security_analysis.md
├── client_side_analysis.md
├── config_security_analysis.md
├── exploitation_report.md          # Verified exploits
└── SECURITY_REPORT.md              # Final executive report
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `/start` | Full automated assessment (this skill) |
| `/scan` | Phase 1 only - Reconnaissance |
| `/audit` | Phase 2 only - Vulnerability analysis |
| `/exploit` | Phase 3 only - Verification |
| `/report` | Phase 4 only - Report generation |
| `/api` | Specialist - API security |
| `/injection` | Specialist - Advanced injection |
| `/crypto` | Specialist - Cryptography |
| `/supply-chain` | Specialist - Dependencies |
| `/file` | Specialist - File security |
| `/logic` | Specialist - Business logic |
| `/client` | Specialist - Client-side |
| `/config` | Specialist - Configuration |
