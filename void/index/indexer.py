from pathlib import Path
import json


class WorkspaceIndexer:
    """
    Builds an index of the workspace.
    """

    IGNORE = {
        ".git",
        "__pycache__",
        ".venv",
        "node_modules"
    }

    def __init__(self, workspace):
        self.workspace = Path(workspace)

    def build(self):
        data = []

        for file in self.workspace.rglob("*"):

            if not file.is_file():
                continue

            if any(part in self.IGNORE for part in file.parts):
                continue

            data.append({
                "path": str(file.relative_to(self.workspace)),
                "suffix": file.suffix,
                "size": file.stat().st_size
            })

        return data

    def save(self):
        data = self.build()

        output = self.workspace / ".void_index.json"

        output.write_text(
            json.dumps(data, indent=4)
        )

        return output
