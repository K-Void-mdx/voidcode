import json
from pathlib import Path
from datetime import datetime

CONV_DIR = Path.home() / ".voidcode" / "conversations"


class MessageHistory:

    def __init__(self, conversation_id=None):
        self.messages = []
        self.conversation_id = conversation_id or datetime.now().strftime("%Y%m%d_%H%M%S")
        CONV_DIR.mkdir(parents=True, exist_ok=True)

    @property
    def path(self):
        return CONV_DIR / f"{self.conversation_id}.json"

    def add_user(self, text):
        self.messages.append({
            "role": "user",
            "content": text,
            "timestamp": datetime.now().isoformat(),
        })
        self._save()

    def add_assistant(self, text):
        self.messages.append({
            "role": "assistant",
            "content": text,
            "timestamp": datetime.now().isoformat(),
        })
        self._save()

    def add_tool_result(self, text):
        self.messages.append({
            "role": "user",
            "content": f"[tool result]\n{text}",
            "timestamp": datetime.now().isoformat(),
        })
        self._save()

    def all(self):
        return [
            {"role": m["role"], "content": m["content"]}
            for m in self.messages
            if m["role"] in ("user", "assistant")
        ]

    def clear(self):
        self.messages.clear()
        self._save()

    def _save(self):
        data = {
            "id": self.conversation_id,
            "updated": datetime.now().isoformat(),
            "messages": self.messages,
        }
        with open(self.path, "w") as f:
            json.dump(data, f, indent=2)

    def save(self):
        self._save()

    @classmethod
    def load_latest(cls):
        CONV_DIR.mkdir(parents=True, exist_ok=True)
        convs = sorted(CONV_DIR.glob("*.json"), reverse=True)
        if not convs:
            return cls()

        try:
            with open(convs[0]) as f:
                data = json.load(f)
            instance = cls(data.get("id"))
            instance.messages = data.get("messages", [])
            return instance
        except (json.JSONDecodeError, KeyError):
            return cls()

    @classmethod
    def list_conversations(cls):
        CONV_DIR.mkdir(parents=True, exist_ok=True)
        convs = []
        for p in sorted(CONV_DIR.glob("*.json"), reverse=True):
            try:
                with open(p) as f:
                    data = json.load(f)
                convs.append({
                    "id": data.get("id", p.stem),
                    "updated": data.get("updated", ""),
                    "count": len(data.get("messages", [])),
                })
            except (json.JSONDecodeError, OSError):
                pass
        return convs
