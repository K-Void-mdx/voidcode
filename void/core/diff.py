import difflib


class DiffEngine:

    def create(self, old: str, new: str, file_path: str):

        diff = difflib.unified_diff(
            old.splitlines(keepends=True),
            new.splitlines(keepends=True),
            fromfile=f"a/{file_path}",
            tofile=f"b/{file_path}"
        )

        return "".join(diff)
