---
name: perseus-audit
description: "Use when performing white-box vulnerability analysis on scan results to trace source-to-sink paths, identify missing defenses, and build an exploit queue with confidence-scored findings across injection, XSS, auth, authz, and SSRF categories."
---

# Perseus Audit (Phase 2)

Executes the **Vulnerability Analysis Phase** of the Perseus framework. Performs deep-dive white-box analysis on components identified during the Scan phase by launching 5 parallel agents (Injection, XSS, Auth, Authz, SSRF) that trace source-to-sink paths and flag missing defenses.

**Goal:** Prove exploitation potential by finding source-to-sink paths lacking proper defense and building a prioritized exploit queue.

## Confidence Scoring (Required)

Assign confidence to every finding:

| Confidence | Criteria |
|------------|----------|
| High | Direct source-to-sink path with clear missing defense and reproducible trigger |
| Medium | Strong path evidence, but one assumption (runtime config/auth state) remains |
| Low | Pattern match only; data flow or trigger path is incomplete |

Prioritize exploit queue in this order:
1. High + Critical/High severity
2. Medium + Critical/High severity
3. Remaining findings

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

For each finding include:
*   **Finding ID**
*   **Source -> Sink Path**
*   **Missing or Mismatched Defense**
*   **Preconditions**
*   **Confidence:** `High` | `Medium` | `Low`
*   **Exploit Candidate:** `Yes` | `No` (and reason)

**Next Step:** Proceed to `perseus:exploit` to verify findings with Proof-of-Concept.
