from rich.console import Console

from void.workspace.tree import build_tree

console = Console()


def run(session):
    """
    Display the project tree.
    """

    console.print()
    console.print(build_tree(session.workspace))
