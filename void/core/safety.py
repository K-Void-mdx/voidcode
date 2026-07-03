from typing import List


DANGEROUS_KEYWORDS = [
    ".env",
    "password",
    "secret",
    "token",
    "rm -rf",
    "delete",
    "overwrite",
    "reset",
    "config"
]


def is_dangerous(text: str) -> bool:
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in DANGEROUS_KEYWORDS)


def scan_task_safety(task) -> List[str]:
    """
    Returns list of risky steps.
    """

    risky_steps = []

    for step in task.steps:
        combined = f"{step.action} {step.target}"

        if is_dangerous(combined) or step.risk == "danger":
            risky_steps.append(combined)

    return risky_steps
