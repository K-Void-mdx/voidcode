import re
from void.tools.tool import Tool

CODE_FENCE_RE = re.compile(r"^```\w*\n(.*?)\n```$", re.DOTALL)


class WriteTool(Tool):

    def run(self, file_path, content):
        full_path = f"{self.workspace}/{file_path}"

        match = CODE_FENCE_RE.match(content.strip())
        if match:
            content = match.group(1)

        try:
            parent = __import__("pathlib").Path(full_path).parent
            parent.mkdir(parents=True, exist_ok=True)

            with open(full_path, "w", encoding="utf-8") as f:
                f.write(content)

            return {
                "tool": "write",
                "file": file_path,
                "success": True
            }

        except Exception as e:
            return {
                "tool": "write",
                "file": file_path,
                "error": str(e)
            }
