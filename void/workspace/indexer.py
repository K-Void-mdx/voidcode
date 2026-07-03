from pathlib import Path
import json

IGNORE_DIRS = {".venv", "__pycache__", ".git", "node_modules"}


def build_index(root_path: Path):
    """
    Scan workspace once and build a file index.
    """

    index = []

    for file_path in root_path.rglob("*"):

        if any(part in IGNORE_DIRS for part in file_path.parts):
            continue

        if file_path.is_file():
            index.append(str(file_path.relative_to(root_path)))

    return index


def save_index(root_path: Path, index):
    """
    Save index to disk.
    """
    index_file = root_path / ".void_index.json"

    with open(index_file, "w") as f:
        json.dump(index, f, indent=2)


def load_index(root_path: Path):
    """
    Load index if it exists.
    """
    index_file = root_path / ".void_index.json"

    if not index_file.exists():
        return None

    with open(index_file, "r") as f:
        return json.load(f)
