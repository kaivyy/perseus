---
name: perseus-client
description: Client-side security analysis (DOM XSS, React/Vue/Angular, SSR, prototype pollution)
---

# Perseus Client-Side Specialist

## Context & Authorization

**IMPORTANT:** This skill performs client-side security analysis on the **user's own codebase**. This is defensive security testing to find browser-side vulnerabilities.

**Authorization:** The user owns this codebase and has explicitly requested this specialized analysis.

---

## Multi-Framework Support

| Framework | Versions | Special Considerations |
|-----------|----------|----------------------|
| React | 16+, 18+, 19+ | RSC, Server Actions, JSX injection |
| Next.js | 12+, 13+, 14+, 15+ | App Router, Server Components, Middleware |
| Vue | 2, 3 | v-html, template injection |
| Angular | 12+ | bypassSecurityTrust*, template injection |
| Svelte | 3, 4, 5 | {@html}, SSR |
| SolidJS | 1.x | innerHTML, SSR |
| Vanilla JS | ES6+ | Direct DOM manipulation |
| jQuery | All | .html(), .append() |

---

## Overview

This specialist skill performs deep client-side JavaScript security analysis, focusing on vulnerabilities in modern frameworks including React, Vue, Angular, and SSR frameworks.

**When to Use:** After `/scan` identifies significant client-side JavaScript, SPAs, or SSR applications.

**Goal:** Find DOM-based XSS, prototype pollution, and framework-specific vulnerabilities.

## Engagement Mode Compatibility

| Mode | Specialist Behavior |
|------|---------------------|
| `PRODUCTION_SAFE` | Code-level and rendering-path analysis, minimal runtime probes |
| `STAGING_ACTIVE` | Controlled browser-side verification with throttling |
| `LAB_FULL` | Expanded dynamic client attack-surface validation |
| `LAB_RED_TEAM` | End-to-end client attack-chain simulation in isolated lab |

## Safety Gates (Required)

1. Read `deliverables/engagement_profile.md` before active runtime testing.
2. Default to `PRODUCTION_SAFE` when mode is not specified.
3. Enforce kill-switch thresholds and stop on instability.
4. Never execute persistent or user-impacting payloads in production.

## Client-Side Risks Covered

| Risk | Description | Impact |
|------|-------------|--------|
| DOM XSS | Client-side script injection | Account takeover, data theft |
| React XSS | Unsafe HTML rendering, href injection | XSS via JSX |
| SSR Injection | Server component injection | RCE, data leak |
| Prototype Pollution | Object prototype manipulation | XSS, DoS, logic bypass |
| PostMessage Abuse | Cross-origin message issues | Data leakage, XSS |
| DOM Clobbering | HTML overwriting JS variables | XSS, security bypass |
| Client Storage | Sensitive data exposure | Session hijacking |

## Execution Instructions

### Step 0: Mode & Scope Alignment

- Load mode/scope/limits from `deliverables/engagement_profile.md`.
- Respect `deliverables/verification_scope.md` when present.
- In `PRODUCTION_SAFE`, prefer static and minimal observable checks only.

### Phase 1: React/Next.js Security Analysis (5 Parallel Agents)

1.  **React XSS Analyst:**
    *   "Find React-specific XSS vectors."

    **Vulnerable Patterns:**
    ```jsx
    // VULNERABLE - Dangerous HTML rendering
    <div dangerouslySetInnerHTML={{ __html: userInput }} />

    // VULNERABLE - javascript: in href
    <a href={userUrl}>Click</a>
    // Attack: userUrl = "javascript:alert(1)"

    // VULNERABLE - Dynamic component
    const Component = components[userInput];
    return <Component />;

    // VULNERABLE - Spread props from user
    <div {...userProps} />
    // Attack: userProps = { dangerouslySetInnerHTML: { __html: '<script>...' } }
    ```

2.  **Next.js Server Component Analyst:**
    *   "Analyze Next.js App Router and Server Components for security issues."

    **Patterns:**
    ```typescript
    // VULNERABLE - SQL in Server Component
    async function UserPage({ params }) {
      const user = await db.query(`SELECT * FROM users WHERE id = ${params.id}`);
      return <div>{user.name}</div>;
    }

    // VULNERABLE - Exposing secrets to client
    // In Server Component that passes to Client Component
    <ClientComponent apiKey={process.env.SECRET_KEY} />

    // VULNERABLE - Unvalidated redirect
    import { redirect } from 'next/navigation';
    redirect(userInput);
    ```

3.  **Next.js Server Actions Analyst:**
    *   "Analyze Server Actions for security issues."

    **Patterns:**
    ```typescript
    // VULNERABLE - No auth check in Server Action
    'use server'
    async function deleteUser(userId: string) {
      await db.users.delete(userId);  // No auth check!
    }

    // VULNERABLE - SQL injection in Server Action
    'use server'
    async function searchUsers(query: string) {
      return db.query(`SELECT * FROM users WHERE name LIKE '%${query}%'`);
    }

    // VULNERABLE - CSRF (if custom implementation)
    // Server Actions have built-in CSRF protection, but check custom forms
    ```

4.  **Next.js Middleware Analyst:**
    *   "Analyze Next.js middleware for security issues."

    **Patterns:**
    ```typescript
    // VULNERABLE - Open redirect
    export function middleware(request: NextRequest) {
      const url = request.nextUrl.searchParams.get('redirect');
      return NextResponse.redirect(url);  // No validation!
    }

    // VULNERABLE - Auth bypass via header manipulation
    export function middleware(request: NextRequest) {
      if (request.headers.get('x-admin') === 'true') {
        return NextResponse.next();  // Spoofable!
      }
    }
    ```

5.  **React State Exposure Analyst:**
    *   "Check for sensitive data exposure in React state/props."

    **Patterns:**
    ```jsx
    // VULNERABLE - Secrets in client state
    const [config, setConfig] = useState({
      apiKey: 'sk-xxx',  // Exposed in React DevTools
      adminToken: '...'
    });

    // VULNERABLE - SSR hydration mismatch leaking data
    // Server renders with user data, client sees different user's data
    ```

### Phase 2: Vue Security Analysis (3 Parallel Agents)

1.  **Vue XSS Analyst:**
    *   "Find Vue-specific XSS vectors."

    **Patterns:**
    ```vue
    <!-- VULNERABLE - v-html with user input -->
    <div v-html="userContent"></div>

    <!-- VULNERABLE - Dynamic component -->
    <component :is="userComponent" />

    <!-- VULNERABLE - Template compilation -->
    <script>
    new Vue({
      template: userTemplate  // If user controls this
    });
    </script>

    <!-- VULNERABLE - javascript: in :href -->
    <a :href="userUrl">Link</a>
    ```

2.  **Nuxt.js Analyst:**
    *   "Analyze Nuxt.js specific security issues."

    **Patterns:**
    ```typescript
    // VULNERABLE - Nuxt 3 server routes
    export default defineEventHandler((event) => {
      const id = getQuery(event).id;
      return db.query(`SELECT * FROM items WHERE id = ${id}`);
    });

    // VULNERABLE - Exposing secrets
    // nuxt.config.ts
    runtimeConfig: {
      public: {
        secretKey: process.env.SECRET  // Exposed to client!
      }
    }
    ```

3.  **Vue State Analyst:**
    *   "Check Vuex/Pinia state for sensitive data exposure."

### Phase 3: Angular Security Analysis (2 Parallel Agents)

1.  **Angular XSS Analyst:**
    *   "Find Angular-specific XSS vectors."

    **Patterns:**
    ```typescript
    // VULNERABLE - bypassSecurityTrust*
    constructor(private sanitizer: DomSanitizer) {}

    getHtml() {
      return this.sanitizer.bypassSecurityTrustHtml(userInput);
    }

    // VULNERABLE - Template injection
    @Component({
      template: userTemplate  // If user controls this
    })

    // VULNERABLE - innerHTML binding
    <div [innerHTML]="userContent"></div>
    ```

2.  **Angular SSR Analyst:**
    *   "Analyze Angular Universal for security issues."

### Phase 4: DOM XSS Analysis (4 Parallel Agents)

1.  **Source Identification Agent:**
    *   "Identify all DOM XSS sources across frameworks."

    **Sources:**
    ```javascript
    // URL-based sources
    location.hash
    location.search
    location.href
    document.URL
    document.documentURI
    document.referrer

    // Storage sources
    localStorage.getItem()
    sessionStorage.getItem()
    document.cookie

    // Message sources
    window.addEventListener('message', (e) => e.data)

    // Framework-specific
    // React: props from URL, useSearchParams()
    // Next.js: searchParams, params
    // Vue: $route.query, $route.params
    ```

2.  **Sink Identification Agent:**
    *   "Identify all DOM XSS sinks across frameworks."

    **Sinks:**
    ```javascript
    // Direct sinks
    element.innerHTML = data
    element.outerHTML = data
    document.write(data)
    document.writeln(data)

    // jQuery sinks
    $(selector).html(data)
    $(selector).append(data)
    $(data)  // If data contains HTML

    // Eval sinks
    eval(data)
    new Function(data)
    setTimeout(data, 0)
    setInterval(data, 0)

    // Location sinks
    location.href = data
    location.assign(data)
    location.replace(data)
    window.open(data)

    // Framework-specific already covered above
    ```

3.  **Flow Tracer Agent:**
    *   "Trace data flow from sources to sinks."

4.  **URL Scheme Analyst:**
    *   "Check for javascript: and data: URL injection."

    **Patterns:**
    ```jsx
    // React
    <a href={url}>  // If url = "javascript:..."
    <iframe src={url}>

    // Check validation:
    if (!url.startsWith('https://')) { /* reject */ }
    ```

### Phase 5: Prototype Pollution Analysis (3 Parallel Agents)

1.  **Pollution Source Analyst:**
    *   "Find prototype pollution entry points."

    **Patterns:**
    ```javascript
    // VULNERABLE - Deep merge without __proto__ check
    function merge(target, source) {
      for (let key in source) {
        if (typeof source[key] === 'object') {
          target[key] = merge(target[key] || {}, source[key]);
        } else {
          target[key] = source[key];  // Can set __proto__
        }
      }
    }

    // VULNERABLE - URL params to object
    const params = Object.fromEntries(new URLSearchParams(location.search));
    // Attack: ?__proto__[isAdmin]=true

    // VULNERABLE libraries (check versions)
    // lodash < 4.17.12
    // jQuery < 3.4.0
    // minimist < 1.2.3
    ```

2.  **Gadget Finder Agent:**
    *   "Find prototype pollution gadgets."

    **Patterns:**
    ```javascript
    // GADGET - Property access on polluted prototype
    if (options.isAdmin) {  // Can be polluted
      showAdminPanel();
    }

    // GADGET - HTML attribute setting
    element.setAttribute(key, config[key]);  // key from polluted proto
    ```

3.  **Library Analyst:**
    *   "Check for vulnerable libraries."

### Phase 6: PostMessage Analysis (2 Parallel Agents)

1.  **PostMessage Receiver Analyst:**
    *   "Find all postMessage listeners."

    **Patterns:**
    ```javascript
    // VULNERABLE - No origin check
    window.addEventListener('message', (e) => {
      eval(e.data.code);  // RCE via any origin
    });

    // VULNERABLE - Weak origin check
    window.addEventListener('message', (e) => {
      if (e.origin.includes('trusted.com')) {  // trusted.com.evil.com bypasses
        // ...
      }
    });

    // SAFE
    window.addEventListener('message', (e) => {
      if (e.origin !== 'https://trusted.com') return;
      // ...
    });
    ```

2.  **PostMessage Sender Analyst:**
    *   "Check postMessage sends for data leakage."

    **Patterns:**
    ```javascript
    // VULNERABLE - Sending to any origin
    parent.postMessage(sensitiveData, '*');

    // VULNERABLE - Token in message
    iframe.contentWindow.postMessage({ token: authToken }, '*');
    ```

### Phase 7: Client Storage & Secrets (2 Parallel Agents)

1.  **Storage Security Analyst:**
    *   "Analyze localStorage/sessionStorage usage."

    **Issues:**
    ```javascript
    // VULNERABLE - Token in localStorage (XSS accessible)
    localStorage.setItem('authToken', token);

    // VULNERABLE - Sensitive data persisted
    localStorage.setItem('user', JSON.stringify({
      ssn: '123-45-6789',
      creditCard: '4111...'
    }));
    ```

2.  **Client Secret Analyst:**
    *   "Find secrets in client-side code."

    **Patterns:**
    ```javascript
    // Secrets in JS bundles
    const API_KEY = 'sk-xxx';
    const STRIPE_SECRET = 'sk_live_xxx';

    // Check .env files exposed
    // Check webpack/vite config for DefinePlugin exposure
    ```

## Safe Payload Reference

| Attack | Safe Test Payload | Verification |
|--------|-------------------|--------------|
| DOM XSS | `#<img src=x onerror=alert(1)>` | Alert box appears |
| React href | `javascript:alert(1)` | Alert on click |
| Prototype Pollution | `?__proto__[test]=polluted` | `({}).test === 'polluted'` |
| PostMessage | Send from different origin | Check if processed |

## Output Requirements

Create `deliverables/client_side_analysis.md`:

```markdown
# Client-Side Security Analysis

## Summary
| Category | Issues Found | Critical | High | Medium |
|----------|--------------|----------|------|--------|
| React/Next.js XSS | X | Y | Z | W |
| Vue XSS | X | Y | Z | W |
| Angular XSS | X | Y | Z | W |
| DOM XSS | X | Y | Z | W |
| Server Components | X | Y | Z | W |
| Prototype Pollution | X | Y | Z | W |
| PostMessage | X | Y | Z | W |
| Client Storage | X | Y | Z | W |

## Framework Detected
- Primary: [React 18, Next.js 14, Vue 3, etc.]
- SSR: [Yes/No]
- Build Tool: [Vite, Webpack, Turbopack]

## Critical Findings

### [CLIENT-001] XSS via dangerouslySetInnerHTML
**Severity:** Critical
**Framework:** React
**Location:** `components/Comment.tsx:23`

**Vulnerable Code:**
```jsx
<div dangerouslySetInnerHTML={{ __html: comment.body }} />
```

**Attack:**
```
comment.body = "<img src=x onerror=alert(document.cookie)>"
```

**Impact:** Full XSS - can steal cookies, perform actions as user

**Remediation:**
```jsx
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.body) }} />
```

---

### [CLIENT-002] SQL Injection in Server Action
**Severity:** Critical
**Framework:** Next.js 14
**Location:** `app/actions/search.ts:12`

**Vulnerable Code:**
```typescript
'use server'
async function searchProducts(query: string) {
  return db.query(`SELECT * FROM products WHERE name LIKE '%${query}%'`);
}
```

---

### [CLIENT-003] Open Redirect in Next.js Middleware
**Severity:** High
**Location:** `middleware.ts:8`

---

## Framework Security Matrix

| Framework | Auto-Escape | Common Pitfalls |
|-----------|-------------|-----------------|
| React | Yes (JSX) | dangerouslySetInnerHTML, href |
| Next.js | Yes | Server Actions auth, middleware |
| Vue | Yes | v-html, :href |
| Angular | Yes | bypassSecurityTrust* |

## Recommendations
1. Sanitize all user content with DOMPurify before rendering
2. Validate URLs before using in href/src attributes
3. Add authentication checks to all Server Actions
4. Validate redirect URLs in middleware
5. Move tokens from localStorage to HttpOnly cookies
```

**Next Step:** DOM XSS findings can be verified with browser testing.
