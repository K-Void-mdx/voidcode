class ModeManager:

    MODES = [
        "Chat",
        "Plan",
        "Build",
    ]

    def __init__(self, settings):
        self.settings = settings

    def set(self, mode):
        if mode in self.MODES:
            self.settings.mode = mode

    def get(self):
        return self.settings.mode
