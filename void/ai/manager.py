from void.ai.engine import AIEngine


class AIManager:
    """
    Wraps AI engine and future providers.
    """

    def __init__(self, workspace):
        self.engine = AIEngine(workspace)

    def chat(self, message: str):
        return self.engine.chat(message)

    def run_tool(self, tool_name, *args):
        return self.engine.use_tool(tool_name, *args)
