from void.tools.tool import Tool


class EditTool(Tool):

    def run(self, file_path, old_string, new_string):
        full_path = f"{self.workspace}/{file_path}"

        try:
            with open(full_path, "r", encoding="utf-8") as f:
                content = f.read()

            if old_string not in content:
                return {
                    "tool": "edit",
                    "file": file_path,
                    "error": "old_string not found in file"
                }

            count = content.count(old_string)
            if count > 1:
                return {
                    "tool": "edit",
                    "file": file_path,
                    "error": f"Found {count} matches. Provide more context."
                }

            new_content = content.replace(old_string, new_string)

            with open(full_path, "w", encoding="utf-8") as f:
                f.write(new_content)

            return {
                "tool": "edit",
                "file": file_path,
                "success": True
            }

        except Exception as e:
            return {
                "tool": "edit",
                "file": file_path,
                "error": str(e)
            }
