import os
from void.tools.tool import Tool

IGNORE_DIRS = {".git", ".venv", "__pycache__", "node_modules", ".eggs"}


class GrepTool(Tool):

    def run(self, query):
        results = []

        for root, dirs, files in os.walk(self.workspace):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for f in files:
                path = os.path.join(root, f)

                try:
                    with open(path, "r", errors="ignore") as file:
                        for i, line in enumerate(file):
                            if query.lower() in line.lower():
                                results.append({
                                    "file": os.path.relpath(path, self.workspace),
                                    "line": i + 1,
                                    "text": line.strip()[:200]
                                })
                except:
                    pass

        return {
            "tool": "grep",
            "results": results[:100]
        }
