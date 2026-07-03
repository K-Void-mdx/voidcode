from prompt_toolkit.completion import WordCompleter

from void.commands.registry import list_commands

command_completer = WordCompleter(
    list_commands(),
    ignore_case=True,
)
