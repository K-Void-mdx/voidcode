class Tool:
    def __init__(self, workspace):
        self.workspace = workspace

    def run(self, *args, **kwargs):
        raise NotImplementedError
