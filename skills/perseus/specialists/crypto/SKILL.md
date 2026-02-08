---
name: perseus-crypto
description: Deep-dive cryptography and secrets analysis (JWT, hashing, encryption, key management)
---

# Perseus Crypto Specialist

## Context & Authorization

**IMPORTANT:** This skill performs cryptographic security analysis on the **user's own codebase**. This is defensive security testing to find crypto weaknesses before they lead to data breaches.

**Authorization:** The user owns this codebase and has explicitly requested this specialized analysis.

---

## Overview

This specialist skill performs comprehensive cryptographic analysis including JWT security, hashing, encryption, and key management.

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

### Phase 1: JWT Analysis (3 Parallel Agents)

1.  **JWT Algorithm Analyst:**
    *   "Find all JWT verification code. Check for: algorithm validation (reject 'none'), RS256/HS256 confusion, symmetric key in RS256 verification. Flag any `verify` without algorithm restriction."

    **Vulnerable Patterns:**
    ```javascript
    // Vulnerable - accepts any algorithm
    jwt.verify(token, secret);

    // Safe - explicit algorithm
    jwt.verify(token, secret, { algorithms: ['HS256'] });
    ```

2.  **JWT Secret Analyst:**
    *   "Find JWT signing secrets. Check for: hardcoded secrets, weak secrets (< 32 chars), secrets in code/config. Check if secret is from env variable with proper length."

3.  **JWT Claims Analyst:**
    *   "Analyze JWT claim validation. Check for: expiration (exp) enforcement, issuer (iss) validation, audience (aud) validation, not-before (nbf) handling. Flag missing claim validations."

### Phase 2: Password Hashing Analysis (2 Parallel Agents)

1.  **Hash Algorithm Analyst:**
    *   "Find all password hashing. Flag: MD5, SHA1, SHA256 (without KDF), unsalted hashes, custom hash functions. Verify bcrypt/scrypt/argon2 usage with proper cost factors."

    **Severity Guide:**
    - MD5/SHA1: Critical
    - SHA256 without salt: High
    - bcrypt cost < 10: Medium
    - bcrypt cost >= 12: OK

2.  **Hash Implementation Analyst:**
    *   "Check hash comparison. Flag: timing-unsafe comparison (`==` instead of `timingSafeEqual`), hash truncation, rainbow table vectors. Verify constant-time comparison."

### Phase 3: Encryption Analysis (3 Parallel Agents)

1.  **Cipher Selection Analyst:**
    *   "Find all encryption operations. Flag: DES, 3DES, RC4, Blowfish, AES-ECB. Verify AES-GCM or AES-CBC with HMAC. Check key sizes (< 256 bit for new systems)."

2.  **IV/Nonce Analyst:**
    *   "Check IV/nonce generation. Flag: static IVs, counter reuse in CTR/GCM, predictable IVs. Verify cryptographically random IV generation for each encryption."

3.  **Key Management Analyst:**
    *   "Find encryption keys. Flag: hardcoded keys, keys in source code, keys in config files, weak key derivation. Verify keys from secure storage (HSM, KMS, Vault)."

### Phase 4: Random Number Analysis (2 Parallel Agents)

1.  **PRNG Analyst:**
    *   "Find random number generation for security purposes. Flag: `Math.random()`, `random.random()`, `rand()` for tokens/keys. Verify CSPRNG usage."

    **Language-Specific Secure RNG:**
    - Node.js: `crypto.randomBytes()`, `crypto.randomUUID()`
    - Python: `secrets.token_bytes()`, `secrets.token_hex()`
    - Java: `SecureRandom`
    - PHP: `random_bytes()`, `random_int()`

2.  **Token Generation Analyst:**
    *   "Find session token, reset token, API key generation. Check entropy (>= 128 bits), verify CSPRNG source, check for sequential/predictable patterns."

### Phase 5: Secrets in Code (2 Parallel Agents)

1.  **Hardcoded Secrets Scanner:**
    *   "Deep scan for hardcoded secrets using patterns and entropy analysis. Check: API keys, passwords, private keys, connection strings, OAuth secrets."

    **Patterns:**
    ```
    AWS: AKIA[0-9A-Z]{16}
    GitHub: ghp_[a-zA-Z0-9]{36}
    Stripe: sk_live_[a-zA-Z0-9]{24}
    Private Key: -----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----
    Generic: password\s*=\s*["'][^"']+["']
    ```

2.  **Secret Exposure Analyst:**
    *   "Check where secrets might leak: logs, error messages, API responses, client-side code. Flag any secret that could reach logs or browser."

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
**Location:** `middleware/auth.js:23`

**Vulnerable Code:**
```javascript
const decoded = jwt.verify(token, publicKey);
```

**Attack:**
1. Take valid RS256 token
2. Change header to HS256
3. Sign with public key (which is known)
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
**Location:** `models/user.js:45`
...

## Hardcoded Secrets Found

| Type | Location | Severity |
|------|----------|----------|
| AWS Access Key | `config/aws.js:3` | Critical |
| JWT Secret | `auth/jwt.js:5` | Critical |
| Database Password | `db/connection.js:8` | Critical |

## Recommendations
1. Implement proper algorithm validation for JWT
2. Migrate password hashing to Argon2id or bcrypt (cost 12+)
3. Move all secrets to environment variables or secret manager
4. Replace Math.random() with crypto.randomBytes() for security tokens
```

**Next Step:** Findings feed into `/exploit` for verification (especially JWT attacks).
