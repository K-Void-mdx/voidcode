def create_multi_file_plan(message: str):

    return {
        "goal": message,
        "steps": [
            "Analyze request",
            "Search workspace (glob/grep)",
            "Read relevant files",
            "Generate patch proposal",
            "Await user approval"
        ]
    }
