from void.tools.glob import GlobTool
from void.tools.grep import GrepTool
from void.tools.read import ReadTool
from void.tools.write import WriteTool
from void.tools.edit import EditTool
from void.tools.bash import BashTool


class ToolRegistry:

    def __init__(self, workspace):
        self.tools = {
            "glob": GlobTool(workspace),
            "grep": GrepTool(workspace),
            "read": ReadTool(workspace),
            "write": WriteTool(workspace),
            "edit": EditTool(workspace),
            "bash": BashTool(workspace),
        }

    def get(self, name):
        return self.tools.get(name)

    def list(self):
        return list(self.tools.keys())
