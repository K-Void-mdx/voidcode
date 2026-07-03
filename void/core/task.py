from dataclasses import dataclass, field
from typing import List, Literal


Risk = Literal["safe", "warning", "danger"]


@dataclass
class TaskStep:
    action: str
    target: str = ""
    risk: Risk = "safe"


@dataclass
class Task:
    goal: str
    steps: List[TaskStep] = field(default_factory=list)

    def add_step(self, action, target="", risk="safe"):
        self.steps.append(TaskStep(action, target, risk))

    def summary(self):
        return {
            "goal": self.goal,
            "steps": [
                {
                    "action": s.action,
                    "target": s.target,
                    "risk": s.risk
                }
                for s in self.steps
            ]
        }
