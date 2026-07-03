class ContextBuilder:

    def __init__(self, workspace):
        self.workspace = workspace

    def build(self):
        """
        Build context for the AI.

        Later this will include:
        - Workspace summary
        - Relevant files
        - Search results
        - Symbols
        - Chat history
        """

        return {
            "workspace": str(self.workspace)
        }
