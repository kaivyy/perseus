# Perseus for Antigravity CLI (agy)

Complete guide for using Perseus with [Google Antigravity CLI (`agy`)](https://github.com/google/antigravity).

## Quick Install

In your terminal:

```bash
# Option 1: Native plugin install
agy plugin install kaivyy/perseus

# Option 2: Clone and run post-install
git clone https://github.com/kaivyy/perseus.git
bash perseus/scripts/post-install.sh
```

## How It Works

Antigravity CLI discovers skills adhering to the [Agent Skills specification](https://agentskills.io/specification).
Perseus includes `.antigravity-plugin/plugin.json` and top-level skill symlinks in `skills/` so all 15 skills are discovered automatically:

- `perseus-start` (Full assessment orchestrator)
- `perseus-scan` (Reconnaissance)
- `perseus-audit` (Deep vulnerability analysis)
- `perseus-exploit` (Defensive verification & PoCs)
- `perseus-report` (Executive reporting, unified diffs, and SARIF export)
- `using-perseus` (Usage guide and workflow rules)
- 8 specialist skills (`perseus-api`, `perseus-injection`, `perseus-crypto`, `perseus-supply-chain`, `perseus-file`, `perseus-logic`, `perseus-client`, `perseus-config`) and `perseus-specialist`

## Usage in Antigravity

In any project workspace, run `agy` and prompt:

```text
Gunakan skill perseus-start untuk audit keamanan kode ini
```

Or run targeted phases:

```text
Gunakan skill perseus-scan untuk mapping attack surface
```

```text
Gunakan skill perseus-report untuk generate laporan keamanan
```

## Verification

To verify that Perseus is properly recognized by Antigravity CLI:

```bash
agy plugin validate /path/to/perseus
```
You should see:
`skills 15 · agents 0 · rules 0 · hooks 0 · mcpServers 0 · sidecars 0`
`✔ Validation passed`
