import asyncio

from textual.app import App, ComposeResult
from textual.widgets import Header, Footer, Input, Static, RichLog
from textual.containers import Container
from textual import events

from void.core.chat import ChatEngine
from void.workspace.detector import current_workspace
from void.config.settings import load_settings
from void.ui.commands import CommandRegistry
from void.ai.providers import PROVIDER_NAMES


class CommandPalette(Static):
    pass


class VoidCodeUI(App):

    CSS = """
    Screen {
        background: black;
    }

    #chat {
        height: 1fr;
        background: black;
        color: white;
    }

    #input {
        dock: bottom;
    }

    #status {
        dock: bottom;
        height: 1;
        background: #111;
        color: grey;
        padding: 0 1;
    }

    #palette {
        layer: overlay;
        align: center middle;
        width: 60%;
        height: 50%;
        background: #111;
        border: solid green;
        display: none;
        padding: 1;
    }
    """

    def __init__(self):
        super().__init__()

        self.workspace = current_workspace()
        self.chat = ChatEngine(self.workspace)

        self.registry = CommandRegistry()
        self.commands = self.registry.list()

        self.selected_index = 0
        self.palette_open = False

    # ---------------- UI ----------------

    def compose(self) -> ComposeResult:
        yield Header()

        yield RichLog(id="chat", wrap=True, auto_scroll=True)

        yield Input(placeholder="Type... ( / for menu )", id="input")

        yield Static(self._status(), id="status")

        yield CommandPalette(self._render_palette(), id="palette")

        yield Footer()

    # ---------------- STATUS ----------------

    def _status(self):
        s = load_settings()
        prov = s.get("provider", "?")
        name = PROVIDER_NAMES.get(prov, prov)
        return f"📂 {self.workspace.name} | 🤖 {name} | 🧠 {s.get('model')} | ⚙ {s.get('mode')}"

    # ---------------- CHAT OUTPUT ----------------

    async def stream_text(self, chat, text: str):

        # simulate AI thinking/typing
        output = ""

        for word in text.split():
            output += word + " "
            chat.write(output)
            await asyncio.sleep(0.03)

    # ---------------- INPUT ----------------

    async def on_input_submitted(self, event: Input.Submitted):

        text = event.value.strip()
        event.input.value = ""

        chat = self.query_one("#chat", RichLog)

        if text == "/":
            self.open_palette()
            return

        if text == "/new":
            self.chat.clear_history()
            chat.clear()
            chat.write("Conversation cleared. Starting fresh.\n")
            return

        if text == "/help":
            chat.write(
                "Commands:\n"
                "  /        Open command palette\n"
                "  /new     Start a new conversation\n"
                "  /help    Show this help\n"
                "Just type anything to chat with the AI.\n"
            )
            return

        msg_count = len(self.chat.ai.engine.history.messages)
        chat.write(f"\nYou ({msg_count//2 + 1}): {text}\n")

        response = self.chat.handle(text)

        chat.write("\nVOIDCODE:\n")

        if isinstance(response, str):
            await self.stream_text(chat, response)
        else:
            chat.write(str(response))

        status = self.query_one("#status", Static)
        status.update(self._status())

    # ---------------- PALETTE ----------------

    def open_palette(self):
        self.palette_open = True
        self.query_one("#palette", CommandPalette).styles.display = "block"
        self.refresh_palette()

    def close_palette(self):
        self.palette_open = False
        self.query_one("#palette", CommandPalette).styles.display = "none"

    def _render_palette(self):
        out = "COMMAND PALETTE\n\n"

        for i, cmd in enumerate(self.commands):
            prefix = "▶ " if i == self.selected_index else "  "
            out += f"{prefix}{cmd.name}\n"

        out += "\n↑ ↓ navigate | ENTER select | ESC close"
        return out

    def refresh_palette(self):
        self.query_one("#palette", CommandPalette).update(self._render_palette())

    # ---------------- KEY EVENTS ----------------

    def on_key(self, event: events.Key):

        if event.key == "escape" and self.palette_open:
            self.close_palette()
            return

        if self.palette_open:

            if event.key == "down":
                self.selected_index = (self.selected_index + 1) % len(self.commands)
                self.refresh_palette()

            elif event.key == "up":
                self.selected_index = (self.selected_index - 1) % len(self.commands)
                self.refresh_palette()

            elif event.key == "enter":
                result = self.commands[self.selected_index].action()
                self.close_palette()

                chat = self.query_one("#chat", RichLog)
                chat.write(f"\n⚙ SYSTEM: {result}\n")

                status = self.query_one("#status", Static)
                status.update(self._status())
