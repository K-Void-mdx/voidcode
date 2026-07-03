"""
VOIDCODE setup wizard.

Guides the user through:
1. Choosing an AI provider
2. Entering an API key
3. Selecting a model
4. Setting the work mode
"""

from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt, Confirm
from rich.table import Table

from void.config.settings import (
    load_settings, save_settings,
    set_api_key, set_provider, set_model, set_mode,
)
from void.ai.providers import (
    PROVIDERS, PROVIDER_NAMES, PROVIDER_MODELS, PROVIDER_ENV_KEYS,
)

console = Console()


def run_setup():
    console.print(Panel.fit(
        "[bold cyan]VOIDCODE Setup[/bold cyan]\n"
        "Configure your AI provider and API key.\n"
        "Keys are stored in ~/.voidcode/settings.json",
    ))

    settings = load_settings()
    current_provider = settings.get("provider", "openrouter")

    console.print("\n[bold]Available providers:[/bold]")
    table = Table(show_header=False, border_style="dim")
    table.add_column("Key")
    table.add_column("Name")
    table.add_column("Requires API Key")
    for key, name in PROVIDER_NAMES.items():
        env_key = PROVIDER_ENV_KEYS.get(key, "")
        needs_key = "Yes" if env_key else "No (local)"
        table.add_row(key, name, needs_key)
    console.print(table)

    provider = Prompt.ask(
        "\nSelect provider",
        choices=list(PROVIDERS.keys()),
        default=current_provider,
    )

    set_provider(provider)

    env_key = PROVIDER_ENV_KEYS.get(provider)
    if env_key:
        existing = settings.get("api_keys", {}).get(provider, "")
        prompt_text = f"Enter your {PROVIDER_NAMES.get(provider, provider)} API key"
        api_key = Prompt.ask(prompt_text, default=existing or None)
        if api_key:
            set_api_key(provider, api_key)
            console.print(f"[green]API key saved for {provider}[/green]")

    models = PROVIDER_MODELS.get(provider, [])
    if models:
        current_model = settings.get("model", models[0])
        model = Prompt.ask(
            "Select model",
            choices=models,
            default=current_model if current_model in models else models[0],
        )
        set_model(model)
    else:
        model = Prompt.ask("Enter model name", default=settings.get("model", ""))
        if model:
            set_model(model)

    current_mode = settings.get("mode", "BUILD")
    mode = Prompt.ask(
        "Work mode",
        choices=["BUILD", "PLAN"],
        default=current_mode,
    )
    set_mode(mode)

    console.print("\n[bold green]Setup complete![/bold green]")
    console.print("Run [bold]voidcode[/bold] to launch the assistant.")

    settings = load_settings()
    s = Panel.fit(
        f"Provider: {settings.get('provider')}\n"
        f"Model: {settings.get('model')}\n"
        f"Mode: {settings.get('mode')}"
    )
    console.print(s)
