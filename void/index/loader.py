import json
from pathlib import Path


def load_index(workspace):
    file = Path(workspace) / ".void_index.json"

    if not file.exists():
        return []

    return json.loads(file.read_text())
