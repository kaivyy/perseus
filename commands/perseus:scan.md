---
description: Run security reconnaissance on the codebase (Phase 1 & 2)
---

# /perseus:scan

This command initiates the **Perseus Scan** phase.

It invokes the `perseus:scan` skill to:
1.  Map the application architecture.
2.  Identify all entry points and attack surface.
3.  Catalog security patterns (Auth/Authz).
4.  Map potential XSS, SSRF, and data sinks.

**Usage:**
Just type `/scan` to start. The agent will launch the necessary sub-agents.
