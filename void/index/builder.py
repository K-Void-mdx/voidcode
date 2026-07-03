from pathlib import Path

from void.index.python_analyzer import analyze_python_file
from void.index.symbols import SymbolDatabase


class ProjectBuilder:

    def __init__(self, workspace):
        self.workspace = Path(workspace)
        self.db = SymbolDatabase()

    def build(self):

        for file in self.workspace.rglob("*.py"):

            if "__pycache__" in file.parts:
                continue

            result = analyze_python_file(file)

            if not result:
                continue

            relative = str(file.relative_to(self.workspace))

            for cls in result["classes"]:
                self.db.add(cls, "class", relative)

            for func in result["functions"]:
                self.db.add(func, "function", relative)

        return self.db
