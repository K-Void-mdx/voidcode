from pathlib import Path
from void.workspace.indexer import build_index, save_index, load_index


class Session:
    """
    Stores all runtime state for VOIDCODE.
    """

    def __init__(self, workspace):
        self.workspace = Path(workspace)

        # load or create index
        self.index = load_index(self.workspace)

        if self.index is None:
            self.index = build_index(self.workspace)
            save_index(self.workspace, self.index)

    @property
    def project_name(self):
        return self.workspace.name

    @property
    def workspace_path(self):
        return str(self.workspace)
