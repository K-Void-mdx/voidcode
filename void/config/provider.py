from void.config.settings import load_settings, save_settings


def get_provider():

    settings = load_settings()
    return settings.get("provider")


def set_provider(name):

    settings = load_settings()
    settings["provider"] = name
    save_settings(settings)
