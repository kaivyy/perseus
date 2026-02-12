---
name: perseus:audit
description: Perform deep-dive vulnerability analysis on identified components (Phase 2)
skill: perseus:audit
---

# /perseus:audit

This command initiates the **Perseus Audit** phase.

It invokes the `perseus:audit` skill to:
1.  Launch 5 parallel specialists (Injection, XSS, Auth, Authz, SSRF).
2.  Perform source-to-sink analysis on critical components.
3.  Verify defenses and identify potential exploits.

**Usage:**
Type `/audit` to start. You can optionally specify a target component:
- `/audit` (Full audit of identified surface)
- `/audit src/auth` (Focus on specific module)
