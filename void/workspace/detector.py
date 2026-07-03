from pathlib import Path


def current_workspace() -> Path:
    """
    Return the directory where VOIDCODE was launched.
    """
    return Path.cwd()
