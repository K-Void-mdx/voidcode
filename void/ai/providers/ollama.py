import httpx


class OllamaProvider:

    def __init__(self):
        self.url = "http://localhost:11434/api/chat"
        self.model = "codellama"

    @property
    def name(self):
        return "ollama"

    def chat(self, messages):
        try:
            payload = {
                "model": self.model,
                "messages": messages,
                "stream": False,
            }
            res = httpx.post(self.url, json=payload, timeout=120)
            if res.status_code != 200:
                return f"Ollama error: {res.text}"
            return res.json()["message"]["content"]
        except httpx.ConnectError:
            return "Ollama not running. Start it with: ollama serve"
        except Exception as e:
            return f"Ollama error: {e}"
