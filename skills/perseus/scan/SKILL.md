---
name: perseus:scan
description: Use when starting a security assessment to map architecture, entry points, and attack surface (Phase 1 & 2)
---

# Perseus Scan (Phase 1 & 2)

## Overview

This skill executes the **Pre-Reconnaissance Methodology** of the Perseus/Shannon framework. It maps the target's digital footprint, internal architecture, and attack surface to build a "Target Knowledge Graph".

**Goal:** Zero-blind-spot understanding of what exists, how it works, and where it can be attacked.

**Methodology:**
1.  **Discovery (Parallel):** Architecture, Entry Points, Security Patterns.
2.  **Surface Mapping (Parallel):** XSS Sinks, SSRF Sinks, Data Flows.
3.  **Synthesis:** Comprehensive Code Analysis Report.

## Execution Instructions

### Phase 1: Discovery (Run in Parallel)

Launch these 3 agents simultaneously using a single message with multiple `Task` tool calls:

1.  **Architecture Scanner:**
    *   "Map application structure, tech stack, frameworks, and critical components. Identify if web app, API, or microservices."
2.  **Entry Point Mapper:**
    *   "Find ALL network-accessible entry points (API routes, webhooks, public functions). Catalog API schema files (OpenAPI, GraphQL). Exclude local-only tools."
3.  **Security Pattern Hunter:**
    *   "Identify authentication flows, authorization mechanisms (RBAC/ABAC), session management, and security middleware. Map the security architecture."

### Phase 2: Surface Mapping (Run in Parallel)

*Wait for Phase 1 to complete.* Then launch these 3 agents simultaneously:

1.  **XSS/Injection Sink Hunter:**
    *   "Find dangerous sinks: `innerHTML`, `exec`, `system`, `eval`, SQL queries, file operations. Provide File:Line references."
2.  **SSRF/External Request Tracer:**
    *   "Identify server-side requests: HTTP clients (`fetch`, `axios`), URL fetchers, webhooks. Map user-controllable parameters."
3.  **Data Security Auditor:**
    *   "Trace sensitive data flows (PII, secrets, payments). Identify encryption and storage mechanisms."

### Phase 3: Reporting (Synthesis)

Synthesize all findings into `deliverables/code_analysis_deliverable.md`.

**Required Report Structure:**

1.  **Scope & Boundaries:** Define In-Scope (Network Reachable) vs Out-of-Scope (Local/CLI).
2.  **Executive Summary:** High-level security posture.
3.  **Architecture & Tech Stack:** Frameworks, patterns, components.
4.  **Authentication & Authorization:** Detailed analysis of auth flows and session handling.
5.  **Data Security:** Encryption, storage, and sensitive data handling.
6.  **Attack Surface:** Detailed list of In-Scope entry points.
7.  **Infrastructure:** Secrets management, config, logging.
8.  **Critical File Paths:** Categorized list for downstream agents.
9.  **XSS Sinks:** List of specific sinks and render contexts.
10. **SSRF Sinks:** List of specific outbound request sinks.

**Schema Collection:**
*   Create `outputs/schemas/` directory.
*   Copy all discovered schema files (OpenAPI, GraphQL, JSON Schema) there.

**Next Step:** Proceed to `perseus:audit` to analyze identified components for vulnerabilities.
