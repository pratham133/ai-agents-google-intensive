#!/usr/bin/env python3
"""validate_tool_call.py — PreToolUse gate for run_command.

Invoked by the agent runtime before every run_command execution.
Reads the pending tool call from stdin as JSON, checks the command
against an allowlist, and exits:
  0  → allow the command to proceed
  1  → block the command (agent sees the stderr message as an error)

Usage (by the hooks runtime):
    python3 .agents/scripts/validate_tool_call.py < tool_call.json
"""

import json
import re
import sys

# ---------------------------------------------------------------------------
# Allowlist — add entries here to explicitly permit a command prefix.
# Each entry is a regex pattern matched against the full command string.
# Keep this list minimal; prefer denying by default.
# ---------------------------------------------------------------------------
ALLOWED_PATTERNS: list[str] = [
    r"^uv\s+run\b",          # uv run <anything>  (project venv commands)
    r"^agents-cli\b",        # agents-cli subcommands
    r"^git\s+(status|log|diff|add|commit|push|pull)\b",  # safe git ops
    r"^pre-commit\b",        # pre-commit hooks
    r"^pytest\b",            # test runner
]

# ---------------------------------------------------------------------------
# Blocklist — explicit deny patterns evaluated before the allowlist.
# A match here always blocks, even if an allowlist entry would match.
# ---------------------------------------------------------------------------
BLOCKED_PATTERNS: list[str] = [
    r"\brm\s+-rf\b",         # destructive remove
    r"\bcurl\b.*\|\s*(ba)?sh",  # curl-pipe-to-shell
    r"\bwget\b.*\|\s*(ba)?sh",
    r"\bpowershell\b.*-EncodedCommand\b",  # encoded PS payloads
    r"\beval\b",             # eval execution
    r"\bos\.system\b",       # raw os.system in scripts
    r">\s*/dev/sd[a-z]",     # direct disk writes
]


def _load_tool_call() -> dict:
    """Read the tool-call payload from stdin."""
    try:
        raw = sys.stdin.read()
        if not raw.strip():
            return {}
        return json.loads(raw)
    except json.JSONDecodeError:
        return {}


def _extract_command(payload: dict) -> str:
    """Pull the command string from the tool-call payload."""
    # Support both flat {"command": "..."} and nested ADK structures
    if "command" in payload:
        return str(payload["command"])
    if "input" in payload and "command" in payload["input"]:
        return str(payload["input"]["command"])
    if "tool_input" in payload and "command" in payload["tool_input"]:
        return str(payload["tool_input"]["command"])
    return ""


def validate(command: str) -> tuple[bool, str]:
    """Return (allowed: bool, reason: str).

    Evaluation order:
      1. Empty command  → allow (nothing to block)
      2. Blocklist      → deny immediately
      3. Allowlist      → allow if any pattern matches
      4. Default        → deny (fail-closed)
    """
    if not command.strip():
        return True, "empty command — allowed"

    for pattern in BLOCKED_PATTERNS:
        if re.search(pattern, command, re.IGNORECASE):
            return False, f"blocked by deny-pattern: {pattern!r}"

    for pattern in ALLOWED_PATTERNS:
        if re.search(pattern, command, re.IGNORECASE):
            return True, f"allowed by pattern: {pattern!r}"

    return False, (
        "command not in allowlist — blocked by default-deny policy. "
        "To permit this command, add a pattern to ALLOWED_PATTERNS in "
        ".agents/scripts/validate_tool_call.py and update hooks.json."
    )


def main() -> None:
    payload = _load_tool_call()
    command = _extract_command(payload)

    allowed, reason = validate(command)

    if allowed:
        # Exit 0 → runtime proceeds with the tool call
        sys.exit(0)
    else:
        # Exit 1 → runtime blocks the tool call and surfaces the message
        print(
            f"[hooks/validate_tool_call] BLOCKED: {command!r}\n"
            f"Reason: {reason}",
            file=sys.stderr,
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
