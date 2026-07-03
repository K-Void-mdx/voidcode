from enum import Enum


class Intent(Enum):
    CHAT = "chat"
    EDIT = "edit"
    PLAN = "plan"


def detect_intent(message: str) -> Intent:
    msg = message.lower()

    if any(word in msg for word in ["fix", "edit", "update", "bug", "refactor"]):
        return Intent.EDIT

    if any(word in msg for word in ["plan", "design", "architecture", "structure"]):
        return Intent.PLAN

    return Intent.CHAT
