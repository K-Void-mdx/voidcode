class SymbolDatabase:
    """
    Stores project symbols for fast lookup.
    """

    def __init__(self):
        self.symbols = {}

    def add(self, name, symbol_type, file_path):
        self.symbols[name] = {
            "type": symbol_type,
            "file": file_path
        }

    def find(self, name):
        return self.symbols.get(name)

    def all(self):
        return self.symbols
