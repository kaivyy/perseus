# Perseus for Codex

Guide for using Perseus with OpenAI Codex via native skill discovery.

## Quick Install

Tell Codex:

```
Fetch and follow instructions from https://raw.githubusercontent.com/kaivyy/perseus/refs/heads/main/.codex/INSTALL.md
```

## Manual Installation

### Prerequisites

- OpenAI Codex CLI
- Git

### macOS / Linux

```bash
# 1. Clone Perseus
git clone https://github.com/kaivyy/perseus.git ~/.codex/perseus

# 2. Create skills symlink
mkdir -p ~/.agents/skills
ln -sf ~/.codex/perseus/skills ~/.agents/skills/perseus

# 3. Restart Codex
```

### Windows (PowerShell)

```powershell
# 1. Clone Perseus
git clone https://github.com/kaivyy/perseus.git "$env:USERPROFILE\.codex\perseus"

# 2. Create directories
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.agents\skills"

# 3. Create junction (works without Developer Mode)
cmd /c mklink /J "$env:USERPROFILE\.agents\skills\perseus" "$env:USERPROFILE\.codex\perseus\skills"

# 4. Restart Codex
```

### Verify Installation

```bash
ls -la ~/.agents/skills/perseus
```

You should see a symlink pointing to Perseus skills directory.

## How It Works

Codex has native skill discovery - it scans `~/.agents/skills/` at startup, parses SKILL.md frontmatter, and loads skills on demand. Perseus skills are made visible through a single symlink:

```
~/.agents/skills/perseus/ → ~/.codex/perseus/skills/
```

## Usage

Skills are discovered automatically. Codex activates them when:
- You mention a skill by name (e.g., "use perseus/scan")
- The task matches a skill's description
- You explicitly ask for a security assessment

### Core Skills

| Skill | Description |
|-------|-------------|
| `perseus/start` | Full automated assessment |
| `perseus/scan` | Reconnaissance |
| `perseus/audit` | Vulnerability analysis |
| `perseus/exploit` | PoC verification |
| `perseus/report` | Executive report |

### Specialist Skills

| Skill | Coverage |
|-------|----------|
| `perseus/specialists/api` | API, GraphQL, WebSocket |
| `perseus/specialists/injection` | NoSQL, SSTI, Log4j |
| `perseus/specialists/crypto` | JWT, Hashing, Encryption |
| `perseus/specialists/supply-chain` | CVEs, Dependencies |
| `perseus/specialists/file-security` | Path Traversal, XXE |
| `perseus/specialists/logic` | Race Conditions, AI Security |
| `perseus/specialists/client` | React, Next.js, Vue |
| `perseus/specialists/config` | Docker, CI/CD, Cloud |

### Engagement Modes

Perseus runs verification with explicit modes:

| Mode | Environment | Behavior |
|------|-------------|----------|
| `PRODUCTION_SAFE` | Live production | Passive-first + minimal non-disruptive verification |
| `STAGING_ACTIVE` | Staging/pre-production | Active verification with throttling |
| `LAB_FULL` | Isolated lab | Broad dynamic verification |
| `LAB_RED_TEAM` | Dedicated security lab | Controlled adversarial chain simulation with kill-switches |

Default mode is `PRODUCTION_SAFE`.

### Key Deliverables

After running `perseus/start`, check:
- `deliverables/engagement_profile.md`
- `deliverables/verification_scope.md`
- `deliverables/exploitation_report.md`
- `deliverables/SECURITY_REPORT.md`

## Updating

```bash
cd ~/.codex/perseus && git pull
```

Skills update instantly through the symlink.

## Uninstalling

```bash
rm ~/.agents/skills/perseus
rm -rf ~/.codex/perseus
```

**Windows (PowerShell):**
```powershell
Remove-Item "$env:USERPROFILE\.agents\skills\perseus"
Remove-Item -Recurse -Force "$env:USERPROFILE\.codex\perseus"
```

## Troubleshooting

### Skills not showing up

1. Verify the symlink: `ls -la ~/.agents/skills/perseus`
2. Check skills exist: `ls ~/.codex/perseus/skills`
3. Restart Codex - skills are discovered at startup

### Windows junction issues

Junctions normally work without special permissions. If creation fails, try running PowerShell as administrator.

## Getting Help

- Report issues: https://github.com/kaivyy/perseus/issues
- Main documentation: https://github.com/kaivyy/perseus
