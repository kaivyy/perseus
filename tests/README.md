# Perseus Plugin Tests

This directory contains automated tests to verify the integrity of the Perseus plugin.

## Usage

Run the test suite:

```bash
./tests/run-tests.sh
```

## What is tested?

1.  **File Structure:** Ensures all required metadata files (.claude-plugin, .codex, etc.) exist.
2.  **Skills:** Verifies that all Perseus skills (scan, audit, exploit, report, using-perseus) exist and contain valid YAML frontmatter.
3.  **Commands:** Verifies that all slash commands exist and are properly formatted.
