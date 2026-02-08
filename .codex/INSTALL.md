# Installing Perseus for Codex

Enable perseus skills in Codex via native skill discovery. Just clone and symlink.

## Prerequisites

- Git

## Installation

1. **Clone the perseus repository:**
   ```bash
   git clone https://github.com/kaivy/perseus.git ~/.codex/perseus
   ```

2. **Create the skills symlink:**
   ```bash
   mkdir -p ~/.agents/skills
   ln -s ~/.codex/perseus/skills ~/.agents/skills/perseus
   ```

   **Windows (PowerShell):**
   ```powershell
   New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.agents\skills"
   cmd /c mklink /J "$env:USERPROFILE\.agents\skills\perseus" "$env:USERPROFILE\.codex\perseus\skills"
   ```

3. **Restart Codex** (quit and relaunch the CLI) to discover the skills.

## Migrating from old bootstrap

If you installed perseus before native skill discovery, you need to:

1. **Update the repo:**
   ```bash
   cd ~/.codex/perseus && git pull
   ```

2. **Create the skills symlink** (step 2 above) — this is the new discovery mechanism.

3. **Remove the old bootstrap block** from `~/.codex/AGENTS.md` — any block referencing `perseus-codex bootstrap` is no longer needed.

4. **Restart Codex.**

## Verify

```bash
ls -la ~/.agents/skills/perseus
```

You should see a symlink (or junction on Windows) pointing to your perseus skills directory.

## Updating

```bash
cd ~/.codex/perseus && git pull
```

Skills update instantly through the symlink.

## Uninstalling

```bash
rm ~/.agents/skills/perseus
```

Optionally delete the clone: `rm -rf ~/.codex/perseus`.
