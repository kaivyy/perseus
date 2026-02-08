# Installing Perseus for Codex

One-command installation with automatic setup.

## Quick Install

```bash
git clone https://github.com/kaivyy/perseus.git ~/.codex/perseus && ~/.codex/perseus/scripts/post-install.sh
```

That's it! The script automatically:
- Creates skill symlinks in `~/.agents/skills/`
- Patches security hooks (if installed)

## Windows (PowerShell)

```powershell
git clone https://github.com/kaivyy/perseus.git "$env:USERPROFILE\.codex\perseus"
& "$env:USERPROFILE\.codex\perseus\scripts\post-install.sh"
```

## Verify Installation

```bash
ls -la ~/.agents/skills/perseus*
```

## Usage

```
/start       - Full automated assessment
/scan        - Phase 1: Reconnaissance
/audit       - Phase 2: Vulnerability Analysis
/exploit     - Phase 3: PoC Verification
/report      - Phase 4: Executive Report
/specialist  - All 8 specialists
```

## Updating

```bash
cd ~/.codex/perseus && git pull
```

## Uninstalling

```bash
~/.codex/perseus/scripts/uninstall.sh
rm -rf ~/.codex/perseus
```
