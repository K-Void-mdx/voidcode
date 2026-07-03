import os
import httpx
from void.config.settings import get_api_key


class GoogleProvider:

    def __init__(self):
        self.api_key = get_api_key("google") or os.getenv("GOOGLE_API_KEY")
        self.model = "gemini-2.5-flash"

    @property
    def name(self):
        return "google"

    def chat(self, messages):
        if not self.api_key:
            return ("Google API key not found.\n"
                    "Set it with: voidcode setup\n"
                    "Or add GOOGLE_API_KEY to your .env file.")

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"

        contents = []
        for m in messages:
            if m["role"] == "system":
                contents.append({
                    "role": "user",
                    "parts": [{"text": f"[System]: {m['content']}"}]
                })
            elif m["role"] == "assistant":
                contents.append({
                    "role": "model",
                    "parts": [{"text": m["content"]}]
                })
            else:
                contents.append({
                    "role": "user",
                    "parts": [{"text": m["content"]}]
                })

        payload = {"contents": contents}

        try:
            res = httpx.post(url, json=payload, timeout=120)
            if res.status_code == 403 or res.status_code == 401:
                return "Invalid Google API key. Update it with: voidcode setup"
            if res.status_code != 200:
                return f"Google error: {res.text}"
            candidates = res.json().get("candidates", [])
            if candidates:
                return candidates[0]["content"]["parts"][0]["text"]
            return "No response from Gemini"
        except httpx.ConnectError:
            return "Cannot connect to Google AI. Check your internet."
        except Exception as e:
            return f"Google error: {e}"
