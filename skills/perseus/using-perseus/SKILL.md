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

### Phase 2: Vulnerability Analysis (`/audit`)
**Goal:** Prove potential vulnerability.
- **Action:** Run `Skill: perseus:audit` (or `/audit`).
- **Logic:** Launch 5 parallel specialists (Injection, XSS, Auth, Authz, SSRF).
- **Method:** "Negative Analysis" (Source -> Flow -> Sink -> Defense -> Verdict).
- **Output:** Specialized reports in `deliverables/`.

### Phase 3: Exploitation (`/exploit`)
**Goal:** Verify impact (False Positive Filtering).
- **Action:** Run `Skill: perseus:exploit` (or `/exploit`).
- **Safety:** Use SAFE payloads only (`whoami`, `alert(1)`, `sleep`).
- **Output:** Verified proofs in `deliverables/exploitation_report.md`.

### Phase 4: Reporting (`/report`)
**Goal:** Communicate risk.
- **Action:** Run `Skill: perseus:report` (or `/report`).
- **Output:** Final `SECURITY_REPORT.md` with executive summary and risk scoring.

## Critical Rules

1.  **No Hallucinations:** Only report vulnerabilities you have verified via Audit or Exploit.
2.  **Safe Mode:** Never execute destructive commands (e.g., `rm`, `DROP TABLE`).
3.  **Evidence-Based:** Every finding must cite a specific File:Line or HTTP Request/Response.

## How to Start

If the user asks for a security review, pentest, or audit, ALWAYS start with:

```text
I will use the Perseus methodology to assess this codebase.
Starting Phase 1: Reconnaissance...
[Invoking /scan]
```
