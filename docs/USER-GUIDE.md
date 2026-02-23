# Perseus User Guide

A comprehensive guide to using Perseus for security assessments.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Quick Assessment](#quick-assessment)
3. [Understanding the Phases](#understanding-the-phases)
4. [Reading Reports](#reading-reports)
5. [Using Specialists](#using-specialists)
6. [Configuration](#configuration)
7. [Common Workflows](#common-workflows)
8. [Interpreting Findings](#interpreting-findings)
9. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Installation

**Claude Code:**
```
/plugin install kaivyy/perseus
```

**Verify Installation:**
```
/plugin
```
Look for "perseus" in the installed plugins list.

### First Assessment

Navigate to your project directory and run:
```
/start
```

Perseus will:
1. Auto-detect your language, framework, and infrastructure
2. Run reconnaissance (scan phase)
3. Perform vulnerability analysis (audit phase)
4. Verify findings with safe payloads (exploit phase)
5. Generate an executive report

---

## Quick Assessment

### Full Automated Assessment
```
/start
```
Best for: First-time scans, comprehensive coverage

### Key Commands
```
/scan        # Map attack surface
/report      # Generate report
```

### Specialist Deep-Dives
```
/specialist  # Run all 8 specialists
```

Specialist skills also run automatically during `/start` when relevant signals are detected.

---

## Understanding the Phases

### Phase 1: Scan (Reconnaissance)

**Purpose:** Map your application's attack surface

**What it finds:**
- Architecture & tech stack
- API endpoints (REST, GraphQL, WebSocket)
- Authentication patterns
- Database connections
- Dangerous code patterns (sinks)
- Hardcoded secrets

**Output:** `deliverables/code_analysis_deliverable.md`

### Phase 2: Audit (Vulnerability Analysis)

**Purpose:** Deep-dive analysis of potential vulnerabilities

**Methodology:** Negative Analysis Loop
```
Source → Data Flow → Sink → Defense Check → Verdict
```

**Runs in 3 waves (parallel):**
- Wave 1: SQLi, Command Injection, XSS, Auth, Authz
- Wave 2: SSRF, SSTI, Deserialization, Path Traversal, XXE
- Wave 3: JWT, Crypto, Race Conditions, Business Logic

**Output:** Multiple `*_analysis.md` files

### Phase 3: Exploit (Verification)

**Purpose:** Verify findings with safe Proof-of-Concept payloads

**Safe payloads only:**
| Vulnerability | Safe Payload |
|---------------|--------------|
| SQL Injection | `SLEEP(5)`, `AND 1=1` |
| Command Injection | `sleep 5`, `whoami` |
| XSS | `alert(1)`, `alert(document.domain)` |
| SSTI | `{{7*7}}` → expects `49` |

**Output:** `deliverables/exploitation_report.md`

### Phase 4: Report (Executive Summary)

**Purpose:** Professional report for stakeholders

**Includes:**
- Risk overview with severity counts
- Verified exploits with evidence
- Business impact analysis
- Language-specific remediation
- Strategic recommendations

**Output:** `deliverables/SECURITY_REPORT.md`

---

## Reading Reports

### Severity Levels

| Severity | CVSS | Examples |
|----------|------|----------|
| **Critical** | 9.0-10.0 | RCE, Auth Bypass, SQLi with data access |
| **High** | 7.0-8.9 | Stored XSS, SSRF to internal, Privilege Escalation |
| **Medium** | 4.0-6.9 | Reflected XSS, CSRF, Missing security headers |
| **Low** | 0.1-3.9 | Info disclosure, Best practice violations |

### Finding Status

| Status | Meaning |
|--------|---------|
| **VERIFIED** | Confirmed exploitable with PoC |
| **POTENTIAL** | Likely vulnerable, needs manual verification |
| **THEORETICAL** | Possible under specific conditions |

### Report Structure

```
SECURITY_REPORT.md
├── Executive Summary
│   ├── Risk Overview (table)
│   ├── Key Findings (top 3)
│   └── Business Impact
├── Critical Findings (verified)
├── High Severity Findings
├── Medium Severity Findings
├── Low Severity Findings
├── Infrastructure Security
├── AI/LLM Security (if applicable)
├── Supply Chain Summary
├── Secure Components (what's OK)
└── Strategic Recommendations
```

---

## Using Specialists

### When to Use Specialists

| Scenario | Recommended Specialist |
|----------|------------------------|
| Building APIs | api |
| User authentication | crypto |
| File upload feature | file |
| React/Next.js frontend | client |
| Docker deployment | config |
| AI/LLM integration | logic |
| npm/pip dependencies | supply-chain |
| Complex input handling | injection |

### Specialist Coverage

| Specialist | Coverage |
|------------|----------|
| **api** | OWASP API Top 10, GraphQL, WebSocket, OAuth, gRPC |
| **injection** | NoSQL, LDAP, XPath, SSTI, Log4j, Expression Language |
| **crypto** | JWT, Password Hashing, Encryption, Key Management |
| **supply-chain** | CVEs, Typosquatting, Dependency Confusion, Licenses |
| **file** | Path Traversal, Upload Bypass, XXE, Zip Slip |
| **logic** | Race Conditions, AI Security, Business Logic |
| **client** | React, Next.js SSR, Vue, Angular, DOM XSS |
| **config** | Docker, CI/CD, Cloud (AWS/GCP/Azure), Kubernetes |

---

## Configuration

### Using perseus.yaml

Copy the example config to your project:
```bash
cp ~/.claude/plugins/perseus/perseus.yaml.example ./perseus.yaml
```

### Common Configurations

**Exclude test files:**
```yaml
scope:
  exclude:
    - "**/*.test.*"
    - "**/*.spec.*"
    - "__tests__/**"
```

**Only run specific specialists:**
```yaml
specialists:
  api: true
  injection: true
  crypto: true
  supply-chain: false  # Skip
  file: false          # Skip
  logic: true
  client: false        # Skip
  config: true
```

**Set minimum severity:**
```yaml
severity:
  minimum: medium  # Don't report low/info
```

**Enable incremental scan:**
```yaml
incremental:
  enabled: true
  baseline: "main"
```

---

## Common Workflows

### Pre-Commit Security Check
```
/scan
```
Quick reconnaissance before committing code.

### PR Security Review
```
/start
```
Full analysis for pull request reviews.

### Pre-Release Assessment
```
/start
```
Full assessment before deploying to production.

### Dependency Update Review
```
/specialist
```
Run deep-dive specialists after updating dependencies.

### After Adding Authentication
```
/specialist
```
Run specialists to verify JWT/password handling.

### After API Changes
```
/specialist
```
Run specialists to check BOLA, rate limiting, etc.

---

## Interpreting Findings

### What to Fix First

1. **Critical + Verified** → Fix immediately
2. **High + Verified** → Fix before release
3. **Critical + Potential** → Investigate and fix
4. **High + Potential** → Plan to fix
5. **Medium** → Fix when possible
6. **Low** → Consider fixing

### Understanding Remediation Code

Each finding includes:
```markdown
**Vulnerable Code:**
```javascript
// What's wrong
```

**Fixed Code:**
```javascript
// How to fix it
```
```

The remediation is language-specific based on your detected framework.

### False Positives

If a finding is a false positive:
1. Check the context - is there defense elsewhere?
2. Verify the data flow - is user input actually reaching the sink?
3. Consider business context - is this risk acceptable?

---

## Troubleshooting

### "Skill not found"

Reinstall the plugin:
```
/plugin uninstall perseus
/plugin install kaivyy/perseus
```

### No deliverables created

Check if `deliverables/` directory exists:
```bash
mkdir -p deliverables
```

Then run the assessment again.

### Scan takes too long

Use incremental scan:
```yaml
# perseus.yaml
incremental:
  enabled: true
  baseline: "main"
```

Or exclude large directories:
```yaml
scope:
  exclude:
    - "node_modules/**"
    - "vendor/**"
```

### Hook not running

Verify hooks are registered:
```
/plugin
```
Look for "Hooks: SessionStart" under Perseus.

### Assessment stops midway

Check for:
1. Rate limiting (wait and retry)
2. Large files (add to exclude list)
3. Infinite loops in code (fix the code)

---

## Best Practices

1. **Run `/start` on new projects** - Get baseline security posture
2. **Use specialists for focused work** - After making specific changes
3. **Review reports thoroughly** - Don't just look at severity
4. **Verify before fixing** - Understand the vulnerability first
5. **Track findings over time** - Compare reports between releases
6. **Don't ignore "potential"** - They often become "verified" later

---

## Getting Help

- **GitHub Issues:** https://github.com/kaivyy/perseus/issues
- **Documentation:** https://github.com/kaivyy/perseus
- **Release Notes:** Check `CHANGELOG.md` for updates
