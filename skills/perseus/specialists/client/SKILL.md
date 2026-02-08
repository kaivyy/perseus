---
name: perseus-client
description: Client-side security analysis (DOM XSS, prototype pollution, postMessage)
---

# Perseus Client-Side Specialist

## Context & Authorization

**IMPORTANT:** This skill performs client-side security analysis on the **user's own codebase**. This is defensive security testing to find browser-side vulnerabilities.

**Authorization:** The user owns this codebase and has explicitly requested this specialized analysis.

---

## Overview

This specialist skill performs deep client-side JavaScript security analysis, focusing on vulnerabilities that exist purely in browser code.

**When to Use:** After `/scan` identifies significant client-side JavaScript or SPAs.

**Goal:** Find DOM-based XSS, prototype pollution, and other client-side vulnerabilities.

## Client-Side Risks Covered

| Risk | Description | Impact |
|------|-------------|--------|
| DOM XSS | Client-side script injection | Account takeover, data theft |
| Prototype Pollution | Object prototype manipulation | XSS, DoS, logic bypass |
| PostMessage Abuse | Cross-origin message issues | Data leakage, XSS |
| DOM Clobbering | HTML overwriting JS variables | XSS, security bypass |
| Open Redirect | Client-side redirects | Phishing, token theft |
| Sensitive Data Exposure | Secrets in client code | Credential theft |
| Insecure Storage | Sensitive data in localStorage | Session hijacking |

## Execution Instructions

### Phase 1: DOM XSS Analysis (4 Parallel Agents)

1.  **Source Identification Agent:**
    *   "Identify all DOM XSS sources - where user input enters client-side code."

    **Sources to Find:**
    - URL fragments: hash, search, href
    - Document properties: URL, referrer
    - Window properties: name, postMessage data
    - Storage: localStorage, sessionStorage, cookies

2.  **Sink Identification Agent:**
    *   "Identify all DOM XSS sinks - where data is rendered unsafely."

    **Sinks to Find:**
    - HTML property setters on elements
    - Document writing methods
    - Dynamic code execution functions
    - Adjacent HTML insertion methods
    - jQuery HTML manipulation methods

3.  **Flow Tracer Agent:**
    *   "Trace data flow from sources to sinks. Check for: sanitization, encoding, validation along the path. Flag direct source-to-sink flows."

4.  **Framework-Specific Agent:**
    *   "Analyze framework-specific XSS vectors:"
    - React: unsafe HTML rendering props, href with javascript protocol
    - Vue: v-html directive, dynamic href bindings
    - Angular: security bypass methods, HTML binding

### Phase 2: Prototype Pollution Analysis (3 Parallel Agents)

1.  **Gadget Finder Agent:**
    *   "Find prototype pollution sinks - code that accesses potentially polluted properties."

    **Example Gadgets:**
    - `if (options.isAdmin) { ... }` - can be polluted via Object.prototype
    - HTML property setters with config values that can be polluted

2.  **Merge/Clone Analyst:**
    *   "Find unsafe object merge/clone operations that could allow pollution."

    **Vulnerable Patterns:**
    - Deep merge functions without __proto__ filtering
    - Recursive object copying without key validation

3.  **Library Analyst:**
    *   "Check for libraries with known prototype pollution vulnerabilities."

    **Known Vulnerable Versions:**
    - lodash < 4.17.12
    - jQuery < 3.4.0
    - minimist < 1.2.3
    - qs < 6.0.4

### Phase 3: PostMessage Analysis (2 Parallel Agents)

1.  **PostMessage Receiver Analyst:**
    *   "Find all postMessage event listeners. Check for: origin validation, message type validation, unsafe handling of message data."

    **Check for:**
    - Missing `event.origin` validation
    - Processing messages from any origin
    - Executing code based on message content

2.  **PostMessage Sender Analyst:**
    *   "Find postMessage sends. Check for: targetOrigin set to '*', sensitive data in messages, authentication tokens in messages."

### Phase 4: DOM Clobbering Analysis (1 Agent)

1.  **DOM Clobbering Analyst:**
    *   "Find code that accesses global variables that could be clobbered by HTML elements."

    **Vulnerable Pattern:**
    - Code accessing `window.config` or similar globals
    - Attacker injects HTML with matching id/name attributes
    - Global variable gets clobbered by DOM element

### Phase 5: Client Storage Analysis (2 Parallel Agents)

1.  **Storage Security Analyst:**
    *   "Analyze localStorage/sessionStorage usage. Flag: tokens, passwords, PII, API keys stored client-side. Check for XSS access to storage."

2.  **Cookie Security Analyst:**
    *   "Analyze cookie usage from client-side. Check for: HttpOnly missing on session cookies, Secure flag, SameSite attribute, sensitive data in JS-accessible cookies."

### Phase 6: Client-Side Secrets (1 Agent)

1.  **Secret Exposure Analyst:**
    *   "Scan all client-side JavaScript for secrets."

    **Patterns to Find:**
    - API keys: `apiKey`, `api_key`, `APIKEY`
    - Credentials: hardcoded passwords, tokens
    - Internal URLs: debug endpoints, admin paths
    - Private keys: RSA, EC key material

## Safe Payload Reference

| Attack | Safe Test Payload | Verification |
|--------|-------------------|--------------|
| DOM XSS | `#<img src=x onerror=alert(1)>` | Alert box appears |
| Prototype Pollution | `?__proto__[test]=polluted` | `({}).test === 'polluted'` |
| PostMessage | Send message from different origin | Check if processed |

## Output Requirements

Create `deliverables/client_side_analysis.md`:

```markdown
# Client-Side Security Analysis

## Summary
| Category | Issues Found | Critical | High | Medium |
|----------|--------------|----------|------|--------|
| DOM XSS | X | Y | Z | W |
| Prototype Pollution | X | Y | Z | W |
| PostMessage | X | Y | Z | W |
| DOM Clobbering | X | Y | Z | W |
| Client Storage | X | Y | Z | W |
| Exposed Secrets | X | Y | Z | W |

## DOM XSS Sources and Sinks Map

| Source | Sink | Sanitization | Risk |
|--------|------|--------------|------|
| location.hash | HTML setter | None | CRITICAL |
| URL params | jQuery.html() | None | CRITICAL |

## Critical Findings

### [CLIENT-001] DOM XSS via Hash Fragment
**Severity:** Critical
**Location:** `static/js/app.js:234`

**Vulnerable Code:**
[Code that uses hash fragment directly in HTML rendering]

**Attack:**
[URL with XSS payload in hash]

**Impact:** Full XSS - can steal cookies, perform actions as user

**Remediation:**
Use textContent instead of HTML setters, or sanitize with DOMPurify.

## PostMessage Security

| Listener Location | Origin Check | Data Validation | Risk |
|-------------------|--------------|-----------------|------|
| app.js:45 | None | None | CRITICAL |
| widget.js:89 | Partial | Yes | MEDIUM |

## Sensitive Data in Client Code

| Type | Location | Exposure |
|------|----------|----------|
| API Key | config.js:3 | Public |

## Client Storage Audit

| Storage | Data Type | Risk | Recommendation |
|---------|-----------|------|----------------|
| localStorage.token | JWT | High | Use HttpOnly cookie |
```

## Recommendations
1. Replace HTML setters with textContent where possible
2. Implement DOMPurify for required HTML rendering
3. Add strict origin checks to all postMessage listeners
4. Move sensitive tokens to HttpOnly cookies
5. Remove API keys from client-side code

**Next Step:** DOM XSS findings can be verified with browser testing.
