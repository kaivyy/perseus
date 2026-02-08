---
name: perseus-supply-chain
description: Dependency and supply chain security analysis (CVEs, licenses, typosquatting)
---

# Perseus Supply Chain Specialist

## Context & Authorization

**IMPORTANT:** This skill performs supply chain security analysis on the **user's own codebase**. This is defensive security testing to identify vulnerable dependencies before they're exploited.

**Authorization:** The user owns this codebase and has explicitly requested this specialized analysis.

---

## Overview

This specialist skill performs comprehensive dependency and supply chain security analysis.

**When to Use:** As part of any security assessment, or specifically when concerned about third-party code.

**Goal:** Identify vulnerable, malicious, or risky dependencies before they compromise the application.

## Supply Chain Risks Covered

| Risk | Description | Impact |
|------|-------------|--------|
| Known CVEs | Published vulnerabilities in dependencies | Varies (RCE to DoS) |
| Outdated Packages | Old versions missing security fixes | Potential exposure |
| Typosquatting | Malicious packages with similar names | Malware, data theft |
| Dependency Confusion | Private package name hijacking | Code execution |
| License Issues | Incompatible or risky licenses | Legal, compliance |
| Abandoned Packages | Unmaintained dependencies | Future vulnerabilities |

## Execution Instructions

### Phase 1: Dependency Inventory (2 Parallel Agents)

1.  **Manifest Scanner:**
    *   "Find and parse all dependency manifests. Extract: package name, version, source registry. Create complete dependency tree including transitive dependencies."

    **Manifests to Check:**
    - Node.js: `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
    - Python: `requirements.txt`, `Pipfile.lock`, `poetry.lock`, `setup.py`
    - Go: `go.mod`, `go.sum`
    - Rust: `Cargo.toml`, `Cargo.lock`
    - Java: `pom.xml`, `build.gradle`
    - PHP: `composer.json`, `composer.lock`
    - Ruby: `Gemfile`, `Gemfile.lock`
    - .NET: `*.csproj`, `packages.config`

2.  **Lock File Analyst:**
    *   "Verify lock files exist and are up to date. Check for integrity hashes. Flag missing lock files (allows dependency substitution attacks)."

### Phase 2: Vulnerability Analysis (3 Parallel Agents)

1.  **CVE Scanner:**
    *   "For each dependency, check known CVE databases. Prioritize by: CVSS score, exploitability, whether vulnerability affects used functionality."

    **Data Sources (conceptual - analyze version patterns):**
    - npm: Check for known vulnerable versions
    - PyPI: Check for security advisories
    - Go: Check for vulncheck patterns

2.  **Severity Analyst:**
    *   "For each CVE found, determine: Is the vulnerable code path reachable? Is it in production dependencies or devDependencies? What's the actual risk in this context?"

3.  **Transitive Dependency Analyst:**
    *   "Analyze transitive (indirect) dependencies. These are often overlooked but equally dangerous. Flag deeply nested vulnerabilities."

### Phase 3: Package Integrity Analysis (3 Parallel Agents)

1.  **Typosquatting Detector:**
    *   "Check package names against known typosquatting patterns. Flag: names similar to popular packages, recently published packages, packages with few downloads."

    **Common Typosquatting Patterns:**
    - lodash → lodahs, 1odash, lodash-utils
    - express → expres, expresss, express-js
    - requests → request, reqeusts

2.  **Dependency Confusion Analyst:**
    *   "Check for private package patterns that could be hijacked on public registries. Flag: @company/* scopes, internal-looking names, packages from private registries."

3.  **Package Reputation Analyst:**
    *   "Analyze package metadata: maintainer count, last update date, download trends, GitHub stars. Flag: single maintainer, no updates in 2+ years, sudden ownership changes."

### Phase 4: License & Compliance (2 Parallel Agents)

1.  **License Scanner:**
    *   "Extract licenses for all dependencies. Flag: GPL in commercial projects, unclear licenses, license changes between versions."

    **License Risk Levels:**
    - Low: MIT, BSD, Apache 2.0, ISC
    - Medium: LGPL, MPL
    - High: GPL, AGPL (for proprietary use)
    - Critical: No license, custom restrictive

2.  **Compliance Analyst:**
    *   "Check for compliance requirements: export controls, government restrictions, industry-specific requirements (PCI, HIPAA)."

### Phase 5: Build & Install Script Analysis (2 Parallel Agents)

1.  **Install Script Analyst:**
    *   "Check for postinstall/preinstall scripts in dependencies. These run with full system access. Flag: network requests, file system modifications, obfuscated code."

2.  **Native Dependency Analyst:**
    *   "Identify native/compiled dependencies. Check for: prebuilt binaries from untrusted sources, C/C++ dependencies with memory safety issues."

## Output Requirements

Create `deliverables/supply_chain_analysis.md`:

```markdown
# Supply Chain Security Analysis

## Dependency Overview
| Ecosystem | Direct | Transitive | Total |
|-----------|--------|------------|-------|
| npm | X | Y | Z |
| pip | X | Y | Z |
| go | X | Y | Z |

## Vulnerability Summary
| Severity | Count | Fixable | Action Required |
|----------|-------|---------|-----------------|
| Critical | X | Y | Immediate |
| High | X | Y | This sprint |
| Medium | X | Y | Next release |
| Low | X | Y | Backlog |

## Critical Vulnerabilities

### [CVE-2024-XXXXX] Remote Code Execution in lodash
**Package:** lodash@4.17.20
**Severity:** Critical (CVSS 9.8)
**Fixed Version:** 4.17.21

**Impact:** Prototype pollution leading to RCE
**Reachability:** CONFIRMED - Used in `utils/data.js:45`

**Remediation:**
```bash
npm update lodash --depth=10
# or
npm audit fix
```

---

### [CVE-2024-YYYYY] ...

## Suspicious Packages

### [TYPO-001] Possible Typosquatting
**Package:** `expresss` (note: 3 s's)
**Similar to:** `express` (popular web framework)
**Recommendation:** Verify this is intentional, otherwise remove

## License Issues

| Package | License | Issue | Action |
|---------|---------|-------|--------|
| react-pdf | GPL-3.0 | Copyleft in commercial app | Review usage |
| unknown-lib | UNLICENSED | No license | Contact author or remove |

## Outdated Packages

| Package | Current | Latest | Age | Risk |
|---------|---------|--------|-----|------|
| webpack | 4.44.0 | 5.88.0 | 3 years | Medium |
| node-sass | 4.14.0 | deprecated | - | High |

## Recommendations

### Immediate Actions
1. Update lodash to 4.17.21+ (Critical CVE)
2. Remove or verify `expresss` package
3. Add lock files if missing

### Process Improvements
1. Implement automated dependency scanning in CI/CD
2. Set up Dependabot or Renovate for automated updates
3. Create policy for evaluating new dependencies
4. Regular (monthly) dependency audits
```

**Next Step:** Critical CVEs should be fixed immediately. Other findings inform risk assessment.
