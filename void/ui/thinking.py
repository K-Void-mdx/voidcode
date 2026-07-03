from rich.console import Console
import time

console = Console()


def thinking(message="Thinking"):
    """
    Fake animation placeholder (we improve later)
    """
    dots = ["", ".", "..", "...", "...."]

    for i in range(5):
        console.print(f"\r🧠 {message}{dots[i % len(dots)]}", end="")
        time.sleep(0.2)

    print("\n")
