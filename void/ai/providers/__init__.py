"""
AI Providers.

Every provider implements the same interface:
- chat(messages) -> str
"""

from void.ai.providers.openrouter import OpenRouterProvider
from void.ai.providers.groq import GroqProvider
from void.ai.providers.ollama import OllamaProvider
from void.ai.providers.anthropic import AnthropicProvider
from void.ai.providers.google import GoogleProvider

PROVIDERS = {
    "openrouter": OpenRouterProvider,
    "groq": GroqProvider,
    "ollama": OllamaProvider,
    "anthropic": AnthropicProvider,
    "google": GoogleProvider,
}

PROVIDER_MODELS = {
    "openrouter": [
        "gpt-4o-mini",
        "gpt-4o",
        "claude-sonnet-4-20250514",
        "claude-3.5-sonnet",
        "deepseek-chat",
        "qwen2.5-coder-32b-instruct",
        "mistral-large",
        "llama-3.1-70b",
    ],
    "groq": [
        "llama-3.3-70b-versatile",
        "llama-3.1-70b-versatile",
        "llama-3.1-8b-instant",
        "mixtral-8x7b-32768",
        "gemma2-9b-it",
    ],
    "ollama": [],
    "anthropic": [
        "claude-sonnet-4-20250514",
        "claude-3-5-haiku-latest",
        "claude-3-opus-latest",
    ],
    "google": [
        "gemini-2.5-flash",
        "gemini-2.5-pro",
    ],
}

PROVIDER_NAMES = {
    "openrouter": "OpenRouter",
    "groq": "Groq",
    "ollama": "Ollama (local)",
    "anthropic": "Anthropic",
    "google": "Google",
}

PROVIDER_ENV_KEYS = {
    "openrouter": "OPENROUTER_API_KEY",
    "groq": "GROQ_API_KEY",
    "ollama": None,
    "anthropic": "ANTHROPIC_API_KEY",
    "google": "GOOGLE_API_KEY",
}


def get_provider(name):
    cls = PROVIDERS.get(name)
    if cls:
        return cls()
    return None


def get_models(name):
    return PROVIDER_MODELS.get(name, [])


def get_provider_name(name):
    return PROVIDER_NAMES.get(name, name)


def get_env_key(name):
    return PROVIDER_ENV_KEYS.get(name)
