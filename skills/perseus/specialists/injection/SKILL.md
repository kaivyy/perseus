---
name: perseus-injection
description: Deep-dive injection vulnerability analysis (NoSQL, LDAP, XPath, Template, OS Command)
---

# Perseus Injection Specialist

## Context & Authorization

**IMPORTANT:** This skill performs deep injection vulnerability analysis on the **user's own codebase**. This is defensive security testing to find injection flaws before attackers do.

**Authorization:** The user owns this codebase and has explicitly requested this specialized analysis.

---

## Overview

This specialist skill performs comprehensive injection analysis beyond basic SQLi/XSS, covering advanced injection vectors often missed by standard scans.

**When to Use:** After `/audit` identifies potential injection points, or when the application uses NoSQL, LDAP, XML, or template engines.

**Goal:** Find all injection vectors including less common but equally dangerous ones.

## Injection Types Covered

| Type | Sinks | Impact |
|------|-------|--------|
| NoSQL Injection | MongoDB queries, Redis commands | Data exfiltration, auth bypass |
| LDAP Injection | LDAP queries, directory lookups | Auth bypass, info disclosure |
| XPath Injection | XML queries | Data extraction |
| Template Injection (SSTI) | Template engines | RCE |
| OS Command Injection | Shell execution | RCE |
| Expression Language | EL, SpEL, OGNL | RCE |
| Header Injection | HTTP headers, emails | Response splitting, phishing |

## Execution Instructions

### Phase 1: NoSQL Injection Analysis (2 Parallel Agents)

1.  **MongoDB Injection Analyst:**
    *   "Find all MongoDB query operations. Check for: `$where` with user input, `$regex` injection, operator injection (`$gt`, `$ne`), JSON injection in queries. Flag any user input reaching query operators."

    **Patterns to Find:**
    ```javascript
    // Vulnerable patterns
    db.users.find({ username: req.body.username })  // operator injection
    db.users.find({ $where: `this.name == '${input}'` })  // JS injection
    ```

2.  **Redis/Other NoSQL Analyst:**
    *   "Find Redis, Elasticsearch, Cassandra operations. Check for command injection in Redis (EVAL), query injection in Elasticsearch. Flag unsanitized input in NoSQL operations."

### Phase 2: Directory Injection Analysis (2 Parallel Agents)

1.  **LDAP Injection Analyst:**
    *   "Find LDAP operations (ldap_search, ldap_bind, JNDI lookups). Check for filter injection, DN injection. Flag string concatenation in LDAP filters."

    **Patterns to Find:**
    ```java
    // Vulnerable
    String filter = "(uid=" + username + ")";

    // Safe
    String filter = "(uid={0})";
    ctx.search(base, filter, new Object[]{username}, controls);
    ```

2.  **XPath Injection Analyst:**
    *   "Find XML processing with XPath queries. Check for user input in XPath expressions. Flag dynamic XPath construction."

### Phase 3: Template Injection Analysis (3 Parallel Agents)

1.  **Python Template Analyst (Jinja2, Mako, Django):**
    *   "Find template rendering operations. Check for: user input in template strings, `Template(user_input)`, disabled autoescaping. Test markers: `{{7*7}}`, `${7*7}`"

2.  **Java Template Analyst (Freemarker, Velocity, Thymeleaf):**
    *   "Find template engine usage. Check for user-controlled template paths, expression injection. Test markers: `${7*7}`, `<#assign x=7*7>${x}`"

3.  **JavaScript Template Analyst (EJS, Pug, Handlebars, Nunjucks):**
    *   "Find template rendering. Check for: `render(template, {user_input})`, disabled escaping, `<%- %>` vs `<%= %>`. Flag any user input in template source."

### Phase 4: Command & Expression Injection (3 Parallel Agents)

1.  **OS Command Injection Analyst:**
    *   "Find all shell execution points. Check: subprocess with shell=True, backticks, $(), process builders with user input."

    **Language-Specific Sinks:**
    - Python: `os.system`, `subprocess.call(shell=True)`, `os.popen`
    - Node.js: `child_process.exec`, `child_process.spawn({shell:true})`
    - PHP: `system`, `passthru`, `shell_exec`, `proc_open`
    - Ruby: `system`, `exec`, backticks, `%x{}`
    - Java: `Runtime.exec`, `ProcessBuilder`

2.  **Expression Language Analyst:**
    *   "Find EL/SpEL/OGNL usage in Java apps. Check for user input in expressions. Flag: `@Value("${user.input}")`, dynamic SpEL evaluation."

3.  **Header Injection Analyst:**
    *   "Find HTTP header setting with user input. Check for CRLF injection (\\r\\n). Flag: `setHeader`, `addHeader`, email headers with user input."

## Safe Payload Reference

| Injection Type | Detection Payload | Verification |
|----------------|-------------------|--------------|
| NoSQL (MongoDB) | `{"$gt": ""}` | Returns all records |
| LDAP | `*)(uid=*))(|(uid=*` | Modified query results |
| XPath | `' or '1'='1` | Returns all nodes |
| SSTI (Jinja2) | `{{7*7}}` | Output: 49 |
| SSTI (Freemarker) | `${7*7}` | Output: 49 |
| Command | `; sleep 5` | 5 second delay |
| Header | `\r\nX-Injected: true` | New header appears |

## Output Requirements

Create `deliverables/injection_deep_analysis.md`:

```markdown
# Advanced Injection Analysis

## Summary
| Type | Instances Found | Vulnerable | Safe |
|------|-----------------|------------|------|
| NoSQL | X | Y | Z |
| LDAP | X | Y | Z |
| Template | X | Y | Z |
| Command | X | Y | Z |
| Expression | X | Y | Z |

## Critical Findings

### [INJ-001] MongoDB Operator Injection in Login
**Severity:** Critical
**Type:** NoSQL Injection
**Location:** `auth/login.js:34`

**Vulnerable Code:**
```javascript
const user = await User.findOne({
  username: req.body.username,
  password: req.body.password
});
```

**Attack:**
```json
POST /login
{"username": "admin", "password": {"$ne": ""}}
```

**Impact:** Authentication bypass - attacker can login as any user

**Remediation:**
```javascript
// Validate types before query
if (typeof username !== 'string' || typeof password !== 'string') {
  return res.status(400).json({ error: 'Invalid input' });
}
const user = await User.findOne({ username, password: hash(password) });
```
```

**Next Step:** Findings feed into `/exploit` for verification.
