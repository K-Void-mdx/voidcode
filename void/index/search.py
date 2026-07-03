def search_index(index, keyword):
    keyword = keyword.lower()

    return [
        item
        for item in index
        if keyword in item["path"].lower()
    ]
