---
name: perseus-config
description: Security configuration and headers analysis (CSP, CORS, HTTPS, headers)
---

# Perseus Configuration Specialist

## Context & Authorization

**IMPORTANT:** This skill performs security configuration analysis on the **user's own codebase**. This is defensive security testing to ensure proper security hardening.

**Authorization:** The user owns this codebase and has explicitly requested this specialized analysis.

---

## Overview

This specialist skill analyzes security configuration including HTTP headers, TLS settings, CORS policies, and application security settings.

**When to Use:** As part of any security assessment, or specifically when reviewing deployment configuration.

**Goal:** Ensure all security configurations follow best practices and don't introduce vulnerabilities.

## Configuration Risks Covered

| Risk | Description | Impact |
|------|-------------|--------|
| Missing Security Headers | No CSP, HSTS, X-Frame-Options | XSS, clickjacking |
| CORS Misconfiguration | Overly permissive origins | Data theft |
| Insecure Cookies | Missing Secure, HttpOnly, SameSite | Session hijacking |
| Debug Mode | Production debug enabled | Info disclosure |
| Default Credentials | Unchanged defaults | Account takeover |
| Verbose Errors | Stack traces exposed | Info disclosure |
| TLS Misconfiguration | Weak ciphers, old protocols | MITM, decryption |

## Execution Instructions

### Phase 1: HTTP Security Headers (3 Parallel Agents)

1.  **CSP Analyst:**
    *   "Find Content Security Policy configuration. Check for: existence, unsafe-inline, unsafe-eval, overly broad sources, missing directives. Rate the policy strength."

    **CSP Rating Guide:**
    - None: CRITICAL
    - `default-src *`: CRITICAL
    - Has `unsafe-inline`: HIGH
    - Has `unsafe-eval`: HIGH
    - Strict with nonces/hashes: GOOD
    - Strict with no unsafe: EXCELLENT

2.  **Security Headers Analyst:**
    *   "Check for all security headers. Document presence and configuration."

    **Headers to Check:**
    | Header | Purpose | Recommended Value |
    |--------|---------|-------------------|
    | Strict-Transport-Security | Force HTTPS | `max-age=31536000; includeSubDomains` |
    | X-Frame-Options | Prevent clickjacking | `DENY` or `SAMEORIGIN` |
    | X-Content-Type-Options | Prevent MIME sniffing | `nosniff` |
    | Referrer-Policy | Control referrer | `strict-origin-when-cross-origin` |
    | Permissions-Policy | Limit browser features | Disable unused features |
    | X-XSS-Protection | Legacy XSS filter | `0` (deprecated, can cause issues) |

3.  **Cache Security Analyst:**
    *   "Check cache headers for sensitive endpoints. Verify: no-store for auth responses, no caching of PII, proper Vary headers."

### Phase 2: CORS Analysis (2 Parallel Agents)

1.  **CORS Policy Analyst:**
    *   "Find CORS configuration. Check for: wildcard origins, dynamic origin reflection, credentials with wildcard, null origin allowed."

    **CORS Risk Levels:**
    ```javascript
    // CRITICAL - wildcard with credentials
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true

    // HIGH - reflects any origin
    Access-Control-Allow-Origin: ${req.headers.origin}

    // MEDIUM - allows null origin
    Access-Control-Allow-Origin: null

    // LOW - overly broad but specific
    Access-Control-Allow-Origin: *.example.com

    // OK - specific trusted origins
    Access-Control-Allow-Origin: https://trusted.example.com
    ```

2.  **Preflight Analyst:**
    *   "Check preflight (OPTIONS) handling. Verify: proper method restrictions, header restrictions, max-age settings."

### Phase 3: Cookie Security (2 Parallel Agents)

1.  **Cookie Flags Analyst:**
    *   "Find all cookie setting operations. Check for: Secure flag, HttpOnly flag, SameSite attribute, proper Path, reasonable expiry."

    **Cookie Security Checklist:**
    | Flag | Purpose | Required For |
    |------|---------|--------------|
    | Secure | HTTPS only | All production cookies |
    | HttpOnly | No JS access | Session cookies, tokens |
    | SameSite=Strict/Lax | CSRF protection | All cookies |
    | Path=/ | Scope limitation | As appropriate |

2.  **Session Cookie Analyst:**
    *   "Identify session cookies specifically. Verify: strong session ID generation, appropriate lifetime, regeneration after auth."

### Phase 4: Application Configuration (4 Parallel Agents)

1.  **Debug Mode Analyst:**
    *   "Check for debug/development mode indicators. Flag: DEBUG=true, development environment in production, verbose logging enabled."

    **Patterns to Find:**
    ```javascript
    DEBUG = true
    NODE_ENV = 'development'
    app.use(errorHandler({ dumpExceptions: true }))
    FLASK_DEBUG=1
    DJANGO_DEBUG=True
    ```

2.  **Error Handling Analyst:**
    *   "Check error responses. Verify: stack traces not exposed, internal paths not leaked, generic error messages for users."

3.  **Default Credentials Analyst:**
    *   "Find default/hardcoded credentials. Check: admin panels, database connections, API integrations, test accounts."

4.  **Secrets Management Analyst:**
    *   "Check how secrets are managed. Verify: environment variables used, no secrets in code/config files, secrets not logged."

### Phase 5: TLS/HTTPS Configuration (2 Parallel Agents)

1.  **TLS Configuration Analyst:**
    *   "Check TLS settings if configurable in code. Flag: TLS 1.0/1.1, weak ciphers, disabled certificate validation, self-signed certs in production."

2.  **HTTPS Enforcement Analyst:**
    *   "Check for HTTPS enforcement. Verify: HTTP redirects to HTTPS, no mixed content, secure websocket (wss://), HSTS configured."

### Phase 6: Infrastructure Security (2 Parallel Agents)

1.  **Docker Security Analyst:**
    *   "If Docker used, check: running as root, privileged mode, exposed ports, secrets in Dockerfile, base image freshness."

2.  **Cloud Configuration Analyst:**
    *   "Check cloud config files (AWS, GCP, Azure). Flag: public S3 buckets, overly permissive IAM, exposed metadata endpoints."

## Output Requirements

Create `deliverables/config_security_analysis.md`:

```markdown
# Security Configuration Analysis

## Summary
| Category | Checks | Pass | Fail | Critical |
|----------|--------|------|------|----------|
| HTTP Headers | X | Y | Z | W |
| CORS | X | Y | Z | W |
| Cookies | X | Y | Z | W |
| App Config | X | Y | Z | W |
| TLS/HTTPS | X | Y | Z | W |

## Security Headers Status

| Header | Status | Current Value | Recommendation |
|--------|--------|---------------|----------------|
| Content-Security-Policy | MISSING | - | Add strict CSP |
| Strict-Transport-Security | WEAK | max-age=3600 | Increase to 31536000 |
| X-Frame-Options | OK | DENY | - |
| X-Content-Type-Options | OK | nosniff | - |
| Referrer-Policy | MISSING | - | Add strict-origin-when-cross-origin |

## Critical Findings

### [CONFIG-001] Missing Content Security Policy
**Severity:** High
**Location:** Server configuration

**Issue:** No CSP header is set, allowing unrestricted script execution.

**Impact:** XSS attacks can execute any script, load external resources, exfiltrate data.

**Remediation:**
```javascript
// Express.js example
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}));
```

---

### [CONFIG-002] CORS Allows Any Origin
**Severity:** Critical
**Location:** `middleware/cors.js:12`

**Vulnerable Code:**
```javascript
app.use(cors({
  origin: true,  // Reflects any origin!
  credentials: true
}));
```

**Impact:** Any website can make authenticated requests to your API and steal data.

**Remediation:**
```javascript
const allowedOrigins = ['https://app.example.com', 'https://admin.example.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

## Cookie Security

| Cookie | Secure | HttpOnly | SameSite | Issue |
|--------|--------|----------|----------|-------|
| session | Yes | Yes | Lax | OK |
| remember_me | No | No | None | CRITICAL |
| preferences | Yes | No | Lax | OK |

## Debug/Development Settings

| Setting | File | Value | Risk |
|---------|------|-------|------|
| DEBUG | .env | true | HIGH - Disable in production |
| VERBOSE_ERRORS | config.js | true | MEDIUM - Exposes stack traces |
| NODE_ENV | - | development | HIGH - Should be production |

## Recommendations

### Immediate Actions
1. Add Content-Security-Policy header
2. Fix CORS to allowlist specific origins
3. Add Secure and HttpOnly to all sensitive cookies
4. Disable debug mode in production

### Security Headers to Add
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; object-src 'none'
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```
```

**Next Step:** Configuration issues typically don't need exploit verification - they're either configured correctly or not.
