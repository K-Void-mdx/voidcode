from void.tools.registry import ToolRegistry


class ToolExecutor:

    def __init__(self, workspace):
        self.registry = ToolRegistry(workspace)

    def run(self, tool_name, *args):

        tool = self.registry.get(tool_name)

        if not tool:
            return {"error": "Tool not found"}

        return tool.run(*args)
