from rich.console import Console

console = Console()


def run(workspace=None):
    """Display available commands."""

    console.print()

    console.print("[bold cyan]Available Commands[/bold cyan]\n")

    console.print("  /help    Show this help menu")
    console.print("  /pwd     Show current workspace")
    console.print("  /tree    Show project tree")
    console.print("  /exit    Exit VOIDCODE")

    console.print()
