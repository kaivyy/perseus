---
name: perseus-api
description: Deep-dive API security analysis (REST, GraphQL, WebSocket, gRPC)
---

# Perseus API Security Specialist

## Context & Authorization

**IMPORTANT:** This skill performs deep API security analysis on the **user's own codebase**. This is defensive security testing to find API vulnerabilities before production deployment.

**Authorization:** The user owns this codebase and has explicitly requested this specialized analysis.

---

## Overview

This specialist skill performs comprehensive API security analysis covering OWASP API Security Top 10 vulnerabilities.

**When to Use:** After `/scan` identifies API endpoints (REST, GraphQL, WebSocket, gRPC).

**Goal:** Deep-dive into API-specific vulnerabilities that generic scans might miss.

## OWASP API Security Top 10 Coverage

| ID | Vulnerability | Description |
|----|---------------|-------------|
| API1 | Broken Object Level Authorization | IDOR, accessing other users' resources |
| API2 | Broken Authentication | Weak auth, token issues |
| API3 | Broken Object Property Level Authorization | Mass assignment, excessive data exposure |
| API4 | Unrestricted Resource Consumption | Missing rate limits, DoS vectors |
| API5 | Broken Function Level Authorization | Admin functions accessible to users |
| API6 | Unrestricted Access to Sensitive Business Flows | Automation abuse, scraping |
| API7 | Server Side Request Forgery | SSRF via API parameters |
| API8 | Security Misconfiguration | CORS, headers, debug mode |
| API9 | Improper Inventory Management | Shadow APIs, deprecated endpoints |
| API10 | Unsafe Consumption of APIs | Third-party API trust issues |

## Execution Instructions

### Phase 1: REST API Analysis (3 Parallel Agents)

1.  **BOLA/IDOR Analyst:**
    *   "Analyze all endpoints with resource IDs (e.g., `/users/{id}`, `/orders/{id}`). Check if ownership is verified before access. Flag endpoints that only check authentication, not authorization."

2.  **Mass Assignment Analyst:**
    *   "Find endpoints that accept JSON/form data and map to models. Check for: unprotected fields (isAdmin, role, price), missing allowlists, ORM auto-binding. Flag any endpoint where user can set privileged fields."

3.  **Rate Limiting Analyst:**
    *   "Check all endpoints for rate limiting. Prioritize: login, password reset, OTP verification, expensive operations. Flag missing rate limits and identify DoS vectors."

### Phase 2: GraphQL Analysis (3 Parallel Agents)

*If GraphQL detected:*

1.  **Introspection Analyst:**
    *   "Check if introspection is enabled in production. Document all queries, mutations, and subscriptions. Identify sensitive operations."

2.  **Query Complexity Analyst:**
    *   "Check for query depth limits, complexity limits, and batch restrictions. Test for nested query attacks and alias-based DoS."

3.  **Authorization Analyst:**
    *   "Analyze resolver-level authorization. Check if each resolver verifies permissions. Flag mutations without auth checks."

### Phase 3: WebSocket Analysis (2 Parallel Agents)

*If WebSocket detected:*

1.  **WebSocket Auth Analyst:**
    *   "Check authentication on WebSocket upgrade. Verify token validation on each message. Check for session fixation in WS connections."

2.  **WebSocket Injection Analyst:**
    *   "Analyze message handlers for injection vulnerabilities. Check if messages are validated before processing. Flag raw JSON parsing without schema."

### Phase 4: API Configuration (2 Parallel Agents)

1.  **CORS Analyst:**
    *   "Check CORS configuration. Flag: wildcard origins (*), credentials with wildcard, dynamic origin reflection, null origin allowed."

2.  **API Versioning Analyst:**
    *   "Identify all API versions. Check if deprecated versions are still accessible. Flag shadow APIs and undocumented endpoints."

## Output Requirements

Create `deliverables/api_security_analysis.md`:

```markdown
# API Security Analysis

## Summary
- Total Endpoints Analyzed: X
- REST Endpoints: X
- GraphQL Operations: X
- WebSocket Handlers: X

## Critical Findings

### [API-001] BOLA in Order Retrieval
**Severity:** Critical
**Endpoint:** `GET /api/orders/{orderId}`
**Issue:** No ownership check - any authenticated user can access any order
**Location:** `controllers/order.js:45`

**Vulnerable Code:**
```javascript
// Only checks if user is logged in, not if they own the order
const order = await Order.findById(orderId);
```

**Remediation:**
```javascript
const order = await Order.findOne({ _id: orderId, userId: req.user.id });
if (!order) return res.status(404).json({ error: 'Not found' });
```

---

### [API-002] Mass Assignment in User Update
...

## Rate Limiting Status

| Endpoint | Rate Limit | Status |
|----------|------------|--------|
| POST /login | None | VULNERABLE |
| POST /reset-password | None | VULNERABLE |
| GET /api/users | 100/min | OK |

## GraphQL Security

### Introspection: [ENABLED/DISABLED]
### Query Depth Limit: [X/NONE]
### Complexity Limit: [X/NONE]

## CORS Configuration

| Origin | Credentials | Status |
|--------|-------------|--------|
| * | true | CRITICAL |
| https://trusted.com | true | OK |

## Recommendations
1. Implement object-level authorization on all resource endpoints
2. Add rate limiting to authentication endpoints
3. Disable GraphQL introspection in production
```

**Next Step:** Findings feed into `/exploit` for verification or `/report` for documentation.
