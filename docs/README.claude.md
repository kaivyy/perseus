# Perseus for Claude Code

Complete guide for using Perseus with Claude Code.

## Quick Install

In Claude Code, run:

```
/plugin install https://github.com/kaivyy/perseus
```

That's it! Everything is automatic.

## Manual Installation

### Prerequisites

- Claude Code CLI installed
- Git installed

### macOS / Linux

```bash
# 1. Clone Perseus
git clone https://github.com/kaivyy/perseus.git ~/.claude/plugins/perseus

# 2. Run post-install script
~/.claude/plugins/perseus/scripts/post-install.sh
```

### Windows

**PowerShell (Run as Administrator or with Developer Mode):**

```powershell
# 1. Clone Perseus
git clone https://github.com/kaivyy/perseus.git "$env:USERPROFILE\.claude\plugins\perseus"

# 2. Run post-install script
& "$env:USERPROFILE\.claude\plugins\perseus\scripts\post-install.sh"
```

### Verify Installation

```bash
ls -la ~/.claude/skills/perseus*
```

You should see symlinks pointing to Perseus skills.

## Usage

### Core Commands

| Command | Description |
|---------|-------------|
| `/start` | Full automated security assessment |
| `/scan` | Phase 1: Reconnaissance |
| `/audit` | Phase 2: Vulnerability Analysis |
| `/exploit` | Phase 3: PoC Verification |
| `/report` | Phase 4: Executive Report |
| `/specialist` | Run all 8 specialists |

### Specialist Commands

| Command | Coverage |
|---------|----------|
| `/perseus:api` | API, GraphQL, WebSocket, OAuth, gRPC |
| `/perseus:injection` | NoSQL, LDAP, XPath, SSTI, Log4j |
| `/perseus:crypto` | JWT, Hashing, Encryption |
| `/perseus:supply-chain` | CVEs, Typosquatting, Licenses |
| `/perseus:file` | Path Traversal, XXE, Zip Slip |
| `/perseus:logic` | Race Conditions, AI/LLM Security |
| `/perseus:client` | React, Next.js, Vue, Angular |
| `/perseus:config` | Docker, CI/CD, Cloud, Kubernetes |

## How It Works

### Plugin Structure

Perseus uses Claude Code's plugin system:

```
~/.claude/plugins/perseus/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── hooks/
│   ├── hooks.json           # Hook configuration
│   ├── session-start.sh     # Auto-patches security hooks
│   └── security-whitelist.py # Whitelists Perseus paths
├── skills/                  # 15 security skills
├── commands/                # 20 slash commands
└── scripts/
    └── post-install.sh      # Creates symlinks
```

### Automatic Hook Bypass

Perseus automatically patches the `security-guidance` plugin (if installed) to allow writing security documentation. This happens on every session start via `session-start.sh`.

**Whitelisted paths:**
- `skills/perseus/*`
- `deliverables/*`
- `*_analysis.md`
- `SECURITY_REPORT.md`

### Multi-Language Support

Perseus supports 8 languages with 30+ frameworks:

| Language | Frameworks |
|----------|------------|
| JavaScript/TypeScript | Express, Fastify, Next.js, Nest.js, Hono, Bun |
| Go | Gin, Echo, Fiber, Chi |
| PHP | Laravel, Symfony, Slim, Lumen |
| Python | FastAPI, Django, Flask, Starlette |
| Rust | Actix-web, Axum, Rocket, Warp |
| Java | Spring Boot, Quarkus, Micronaut |
| Ruby | Rails, Sinatra, Grape |
| C# | ASP.NET Core, Minimal APIs |

## Updating

```bash
cd ~/.claude/plugins/perseus && git pull
```

## Uninstalling

```bash
~/.claude/plugins/perseus/scripts/uninstall.sh
rm -rf ~/.claude/plugins/perseus
```

## Troubleshooting

### Hook Blocking Issue

**Problem:** Perseus scan/audit fails with security warning errors.

**Solution 1:** Restart Claude Code session (auto-patch runs on start):
```
/clear
```

**Solution 2:** Run post-install manually:
```bash
~/.claude/plugins/perseus/scripts/post-install.sh
```

**Solution 3:** Disable security hook temporarily:
```bash
export ENABLE_SECURITY_REMINDER=0
```

### Skills Not Found

**Problem:** `/scan` or other commands say skill not found.

**Solution:** Run post-install to create symlinks:
```bash
~/.claude/plugins/perseus/scripts/post-install.sh
```

### Deliverables Not Created

**Problem:** `deliverables/` folder is empty after scan.

**Cause:** Hook blocked file writing.

**Solution:** Fix hook issue first, then run `/scan` again.

## Getting Help

- Report issues: https://github.com/kaivyy/perseus/issues
- Full documentation: https://github.com/kaivyy/perseus
