from void.commands.help import run as help_command
from void.commands.pwd import run as pwd_command
from void.commands.tree import run as tree_command
from void.commands.read import run as read_command
from void.commands.search import run as search_command
from void.commands.run import run as run_command

COMMANDS = {
    "/help": help_command,
    "/pwd": pwd_command,
    "/tree": tree_command,
    "/read": read_command,
    "/search": search_command,
    "/run": run_command,
}


def execute(command, session):
    parts = command.split(" ", 1)
    cmd = parts[0]
    args = parts[1] if len(parts) > 1 else None

    action = COMMANDS.get(cmd)

    if action is None:
        return False

    if args:
        action(session, args)
    else:
        action(session)

    return True


def list_commands():
    return sorted(COMMANDS.keys())
