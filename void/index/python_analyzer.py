import ast
from pathlib import Path


def analyze_python_file(file_path):
    """
    Analyze a Python file and return its structure.
    """

    path = Path(file_path)

    try:
        source = path.read_text(encoding="utf-8")
    except Exception:
        return None

    try:
        tree = ast.parse(source)
    except SyntaxError:
        return None

    data = {
        "classes": [],
        "functions": [],
        "imports": []
    }

    for node in ast.walk(tree):

        if isinstance(node, ast.ClassDef):
            data["classes"].append(node.name)

        elif isinstance(node, ast.FunctionDef):
            data["functions"].append(node.name)

        elif isinstance(node, ast.Import):
            for name in node.names:
                data["imports"].append(name.name)

        elif isinstance(node, ast.ImportFrom):
            module = node.module or ""
            data["imports"].append(module)

    return data
