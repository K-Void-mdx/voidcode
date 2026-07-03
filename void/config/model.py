from void.config.settings import load_settings, save_settings


def get_model():

    settings = load_settings()
    return settings.get("model")


def set_model(name):

    settings = load_settings()
    settings["model"] = name
    save_settings(settings)
