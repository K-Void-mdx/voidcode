from rich.console import Console
from void.core.chat import ChatEngine

console = Console()


class VoidShell:
    def __init__(self, workspace):
        self.chat = ChatEngine(workspace)

    def start(self):
        console.print("\n🚀 VOIDCODE ACTIVE\n", style="bold cyan")
        console.print("Type anything. No commands needed.\n")

        while True:
            try:
                user_input = console.input("│ ")

                if user_input.lower() in ["exit", "quit"]:
                    console.print("\n👋 Goodbye!\n")
                    break

                response = self.chat.handle(user_input)

                console.print("\n🤖 VOIDCODE:\n", style="bold green")
                console.print(response)

                console.print("\n" + "-" * 50 + "\n")

            except KeyboardInterrupt:
                console.print("\n\n👋 Interrupted\n")
                break
