#!/usr/bin/env bash
#
# Perseus Security Skills - Uninstall Script
#
# This script removes Perseus patches from security-guidance plugin
# and restores original hook behavior.
#
# Usage: ./scripts/uninstall.sh
#

set -euo pipefail

echo "🛡️  Perseus Security Skills - Uninstall"
echo "========================================"

# Detect OS and set paths
if [[ "$OSTYPE" == "darwin"* ]]; then
    CLAUDE_DIR="$HOME/.claude"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    CLAUDE_DIR="$HOME/.claude"
else
    CLAUDE_DIR="$HOME/.claude"
fi

# Possible locations for security-guidance hook backup
HOOK_LOCATIONS=(
    "$CLAUDE_DIR/plugins/marketplaces/claude-plugins-official/plugins/security-guidance/hooks/security_reminder_hook.py"
    "$CLAUDE_DIR/plugins/cache/claude-plugins-official/security-guidance/*/hooks/security_reminder_hook.py"
)

restore_hook() {
    local hook_file="$1"
    local backup_file="${hook_file}.perseus-backup"

    if [[ -f "$backup_file" ]]; then
        echo "📍 Restoring backup: $backup_file"
        mv "$backup_file" "$hook_file"
        echo "✅ Restored original hook"
        return 0
    else
        echo "ℹ️  No backup found for: $hook_file"
        return 0
    fi
}

# Find and restore hooks
for pattern in "${HOOK_LOCATIONS[@]}"; do
    for hook_file in $pattern; do
        if [[ -f "$hook_file" ]]; then
            restore_hook "$hook_file"
        fi
    done
done

# Remove Perseus symlinks from skills
echo ""
echo "🔗 Removing Perseus skill symlinks..."

PERSEUS_SKILLS=(
    "perseus-scan"
    "perseus-audit"
    "perseus-exploit"
    "perseus-report"
    "perseus-start"
    "perseus-help"
    "perseus-api"
    "perseus-injection"
    "perseus-crypto"
    "perseus-supply-chain"
    "perseus-file"
    "perseus-logic"
    "perseus-client"
    "perseus-config"
    "perseus-specialist"
)

for skill in "${PERSEUS_SKILLS[@]}"; do
    skill_link="$CLAUDE_DIR/skills/$skill"
    if [[ -L "$skill_link" ]]; then
        rm "$skill_link"
        echo "  Removed: $skill"
    fi
done

# Remove plugin symlink
plugin_link="$CLAUDE_DIR/plugins/perseus"
if [[ -L "$plugin_link" ]]; then
    rm "$plugin_link"
    echo "  Removed plugin symlink"
fi

echo ""
echo "✅ Perseus uninstalled successfully!"
echo ""
echo "Note: The Perseus source files are still in place."
echo "To completely remove, delete the perseus directory."
