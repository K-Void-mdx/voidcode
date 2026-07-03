from dataclasses import dataclass, field


@dataclass
class AIRequest:
    """
    A request sent to an AI provider.
    """

    prompt: str
    context: str = ""
    history: list = field(default_factory=list)
    model: str | None = None
    temperature: float = 0.2
