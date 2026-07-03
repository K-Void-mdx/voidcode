import os
import httpx
from void.config.settings import get_api_key


class GroqProvider:

    def __init__(self):
        self.api_key = get_api_key("groq") or os.getenv("GROQ_API_KEY")
        self.url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama-3.3-70b-versatile"

    @property
    def name(self):
        return "groq"

    def chat(self, messages):
        if not self.api_key:
            return ("Groq API key not found.\n"
                    "Set it with: voidcode setup\n"
                    "Or add GROQ_API_KEY to your .env file.")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.3,
        }

        try:
            res = httpx.post(self.url, headers=headers, json=payload, timeout=120)
            if res.status_code == 401:
                return "Invalid Groq API key. Update it with: voidcode setup"
            if res.status_code != 200:
                return f"Groq error: {res.text}"
            return res.json()["choices"][0]["message"]["content"]
        except httpx.ConnectError:
            return "Cannot connect to Groq. Check your internet."
        except Exception as e:
            return f"Groq error: {e}"
