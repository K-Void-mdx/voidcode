from void.core.diff import DiffEngine


class Patch:

    def __init__(self, file_path, old_content, new_content):
        self.file_path = file_path
        self.old = old_content
        self.new = new_content
        self.diff_engine = DiffEngine()

    def diff(self):
        return self.diff_engine.create(self.old, self.new, self.file_path)
