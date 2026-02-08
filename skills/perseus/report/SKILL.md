---
name: perseus:report
description: Use when generating the final executive security report (Phase 5)
---

# Perseus Report (Phase 5)

## Overview

This skill executes the **Reporting Phase** of the Perseus/Shannon framework. It synthesizes findings from Scan, Audit, and Exploit phases into a professional executive report.

**Goal:** Communicate verified risk effectively to stakeholders and drive remediation.

**Methodology:**
1.  **Synthesize:** Combine findings from all phases.
2.  **Verify:** Prioritize *proven* exploits over theoretical risks.
3.  **Contextualize:** Explain business impact, not just technical flaws.

## Execution Instructions

### Step 1: Synthesis
Read all files in `deliverables/` (Scan, Audit, Exploit reports).

### Step 2: Report Generation
Create `deliverables/SECURITY_REPORT.md` using the following structure:

**1. Executive Summary**
*   **Assessment Status:** (Complete/Partial)
*   **Key Findings:** Summary of critical verified risks.
*   **Business Impact:** Data loss, Reputation damage, Compliance violations.
*   **Strategic Recommendation:** Top 1-2 systemic fixes (e.g., "Implement WAF", "Fix Auth Logic").

**2. Attack Surface Summary**
*   Overview of In-Scope components (from Scan Phase).
*   Summary of confirmed secure components (Negative results).

**3. Critical Findings (Verified Exploits)**
*   *Only list findings verified in the Exploit Phase.*
*   **Title:** Clear, descriptive name.
*   **Severity:** Critical/High/Medium (Based on Impact + Likelihood).
*   **Location:** File:Line.
*   **Proof of Concept:** Verified payload or steps to reproduce.
*   **Remediation:** Specific code fix or configuration change.

**4. Audit Findings (Unverified Risks)**
*   List findings from Audit Phase that were *not* exploited but remain risky.
*   Mark as "Potential Vulnerability".

**5. Strategic Recommendations**
*   Systemic improvements (e.g., "Adopt strict Content Security Policy", "Migrate to ORM").
*   Defense-in-depth strategies.

## Tone & Style
*   **Professional:** Objective and factual. No hyperbole.
*   **Actionable:** Recommendations must be concrete code/config changes.
*   **Developer-Focused:** Speak the language of the engineering team.
