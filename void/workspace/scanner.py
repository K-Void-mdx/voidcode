from pathlib import Path

IGNORE_DIRS = {
    ".git",
    ".venv",
    "__pycache__",
    "node_modules",
}


def scan_workspace(workspace: Path):
    """
    Scan every file inside the workspace.
    """

    for item in workspace.rglob("*"):
        if any(part in IGNORE_DIRS for part in item.parts):
            continue

        yield item
