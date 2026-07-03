from pathlib import Path


def inspect_workspace(workspace: Path) -> dict:
    """
    Inspect the current workspace and return basic information.
    """

    files = 0
    folders = 0

    for item in workspace.iterdir():
        if item.is_file():
            files += 1
        elif item.is_dir():
            folders += 1

    return {
        "name": workspace.name,
        "path": str(workspace),
        "files": files,
        "folders": folders,
        "python": (workspace / "pyproject.toml").exists(),
        "git": (workspace / ".git").exists(),
        "readme": (workspace / "README.md").exists(),
    }
