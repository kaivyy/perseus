---
name: perseus-start
description: "Use when running a full automated penetration test, security assessment, or vulnerability scan from start to finish, orchestrating scan, audit, exploit, and report phases with smart auto-detection of languages, frameworks, infrastructure, and AI integrations across JavaScript, Go, PHP, Python, Rust, Java, Ruby, and C# codebases."
---

# Perseus Start (Automated Security Assessment)

## Context & Authorization

**IMPORTANT:** This skill orchestrates a complete security assessment on the **user's own codebase**. This is **defensive security testing** — the user is proactively finding vulnerabilities in their own code before attackers do. All analysis is performed on local files the user owns and controls.

---

Master orchestrator for the entire Perseus security assessment lifecycle. Auto-detects languages, frameworks, infrastructure, and AI integrations (see [DETECTION.md](DETECTION.md) for full detection rules), then runs all phases sequentially with specialist deep-dives triggered by detection results.

## Engagement Mode (Required)

| Mode | Environment | Behavior |
|------|-------------|----------|
| `PRODUCTION_SAFE` (default) | Live production | Passive-first analysis and minimal safe verification only |
| `STAGING_ACTIVE` | Staging/pre-production | Active safe payload testing with request throttling |
| `LAB_FULL` | Isolated lab | Full dynamic verification and payload mutation |
| `LAB_RED_TEAM` | Dedicated lab environment | Multi-step adversarial simulation with kill-switches |

## Core Phases & Specialists

**Core Phases (Always Run):**

| Phase | Skill | Purpose |
|-------|-------|---------|
| 1 | perseus:scan | Map architecture, entry points, attack surface |
| 2 | perseus:audit | Analyze all vulnerability classes |
| 3 | perseus:exploit | Verify findings with safe PoCs |
| 4 | perseus:report | Generate executive security report |

**Specialist Deep-Dives (Run When Detected):**

| Skill | Trigger | Coverage |
|-------|---------|----------|
| api | REST/GraphQL/WebSocket/gRPC | +OAuth, Cache |
| injection | NoSQL/Templates/Commands | +Log4j, SSTI |
| crypto | JWT/Encryption/Hashing | Multi-lang patterns |
| supply-chain | Package manifests | +Typosquatting |
| file | File uploads/operations | +Zip Slip, XXE |
| logic | Payment/Auth/AI flows | +Prompt injection |
| client | React/Vue/Angular/SSR | +Server Components |
| config | Always | +Docker, CI/CD, Cloud, K8s |

## Execution Instructions

When the user invokes `/start`, execute this sequence. If any phase fails or returns empty results, log the failure and continue to the next phase.

### Phase -1: Engagement Setup
1. Detect runtime context (production/staging/lab)
2. Ask for explicit authorization scope if context is unclear
3. Set mode (default `PRODUCTION_SAFE`)
4. Create `deliverables/engagement_profile.md` with mode, in-scope targets, excluded systems, request-rate limits, approved test window, kill-switch thresholds
5. Announce: "Engagement mode set to: [MODE]"

### Phase 0: Auto-Detection
1. Scan for languages, frameworks, infrastructure, APIs, and AI integrations using the patterns in [DETECTION.md](DETECTION.md)
2. Announce: "Detected: [Language], [Framework], [Infrastructure]"

### Phase 1: Reconnaissance
1. Invoke `Skill: perseus:scan`
2. Wait for `deliverables/code_analysis_deliverable.md`
3. Announce: "Scan complete. Found X entry points, Y sinks."

### Phase 1.5: Specialist Detection
1. Match detection results against specialist trigger rules in [DETECTION.md](DETECTION.md)
2. Announce: "Will run specialists: [list]"

### Phase 2: Core Vulnerability Analysis
1. Invoke `Skill: perseus:audit`
2. Wait for all `*_analysis.md` files in `deliverables/`
3. Announce: "Audit complete. Found X potential vulnerabilities."

### Phase 2.5: Specialist Deep-Dives
1. Invoke all detected specialist skills in parallel
2. Wait for all specialist reports
3. Announce: "Specialist analysis complete."

### Phase 3: Exploitation & Verification
1. Invoke `Skill: perseus:exploit`
2. Wait for `deliverables/exploitation_report.md`
3. Announce: "Exploitation complete. X verified, Y false positives."

**Safety enforcement (all modes):** Only safe payloads (`whoami`, `sleep`, `alert(1)`, `{{7*7}}`). No destructive operations. No data exfiltration.

### Phase 4: Report Generation
1. Invoke `Skill: perseus:report`
2. Wait for `deliverables/SECURITY_REPORT.md`
3. Announce assessment complete with summary of findings by severity

## Output Structure

After completion, `deliverables/` contains: `engagement_profile.md`, `code_analysis_deliverable.md`, all `*_analysis.md` files (core + specialist), `verification_scope.md`, `exploitation_report.md`, and `SECURITY_REPORT.md`.

## Quick Reference

| Command | Description |
|---------|-------------|
| `/start` | Full automated assessment with auto-detect (this skill) |
| `/scan` | Phase 1 only — Reconnaissance |
| `/report` | Phase 4 only — Report generation |
| `/specialist` | Run all specialist skills in parallel |
