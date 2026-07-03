from rich.panel import Panel

from void.ui.theme import (
    WELCOME_BORDER,
    WELCOME_TITLE,
    PRIMARY_COLOR,
)


def welcome_banner():
    return Panel(
        f"[{PRIMARY_COLOR}]Welcome to VOIDCODE[/{PRIMARY_COLOR}]\n\n"
        "Version: 0.1.0\n"
        "Stage: Foundation\n\n"
        "Building the brain before the intelligence.",
        title=WELCOME_TITLE,
        border_style=WELCOME_BORDER,
    )
