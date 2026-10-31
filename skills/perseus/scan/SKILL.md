---
name: perseus-scan
description: Use when starting a security assessment to map architecture, entry points, and attack surface (Phase 1 & 2)
---

# Perseus Scan (Phase 1 & 2 - Reconnaissance & Surface Mapping)

## Context & Authorization

**IMPORTANT:** This skill performs reconnaissance and attack surface mapping on the **user's own codebase**. This is **defensive code security review / SAST analysis** to inventory entry points, critical sinks, and data flows before testing.

- **Authorization:** The user owns this repository and has explicitly requested this security analysis.
- **Scope:** Local source files and configuration within the repository.
- **Safety:** Passive code reading and local command execution only. No external attacks or destructive actions.

---

## Overview

This skill executes the **Pre-Reconnaissance Methodology** of the Perseus framework. It maps the target codebase's internal architecture, entry points, and data sinks to construct a "Target Knowledge Graph".

**Goal:** Zero-blind-spot inventory of what technologies exist, how data enters the application, and where untrusted input reaches critical sinks.

---

## Agent Execution Strategy (Dual-Mode)

When executing this skill, adapt to the runtime environment:

* **Mode A — Subagents Available (Multi-Agent/Parallel):**
  If subagent tools (e.g. `Task`, `Agent`, `invoke_subagent`) are available, launch the specialist agents in parallel waves as described below.
* **Mode B — Direct Execution (Single-Agent Fallback — UNIVERSAL):**
  If no subagent tool exists in your runtime, **DO NOT attempt to call non-existent subagent tools**. Execute each discovery step sequentially in the current session using bash commands (`find`, `rg`/`grep`), inspect matching files, and synthesize findings directly into `deliverables/code_analysis_deliverable.md`.

---

## Fast-Track CLI Commands for Codebase Mapping

Before reading large files, run these targeted commands in the terminal to inspect the codebase rapidly:

### 1. Technology & Architecture Discovery
```bash
# Ensure deliverables directory exists
mkdir -p deliverables outputs/schemas

# Identify top-level file structure (excluding lockfiles & dependencies)
find . -maxdepth 3 -not -path '*/.*' -not -path '*/node_modules/*' -not -path '*/vendor/*' -not -path '*/target/*' -not -path '*/dist/*' | sort
```

### 2. Network Entry Point Discovery (Multi-Language)
Run the pattern matching the detected framework:
```bash
# Node.js / Express / Fastify / Nest.js / Hono
rg -n "app\.(get|post|put|delete|patch|use)|router\.(get|post|put|delete|patch)|export async function (GET|POST|PUT|DELETE)" --glob '!node_modules/**'

# Next.js App Router & Pages Router
find app/ pages/ -name "route.ts" -o -name "route.js" -o -name "*.tsx" 2>/dev/null

# Python (FastAPI / Flask / Django)
rg -n "@(app|router)\.(get|post|put|delete|patch)|path\(|re_path\(|@api_view" --glob '!venv/**' --glob '!.env/**'

# Go (Gin / Echo / Chi / net/http)
rg -n "(r|router|e)\.(GET|POST|PUT|DELETE|Handle|HandleFunc)|http\.HandleFunc" --glob '!vendor/**'

# Java (Spring Boot)
rg -n "@(GetMapping|PostMapping|PutMapping|DeleteMapping|RequestMapping)"

# PHP (Laravel / Symfony)
rg -n "Route::(get|post|put|delete|patch|resource)"

# Rust (Actix / Axum)
rg -n "(web::get|web::post|web::resource|\.route\()"

# Ruby on Rails
rg -n "(get|post|put|patch|delete)\s+['\"]" config/routes.rb 2>/dev/null
```

### 3. Critical Sinks Mapping (Data Flow Destinations)
```bash
# SQL / Query Sinks (Raw queries, unescaped string interpolations)
rg -n -C 2 -i "(queryRawUnsafe|\.raw\(|exec\(.*SELECT|db\.query\(|\.query\(f?['\"].*\$|\.execute\(f?['\"].*%|SELECT\s+.*\+)" --glob '!tests/**'

# OS Command Sinks
rg -n -C 2 "(child_process|exec\(|spawn\(|execSync|system\(|popen\(|os\.system|subprocess\.|exec\.Command|Runtime\.getRuntime\(\)\.exec)"

# File Operations & Path Traversal Sinks
rg -n -C 2 "(readFile|createReadStream|readFileSync|open\(|File\(|os\.Open|filepath\.Join|send_file|sendFile)"

# Outbound SSRF Sinks (HTTP requests, webhooks)
rg -n -C 2 -i "(axios\.|fetch\(|request\(|http\.Get|urllib|requests\.get|WebClient|HttpClient)"

# XSS & DOM Rendering Sinks
rg -n -C 2 "(innerHTML|dangerouslySetInnerHTML|v-html|bypassSecurityTrustHtml|document\.write)"

# Hardcoded Secrets & Credentials
rg -n -C 1 -i "(api_key|secret_key|private_key|jwt_secret|password|access_token)\s*[:=]\s*['\"][A-Za-z0-9_\-\.]{8,}['\"]"
```

---

## Incremental Scan Mode

For large codebases or pull-request reviews, focus analysis on changed files:
```bash
# Detect changed code files against baseline branch
git diff --name-only main...HEAD 2>/dev/null | grep -E '\.(js|ts|tsx|py|go|php|rb|java|rs|cs)$' || true
```
If specific files are modified, prioritize entry points and sinks located in those files or importing them.

---

## Discovery & Mapping Phases

### Phase 1: Architecture & Entry Points
1. **Architecture Discovery:** Determine whether the application is a monolith, microservice, API backend, frontend SPA, or SSR app.
2. **Entry Points Inventory:** Catalog all HTTP endpoints, WebSocket handlers, GraphQL resolvers, message queue consumers, and background workers.
3. **Security Pattern Inventory:** Locate authentication middleware (JWT, sessions, cookies), authorization guards (RBAC, ABAC), and CORS configurations.

### Phase 2: Attack Surface & Sinks
1. **Injection Sinks:** Identify every location where data reaches SQL engines, template engines, OS shells, LDAP queries, or NoSQL databases.
2. **Outbound / SSRF Sinks:** Identify URL fetchers, webhook handlers, and proxy endpoints where user-supplied URLs or hosts are accepted.
3. **Sensitive Data Flows:** Trace PII, authentication tokens, financial data, and credentials from ingestion to storage/logging.

---

## Phase 3: Deliverable Generation (Synthesis)

Write all synthesized findings into `deliverables/code_analysis_deliverable.md` with the following structure:

```markdown
# Target Knowledge Graph & Architecture Analysis

## 1. Scope & System Boundaries
- **Project Root:** [Path]
- **Target Type:** [Web API / Fullstack / Microservice / CLI]
- **In-Scope Components:** [List public/network accessible services]
- **Out-of-Scope Components:** [Test runners, build scripts, dev tooling]

## 2. Tech Stack & Framework Inventory
- **Languages:** [TypeScript, Python, Go, etc.]
- **Web Frameworks:** [Next.js, FastAPI, Gin, etc.]
- **Database / ORM:** [PostgreSQL with Prisma, MongoDB with Mongoose, etc.]
- **Security Middlewares:** [Helmet, CORS, Passport, custom auth guards]

## 3. Discovered Entry Points
| Method | Route / Handler | Auth Required | File & Line |
|--------|-----------------|---------------|-------------|
| POST   | `/api/auth/login` | No            | `src/routes/auth.ts:15` |
| GET    | `/api/users/:id`  | Yes (JWT)     | `src/routes/users.ts:42` |

## 4. Attack Surface & Sink Inventory
| Sink Type | Target Function / API | Input Source | File & Line Reference |
|-----------|------------------------|--------------|-----------------------|
| SQL       | `prisma.$queryRawUnsafe` | `req.query.sort` | `src/controllers/report.ts:88` |
| Command   | `child_process.exec`   | `req.body.cmd` | `src/utils/tool.ts:24` |
| SSRF      | `axios.get(url)`       | `req.body.webhook` | `src/services/webhook.ts:51` |
| XSS       | `dangerouslySetInnerHTML` | `props.content` | `components/Post.tsx:32` |

## 5. Security Architecture & Controls
- **Authentication Flow:** [Description]
- **Authorization Guarding:** [Description]
- **Data Protection & Encryption:** [Description]

## 6. Recommendations for Audit Phase
- List top 3-5 priority targets for deep taint analysis in `perseus-audit`.
```

**Schema Collection:**
If OpenAPI, Swagger, GraphQL, or protobuf schemas exist in the codebase, copy or link them to `outputs/schemas/`.

**Next Step:** Proceed to `perseus-audit` to analyze identified sinks for actual vulnerabilities.
