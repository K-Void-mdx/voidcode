from rich.table import Table


def build_status(settings):

    table = Table(title="VOIDCODE Status")

    table.add_column("Setting")
    table.add_column("Value")

    table.add_row("Provider", settings.provider or "Not Selected")
    table.add_row("Model", settings.model or "Not Selected")
    table.add_row("Mode", settings.mode)
    table.add_row("Theme", settings.theme)

    return table
