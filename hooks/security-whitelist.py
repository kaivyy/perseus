#!/usr/bin/env python3
"""
Perseus Security Whitelist Hook

This hook allows writing to Perseus skills directories without triggering
security warnings from other plugins. Security documentation files need
to reference dangerous patterns for educational/detection purposes.

Whitelisted paths:
- skills/perseus/** (skill definitions)
- deliverables/** (assessment outputs)
"""

import json
import os
import sys

# Whitelist patterns - files in these paths are allowed to contain security patterns
WHITELIST_PATTERNS = [
    "skills/perseus/",
    "skills/",
    "deliverables/",
    "/perseus/skills/",
    "/perseus/deliverables/",
    "SKILL.md",
    "_analysis.md",
    "SECURITY_REPORT.md",
]


def is_whitelisted(file_path):
    """Check if file path is in whitelist."""
    if not file_path:
        return False

    normalized_path = file_path.replace("\\", "/")

    for pattern in WHITELIST_PATTERNS:
        if pattern in normalized_path:
            return True

    return False


def main():
    """Main hook function."""
    try:
        raw_input = sys.stdin.read()
        input_data = json.loads(raw_input)
    except json.JSONDecodeError:
        sys.exit(0)  # Allow if can't parse

    tool_name = input_data.get("tool_name", "")
    tool_input = input_data.get("tool_input", {})

    # Only check file tools
    if tool_name not in ["Edit", "Write", "MultiEdit"]:
        sys.exit(0)

    file_path = tool_input.get("file_path", "")

    # If whitelisted, set environment variable to disable other security hooks
    if is_whitelisted(file_path):
        # Output nothing, just allow
        sys.exit(0)

    # For non-whitelisted files, allow and let other hooks handle
    sys.exit(0)


if __name__ == "__main__":
    main()
