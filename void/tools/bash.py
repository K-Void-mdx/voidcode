import subprocess
import shlex
from void.tools.tool import Tool


class BashTool(Tool):

    def run(self, command, timeout=30):
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=str(self.workspace)
            )

            output = ""
            if result.stdout:
                output += result.stdout
            if result.stderr:
                output += result.stderr

            return {
                "tool": "bash",
                "command": command,
                "exit_code": result.returncode,
                "output": output[:10000]
            }

        except subprocess.TimeoutExpired:
            return {
                "tool": "bash",
                "command": command,
                "error": f"Command timed out after {timeout}s"
            }

        except Exception as e:
            return {
                "tool": "bash",
                "command": command,
                "error": str(e)
            }
