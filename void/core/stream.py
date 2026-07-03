class StreamBus:

    def __init__(self):
        self.events = []

    def emit(self, event_type, data):
        event = {
            "type": event_type,
            "data": data
        }
        self.events.append(event)
        return event

    def get(self):
        return self.events
