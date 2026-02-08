# Perseus for OpenCode

Complete guide for using Perseus with [OpenCode.ai](https://opencode.ai).

## Quick Install

Tell OpenCode:

```
Clone https://github.com/kaivyy/perseus to ~/.config/opencode/perseus, then create directory ~/.config/opencode/plugins, then symlink ~/.config/opencode/perseus/.opencode/plugins/perseus.js to ~/.config/opencode/plugins/perseus.js, then symlink ~/.config/opencode/perseus/skills to ~/.config/opencode/skills/perseus, then restart opencode.
```

## Manual Installation

### Prerequisites

- [OpenCode.ai](https://opencode.ai) installed
- Git installed

### macOS / Linux

```bash
# 1. Install Perseus (or update existing)
if [ -d ~/.config/opencode/perseus ]; then
  cd ~/.config/opencode/perseus && git pull
else
  git clone https://github.com/kaivyy/perseus.git ~/.config/opencode/perseus
fi

# 2. Create directories
mkdir -p ~/.config/opencode/plugins ~/.config/opencode/skills

# 3. Remove old symlinks if they exist
rm -f ~/.config/opencode/plugins/perseus.js
rm -rf ~/.config/opencode/skills/perseus

# 4. Create symlinks
ln -s ~/.config/opencode/perseus/.opencode/plugins/perseus.js ~/.config/opencode/plugins/perseus.js
ln -s ~/.config/opencode/perseus/skills ~/.config/opencode/skills/perseus

# 5. Restart OpenCode
```

#### Verify Installation

```bash
ls -l ~/.config/opencode/plugins/perseus.js
ls -l ~/.config/opencode/skills/perseus
```

Both should show symlinks pointing to the perseus directory.

### Windows

**Prerequisites:**
- Git installed
- Either **Developer Mode** enabled OR **Administrator privileges**
  - Windows 10: Settings → Update & Security → For developers
  - Windows 11: Settings → System → For developers

#### PowerShell

Run as Administrator, or with Developer Mode enabled:

```powershell
# 1. Install Perseus
git clone https://github.com/kaivyy/perseus.git "$env:USERPROFILE\.config\opencode\perseus"

# 2. Create directories
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.config\opencode\plugins"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.config\opencode\skills"

# 3. Remove existing links (safe for reinstalls)
Remove-Item "$env:USERPROFILE\.config\opencode\plugins\perseus.js" -Force -ErrorAction SilentlyContinue
Remove-Item "$env:USERPROFILE\.config\opencode\skills\perseus" -Force -ErrorAction SilentlyContinue

# 4. Create plugin symlink (requires Developer Mode or Admin)
New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.config\opencode\plugins\perseus.js" -Target "$env:USERPROFILE\.config\opencode\perseus\.opencode\plugins\perseus.js"

# 5. Create skills junction (works without special privileges)
New-Item -ItemType Junction -Path "$env:USERPROFILE\.config\opencode\skills\perseus" -Target "$env:USERPROFILE\.config\opencode\perseus\skills"

# 6. Restart OpenCode
```

#### Command Prompt

Run as Administrator, or with Developer Mode enabled:

```cmd
:: 1. Install Perseus
git clone https://github.com/kaivyy/perseus.git "%USERPROFILE%\.config\opencode\perseus"

:: 2. Create directories
mkdir "%USERPROFILE%\.config\opencode\plugins" 2>nul
mkdir "%USERPROFILE%\.config\opencode\skills" 2>nul

:: 3. Remove existing links
del "%USERPROFILE%\.config\opencode\plugins\perseus.js" 2>nul
rmdir "%USERPROFILE%\.config\opencode\skills\perseus" 2>nul

:: 4. Create plugin symlink (requires Developer Mode or Admin)
mklink "%USERPROFILE%\.config\opencode\plugins\perseus.js" "%USERPROFILE%\.config\opencode\perseus\.opencode\plugins\perseus.js"

:: 5. Create skills junction
mklink /J "%USERPROFILE%\.config\opencode\skills\perseus" "%USERPROFILE%\.config\opencode\perseus\skills"

:: 6. Restart OpenCode
```

#### Verify Installation

**PowerShell:**
```powershell
Get-ChildItem "$env:USERPROFILE\.config\opencode\plugins" | Where-Object { $_.LinkType }
Get-ChildItem "$env:USERPROFILE\.config\opencode\skills" | Where-Object { $_.LinkType }
```

Look for `<SYMLINK>` or `<JUNCTION>` in the output.

## Usage

### Finding Skills

Use OpenCode's native `skill` tool to list all available skills:

```
use skill tool to list skills
```

### Loading a Skill

Use OpenCode's native `skill` tool to load a specific skill:

```
use skill tool to load perseus/scan
use skill tool to load perseus/start
```

Or ask: "do you have perseus?"

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
| `perseus/specialists/api` | API, GraphQL, WebSocket, OAuth |
| `perseus/specialists/injection` | NoSQL, SSTI, Log4j |
| `perseus/specialists/crypto` | JWT, Hashing, Encryption |
| `perseus/specialists/supply-chain` | CVEs, Dependencies |
| `perseus/specialists/file-security` | Path Traversal, XXE |
| `perseus/specialists/logic` | Race Conditions, AI Security |
| `perseus/specialists/client` | React, Next.js, Vue |
| `perseus/specialists/config` | Docker, CI/CD, Cloud, K8s |

## Tool Mapping

When skills reference Claude Code tools, substitute OpenCode equivalents:

| Claude Code | OpenCode |
|-------------|----------|
| `TodoWrite` | `update_plan` |
| `Task` with subagents | `@mention` syntax |
| `Skill` tool | Native `skill` tool |
| `Read`, `Write`, `Edit`, `Bash` | Native tools |

## Updating

```bash
cd ~/.config/opencode/perseus && git pull
```

Restart OpenCode to load updates.

## Uninstalling

```bash
rm ~/.config/opencode/plugins/perseus.js
rm -rf ~/.config/opencode/skills/perseus
rm -rf ~/.config/opencode/perseus
```

## Troubleshooting

### Plugin not loading

1. Check plugin exists: `ls ~/.config/opencode/perseus/.opencode/plugins/perseus.js`
2. Check symlink: `ls -l ~/.config/opencode/plugins/`
3. Check OpenCode logs for errors

### Skills not found

1. Verify skills symlink: `ls -l ~/.config/opencode/skills/perseus`
2. Use `skill` tool to list available skills
3. Check skill structure: each skill needs `SKILL.md` with valid frontmatter

### Windows: "You do not have sufficient privilege" error

- Enable Developer Mode in Windows Settings, OR
- Right-click terminal → "Run as Administrator"

## Getting Help

- Report issues: https://github.com/kaivyy/perseus/issues
- Full documentation: https://github.com/kaivyy/perseus
