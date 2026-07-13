let _settingsCache = null

async function fetchSettings(userId, force) {
    if (_settingsCache && !force) return _settingsCache
    initDb()
    const db = getDb()
    const Query = getQuery()
    const { ID, Permission, Role } = Appwrite
    try {
        const profileDocId = _profile?.$id
        if (!profileDocId) return null
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.settings,
            [Query.equal('profiles', profileDocId)]
        )
        if (res.documents.length) {
            _settingsCache = res.documents[0]
            return _settingsCache
        }
        _settingsCache = await db.createDocument(
            CONFIG.database.id,
            CONFIG.database.collections.settings,
            ID.unique(),
            {
                profiles: profileDocId,
                theme: 'dark',
                preferred_language: 'English',
                email_notifications: true,
                smart_revision_enabled: true,
                daily_goal_minutes: 30,
                ai_assistant_enabled: true,
                accessibility_mode: 'off',
                onboarding_completed: false
            },
            [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId))
            ]
        )
        return _settingsCache
    } catch { _settingsCache = null; return null }
}

async function updateSettings(userId, prefs) {
    initDb()
    const db = getDb()
    try {
        const settings = await fetchSettings(userId, true)
        if (!settings) return null
        const updated = await db.updateDocument(
            CONFIG.database.id,
            CONFIG.database.collections.settings,
            settings.$id,
            prefs
        )
        _settingsCache = updated
        return updated
    } catch (e) { console.warn('updateSettings failed:', e); return null }
}

function parsePreferences(settings) {
    if (!settings) return {}
    return {
        theme: settings.theme || 'dark',
        preferred_language: settings.preferred_language || 'English',
        email_notifications: settings.email_notifications !== false,
        smart_revision_enabled: settings.smart_revision_enabled !== false,
        daily_goal_minutes: settings.daily_goal_minutes || 30,
        ai_assistant_enabled: settings.ai_assistant_enabled !== false,
        accessibility_mode: settings.accessibility_mode || 'off'
    }
}
