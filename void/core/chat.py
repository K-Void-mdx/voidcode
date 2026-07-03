from void.ai.manager import AIManager
from void.core.intent import detect_intent, Intent
from void.core.planner import create_multi_file_plan
from void.config.settings import load_settings


class ChatEngine:

    def __init__(self, workspace):
        self.ai = AIManager(workspace)

    def clear_history(self):
        self.ai.engine.clear_history()

    def handle(self, message: str):
        settings = load_settings()
        mode = settings.get("mode", "BUILD")

        intent = detect_intent(message)

        if mode == "PLAN" or intent == Intent.PLAN:
            return self.ai.chat(
                f"PLAN MODE ONLY. User request: {message}\n"
                "Return architecture and design only. Do NOT make any edits."
            )

        return self.ai.chat(message)
