import re


class PatchParser:
    """
    Extracts file + new content from AI output.
    Simple structured format parser.
    """

    def parse(self, text: str):

        pattern = r"FILE:\s*(.*?)\nCONTENT:\n(.*?)(?=\nFILE:|$)"

        matches = re.findall(pattern, text, re.DOTALL)

        patches = []

        for file_path, content in matches:
            patches.append({
                "file": file_path.strip(),
                "content": content.rstrip()
            })

        return patches
