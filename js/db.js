let _databases = null
let _storage = null
let _query = null

function initDb() {
    if (_databases) return true
    if (typeof Appwrite === 'undefined' || !_client) return false
    const { Databases, Storage, Query } = Appwrite
    _databases = new Databases(_client)
    _storage = new Storage(_client)
    _query = Query
    return true
}

function getDb() {
    if (!_databases) throw new Error('Database not initialized. Call initDb() first.')
    return _databases
}

function getStorage() {
    if (!_storage) throw new Error('Storage not initialized. Call initDb() first.')
    return _storage
}

function getQuery() {
    if (!_query) throw new Error('Query not initialized.')
    return _query
}
