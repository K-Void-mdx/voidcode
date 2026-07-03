class PatchApplier:

    def apply(self, workspace, file_path, content):

        full_path = f"{workspace}/{file_path}"

        try:
            with open(full_path, "w", encoding="utf-8") as f:
                f.write(content)

            return {
                "success": True,
                "file": file_path
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
