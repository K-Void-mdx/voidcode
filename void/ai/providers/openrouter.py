import os
import httpx
from void.config.settings import get_api_key


class OpenRouterProvider:

    def __init__(self):
        self.api_key = get_api_key("openrouter") or os.getenv("OPENROUTER_API_KEY")
        self.url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = os.getenv("OPENROUTER_MODEL") or "gpt-4o-mini"

    @property
    def name(self):
        return "openrouter"

    def chat(self, messages):
        if not self.api_key:
            return ("OpenRouter API key not found.\n"
                    "Set it with: voidcode setup\n"
                    "Or add OPENROUTER_API_KEY to your .env file.")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://voidcode.dev",
            "X-Title": "VOIDCODE",
        }

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.3,
        }

        try:
            res = httpx.post(self.url, headers=headers, json=payload, timeout=120)
            if res.status_code == 401:
                return ("Invalid OpenRouter API key. Update it with: voidcode setup")
            if res.status_code != 200:
                return f"OpenRouter error: {res.text}"
            return res.json()["choices"][0]["message"]["content"]
        except httpx.ConnectError:
            return "Cannot connect to OpenRouter. Check your internet."
        except Exception as e:
            return f"OpenRouter error: {e}"
