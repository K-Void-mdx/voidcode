from void.config.settings import Settings


class ConfigManager:

    def __init__(self):
        self.settings = Settings()

    def get(self):
        return self.settings
