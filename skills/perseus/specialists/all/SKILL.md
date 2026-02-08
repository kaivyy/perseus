---
name: perseus-specialist
description: Run all specialist deep-dive skills in parallel for comprehensive analysis
---

# Perseus Specialist (All Deep-Dive Skills)

## Context & Authorization

**IMPORTANT:** This skill runs all specialist security analyses on the **user's own codebase**. This is defensive security testing to find vulnerabilities before attackers do.

**Authorization:** The user owns this codebase and has explicitly requested this comprehensive analysis.

---

## Overview

This skill orchestrates ALL 8 specialist skills in parallel for maximum coverage and efficiency.

**When to Use:**
- After `/scan` to get deep analysis on all detected components
- When you want comprehensive specialist coverage without running `/start`
- As a standalone deep-dive after initial assessment

**Goal:** Run all specialists simultaneously for thorough security analysis.

## Specialists Included

| Skill | Coverage | Output |
|-------|----------|--------|
| `perseus-api` | OWASP API Top 10, GraphQL, WebSocket | `api_security_analysis.md` |
| `perseus-injection` | NoSQL, LDAP, XPath, SSTI, Command | `injection_deep_analysis.md` |
| `perseus-crypto` | JWT, Hashing, Encryption, Secrets | `crypto_security_analysis.md` |
| `perseus-supply-chain` | CVEs, Dependencies, Licenses | `supply_chain_analysis.md` |
| `perseus-file-security` | Path Traversal, Upload, XXE | `file_security_analysis.md` |
| `perseus-logic` | Race Conditions, Business Logic | `business_logic_analysis.md` |
| `perseus-client` | DOM XSS, Prototype Pollution | `client_side_analysis.md` |
| `perseus-config` | Headers, CORS, Cookies, TLS | `config_security_analysis.md` |

## Execution Instructions

### Step 1: Announce Start

```
"Running all Perseus specialist skills in parallel..."
"This provides deep-dive analysis across 8 security domains."
```

### Step 2: Launch All Specialists in Parallel

Use a single message with 8 parallel `Task` tool calls:

```
Parallel Tasks:
1. Task: "Run API security specialist" -> Skill: perseus-api
2. Task: "Run injection specialist" -> Skill: perseus-injection
3. Task: "Run crypto specialist" -> Skill: perseus-crypto
4. Task: "Run supply chain specialist" -> Skill: perseus-supply-chain
5. Task: "Run file security specialist" -> Skill: perseus-file-security
6. Task: "Run business logic specialist" -> Skill: perseus-logic
7. Task: "Run client-side specialist" -> Skill: perseus-client
8. Task: "Run config specialist" -> Skill: perseus-config
```

### Step 3: Wait for Completion

Wait for all 8 specialists to complete their analysis.

### Step 4: Summarize Results

```
"Specialist analysis complete!"

Summary:
- API Security: X findings
- Injection: X findings
- Cryptography: X findings
- Supply Chain: X findings
- File Security: X findings
- Business Logic: X findings
- Client-Side: X findings
- Configuration: X findings

Total: X findings across 8 domains

"All reports saved to deliverables/"
```

## Output Structure

After completion, `deliverables/` will contain:

```
deliverables/
├── api_security_analysis.md
├── injection_deep_analysis.md
├── crypto_security_analysis.md
├── supply_chain_analysis.md
├── file_security_analysis.md
├── business_logic_analysis.md
├── client_side_analysis.md
└── config_security_analysis.md
```

## When to Use Each Specialist Individually

| If You Need | Run |
|-------------|-----|
| Only API analysis | `/api` |
| Only injection deep-dive | `/injection` |
| Only crypto audit | `/crypto` |
| Only dependency check | `/supply-chain` |
| Only file/upload security | `/file` |
| Only business logic | `/logic` |
| Only client-side | `/client` |
| Only config hardening | `/config` |
| **All of the above** | `/specialist` |

## Integration with Core Skills

```
Recommended Flow:

/scan              → Map attack surface
    ↓
/specialist        → Deep-dive all domains (this skill)
    ↓
/audit             → Core vulnerability analysis
    ↓
/exploit           → Verify findings
    ↓
/report            → Generate final report

Or simply:

/start             → Runs everything automatically
```

## Quick Reference

| Command | What It Does |
|---------|--------------|
| `/specialist` | All 8 specialists in parallel |
| `/start` | Full assessment (includes specialists) |
| `/api` | API security only |
| `/injection` | Injection analysis only |
| `/crypto` | Cryptography only |
| `/supply-chain` | Dependencies only |
| `/file` | File security only |
| `/logic` | Business logic only |
| `/client` | Client-side only |
| `/config` | Configuration only |
