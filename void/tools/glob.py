import os
import fnmatch
from void.tools.tool import Tool

IGNORE_DIRS = {".git", ".venv", "__pycache__", "node_modules", ".eggs", "*.egg-info"}


class GlobTool(Tool):

    def run(self, pattern="**/*"):
        results = []

        for root, dirs, files in os.walk(self.workspace):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for f in files:
                full = os.path.join(root, f)
                rel = os.path.relpath(full, self.workspace)

                if fnmatch.fnmatch(rel, pattern):
                    results.append(rel)

        return {
            "tool": "glob",
            "matches": results[:200]
        }
