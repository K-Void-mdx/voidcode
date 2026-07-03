import re
import json
import shlex

from void.agent.agent import Agent
from void.ai.providers import get_provider
from void.ai.messages import MessageHistory
from void.ai.prompts import SYSTEM_PROMPT
from void.config.settings import load_settings


TOOL_RE = re.compile(r"<tool>(.+?)</tool>", re.DOTALL)
XML_SELF_CLOSE_RE = re.compile(r"<(\w+)\s+(.*?)\s*/>", re.DOTALL)
XML_CONTENT_RE = re.compile(r"<(\w+)(\s+[^>]*?)?>(.*?)</\1>", re.DOTALL)


class AIEngine:

    def __init__(self, workspace):
        self.agent = Agent(workspace)
        self.history = MessageHistory.load_latest()
        self.max_turns = 15
        self._init_provider()

    def _init_provider(self):
        settings = load_settings()
        name = settings.get("provider", "openrouter")
        self.provider = get_provider(name)
        if not self.provider:
            self.provider = get_provider("openrouter")

    def refresh_provider(self):
        self._init_provider()

    def clear_history(self):
        self.history = MessageHistory()
        self.history.save()

    def _run_tool(self, name, *args):
        return self.agent.use(name, *args)

    def _parse_xml_attrs(self, attrs_text):
        pairs = re.findall(r"""(\w+)\s*=\s*"([^"]*?)"|(\w+)\s*=\s*'([^']*?)'""", attrs_text or "")
        result = {}
        for match in pairs:
            k = match[0] or match[2]
            v = match[1] or match[3]
            result[k] = v
        return result

    def _execute_xml_tools(self, text):
        results = []

        for match in XML_CONTENT_RE.finditer(text):
            name = match.group(1)
            attrs_text = match.group(2) or ""
            inner = match.group(3)
            attrs = self._parse_xml_attrs(attrs_text)

            if name == "write":
                path = attrs.get("path") or attrs.get("file") or ""
                if not path:
                    path = attrs_text.strip().split()[0] if attrs_text.strip() else ""
                r = self._run_tool("write", path, inner)
                results.append(("write", path, r))

            elif name == "edit":
                path = attrs.get("path") or attrs.get("file", "")
                old = attrs.get("old", "")
                new = attrs.get("new", "")
                r = self._run_tool("edit", path, old, new)
                results.append(("edit", path, r))

            elif name == "bash":
                r = self._run_tool("bash", inner)
                results.append(("bash", inner[:50], r))

        for match in XML_SELF_CLOSE_RE.finditer(text):
            name = match.group(1)
            if name in ("read", "glob", "grep", "bash"):
                attrs_text = match.group(2)
                attrs = self._parse_xml_attrs(attrs_text)
                for key in ("path", "command", "pattern", "query"):
                    if key in attrs:
                        r = self._run_tool(name, attrs[key])
                        results.append((name, attrs[key], r))
                        break
                else:
                    if attrs:
                        r = self._run_tool(name, list(attrs.values())[0])
                        results.append((name, str(list(attrs.values())[0]), r))

        clean = text
        for pat in [XML_CONTENT_RE, XML_SELF_CLOSE_RE]:
            clean = pat.sub("", clean)
        return clean.strip(), results

    def _execute_simple_tool(self, tool_text):
        parts = shlex.split(tool_text)
        if not parts:
            return {"error": "Empty tool call"}
        return self._run_tool(parts[0], *parts[1:])

    def chat(self, message: str):
        self.history.add_user(message)

        forced = f"CRITICAL: Start your response by calling a tool. Do not explain first. {message}"
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
        ] + self.history.all()

        messages[-1] = {"role": "user", "content": forced}

        full_response = ""
        turn_count = 0

        while turn_count < self.max_turns:
            turn_count += 1

            response = self.provider.chat(messages)
            content = response if isinstance(response, str) else str(response)

            tool_calls = TOOL_RE.findall(content)
            clean, xml_results = self._execute_xml_tools(content)

            has_tool = bool(tool_calls) or bool(xml_results)

            if not has_tool:
                clean = content.strip()
                if clean:
                    self.history.add_assistant(clean)
                return clean

            if clean:
                full_response += clean + "\n"

            messages.append({"role": "assistant", "content": content})

            all_results = []
            for tc in tool_calls:
                result = self._execute_simple_tool(tc)
                all_results.append((tc, json.dumps(result, indent=2)[:3000]))

            for tool_type, path, result in xml_results:
                all_results.append((f"{tool_type} {path}",
                                    json.dumps(result, indent=2)[:3000]))

            for call_desc, result_str in all_results:
                full_response += f"[tool: {call_desc}]\n{result_str}\n"
                self.history.add_tool_result(result_str)
                messages.append({
                    "role": "user",
                    "content": f"Tool result:\n{result_str}"
                })

        final = full_response.strip() or "Max turns reached."
        self.history.add_assistant(final)
        return final
