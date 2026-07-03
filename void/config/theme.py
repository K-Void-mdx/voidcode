class ThemeManager:

    THEMES = [
        "VOID Purple",
        "Claude Orange",
        "Copilot Blue",
        "Ollama Green",
        "Matrix",
    ]

    def __init__(self, settings):
        self.settings = settings

    def set(self, theme):
        if theme in self.THEMES:
            self.settings.theme = theme

    def get(self):
        return self.settings.theme
