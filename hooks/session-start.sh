#!/usr/bin/env bash
# SessionStart hook for Perseus plugin
# Injects Perseus context into Claude Code session

set -eo pipefail

# Determine plugin root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Read using-perseus content
using_perseus_content=$(cat "${PLUGIN_ROOT}/skills/perseus/using-perseus/SKILL.md" 2>&1 || echo "Error reading using-perseus skill")

# Escape string for JSON embedding
escape_for_json() {
    local s="$1"
    s="${s//\\/\\\\}"
    s="${s//\"/\\\"}"
    s="${s//$'\n'/\\n}"
    s="${s//$'\r'/\\r}"
    s="${s//$'\t'/\\t}"
    printf '%s' "$s"
}

using_perseus_escaped=$(escape_for_json "$using_perseus_content")

# Output context injection as JSON
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "<EXTREMELY_IMPORTANT>\nYou have Perseus Security Skills.\n\n**Quick Commands:**\n- /start - Full automated assessment\n- /scan - Reconnaissance\n- /report - Executive report\n- /specialist - Run all specialist skills\n\n**Below is the full content of your 'perseus:using-perseus' skill:**\n\n${using_perseus_escaped}\n</EXTREMELY_IMPORTANT>"
  }
}
EOF

exit 0
