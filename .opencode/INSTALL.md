# Installing Perseus for OpenCode

One-command installation with automatic setup.

## Quick Install

```bash
git clone https://github.com/kaivyy/perseus.git ~/.config/opencode/perseus && \
  mkdir -p ~/.config/opencode/plugins ~/.config/opencode/skills && \
  ln -sf ~/.config/opencode/perseus/.opencode/plugins/perseus.js ~/.config/opencode/plugins/perseus.js && \
  ln -sf ~/.config/opencode/perseus/skills ~/.config/opencode/skills/perseus
```

Then restart OpenCode.

## Verify Installation

```bash
ls -la ~/.config/opencode/plugins/perseus.js
ls -la ~/.config/opencode/skills/perseus
```

## Usage

Use OpenCode's native `skill` tool:

```
use skill tool to load perseus/scan
use skill tool to load perseus/start
```

Or ask: "do you have perseus?"

## Updating

```bash
cd ~/.config/opencode/perseus && git pull
```

## Uninstalling

```bash
rm ~/.config/opencode/plugins/perseus.js
rm -rf ~/.config/opencode/skills/perseus
rm -rf ~/.config/opencode/perseus
```
