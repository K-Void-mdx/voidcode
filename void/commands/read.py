from rich.console import Console

from void.tools.read import ReadTool

console = Console()


def run(session, args):

    if not args:
        console.print("\n❌ Usage: /read <filename>\n")
        return

    tool = ReadTool(session.workspace)

    result = tool.run(args[0])

    if not result["success"]:
        console.print(f"\n❌ {result['error']}\n")
        return

    console.print(f"\n📄 File: {args[0]}\n")

    console.print("-" * 50)
    console.print(result["content"])
    console.print("-" * 50)
