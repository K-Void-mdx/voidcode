from rich.console import Console
from pathlib import Path

from void.core.planner import create_task
from void.core.safety import scan_task_safety
from void.core.executor import ExecutionPlan

console = Console()


def run(session, goal=None):
    if not goal:
        console.print("\n❌ Usage: /run <goal>\n")
        return

    task = create_task(goal)

    console.print("\n🧠 TASK CREATED\n", style="bold cyan")
    console.print(f"🎯 Goal: {task.goal}\n")

    console.print("📋 Steps:\n", style="bold")

    for i, step in enumerate(task.steps, start=1):
        icon = {
            "safe": "🟢",
            "warning": "🟡",
            "danger": "🔴"
        }[step.risk]

        console.print(f"{i}. {icon} {step.action}")

    risky = scan_task_safety(task)

    if risky:
        console.print("\n⚠️ SAFETY WARNING:", style="bold red")
        for r in risky:
            console.print(f" - {r}")
        console.print("\n❌ Execution blocked\n")
        return

    # 🧪 EXECUTION SIMULATION
    plan = ExecutionPlan(task)

    root = Path(session.workspace)

    sample_file = root / "void" / "app.py"

    if sample_file.exists():
        before = sample_file.read_text()

        # fake modification (for now)
        after = before + "\n# VOIDCODE simulated AI edit"

        plan.add_change(str(sample_file), before, after)

    plan.show_preview()
