let _settingsCache = null

async function fetchSettings(userId, force) {
    if (_settingsCache && !force) return _settingsCache
    initDb()
    const db = getDb()
    const Query = getQuery()
    const { ID } = Appwrite
    try {
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.settings,
            [Query.equal('userId', userId)]
        )
        if (res.documents.length) {
            _settingsCache = res.documents[0]
            return _settingsCache
        }
        _settingsCache = await db.createDocument(
            CONFIG.database.id,
            CONFIG.database.collections.settings,
            ID.unique(),
            { userId, preferences: {}, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        )
        return _settingsCache
    } catch {
        _settingsCache = null
        return null
    }
}

async function updateSettings(userId, prefs) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const settings = await fetchSettings(userId, true)
        if (!settings) return null
        const updated = await db.updateDocument(
            CONFIG.database.id,
            CONFIG.database.collections.settings,
            settings.$id,
            { preferences: prefs, updated_at: new Date().toISOString() }
        )
        _settingsCache = updated
        return updated
    } catch (e) {
        console.warn('updateSettings failed:', e)
        return null
    }
}
