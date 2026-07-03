from void.config.settings import load_settings, save_settings, set_provider, set_model, set_mode
from void.ai.providers import PROVIDERS, PROVIDER_NAMES, PROVIDER_MODELS, PROVIDER_ENV_KEYS


class CommandItem:
    def __init__(self, name, action):
        self.name = name
        self.action = action


class CommandRegistry:

    def __init__(self):
        self.commands = [
            CommandItem("Switch Provider", self.switch_provider),
            CommandItem("Switch Model", self.switch_model),
            CommandItem("Toggle Work Mode", self.work_mode),
            CommandItem("Setup (API Keys)", self.setup),
            CommandItem("Status", self.status),
        ]

    def list(self):
        return self.commands

    def switch_provider(self):
        s = load_settings()
        providers = list(PROVIDERS.keys())
        current = s.get("provider", "openrouter")
        idx = providers.index(current) if current in providers else 0
        next_idx = (idx + 1) % len(providers)
        next_provider = providers[next_idx]
        set_provider(next_provider)

        models = PROVIDER_MODELS.get(next_provider, [])
        if models:
            set_model(models[0])

        return f"Provider: {current} -> {next_provider}"

    def switch_model(self):
        s = load_settings()
        provider = s.get("provider", "openrouter")
        models = PROVIDER_MODELS.get(provider, [])
        if not models:
            return f"No preset models for {provider}. Edit ~/.voidcode/settings.json"

        current = s.get("model", models[0])
        idx = models.index(current) if current in models else 0
        next_idx = (idx + 1) % len(models)
        next_model = models[next_idx]
        set_model(next_model)
        return f"Model: {current} -> {next_model}"

    def work_mode(self):
        s = load_settings()
        current = s.get("mode", "BUILD")
        new_mode = "PLAN" if current == "BUILD" else "BUILD"
        set_mode(new_mode)
        return f"Mode: {current} -> {new_mode}"

    def setup(self):
        return "Run 'voidcode setup' in your terminal"

    def status(self):
        s = load_settings()
        provider = s.get("provider", "?")
        model = s.get("model", "?")
        mode = s.get("mode", "?")
        name = PROVIDER_NAMES.get(provider, provider)
        return f"Provider: {provider} ({name}) | Model: {model} | Mode: {mode}"
