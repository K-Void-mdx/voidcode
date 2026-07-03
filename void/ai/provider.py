class AIProvider:
    """
    Base class for every AI provider.

    All providers (Groq, Ollama, OpenRouter, Gemini, etc.)
    must inherit from this class.
    """

    @property
    def name(self):
        raise NotImplementedError

    def chat(self, request):
        """
        Send a request to the AI.

        Returns an AIResponse object.
        """
        raise NotImplementedError
