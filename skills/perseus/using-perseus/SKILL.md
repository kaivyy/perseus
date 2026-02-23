---
name: using-perseus
description: Use when starting a security conversation to understand the Perseus methodology
---

# Using Perseus

## Overview

Perseus is a rigorous, automated security assessment framework for Claude Code. It transforms the AI into a structured penetration tester.

**Core Principle:** Methodological rigor over ad-hoc guessing. We do not "look around"; we execute specific phases.

## The Workflow

The assessment MUST follow this linear sequence. Do not skip phases.

### Phase 1: Reconnaissance (`/scan`)
**Goal:** Map the attack surface.
- **Action:** Run `Skill: perseus:scan` (or `/scan`).
- **Output:** `deliverables/code_analysis_deliverable.md` (Target Knowledge Graph).
- **Stop Condition:** Do not proceed until you know *what* to attack.

### Phase 2: Vulnerability Analysis (Audit)
**Goal:** Prove potential vulnerability.
- **Action:** Run `Skill: perseus:audit`.
- **Logic:** Launch 5 parallel specialists (Injection, XSS, Auth, Authz, SSRF).
- **Method:** "Negative Analysis" (Source -> Flow -> Sink -> Defense -> Verdict).
- **Output:** Specialized reports in `deliverables/`.

### Phase 3: Exploitation (Exploit)
**Goal:** Verify impact (False Positive Filtering).
- **Action:** Run `Skill: perseus:exploit`.
- **Safety:** Use SAFE payloads only (`whoami`, `alert(1)`, `sleep`).
- **Output:** Verified proofs in `deliverables/exploitation_report.md`.

### Phase 4: Reporting (`/report`)
**Goal:** Communicate risk.
- **Action:** Run `Skill: perseus:report` (or `/report`).
- **Output:** Final `SECURITY_REPORT.md` with executive summary and risk scoring.

### Optional: Specialists (`/specialist`)
**Goal:** Run all deep-dive specialists in parallel.
- **Action:** Run `Skill: perseus-specialist` (or `/specialist`).

## Engagement Modes

Always select engagement mode before Phase 1. If user does not specify, default to `PRODUCTION_SAFE`.

| Mode | Intended Environment | Verification Style |
|------|----------------------|--------------------|
| `PRODUCTION_SAFE` | Live production | Passive analysis + minimal non-disruptive verification |
| `STAGING_ACTIVE` | Staging/pre-prod | Targeted active verification with throttling |
| `LAB_FULL` | Isolated lab | Full dynamic verification for hard-to-reproduce findings |
| `LAB_RED_TEAM` | Dedicated security lab | Adversarial chain simulation with strict legal scope |

Mode selection rule:
1. If environment is unclear, assume production and use `PRODUCTION_SAFE`.
2. If user requests aggressive testing, require explicit confirmation that target is staging/lab and authorized.
3. Record chosen mode in deliverables so report consumers understand test depth.

## Critical Rules

1.  **No Hallucinations:** Only report vulnerabilities you have verified via Audit or Exploit.
2.  **Safe Mode:** Never execute destructive commands (e.g., `rm`, `DROP TABLE`).
3.  **Evidence-Based:** Every finding must cite a specific File:Line or HTTP Request/Response.
4.  **Authorization Gate:** Do not run active exploit validation on production without explicit approved test window.
5.  **Stability First:** Keep verification low-rate and stop immediately if service degradation appears.
6.  **Lab Isolation for Red-Team Mode:** `LAB_RED_TEAM` only on isolated test environment with non-production data.

## How to Start

If the user asks for a security review, pentest, or audit, ALWAYS start with:

```text
I will use the Perseus methodology to assess this codebase.
Starting Phase 1: Reconnaissance...
[Invoking /scan]
```
