from rich.console import Console
from pathlib import Path
import json

console = Console()


def load_index(root: Path):
    index_file = root / ".void_index.json"
    if not index_file.exists():
        return None

    with open(index_file, "r") as f:
        return json.load(f)


def run(session, query=None):
    """
    Search using pre-built project index (fast version).
    """

    if not query:
        console.print("\n❌ Usage: /search <text>\n")
        return

    root = Path(session.workspace)

    index = load_index(root)

    if not index:
        console.print("\n❌ No index found. Restart VOIDCODE.\n")
        return

    results = []

    for relative_path in index:

        file_path = root / relative_path

        if not file_path.exists():
            continue

        try:
            content = file_path.read_text(errors="ignore")
        except:
            continue

        for i, line in enumerate(content.splitlines(), start=1):
            if query in line:
                results.append(f"{relative_path}:{i}: {line.strip()}")

    if not results:
        console.print(f"\n❌ No results found for: {query}\n")
        return

    console.print(f"\n🔍 INDEX SEARCH: {query}\n")
    console.print("-" * 50)

    for r in results[:80]:
        console.print(r)

    console.print("-" * 50)
