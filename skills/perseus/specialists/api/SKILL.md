---
name: perseus-api
description: Deep-dive API security analysis (REST, GraphQL, WebSocket, gRPC, OAuth, Cache)
---

# Perseus API Security Specialist

## Context & Authorization

**IMPORTANT:** This skill performs deep API security analysis on the **user's own codebase**. This is defensive security testing to find API vulnerabilities before production deployment.

**Authorization:** The user owns this codebase and has explicitly requested this specialized analysis.

---

## Multi-Language Support

| Language | Frameworks |
|----------|------------|
| JavaScript/TypeScript | Express, Fastify, Nest.js, Next.js API, Hono, Bun |
| Go | Gin, Echo, Fiber, Chi, net/http |
| PHP | Laravel, Symfony, Slim, Lumen |
| Python | FastAPI, Django REST, Flask, Starlette |
| Rust | Actix-web, Axum, Rocket, Warp |
| Java | Spring Boot, Quarkus, Micronaut |
| Ruby | Rails API, Sinatra, Grape |
| C# | ASP.NET Core, Minimal APIs |

---

## Overview

This specialist skill performs comprehensive API security analysis covering OWASP API Security Top 10 plus advanced attack vectors.

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

## Extended Coverage

| Category | Vulnerabilities |
|----------|-----------------|
| GraphQL | Introspection, batching, depth attacks, alias DoS, field suggestions |
| WebSocket | Origin bypass, message injection, auth on upgrade, CSWSH |
| OAuth/OIDC | Token leakage, PKCE bypass, redirect URI manipulation, state fixation |
| Cache | Cache poisoning, cache deception, key injection, web cache DoS |
| gRPC | Reflection enabled, missing auth, message size limits |

## Execution Instructions

### Phase 1: REST API Analysis (4 Parallel Agents)

1.  **BOLA/IDOR Analyst:**
    *   "Analyze all endpoints with resource IDs. Check if ownership is verified before access."

    **Language-Specific Patterns:**
    ```javascript
    // Node.js/Express - VULNERABLE
    app.get('/orders/:id', async (req, res) => {
      const order = await Order.findById(req.params.id); // No owner check
    });
    ```
    ```go
    // Go/Gin - VULNERABLE
    func GetOrder(c *gin.Context) {
      id := c.Param("id")
      order, _ := db.FindOrder(id) // No owner check
    }
    ```
    ```php
    // PHP/Laravel - VULNERABLE
    public function show($id) {
      return Order::find($id); // No owner check
    }
    ```
    ```python
    # Python/FastAPI - VULNERABLE
    @app.get("/orders/{order_id}")
    async def get_order(order_id: int):
        return await Order.get(order_id)  # No owner check
    ```
    ```rust
    // Rust/Actix - VULNERABLE
    async fn get_order(path: web::Path<i32>) -> impl Responder {
        Order::find(path.into_inner())  // No owner check
    }
    ```

2.  **Mass Assignment Analyst:**
    *   "Find endpoints that accept JSON/form data and map to models. Check for unprotected fields."

    **Language-Specific Patterns:**
    ```javascript
    // Node.js - VULNERABLE
    User.findByIdAndUpdate(id, req.body); // All fields accepted
    ```
    ```go
    // Go - VULNERABLE
    c.ShouldBindJSON(&user) // Binds all fields including Role
    ```
    ```php
    // PHP/Laravel - VULNERABLE (without $fillable)
    $user->update($request->all());
    ```
    ```python
    # Python/Django - VULNERABLE
    serializer = UserSerializer(user, data=request.data)
    ```
    ```rust
    // Rust/Serde - VULNERABLE
    let user: User = serde_json::from_str(&body)?; // All fields
    ```

3.  **Rate Limiting Analyst:**
    *   "Check all endpoints for rate limiting. Prioritize: login, password reset, OTP, expensive operations."

    **Framework Rate Limiters to Check:**
    - Express: `express-rate-limit`
    - Fastify: `@fastify/rate-limit`
    - Go: `golang.org/x/time/rate`, `ulule/limiter`
    - PHP: Laravel `ThrottleRequests`
    - Python: `slowapi`, Django `django-ratelimit`
    - Rust: `actix-limitation`, `tower::limit`

4.  **Response Data Analyst:**
    *   "Check API responses for excessive data exposure. Flag: password hashes, internal IDs, PII leakage, debug info."

### Phase 2: GraphQL Analysis (4 Parallel Agents)

*If GraphQL detected:*

1.  **Introspection Analyst:**
    *   "Check if introspection is enabled in production. Document all queries, mutations, subscriptions."

    **Disable Introspection:**
    ```javascript
    // Apollo Server
    new ApolloServer({ introspection: false });
    ```
    ```go
    // gqlgen
    srv.AroundOperations(func(ctx context.Context, next graphql.OperationHandler) graphql.ResponseHandler {
      if graphql.GetOperationContext(ctx).Operation.Operation == "introspection" { return nil }
    })
    ```
    ```python
    # Strawberry
    schema = strawberry.Schema(query=Query, subscription=Subscription, config=StrawberryConfig(auto_camel_case=True))
    ```

2.  **Query Complexity Analyst:**
    *   "Check for query depth limits, complexity limits, batch restrictions. Test for nested query attacks."

    **DoS Patterns:**
    ```graphql
    # Depth attack
    { user { friends { friends { friends { friends { name } } } } } }

    # Alias attack
    { a1: user(id:1) { name } a2: user(id:2) { name } ... a1000: user(id:1000) { name } }

    # Batching attack
    [{ "query": "{ user(id:1) { name } }" }, { "query": "{ user(id:2) { name } }" }, ...]
    ```

3.  **Resolver Authorization Analyst:**
    *   "Analyze resolver-level authorization. Check if each resolver verifies permissions."

4.  **Field Suggestion Analyst:**
    *   "Check if field suggestions are enabled - can leak schema info even without introspection."

5.  **Subscription Security Analyst:**
    *   "Analyze GraphQL subscriptions for security issues."

    **Subscription Vulnerabilities:**
    ```graphql
    # Subscription without auth check
    subscription {
      orderUpdated { id status userId }  # Can subscribe to any user's orders?
    }

    # Subscription flooding
    subscription { messageAdded { content } }  # No rate limiting?
    ```

    **Patterns to Check:**
    ```javascript
    // Apollo Server - VULNERABLE
    const resolvers = {
      Subscription: {
        orderUpdated: {
          subscribe: () => pubsub.asyncIterator(['ORDER_UPDATED'])
          // No auth check - anyone can subscribe
        }
      }
    };

    // Apollo Server - SAFE
    const resolvers = {
      Subscription: {
        orderUpdated: {
          subscribe: withFilter(
            () => pubsub.asyncIterator(['ORDER_UPDATED']),
            (payload, variables, context) => {
              // Verify user owns the resource
              return payload.orderUpdated.userId === context.user.id;
            }
          )
        }
      }
    };
    ```
    ```python
    # Strawberry - Check subscription auth
    @strawberry.type
    class Subscription:
        @strawberry.subscription
        async def order_updated(self, info: Info) -> AsyncGenerator[Order, None]:
            # Is info.context.user checked?
    ```

6.  **Persisted Queries Analyst:**
    *   "Check if persisted queries can be bypassed."

    **Bypass Patterns:**
    ```json
    // Attempt to send raw query when only persisted should be allowed
    { "query": "{ __schema { types { name } } }" }

    // Try extensions field
    { "extensions": { "persistedQuery": { "sha256Hash": "..." } }, "query": "{ malicious }" }
    ```

### Phase 3: WebSocket Analysis (3 Parallel Agents)

*If WebSocket detected:*

1.  **WebSocket Auth Analyst:**
    *   "Check authentication on WebSocket upgrade. Verify token validation on each message."

    **Patterns to Check:**
    ```javascript
    // Node.js/ws - Check upgrade auth
    wss.on('connection', (ws, req) => {
      // Is token validated here?
    });
    ```
    ```go
    // Go/Gorilla - Check upgrade auth
    func wsHandler(w http.ResponseWriter, r *http.Request) {
      conn, _ := upgrader.Upgrade(w, r, nil) // Auth check?
    }
    ```

2.  **WebSocket Origin Analyst:**
    *   "Check Cross-Site WebSocket Hijacking (CSWSH). Verify Origin header validation."

    **Vulnerable Pattern:**
    ```javascript
    // VULNERABLE - No origin check
    const wss = new WebSocket.Server({ server });

    // SAFE - Origin validated
    wss.on('headers', (headers, req) => {
      if (!allowedOrigins.includes(req.headers.origin)) {
        throw new Error('Invalid origin');
      }
    });
    ```

3.  **WebSocket Message Analyst:**
    *   "Analyze message handlers for injection. Check if messages are validated before processing."

### Phase 4: OAuth/OIDC Analysis (3 Parallel Agents)

*If OAuth detected:*

1.  **OAuth Flow Analyst:**
    *   "Check OAuth implementation for security issues."

    **Issues to Find:**
    - Missing state parameter (CSRF)
    - Missing PKCE for public clients
    - Token in URL fragment/query
    - Redirect URI not validated strictly

2.  **Token Security Analyst:**
    *   "Check token storage and transmission. Flag: tokens in localStorage, tokens in URLs, no token rotation."

3.  **Redirect URI Analyst:**
    *   "Check redirect_uri validation. Test for: open redirect, subdomain takeover, path traversal."

    **Bypass Techniques:**
    ```
    https://evil.com#@legitimate.com
    https://legitimate.com.evil.com
    https://legitimate.com%2F@evil.com
    https://legitimate.com/callback/../../../evil
    ```

### Phase 5: Cache Security Analysis (2 Parallel Agents)

1.  **Cache Poisoning Analyst:**
    *   "Check for web cache poisoning vulnerabilities."

    **Patterns:**
    - Unkeyed headers reflected in response
    - Host header injection
    - X-Forwarded-Host not validated
    - Cache key vs cache content mismatch

2.  **Cache Deception Analyst:**
    *   "Check for web cache deception attacks."

    **Vulnerable Pattern:**
    ```
    GET /api/account/settings.css HTTP/1.1
    # If cached, attacker can retrieve victim's data
    ```

    **Check:**
    - Static extension on dynamic endpoints
    - Missing Cache-Control headers
    - CDN caching rules

### Phase 6: API Configuration (3 Parallel Agents)

1.  **CORS Analyst:**
    *   "Check CORS configuration across all frameworks."

    **Framework-Specific:**
    ```javascript
    // Express - VULNERABLE
    app.use(cors({ origin: true, credentials: true }));
    ```
    ```go
    // Go - VULNERABLE
    c.Writer.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
    ```
    ```php
    // Laravel - VULNERABLE
    'allowed_origins' => ['*'],
    'supports_credentials' => true,
    ```
    ```python
    # FastAPI - VULNERABLE
    app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True)
    ```

2.  **API Versioning Analyst:**
    *   "Identify all API versions. Check if deprecated versions are still accessible."

3.  **gRPC Security Analyst:**
    *   "If gRPC used: check reflection, auth interceptors, message size limits."

## Output Requirements

Create `deliverables/api_security_analysis.md`:

```markdown
# API Security Analysis

## Summary
| Category | Endpoints | Critical | High | Medium |
|----------|-----------|----------|------|--------|
| REST | X | Y | Z | W |
| GraphQL | X | Y | Z | W |
| WebSocket | X | Y | Z | W |
| OAuth | X | Y | Z | W |
| gRPC | X | Y | Z | W |

## Language/Framework Detected
- Primary: [e.g., Node.js/Express, Go/Gin, PHP/Laravel]
- API Types: REST, GraphQL, WebSocket

## Critical Findings

### [API-001] BOLA in Order Retrieval
**Severity:** Critical
**Endpoint:** `GET /api/orders/{orderId}`
**Framework:** Express.js
**Location:** `controllers/order.js:45`

**Vulnerable Code:**
[Language-specific vulnerable code]

**Remediation:**
[Language-specific fix]

---

## GraphQL Security
| Check | Status | Risk |
|-------|--------|------|
| Introspection | ENABLED | High |
| Query Depth Limit | NONE | High |
| Complexity Limit | NONE | High |
| Batching Limit | NONE | Medium |

## WebSocket Security
| Endpoint | Origin Check | Auth on Upgrade | Message Validation |
|----------|--------------|-----------------|-------------------|
| /ws | None | None | None | CRITICAL |

## OAuth Security
| Issue | Status |
|-------|--------|
| State Parameter | Missing |
| PKCE | Not Implemented |
| Redirect URI Validation | Weak |

## Cache Security
| Issue | Vulnerable | Location |
|-------|------------|----------|
| Cache Poisoning | Yes | X-Forwarded-Host |
| Cache Deception | Yes | /api/* |

## Rate Limiting Status
| Endpoint | Limit | Status |
|----------|-------|--------|
| POST /login | None | VULNERABLE |
| POST /reset-password | None | VULNERABLE |

## CORS Configuration
| Origin | Credentials | Status |
|--------|-------------|--------|
| * | true | CRITICAL |

## Recommendations
1. Implement object-level authorization on all resource endpoints
2. Add rate limiting to authentication endpoints
3. Disable GraphQL introspection in production
4. Validate WebSocket Origin header
5. Implement PKCE for OAuth flows
```

**Next Step:** Findings feed into `/exploit` for verification or `/report` for documentation.
