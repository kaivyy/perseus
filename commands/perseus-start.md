---
name: perseus:start
description: Run the full automated Perseus security assessment (Scan -> Audit -> Exploit -> Report)
skill: perseus:start
---

# /perseus:start

This command initiates the **Full Perseus Workflow**.

It invokes the master skill `perseus:start` which automatically chains:
1.  **Scan** (Reconnaissance)
2.  **Audit** (Vulnerability Analysis)
3.  **Exploit** (Verification)
4.  **Report** (Final Deliverable)

**Usage:**
Type `/start` to begin the automated assessment.
