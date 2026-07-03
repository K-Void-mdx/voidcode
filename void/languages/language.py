from abc import ABC, abstractmethod


class Language(ABC):
    """
    Base class for all programming languages supported by VOIDCODE.
    """

    name = ""

    extensions = []

    @abstractmethod
    def analyze(self, file_path):
        """
        Analyze a source file and return structured information.
        """
        pass
