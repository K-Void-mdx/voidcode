from void.config.settings import load_settings, save_settings


def get_key(provider):

    settings = load_settings()
    return settings["api_keys"].get(provider)


def set_key(provider, key):

    settings = load_settings()

    settings["api_keys"][provider] = key

    save_settings(settings)
