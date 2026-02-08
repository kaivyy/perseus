---
name: perseus:audit
description: Use when analyzing components for vulnerabilities (Phase 3 - Parallel Analysis)
---

# Perseus Audit (Phase 3)

## Overview

This skill executes the **Vulnerability Analysis Phase** of the Perseus/Shannon framework. It performs deep-dive white-box analysis on the components identified during the Scan phase.

**Goal:** Prove the *potential* for exploitation by finding source-to-sink paths lacking proper defense.

**Methodology:**
1.  **Launch 5 Agents in Parallel:** Injection, XSS, Auth, Authz, SSRF.
2.  **Negative Analysis Loop:** Trace Source -> Sanitizers -> Sink -> Verdict.
3.  **Exploit Queue:** Generate actionable vulnerabilities for verification.

## Execution Instructions

Launch these 5 agents simultaneously using a single message with multiple `Task` tool calls:

1.  **Injection Analyst:**
    *   "Trace untrusted input to SQL/Command sinks. Verify if sanitization matches sink context. Flag string concatenation in queries."
2.  **XSS Specialist:**
    *   "Trace input to browser sinks (`innerHTML`, `eval`). Verify context-aware escaping. Flag raw HTML rendering."
3.  **Auth Specialist:**
    *   "Analyze login/session logic. Check for bypasses, weak tokens, and missing MFA. Verify `state`/`nonce` in OAuth."
4.  **Authz Specialist:**
    *   "Analyze permission checks (RBAC/ABAC). Check for IDOR and Privilege Escalation. Verify every protected route has a guard."
5.  **SSRF Specialist:**
    *   "Trace input to outbound request sinks. Verify URL validation and allowlists. Check for local network access."

## Analysis Methodology (The "Negative Analysis" Loop)

For each agent, enforce this loop:

1.  **Trace Source:** Identify where untrusted data enters (from Scan phase).
2.  **Trace Flow:** Follow variables through functions, middleware, and transforms.
3.  **Identify Sink:** Where does the data end up? (DB, Screen, Log, Shell).
4.  **Verify Defense:**
    *   *Is there validation?* (e.g., `zod.parse`)
    *   *Is there sanitization?* (e.g., `escapeHtml`)
    *   *Is it parameterized?* (e.g., Prepared Statements)
5.  **Verdict:**
    *   **VULNERABLE:** Path exists + Defense missing/mismatched. -> **Add to Exploit Queue**
    *   **SAFE:** Defense is robust. -> **Document as Secure**

## Output Requirements

Each agent must produce a specialized report in `deliverables/`:
*   `injection_analysis.md`
*   `xss_analysis.md`
*   `auth_analysis.md`
*   `authz_analysis.md`
*   `ssrf_analysis.md`

**Next Step:** Proceed to `perseus:exploit` to verify findings with Proof-of-Concept.
