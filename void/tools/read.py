from void.tools.tool import Tool


class ReadTool(Tool):

    def run(self, file_path):
        full_path = f"{self.workspace}/{file_path}"

        try:
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()

            return {
                "tool": "read",
                "file": file_path,
                "content": content[:6000]
            }

        except Exception as e:
            return {
                "tool": "read",
                "error": str(e)
            }
