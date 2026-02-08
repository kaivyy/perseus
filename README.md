# Perseus Security Skills for Claude Code

Perseus is a suite of interactive security assessment skills for Claude Code, based on the rigorous **Shannon** methodology. It transforms Claude into an automated penetration testing partner.

## 📦 Installation

You can install this plugin directly from GitHub:

```bash
/plugin install kaivy/perseus
```

*(Note: Replace `kaivy/perseus` with your actual GitHub repository URL once published)*

## 🛡️ Available Skills

### 1. Scan (Reconnaissance)
Maps the target's architecture, entry points, and attack surface.
- **Command:** `Skill: perseus:scan`
- **Phases:** Discovery (Architecture, Entry Points, Auth) + Surface Mapping (XSS, SSRF, Data)

### 2. Audit (Vulnerability Analysis)
Performs deep-dive white-box analysis on identified components.
- **Command:** `Skill: perseus:audit`
- **Agents:** Injection, XSS, Auth, Authz, SSRF (Parallel Execution)
- **Methodology:** Negative Analysis Loop (Source -> Sink -> Defense -> Verdict)

### 3. Report (Executive Reporting)
Synthesizes verified findings into a professional security report.
- **Command:** `Skill: perseus:report`
- **Output:** Executive Summary, Risk Scorecard, Verified Exploits, Strategic Recommendations

## 🚀 Usage Workflow

1.  **Start with a Scan:**
    ```text
    I want to assess this codebase. Use perseus:scan to map the attack surface.
    ```

2.  **Audit Specific Components:**
    ```text
    The scan found a complex auth flow in src/auth.ts. Use perseus:audit to analyze it for bypasses.
    ```

3.  **Generate Report:**
    ```text
    We are done. Use perseus:report to generate the final deliverables.
    ```

## 📄 License

MIT
