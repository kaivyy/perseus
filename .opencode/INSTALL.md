# Installing Perseus for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed
- Git installed

## Installation Steps

### 1. Clone Perseus

```bash
git clone https://github.com/kaivy/perseus.git ~/.config/opencode/perseus
```

### 2. Register the Plugin

Create a symlink so OpenCode discovers the plugin:

```bash
mkdir -p ~/.config/opencode/plugins
rm -f ~/.config/opencode/plugins/perseus.js
ln -s ~/.config/opencode/perseus/.opencode/plugins/perseus.js ~/.config/opencode/plugins/perseus.js
```

### 3. Symlink Skills

Create a symlink so OpenCode's native skill tool discovers perseus skills:

```bash
mkdir -p ~/.config/opencode/skills
rm -rf ~/.config/opencode/skills/perseus
ln -s ~/.config/opencode/perseus/skills ~/.config/opencode/skills/perseus
```

### 4. Restart OpenCode

Restart OpenCode. The plugin will automatically inject perseus context.

Verify by asking: "do you have perseus?"

## Usage

### Finding Skills

Use OpenCode's native `skill` tool to list available skills:

```
use skill tool to list skills
```

### Loading a Skill

Use OpenCode's native `skill` tool to load a specific skill:

```
use skill tool to load perseus/scan
```

### Personal Skills

Create your own skills in `~/.config/opencode/skills/`:

```bash
mkdir -p ~/.config/opencode/skills/my-skill
```

Create `~/.config/opencode/skills/my-skill/SKILL.md`:

```markdown
---
name: my-skill
description: Use when [condition] - [what it does]
---

# My Skill

[Your skill content here]
```

### Project Skills

Create project-specific skills in `.opencode/skills/` within your project.

**Skill Priority:** Project skills > Personal skills > Perseus skills

## Updating

```bash
cd ~/.config/opencode/perseus
git pull
```

## Troubleshooting

### Plugin not loading

1. Check plugin symlink: `ls -l ~/.config/opencode/plugins/perseus.js`
2. Check source exists: `ls ~/.config/opencode/perseus/.opencode/plugins/perseus.js`
3. Check OpenCode logs for errors

### Skills not found

1. Check skills symlink: `ls -l ~/.config/opencode/skills/perseus`
2. Verify it points to: `~/.config/opencode/perseus/skills`
3. Use `skill` tool to list what's discovered

### Tool mapping

When skills reference Claude Code tools:
- `TodoWrite` → `update_plan`
- `Task` with subagents → `@mention` syntax
- `Skill` tool → OpenCode's native `skill` tool
- File operations → your native tools

## Getting Help

- Report issues: https://github.com/kaivy/perseus/issues
- Full documentation: https://github.com/kaivy/perseus/blob/main/docs/README.opencode.md
