# VOIDCODE

A terminal-based AI coding assistant built from scratch. Like a CLI coding agent that lives in your terminal.

## Quick Install

```bash
pip install voidcode
```

## Usage

```bash
# First-time setup (choose provider + enter API key)
voidcode setup

# Launch the assistant
voidcode
```

## Commands

| Key | Action |
|---|---|
| Type a message | Chat with the AI |
| `/` | Open command palette |
| `↑ ↓` | Navigate palette |
| `Enter` | Select palette item |
| `Esc` | Close palette |

### Palette Commands

- **Switch Provider** — Cycle through AI providers
- **Switch Model** — Cycle through models for current provider
- **Toggle Work Mode** — BUILD (full edits) ↔ PLAN (architecture only)
- **Setup** — Run setup wizard in terminal
- **Status** — Show current configuration

## Providers

VOIDCODE supports multiple AI backends:

| Provider | Key Variable | Models |
|---|---|---|
| [OpenRouter](https://openrouter.ai) | `OPENROUTER_API_KEY` | gpt-4o, claude, deepseek, mistral, llama... |
| [Groq](https://groq.com) | `GROQ_API_KEY` | llama-3.3, mixtral, gemma2 |
| [Anthropic](https://anthropic.com) | `ANTHROPIC_API_KEY` | claude-sonnet-4, claude-3.5 |
| [Google](https://aistudio.google.com) | `GOOGLE_API_KEY` | gemini-2.5-flash, gemini-2.5-pro |
| [Ollama](https://ollama.ai) | (local) | any local model |

API keys are stored in `~/.voidcode/settings.json`.

## How it Works

VOIDCODE is an AI agent with a Textual TUI:

1. You type a request
2. The AI explores your codebase using tools (glob, grep, read)
3. It plans and makes changes (write, edit)
4. It can run bash commands to test/verify
5. It responds with a summary

## Requirements

- Python 3.10+

## Project Structure

```
void/
├── app.py          # App bootstrap
├── cli.py          # CLI entry point (voidcode / voidcode setup)
├── setup.py        # Setup wizard
├── ai/             # AI providers + engine + agent loop
├── agent/          # Tool router
├── tools/          # Tool implementations (read, write, edit, glob, grep, bash)
├── core/           # Chat engine, intent detection, patch system
├── ui/             # Textual TUI (screen, palette, commands, theme)
├── config/         # Settings management
├── workspace/      # Workspace scanning, indexing, tree
├── index/          # Code analysis, symbols, Python AST
└── languages/      # Language support base
```
