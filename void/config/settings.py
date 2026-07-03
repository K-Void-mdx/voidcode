from pathlib import Path
import json

CONFIG_DIR = Path.home() / ".voidcode"
CONFIG_FILE = CONFIG_DIR / "settings.json"

DEFAULT = {
    "provider": "openrouter",
    "model": "gpt-4o-mini",
    "mode": "BUILD",
    "api_keys": {},
}


def load_settings():
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)

    if not CONFIG_FILE.exists():
        save_settings(DEFAULT)
        return DEFAULT.copy()

    with open(CONFIG_FILE, "r") as f:
        data = json.load(f)

    merged = DEFAULT.copy()
    merged.update(data)
    return merged


def save_settings(data):
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    with open(CONFIG_FILE, "w") as f:
        json.dump(data, f, indent=2)
    CONFIG_FILE.chmod(0o600)


def get_api_key(provider):
    settings = load_settings()
    return settings.get("api_keys", {}).get(provider)


def set_api_key(provider, key):
    settings = load_settings()
    if "api_keys" not in settings:
        settings["api_keys"] = {}
    settings["api_keys"][provider] = key
    save_settings(settings)


def set_model(model_name):
    settings = load_settings()
    settings["model"] = model_name
    save_settings(settings)


def set_provider(provider_name):
    settings = load_settings()
    settings["provider"] = provider_name
    save_settings(settings)


def set_mode(mode):
    settings = load_settings()
    settings["mode"] = mode
    save_settings(settings)
