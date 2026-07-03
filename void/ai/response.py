from dataclasses import dataclass


@dataclass
class AIResponse:
    """
    A normalized AI response.
    """

    success: bool
    content: str
    raw: dict | None = None
