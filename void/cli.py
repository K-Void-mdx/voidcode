"""
VOIDCODE CLI entry point.

Usage:
    voidcode          — Launch the TUI
    voidcode setup    — Configure provider and API keys
"""

import sys
from void.app import run
from void.setup import run_setup


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "setup":
        run_setup()
    else:
        run()


if __name__ == "__main__":
    main()
