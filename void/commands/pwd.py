from rich.console import Console

console = Console()


def run(session):
    """
    Show the current workspace path.
    """

    console.print(f"\n📂 Current Workspace:\n{session.workspace_path}\n")
