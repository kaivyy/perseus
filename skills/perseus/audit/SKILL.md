---
name: perseus-audit
description: Use when analyzing components for vulnerabilities (Phase 2 - Parallel Analysis)
---

# Perseus Audit (Phase 2 - Deep Vulnerability Analysis)

## Context & Authorization

**IMPORTANT:** This skill performs in-depth source code vulnerability auditing on the **user's own codebase**. This is **defensive code security review / SAST taint analysis** to uncover flaws before deployment.

- **Authorization:** The user owns this repository and has explicitly requested this security analysis.
- **Scope:** Source code, configuration, and data-flow pathways identified during Phase 1 (`perseus-scan`).
- **Safety:** Static taint tracking and code logic review only. No destructive modifications or external attacks.

---

## Overview

This skill executes the **Vulnerability Analysis Phase** of the Perseus framework. It performs deep white-box taint analysis on candidate entry points and sinks discovered during Phase 1.

**Goal:** Prove whether untrusted source data can traverse application logic and reach a sensitive sink without adequate validation, sanitization, or parameterization.

---

## Agent Execution Strategy (Dual-Mode)

When executing this skill, adapt to the runtime environment:

* **Mode A — Subagents Available (Multi-Agent/Parallel):**
  If subagent tools (e.g. `Task`, `Agent`, `invoke_subagent`) are available, launch 5 parallel analysts (Injection, XSS, Auth, Authz, SSRF).
* **Mode B — Direct Execution (Single-Agent Fallback — UNIVERSAL):**
  If no subagent tool exists in your runtime, **DO NOT attempt to call non-existent subagent tools**. Systematically audit each vulnerability category sequentially in the current session using ripgrep (`rg`), inspect code context with `read_file`, and write deliverables directly.

---

## Taint Analysis Methodology (The Negative Analysis Loop)

For every candidate path, follow this rigorous 5-step loop:

```
[1. Source] ──> [2. Flow / Transform] ──> [3. Defense Check] ──> [4. Sink] ──> [5. Verdict]
```

1. **Trace Source:** Locate where untrusted data enters (`req.body`, `req.query`, `req.params`, headers, cookies, webhook payloads, file uploads, RPC messages).
2. **Trace Flow:** Track variables through assignments, object destructuring, helper utilities, and database model transformations.
3. **Inspect Defense:**
   - *Is there strict schema validation?* (e.g. Zod, Joi, Pydantic, Bean Validation).
   - *Is there contextual sanitization?* (e.g. DOMPurify, HTML entity encoding, shlex escaping).
   - *Is the operation inherently safe?* (e.g. SQL prepared statements, parameterized queries, ORM abstraction).
   - *Common Flaws:* Regex missing start/end anchors (`^`, `$`), single replacement (`.replace()` without global `/g` flag), bypassable blacklist checks, decoding after validation.
4. **Inspect Sink:** Verify if the input directly affects query execution, command execution, DOM rendering, or URL construction.
5. **Determine Verdict:**
   - **VULNERABLE:** Path exists and defense is missing or bypassable. Mark as **Exploit Candidate** (`Yes`).
   - **SAFE / MITIGATED:** Proper defense exists. Document defense mechanisms.

---

## Targeted Audit Commands & Categories

### 1. Injection Analysis (CWE-89, CWE-78, CWE-94, CWE-1336)
```bash
# SQL Injection: Raw queries, dynamic string interpolation, concatenation in ORM calls
rg -n -C 3 -i "(queryRawUnsafe|\.raw\(|exec\(.*SELECT|db\.query\(|\.query\(f?['\"].*\$|\.execute\(f?['\"].*%|SELECT\s+.*\+)"

# OS Command Injection: shell execution with variable input
rg -n -C 3 "(child_process|exec\(|spawn\(|execSync|system\(|popen\(|os\.system|subprocess\.|exec\.Command|Runtime\.getRuntime)"

# Template Injection (SSTI): user input in template render engines
rg -n -C 3 "(render_template_string|jinja2\.Template|Twig|Blade::render|ejs\.render|Handlebars\.compile)"
```

### 2. Client-Side & XSS Analysis (CWE-79, CWE-116)
```bash
# Dangerous React, Vue, Angular, or Svelte innerHTML sinks
rg -n -C 3 "(dangerouslySetInnerHTML|v-html|bypassSecurityTrust|innerHTML|outerHTML|document\.write)"

# Client-side eval and function constructors
rg -n -C 3 "(eval\(|new Function\(|setTimeout\([^,]*\+)"
```

### 3. Authentication & Session Analysis (CWE-287, CWE-384, CWE-798)
```bash
# Token verification, JWT secret usage, session creation
rg -n -C 3 -i "(jwt\.verify|jwt\.sign|bcrypt\.compare|password_verify|session\.regenerate|crypto\.timingSafeEqual)"

# Hardcoded tokens, test credentials, or fallback secrets
rg -n -C 2 -i "(jwt_secret|api_key|secret_key|private_key)\s*[:=]\s*['\"][A-Za-z0-9_\-\.]{8,}['\"]"
```

### 4. Authorization & IDOR Analysis (CWE-862, CWE-639, CWE-285)
```bash
# Inspect route handlers fetching resources by ID:
# Check if current user ID/tenant ID is enforced in the DB query
rg -n -C 4 -i "(\.findById|\.findOne|\.where\(.*id|SELECT.*WHERE.*id)"
```
*Rule:* If endpoint takes `/api/resource/:id` and fetches by `id` without verifying `resource.ownerId === req.user.id` or `where: { id, userId }`, flag as **BOLA/IDOR (CWE-639)**.

### 5. Server-Side Request Forgery (SSRF) (CWE-918)
```bash
# Outbound HTTP calls accepting user-controlled URLs, webhooks, or hosts
rg -n -C 3 -i "(axios\.(get|post)|fetch\(|urllib|requests\.(get|post)|http\.Get|curl_exec)"
```
*Rule:* If URL is parsed or validated, check for IP parsing flaws, DNS rebinding, internal IP bypasses (`localhost`, `127.0.0.1`, `169.254.169.254`, `[::1]`, `0.0.0.0`).

---

## Confidence Scoring Standard

Every finding must receive a strict confidence score:

| Confidence | Qualification Criteria |
|------------|------------------------|
| **High**   | Clear, uninterrupted code path from untrusted source to critical sink with no or demonstrably flawed defense. |
| **Medium** | Path confirmed in code, but exploitability relies on specific environment settings, unverified upstream middleware, or non-default configs. |
| **Low**    | Suspicious pattern detected, but data source might be restricted, internal, or constrained by types/framework protections. |

---

## Deliverables & Output Format

Ensure `mkdir -p deliverables` exists. Generate `deliverables/audit_analysis.md` (or domain-specific reports `deliverables/*_analysis.md`) using this structure:

```markdown
# Vulnerability Analysis Deliverable

## Summary of Findings
| Finding ID | Title | Severity | CWE | Confidence | Exploit Candidate |
|------------|-------|----------|-----|------------|-------------------|
| AUDIT-001  | SQL Injection via Unsafe Query | Critical | CWE-89 | High | Yes |
| AUDIT-002  | Missing Ownership Check (IDOR) | High | CWE-639 | High | Yes |

---

### Finding AUDIT-001: SQL Injection via Unsafe Query

- **Severity:** Critical
- **CWE:** CWE-89 (Improper Neutralization of Special Elements used in an SQL Command)
- **Confidence:** High
- **Exploit Candidate:** Yes

#### 1. Source to Sink Path
- **Source:** `req.query.sort` in `src/controllers/orderController.ts:34`
- **Propagation:** Passed to `orderService.getSortedOrders(sort)` in line 38
- **Sink:** `db.$queryRawUnsafe("SELECT * FROM orders ORDER BY " + sort)` in `src/services/orderService.ts:112`

#### 2. Defense Analysis
- **Observed Defense:** None. Input is concatenated directly into SQL statement.
- **Deficiency:** Untrusted user parameter controls SQL statement structure.

#### 3. Preconditions
- User must be authenticated to invoke the endpoint.

---
```

**Next Step:** Proceed to `perseus-exploit` to verify candidate vulnerabilities with non-destructive proofs.
