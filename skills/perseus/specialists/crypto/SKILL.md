---
name: perseus-crypto
description: Deep-dive cryptography and secrets analysis (JWT, hashing, encryption, key management)
---

# Perseus Crypto Specialist

## Context & Authorization

**IMPORTANT:** This skill performs cryptographic security analysis on the **user's own codebase**. This is defensive security testing to find crypto weaknesses before they lead to data breaches.

**Authorization:** The user owns this codebase and has explicitly requested this specialized analysis.

---

## Multi-Language Support

| Language | Libraries |
|----------|-----------|
| JavaScript/TypeScript | jsonwebtoken, jose, bcrypt, crypto, node-forge |
| Go | golang.org/x/crypto, crypto/*, jwt-go, golang-jwt |
| PHP | openssl, password_hash, sodium, firebase/php-jwt |
| Python | PyJWT, cryptography, bcrypt, passlib, hashlib |
| Rust | jsonwebtoken, ring, rust-crypto, argon2, bcrypt |
| Java | jjwt, Bouncy Castle, Java Cryptography Architecture |
| Ruby | jwt, bcrypt, rbnacl, openssl |
| C# | System.IdentityModel.Tokens.Jwt, BCrypt.Net |

---

## Overview

This specialist skill performs comprehensive cryptographic analysis including JWT security, hashing, encryption, and key management across all major languages.

**When to Use:** After `/scan` identifies JWT usage, password hashing, encryption, or secrets handling.

**Goal:** Ensure cryptographic implementations follow security best practices.

## Cryptographic Issues Covered

| Category | Issues | Impact |
|----------|--------|--------|
| JWT | Algorithm confusion, weak secrets, missing validation | Auth bypass |
| Hashing | MD5/SHA1 for passwords, missing salt, weak iterations | Credential theft |
| Encryption | Weak ciphers, ECB mode, hardcoded keys | Data exposure |
| Random | Predictable RNG, weak seeds | Token prediction |
| Key Management | Hardcoded keys, insecure storage | Full compromise |

## Execution Instructions

### Phase 1: JWT Analysis (4 Parallel Agents)

1.  **JWT Algorithm Analyst:**
    *   "Find all JWT verification code. Check for algorithm validation."

    **Language-Specific Patterns:**
    ```javascript
    // Node.js - VULNERABLE
    jwt.verify(token, secret);  // Accepts any algorithm

    // Node.js - SAFE
    jwt.verify(token, secret, { algorithms: ['HS256'] });
    ```
    ```go
    // Go - VULNERABLE
    token, _ := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
        return secret, nil  // No algorithm check!
    })

    // Go - SAFE
    token, _ := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
        if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("unexpected method: %v", t.Header["alg"])
        }
        return secret, nil
    })
    ```
    ```python
    # Python - VULNERABLE
    jwt.decode(token, secret)  # Accepts any algorithm

    # Python - SAFE
    jwt.decode(token, secret, algorithms=['HS256'])
    ```
    ```php
    // PHP - VULNERABLE
    JWT::decode($token, $key);  // Check library defaults

    // PHP - SAFE
    JWT::decode($token, new Key($key, 'HS256'));
    ```
    ```rust
    // Rust - SAFE (explicit by design)
    decode::<Claims>(&token, &DecodingKey::from_secret(secret), &Validation::new(Algorithm::HS256))
    ```

2.  **JWT Secret Analyst:**
    *   "Find JWT signing secrets across languages."

    **Patterns:**
    ```javascript
    // VULNERABLE - Weak secret
    const secret = 'secret123';
    const secret = 'password';

    // VULNERABLE - Hardcoded
    jwt.sign(payload, 'my-super-secret-key');

    // SAFE - From environment, strong
    const secret = process.env.JWT_SECRET;  // Must be 32+ chars
    ```
    ```go
    // VULNERABLE
    var jwtSecret = []byte("weak-secret")

    // SAFE
    var jwtSecret = []byte(os.Getenv("JWT_SECRET"))
    ```
    ```python
    # VULNERABLE
    SECRET_KEY = "secret"

    # SAFE
    SECRET_KEY = os.environ.get("JWT_SECRET")
    ```

3.  **JWT Claims Analyst:**
    *   "Analyze JWT claim validation."

    **Required Validations:**
    | Claim | Purpose | Check |
    |-------|---------|-------|
    | exp | Expiration | Token not expired |
    | iat | Issued At | Not issued in future |
    | nbf | Not Before | Token is active |
    | iss | Issuer | Trusted issuer |
    | aud | Audience | Intended recipient |

4.  **JWT Key Management Analyst:**
    *   "Check RS256/ES256 key handling."

    **Issues:**
    - Private key in repository
    - Key without rotation
    - Public key as HMAC secret (algorithm confusion)

### Phase 2: Password Hashing Analysis (3 Parallel Agents)

1.  **Hash Algorithm Analyst:**
    *   "Find all password hashing across languages."

    **Language-Specific Patterns:**
    ```javascript
    // Node.js - VULNERABLE
    crypto.createHash('md5').update(password).digest('hex');
    crypto.createHash('sha1').update(password).digest('hex');
    crypto.createHash('sha256').update(password).digest('hex');  // No salt!

    // Node.js - SAFE
    await bcrypt.hash(password, 12);
    await argon2.hash(password);
    ```
    ```go
    // Go - VULNERABLE
    md5.Sum([]byte(password))
    sha256.Sum256([]byte(password))

    // Go - SAFE
    bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
    ```
    ```python
    # Python - VULNERABLE
    hashlib.md5(password.encode()).hexdigest()
    hashlib.sha256(password.encode()).hexdigest()

    # Python - SAFE
    bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))
    from passlib.hash import argon2
    argon2.hash(password)
    ```
    ```php
    // PHP - VULNERABLE
    md5($password);
    sha1($password);
    hash('sha256', $password);

    // PHP - SAFE
    password_hash($password, PASSWORD_ARGON2ID);
    password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    ```
    ```rust
    // Rust - SAFE
    bcrypt::hash(password, bcrypt::DEFAULT_COST)?;
    argon2::hash_encoded(password.as_bytes(), &salt, &config)?;
    ```
    ```java
    // Java - VULNERABLE
    MessageDigest.getInstance("MD5").digest(password.getBytes());

    // Java - SAFE
    BCrypt.hashpw(password, BCrypt.gensalt(12));
    ```

2.  **Hash Comparison Analyst:**
    *   "Check for timing-safe comparison."

    **Patterns:**
    ```javascript
    // VULNERABLE - Timing attack
    if (storedHash === computedHash) { ... }

    // SAFE
    crypto.timingSafeEqual(Buffer.from(storedHash), Buffer.from(computedHash))
    ```
    ```go
    // VULNERABLE
    if storedHash == computedHash { ... }

    // SAFE
    subtle.ConstantTimeCompare([]byte(storedHash), []byte(computedHash))
    ```
    ```python
    # VULNERABLE
    if stored_hash == computed_hash: ...

    # SAFE
    hmac.compare_digest(stored_hash, computed_hash)
    ```

3.  **Password Policy Analyst:**
    *   "Check password strength enforcement."

### Phase 3: Encryption Analysis (4 Parallel Agents)

1.  **Cipher Selection Analyst:**
    *   "Find all encryption operations."

    **Vulnerable Ciphers:**
    | Cipher | Status | Use Instead |
    |--------|--------|-------------|
    | DES | Broken | AES-256-GCM |
    | 3DES | Deprecated | AES-256-GCM |
    | RC4 | Broken | AES-256-GCM |
    | Blowfish | Weak | AES-256-GCM |
    | AES-ECB | Insecure | AES-256-GCM |
    | AES-CBC | OK (with HMAC) | AES-256-GCM preferred |

    **Language Patterns:**
    ```javascript
    // Node.js - VULNERABLE
    crypto.createCipher('des', key);
    crypto.createCipheriv('aes-128-ecb', key, '');

    // Node.js - SAFE
    crypto.createCipheriv('aes-256-gcm', key, iv);
    ```
    ```go
    // Go - VULNERABLE
    des.NewCipher(key)
    cipher.NewCBCEncrypter(block, iv)  // Without HMAC

    // Go - SAFE
    cipher.NewGCM(block)
    ```
    ```python
    # Python - VULNERABLE
    from Crypto.Cipher import DES
    cipher = AES.new(key, AES.MODE_ECB)

    # Python - SAFE
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    ```

2.  **IV/Nonce Analyst:**
    *   "Check IV/nonce generation."

    **Issues:**
    ```javascript
    // VULNERABLE - Static IV
    const iv = Buffer.from('0000000000000000', 'hex');

    // VULNERABLE - Predictable
    const iv = Buffer.from(Date.now().toString());

    // SAFE - Random
    const iv = crypto.randomBytes(16);
    ```

3.  **Key Derivation Analyst:**
    *   "Check key derivation from passwords."

    **Patterns:**
    ```javascript
    // VULNERABLE - Direct use
    const key = Buffer.from(password);

    // SAFE - PBKDF2
    crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

    // SAFE - scrypt
    crypto.scryptSync(password, salt, 32);
    ```

4.  **Key Management Analyst:**
    *   "Find encryption key storage issues."

### Phase 4: Random Number Analysis (2 Parallel Agents)

1.  **PRNG Analyst:**
    *   "Find insecure random number generation."

    **Language-Specific:**
    ```javascript
    // VULNERABLE
    Math.random()

    // SAFE
    crypto.randomBytes(32)
    crypto.randomUUID()
    ```
    ```go
    // VULNERABLE
    math/rand.Int()

    // SAFE
    crypto/rand.Read(buf)
    ```
    ```python
    # VULNERABLE
    random.random()
    random.randint()

    # SAFE
    secrets.token_bytes(32)
    secrets.token_hex(32)
    secrets.token_urlsafe(32)
    ```
    ```php
    // VULNERABLE
    rand()
    mt_rand()

    // SAFE
    random_bytes(32)
    random_int(0, PHP_INT_MAX)
    ```
    ```rust
    // Use rand crate with OsRng
    use rand::rngs::OsRng;
    let random: u64 = OsRng.gen();
    ```
    ```java
    // VULNERABLE
    new Random().nextInt()

    // SAFE
    new SecureRandom().nextInt()
    ```

2.  **Token Generation Analyst:**
    *   "Check security token generation."

### Phase 5: Secrets in Code (3 Parallel Agents)

1.  **Hardcoded Secrets Scanner:**
    *   "Deep scan for hardcoded secrets."

    **Patterns:**
    ```
    # AWS
    AKIA[0-9A-Z]{16}

    # GitHub
    ghp_[a-zA-Z0-9]{36}
    github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}

    # Stripe
    sk_live_[a-zA-Z0-9]{24}
    rk_live_[a-zA-Z0-9]{24}

    # Private Keys
    -----BEGIN (RSA|EC|OPENSSH|PGP) PRIVATE KEY-----

    # Generic
    (password|secret|key|token|api_key)\s*[:=]\s*['\"][^'\"]+['\"]
    ```

2.  **Secret Exposure Analyst:**
    *   "Check where secrets might leak."

    **Locations:**
    - Log files
    - Error messages
    - API responses
    - Client-side code
    - Git history

3.  **Environment Variable Analyst:**
    *   "Check .env file security."

    **Issues:**
    - .env in repository
    - .env.example with real secrets
    - Missing .env in .gitignore

## Output Requirements

Create `deliverables/crypto_security_analysis.md`:

```markdown
# Cryptographic Security Analysis

## Summary
| Category | Issues | Critical | High | Medium |
|----------|--------|----------|------|--------|
| JWT | X | Y | Z | W |
| Hashing | X | Y | Z | W |
| Encryption | X | Y | Z | W |
| Random | X | Y | Z | W |
| Secrets | X | Y | Z | W |

## Language/Framework Detected
- Primary: [e.g., Node.js, Go, Python]
- Crypto Libraries: [e.g., crypto, bcrypt, jose]

## JWT Security Status

| Check | Status | Details |
|-------|--------|---------|
| Algorithm Validation | FAIL | Accepts 'none' algorithm |
| Secret Strength | FAIL | 8 character secret |
| Expiration | PASS | 1 hour expiry enforced |
| Issuer Validation | WARN | Not validated |

## Critical Findings

### [CRYPTO-001] JWT Algorithm Confusion
**Severity:** Critical
**Language:** Node.js
**Location:** `middleware/auth.js:23`

**Vulnerable Code:**
```javascript
const decoded = jwt.verify(token, publicKey);
```

**Attack:**
1. Take valid RS256 token
2. Change header to HS256
3. Sign with public key as secret
4. Server verifies with public key as HMAC secret

**Remediation:**
```javascript
const decoded = jwt.verify(token, publicKey, {
  algorithms: ['RS256']
});
```

---

### [CRYPTO-002] MD5 Password Hashing
**Severity:** Critical
**Language:** Python
**Location:** `models/user.py:45`

**Vulnerable Code:**
```python
hashed = hashlib.md5(password.encode()).hexdigest()
```

**Remediation:**
```python
import bcrypt
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))
```

---

## Password Hashing Status

| Language | Algorithm | Cost/Rounds | Status |
|----------|-----------|-------------|--------|
| Node.js | bcrypt | 10 | WARN (use 12+) |
| Python | MD5 | N/A | CRITICAL |
| Go | bcrypt | 14 | OK |

## Encryption Status

| Usage | Cipher | Mode | Status |
|-------|--------|------|--------|
| File encryption | AES-256 | ECB | CRITICAL |
| API encryption | AES-128 | GCM | WARN (use 256) |

## Random Number Generation

| Usage | Method | Status |
|-------|--------|--------|
| Session tokens | Math.random() | CRITICAL |
| Password reset | crypto.randomBytes() | OK |

## Hardcoded Secrets Found

| Type | Location | Severity |
|------|----------|----------|
| AWS Access Key | `config/aws.js:3` | Critical |
| JWT Secret | `auth/jwt.js:5` | Critical |
| Database Password | `.env.example:8` | High |

## Recommendations

### Immediate Actions
1. Implement algorithm validation for JWT
2. Migrate password hashing to Argon2id or bcrypt (cost 12+)
3. Move all secrets to environment variables
4. Replace Math.random() with crypto.randomBytes()

### Hashing Migration Guide
```javascript
// Before
const hash = md5(password);

// After
const hash = await bcrypt.hash(password, 12);

// Or with Argon2
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4
});
```
```

**Next Step:** JWT vulnerabilities can be verified with crafted tokens.
