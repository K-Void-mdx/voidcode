import os
import httpx
from void.config.settings import get_api_key


class AnthropicProvider:

    def __init__(self):
        self.api_key = get_api_key("anthropic") or os.getenv("ANTHROPIC_API_KEY")
        self.url = "https://api.anthropic.com/v1/messages"
        self.model = "claude-sonnet-4-20250514"

    @property
    def name(self):
        return "anthropic"

    def chat(self, messages):
        if not self.api_key:
            return ("Anthropic API key not found.\n"
                    "Set it with: voidcode setup\n"
                    "Or add ANTHROPIC_API_KEY to your .env file.")

        system = ""
        msgs = []
        for m in messages:
            if m["role"] == "system":
                system = m["content"]
            else:
                msgs.append({"role": m["role"], "content": m["content"]})

        if not msgs:
            msgs = [{"role": "user", "content": "hello"}]

        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }

        payload = {
            "model": self.model,
            "max_tokens": 4096,
            "messages": msgs,
        }
        if system:
            payload["system"] = system

        try:
            res = httpx.post(self.url, headers=headers, json=payload, timeout=120)
            if res.status_code == 401:
                return "Invalid Anthropic API key. Update it with: voidcode setup"
            if res.status_code != 200:
                return f"Anthropic error: {res.text}"
            return res.json()["content"][0]["text"]
        except httpx.ConnectError:
            return "Cannot connect to Anthropic. Check your internet."
        except Exception as e:
            return f"Anthropic error: {e}"
