# Perseus Architecture

Technical architecture documentation for Perseus Security Skills.

## Overview

Perseus is a modular security assessment framework built as a Claude Code plugin. It uses a multi-phase methodology with parallel agent orchestration to perform comprehensive white-box security analysis.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Perseus Framework                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐          │
│  │  Scan   │ → │  Audit  │ → │ Exploit │ → │ Report  │          │
│  │ Phase 1 │   │ Phase 2 │   │ Phase 3 │   │ Phase 4 │          │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘          │
│       ↓             ↓             ↓             ↓                │
│  ┌─────────────────────────────────────────────────────┐        │
│  │              Specialist Skills (Parallel)            │        │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │        │
│  │  │ API │ │ Inj │ │Crypto│ │Supply│ │File │ │Logic│   │        │
│  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘   │        │
│  │  ┌─────┐ ┌─────┐                                    │        │
│  │  │Client│ │Config│                                   │        │
│  │  └─────┘ └─────┘                                    │        │
│  └─────────────────────────────────────────────────────┘        │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────┐        │
│  │                    Deliverables                      │        │
│  │  • code_analysis_deliverable.md                      │        │
│  │  • *_analysis.md (per vulnerability type)            │        │
│  │  • exploitation_report.md                            │        │
│  │  • SECURITY_REPORT.md                                │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
perseus/
├── .claude-plugin/
│   ├── plugin.json          # Plugin manifest
│   └── marketplace.json     # Marketplace definition
├── hooks/
│   ├── hooks.json           # Hook registration
│   └── session-start.sh     # Context injection
├── skills/
│   └── perseus/
│       ├── scan/SKILL.md    # Phase 1
│       ├── audit/SKILL.md   # Phase 2
│       ├── exploit/SKILL.md # Phase 3
│       ├── report/SKILL.md  # Phase 4
│       ├── start/SKILL.md   # Orchestrator
│       ├── using-perseus/SKILL.md
│       └── specialists/
│           ├── api/SKILL.md
│           ├── injection/SKILL.md
│           ├── crypto/SKILL.md
│           ├── supply-chain/SKILL.md
│           ├── file-security/SKILL.md
│           ├── logic/SKILL.md
│           ├── client/SKILL.md
│           ├── config/SKILL.md
│           └── all/SKILL.md
├── commands/                # Slash command definitions
├── docs/                    # Documentation
└── tests/                   # Validation tests
```

## Core Components

### 1. Plugin System

**plugin.json** - Defines plugin metadata:
```json
{
  "name": "perseus",
  "version": "2.0.0",
  "description": "Security assessment skills..."
}
```

**hooks.json** - Registers lifecycle hooks:
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [{
          "type": "command",
          "command": "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh"
        }]
      }
    ]
  }
}
```

### 2. Skill System

Each skill is a `SKILL.md` file with:

```markdown
---
name: skill-name
description: When to use this skill
---

# Skill Title

## Instructions for the AI agent
...
```

**Skill Types:**

| Type | Purpose |
|------|---------|
| Core | Main assessment phases (scan, audit, exploit, report) |
| Orchestrator | Coordinates other skills (start, specialist) |
| Specialist | Deep-dive analysis (api, injection, crypto, etc.) |
| Meta | Usage instructions (using-perseus) |

### 3. Command System

Commands in `commands/` map to skills:

```markdown
# commands/scan.md
Load and execute the perseus:scan skill
```

**Command Naming:**
- Short: `/scan`, `/audit`, `/start`
- Namespaced: `/perseus:api`, `/perseus:injection`

## Phase Methodology

### Phase 1: Scan (Reconnaissance)

**Goal:** Build Target Knowledge Graph

**Agents (13 parallel):**
1. Architecture Analyzer
2. Entry Point Mapper
3. Dependency Scanner
4. Secret Detector
5. Auth Pattern Analyzer
6. Authz Pattern Analyzer
7. Injection Sink Finder
8. XSS Sink Finder
9. SSRF Pattern Finder
10. Data Flow Mapper
11. Crypto Usage Analyzer
12. Security Header Checker
13. Config Analyzer

**Output:** `code_analysis_deliverable.md`

### Phase 2: Audit (Vulnerability Analysis)

**Goal:** Find source-to-sink paths lacking defense

**Methodology:** Negative Analysis Loop
```
1. Source: Where does user input enter?
2. Flow: How does it propagate?
3. Sink: Where is it used dangerously?
4. Defense: Is there sanitization/validation?
5. Verdict: VULNERABLE or SECURE
```

**Agents (14 parallel, 3 waves):**

Wave 1:
- SQL Injection Analyst
- Command Injection Analyst
- XSS Analyst
- Auth Analyst
- Authz Analyst

Wave 2:
- SSRF Analyst
- SSTI Analyst
- Deserialization Analyst
- Path Traversal Analyst
- XXE Analyst

Wave 3:
- JWT Analyst
- Crypto Analyst
- Race Condition Analyst
- Business Logic Analyst

**Output:** Multiple `*_analysis.md` files

### Phase 3: Exploit (Verification)

**Goal:** Confirm exploitability with safe PoCs

**Safe Payload Policy:**
```
✅ Allowed: sleep, whoami, alert(1), {{7*7}}
❌ Forbidden: rm, curl evil, reverse shells
```

**Agents (14 parallel):**
- One per vulnerability type from Phase 2
- Generates custom Python/Bash scripts
- Executes with timeout protection
- Records evidence (screenshots, responses)

**Output:** `exploitation_report.md`

### Phase 4: Report (Executive Summary)

**Goal:** Communicate risks to stakeholders

**Sections:**
1. Executive Summary
2. Risk Overview (severity matrix)
3. Critical Findings (verified)
4. High/Medium/Low Findings
5. Infrastructure Security
6. AI/LLM Security
7. Supply Chain Summary
8. Secure Components
9. Strategic Recommendations

**Output:** `SECURITY_REPORT.md`

## Agent Orchestration

### Parallel Execution

Perseus uses Claude Code's Task tool for parallel agent execution:

```
Main Agent
    ├── Task Agent 1 (SQL Injection)
    ├── Task Agent 2 (XSS)
    ├── Task Agent 3 (Auth)
    └── Task Agent 4 (SSRF)
         └── All run concurrently
```

**Benefits:**
- Faster assessments (parallel > sequential)
- Specialized focus per agent
- Independent failure handling

### Agent Communication

Agents communicate through files:
1. Phase 1 writes `code_analysis_deliverable.md`
2. Phase 2 reads it, writes `*_analysis.md`
3. Phase 3 reads analysis, writes `exploitation_report.md`
4. Phase 4 reads all, writes `SECURITY_REPORT.md`

## Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Codebase   │ ──→ │    Scan     │ ──→ │   Target    │
│   (input)   │     │   Phase     │     │  Knowledge  │
└─────────────┘     └─────────────┘     │    Graph    │
                                        └──────┬──────┘
                                               │
                    ┌──────────────────────────┘
                    ↓
            ┌─────────────┐     ┌─────────────┐
            │    Audit    │ ──→ │ Vulnerability│
            │   Phase     │     │   Findings   │
            └─────────────┘     └──────┬──────┘
                                       │
                    ┌──────────────────┘
                    ↓
            ┌─────────────┐     ┌─────────────┐
            │   Exploit   │ ──→ │   Verified   │
            │   Phase     │     │   Exploits   │
            └─────────────┘     └──────┬──────┘
                                       │
                    ┌──────────────────┘
                    ↓
            ┌─────────────┐     ┌─────────────┐
            │   Report    │ ──→ │  Executive   │
            │   Phase     │     │   Report     │
            └─────────────┘     └─────────────┘
```

## Multi-Language Support

### Language Detection

The `start` skill auto-detects:

| File | Language |
|------|----------|
| `package.json` | JavaScript/TypeScript |
| `go.mod` | Go |
| `composer.json` | PHP |
| `requirements.txt`, `pyproject.toml` | Python |
| `Cargo.toml` | Rust |
| `pom.xml`, `build.gradle` | Java |
| `Gemfile` | Ruby |
| `*.csproj` | C# |

### Framework Detection

| Pattern | Framework |
|---------|-----------|
| `next.config.js` | Next.js |
| `app/Http/Controllers` | Laravel |
| `manage.py` | Django |
| `main.go` + `gin` import | Gin |
| `@SpringBootApplication` | Spring Boot |

## Hook System

### SessionStart Hook

Triggered on: `startup`, `resume`, `clear`, `compact`

**Purpose:** Inject Perseus context into session

```bash
#!/usr/bin/env bash
# hooks/session-start.sh

# Read skill content
using_perseus_content=$(cat "${PLUGIN_ROOT}/skills/perseus/using-perseus/SKILL.md")

# Output JSON for context injection
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "<EXTREMELY_IMPORTANT>..."
  }
}
EOF
```

## Security Considerations

### Safe Mode

All exploit payloads are safe by design:
- No destructive operations
- No data exfiltration
- No persistent changes
- Timeout protection (10s default)

### Defensive Only

Perseus is designed for:
- ✅ Analyzing your own codebase
- ✅ Finding vulnerabilities before attackers
- ✅ Generating remediation guidance
- ❌ Attacking other systems
- ❌ Creating exploits for malicious use

## Extensibility

### Adding New Specialists

1. Create `skills/perseus/specialists/new-skill/SKILL.md`
2. Add command `commands/perseus:new-skill.md`
3. Update `specialists/all/SKILL.md` to include it
4. Add to `start/SKILL.md` detection logic

### Custom Patterns

Add language-specific patterns in skill files:

```markdown
### Language-Specific Patterns

**JavaScript:**
```javascript
// Vulnerable pattern
eval(userInput)
```

**Go:**
```go
// Vulnerable pattern
exec.Command(userInput)
```
```

## Performance

### Optimization Strategies

1. **Parallel Agents** - 13+ agents run concurrently
2. **Incremental Scan** - Only scan changed files
3. **Scope Exclusion** - Skip node_modules, vendor, etc.
4. **Early Termination** - Stop on critical findings (optional)

### Resource Usage

| Phase | Agents | Typical Duration |
|-------|--------|------------------|
| Scan | 13 | 1-3 minutes |
| Audit | 14 | 3-5 minutes |
| Exploit | 14 | 2-4 minutes |
| Report | 1 | 1-2 minutes |

*Durations vary based on codebase size and complexity.*

## Testing

### Structure Validation

`tests/validate-structure.cjs` verifies:
- All skills have valid YAML frontmatter
- All commands reference existing skills
- All required files exist

### Running Tests

```bash
./tests/run-tests.sh
```

## Future Enhancements

- [ ] Interactive HTML reports
- [ ] IDE integration (VS Code extension)
- [ ] CI/CD pipeline integration
- [ ] Custom rule engine
- [ ] Machine learning for false positive reduction
