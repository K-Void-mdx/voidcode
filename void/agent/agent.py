from void.tools.registry import ToolRegistry


class Agent:
    """
    Tool router (brain executor bridge)
    """

    def __init__(self, workspace):
        self.tools = ToolRegistry(workspace)

    def use(self, tool_name, *args):

        tool = self.tools.get(tool_name)

        if not tool:
            return {
                "success": False,
                "error": f"Unknown tool: {tool_name}"
            }

        return tool.run(*args)
