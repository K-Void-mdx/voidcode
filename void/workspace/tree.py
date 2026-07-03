from pathlib import Path

from rich.tree import Tree

IGNORE_DIRS = {
    ".git",
    ".venv",
    "__pycache__",
    "node_modules",
}


def build_tree(workspace: Path) -> Tree:
    """
    Build a visual tree of the workspace.
    """

    tree = Tree(f"📂 {workspace.name}")

    _add_directory(tree, workspace)

    return tree


def _add_directory(branch, directory: Path):
    """
    Recursively add folders and files to the tree.
    """

    entries = sorted(
        directory.iterdir(),
        key=lambda item: (item.is_file(), item.name.lower())
    )

    for item in entries:

        if item.name in IGNORE_DIRS:
            continue

        if item.is_dir():

            child = branch.add(f"📂 {item.name}")

            _add_directory(child, item)

        else:

            branch.add(f"📄 {item.name}")
