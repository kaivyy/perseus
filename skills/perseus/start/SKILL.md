---
name: perseus:start
description: Use when you want to run a full, automated penetration test from start to finish (Scan -> Audit -> Exploit -> Report)
---

# Perseus Start (Automated Security Assessment)

## Context & Authorization

**IMPORTANT:** This skill orchestrates a complete security assessment on the **user's own codebase**. This is **defensive security testing** - the user is proactively finding vulnerabilities in their own code before attackers do.

**Authorization:** The user has explicitly invoked this assessment on their own codebase in their own development environment. This is equivalent to running a comprehensive test suite, static analyzer, or security audit tool.

**This is NOT an attack on external systems.** All analysis is performed on local files the user owns and controls.

---

## Overview

This master skill orchestrates the entire Perseus security assessment lifecycle with **smart auto-detection** of languages, frameworks, and technologies.

**Goal:** Zero-touch automated security assessment with professional-grade output.

## Engagement Mode (Required)

Before running phases, select one mode:

| Mode | Environment | Behavior |
|------|-------------|----------|
| `PRODUCTION_SAFE` | Live production | Passive-first analysis and minimal safe verification only |
| `STAGING_ACTIVE` | Staging/pre-production | Active safe payload testing with request throttling |
| `LAB_FULL` | Isolated lab | Full dynamic verification and payload mutation |
| `LAB_RED_TEAM` | Dedicated lab environment | Multi-step adversarial simulation with kill-switches |

Default mode is `PRODUCTION_SAFE` unless user explicitly confirms staging/lab authorization.

## Smart Auto-Detection

Before starting the assessment, Perseus automatically detects:

### Language Detection
| Files | Language |
|-------|----------|
| package.json, *.ts, *.js | JavaScript/TypeScript |
| go.mod, *.go | Go |
| composer.json, *.php | PHP |
| requirements.txt, *.py | Python |
| Cargo.toml, *.rs | Rust |
| pom.xml, *.java | Java |
| Gemfile, *.rb | Ruby |
| *.csproj, *.cs | C# |

### Framework Detection
| Files/Patterns | Framework |
|----------------|-----------|
| next.config.*, app/ directory | Next.js |
| nuxt.config.* | Nuxt.js |
| angular.json | Angular |
| vite.config.*, svelte.config.* | Vite/Svelte |
| gin import, echo import | Go (Gin/Echo) |
| artisan, laravel | PHP (Laravel) |
| manage.py, django | Python (Django) |
| fastapi import | Python (FastAPI) |
| actix-web, axum in Cargo.toml | Rust (Actix/Axum) |
| spring-boot | Java (Spring) |
| rails | Ruby on Rails |

### Infrastructure Detection
| Files | Technology |
|-------|------------|
| Dockerfile, docker-compose.yml | Docker |
| .github/workflows/*.yml | GitHub Actions |
| .gitlab-ci.yml | GitLab CI |
| *.tf | Terraform |
| k8s/, kubernetes/, *.yaml with apiVersion | Kubernetes |
| serverless.yml | Serverless |
| vercel.json | Vercel |

### API Detection
| Patterns | Type |
|----------|------|
| /graphql, schema.graphql, *.gql | GraphQL |
| WebSocket, ws://, wss:// | WebSocket |
| *.proto, grpc | gRPC |
| openapi, swagger | REST/OpenAPI |

### AI/LLM Detection
| Patterns | Technology |
|----------|------------|
| openai, anthropic, langchain | LLM Integration |
| vector store, embeddings | RAG System |
| prompt, completion | AI Features |

## Complete Capability Matrix

### Core Phases (Always Run)
| Phase | Skill | Purpose |
|-------|-------|---------|
| 1 | scan | Map architecture, entry points, attack surface |
| 2 | audit | Analyze all vulnerability classes |
| 3 | exploit | Verify findings with safe PoCs |
| 4 | report | Generate executive security report |

### Specialist Deep-Dives (Run When Detected)
| Skill | Trigger Condition | Extended Coverage |
|-------|-------------------|-------------------|
| api | REST/GraphQL/WebSocket/gRPC | +OAuth, Cache, multi-lang |
| injection | NoSQL/Templates/Commands | +Log4j, SSTI, multi-lang |
| crypto | JWT/Encryption/Hashing | +multi-lang patterns |
| supply-chain | Package manifests | +multi-lang, typosquatting |
| file | File uploads/operations | +Zip Slip, XXE, multi-lang |
| logic | Payment/Auth/AI flows | +AI prompt injection |
| client | React/Vue/Angular/SSR | +Server Components, Actions |
| config | Always | +Docker, CI/CD, Cloud, K8s |

## Execution Flow

### Phase -1: Engagement Setup
**Action:** Determine mode and boundaries

```
1. Detect runtime context (production/staging/lab)
2. Ask for explicit authorization scope if context is unclear
3. Set mode: PRODUCTION_SAFE, STAGING_ACTIVE, LAB_FULL, or LAB_RED_TEAM
4. Create deliverables/engagement_profile.md with:
   - mode
   - in-scope targets
   - excluded systems
   - request-rate limits
   - approved test window
   - kill-switch thresholds (error rate, latency, saturation)
```

**Announce:** "Engagement mode set to: [MODE]"

---

### Phase 0: Auto-Detection
**Action:** Detect project technologies

```
1. Scan for package manifests:
   - package.json → Node.js
   - go.mod → Go
   - composer.json → PHP
   - requirements.txt/pyproject.toml → Python
   - Cargo.toml → Rust
   - pom.xml/build.gradle → Java
   - Gemfile → Ruby

2. Scan for framework indicators:
   - next.config.* → Next.js
   - app/ with page.tsx → Next.js App Router
   - angular.json → Angular
   - gin/echo imports → Go frameworks
   - artisan/laravel → Laravel
   - manage.py → Django
   - spring-boot → Spring

3. Scan for infrastructure:
   - Dockerfile → Container
   - .github/workflows/ → GitHub Actions
   - .gitlab-ci.yml → GitLab CI
   - *.tf → Terraform
   - k8s/*.yaml → Kubernetes

4. Scan for API types:
   - graphql, *.gql → GraphQL
   - proto files → gRPC
   - websocket imports → WebSocket

5. Scan for AI integration:
   - openai, anthropic imports → LLM
   - langchain, llama → AI framework
```

**Announce:** "Detected: [Language], [Framework], [Infrastructure]"

---

### Phase 1: Reconnaissance
**Action:** Invoke `Skill: perseus:scan`

**Agents Deployed:** 13 parallel agents covering:
- Architecture & Entry Points (multi-language aware)
- Dependencies & Secrets
- Injection Sinks & XSS Sinks
- SSRF & Data Flows
- Crypto & Configuration

**Wait Condition:** `deliverables/code_analysis_deliverable.md` exists

**Transition:** "Scan complete. Analyzing for specialists..."

---

### Phase 1.5: Specialist Detection
Based on detection results and scan findings:

```
DETECTED: Next.js/React     → Queue /client (with SSR focus)
DETECTED: GraphQL           → Queue /api (with GraphQL focus)
DETECTED: Docker            → Queue /config (with container focus)
DETECTED: GitHub Actions    → Queue /config (with CI/CD focus)
DETECTED: Kubernetes        → Queue /config (with K8s focus)
DETECTED: MongoDB/Redis     → Queue /injection (with NoSQL focus)
DETECTED: LLM/AI            → Queue /logic (with AI security focus)
DETECTED: JWT/Auth          → Queue /crypto
DETECTED: File uploads      → Queue /file
DETECTED: Package manifests → Queue /supply-chain
ALWAYS                      → Queue /config
```

**Announce:** "Will run specialists: [list based on detection]"

---

### Phase 2: Core Vulnerability Analysis
**Action:** Invoke `Skill: perseus:audit`

**Agents Deployed:** 14 parallel agents in 3 waves (language-aware):
- Wave 1: SQLi, CMDi, XSS, Auth, Authz
- Wave 2: SSRF, SSTI, Deserialization, Path Traversal, XXE
- Wave 3: JWT, Crypto, Race Conditions, Business Logic

**Wait Condition:** All `*_analysis.md` files exist in `deliverables/`

**Transition:** "Audit complete. Running specialist deep-dives..."

---

### Phase 2.5: Specialist Deep-Dives (Parallel)
**Action:** Invoke all detected specialists simultaneously

Example for Next.js + MongoDB + Docker project:
```
Parallel:
  - Skill: perseus-api (GraphQL if detected)
  - Skill: perseus-injection (NoSQL focus)
  - Skill: perseus-crypto
  - Skill: perseus-client (React/Next.js focus)
  - Skill: perseus-config (Docker + GitHub Actions)
  - Skill: perseus-supply-chain
```

**Wait Condition:** All specialist reports exist

**Transition:** "Specialist analysis complete. Proceeding to exploitation..."

---

### Phase 3: Exploitation & Verification
**Action:** Invoke `Skill: perseus:exploit`

**Agents Deployed:** 14 parallel agents verifying findings based on engagement mode:
- SQL/Command/NoSQL injection verification
- XSS payload generation (including React/Vue specific)
- Auth/Authz bypass testing
- SSRF/SSTI/XXE verification
- JWT attack testing
- Race condition testing
- AI prompt injection testing (if AI detected)

**Mode Enforcement:**
- `PRODUCTION_SAFE`: passive + minimal verification, no internal scanning, strict request caps
- `STAGING_ACTIVE`: active safe PoCs with throttling
- `LAB_FULL`: full dynamic verification in isolated environment
- `LAB_RED_TEAM`: attack-chain simulation in isolated lab with automatic abort thresholds

**Safety Enforcement (all modes):**
- Only safe payloads (`whoami`, `sleep`, `alert(1)`, `{{7*7}}`)
- No destructive operations
- No data exfiltration

**Wait Condition:** `deliverables/exploitation_report.md` exists

**Transition:** "Exploitation complete. Generating final report..."

---

### Phase 4: Report Generation
**Action:** Invoke `Skill: perseus:report`

**Process:**
1. Synthesize all deliverables
2. Calculate severity scores (CVSS)
3. Prioritize verified exploits
4. Generate language/framework-specific remediation
5. Add infrastructure recommendations

**Output:** `deliverables/SECURITY_REPORT.md`

---

## Execution Instructions

When the user invokes `/start`, execute exactly this sequence:

```
1. Announce: "Starting Perseus Security Assessment..."

2. Execute Phase -1 (Engagement Setup):
   - Determine environment and authorization
   - Set mode (default PRODUCTION_SAFE)
   - Write deliverables/engagement_profile.md
   - Announce: "Engagement mode: PRODUCTION_SAFE"

3. Execute Phase 0 (Auto-Detection):
   - Scan for languages, frameworks, infrastructure
   - Announce: "Detected: Next.js 14 (TypeScript), MongoDB, Docker, GitHub Actions"

4. Execute Phase 1:
   - Call: Skill: perseus:scan
   - Wait for completion
   - Announce: "Scan complete. Found X entry points, Y sinks."

5. Detect Specialists:
   - Analyze detection results + scan findings
   - List which specialists will run with their focus areas
   - Announce: "Will run: /api (GraphQL), /client (Next.js), /injection (MongoDB), /config (Docker+CI)"

6. Execute Phase 2:
   - Call: Skill: perseus:audit
   - Wait for completion
   - Announce: "Audit complete. Found X potential vulnerabilities."

7. Execute Phase 2.5:
   - Call all detected specialist skills in parallel
   - Wait for completion
   - Announce: "Specialist analysis complete."

8. Execute Phase 3:
   - Call: Skill: perseus:exploit
   - Wait for completion
   - Announce: "Exploitation complete. X verified, Y false positives."

9. Execute Phase 4:
   - Call: Skill: perseus:report
   - Wait for completion

10. Final Announcement:
   "Assessment Complete!"

   Technologies Analyzed:
   - Language: TypeScript/Node.js
   - Framework: Next.js 14 (App Router)
   - Database: MongoDB
   - Infrastructure: Docker, GitHub Actions

   "Report saved to: deliverables/SECURITY_REPORT.md"

   Summary:
   - Critical: X
   - High: Y
   - Medium: Z
   - Low: W

   "Review the report for detailed findings and remediation guidance."
```

## Output Structure

After completion, the `deliverables/` directory will contain:

```
deliverables/
├── engagement_profile.md          # Mode, scope, and verification constraints
├── code_analysis_deliverable.md    # Scan results (multi-language)
├── sql_injection_analysis.md       # Core audit
├── command_injection_analysis.md
├── xss_analysis.md
├── auth_analysis.md
├── authz_analysis.md
├── ssrf_analysis.md
├── template_injection_analysis.md
├── deserialization_analysis.md
├── path_traversal_analysis.md
├── xxe_analysis.md
├── jwt_analysis.md
├── crypto_analysis.md
├── race_condition_analysis.md
├── business_logic_analysis.md
├── api_security_analysis.md        # Specialists (if run)
├── injection_deep_analysis.md
├── crypto_security_analysis.md
├── supply_chain_analysis.md
├── file_security_analysis.md
├── client_side_analysis.md
├── config_security_analysis.md     # Includes Docker/CI/K8s
├── verification_scope.md           # Exploit verification boundaries
├── exploitation_report.md          # Verified exploits
└── SECURITY_REPORT.md              # Final executive report
```

## Language-Specific Coverage

| Language | SQL | NoSQL | XSS | SSTI | CMDi | Crypto | File |
|----------|-----|-------|-----|------|------|--------|------|
| JavaScript/TS | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Go | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| PHP | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Python | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Rust | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Java | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ruby | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| C# | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Quick Reference

| Command | Description |
|---------|-------------|
| `/start` | Full automated assessment with auto-detect (this skill) |
| `/scan` | Phase 1 only - Reconnaissance |
| `/report` | Phase 4 only - Report generation |
| `/specialist` | Run all specialist skills in parallel |
