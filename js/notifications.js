async function fetchNotifications(userId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const profileDocId = _profile?.$id
        if (!profileDocId) return []
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.notifications,
            [Query.equal('profiles', profileDocId), Query.orderDesc('created_at'), Query.limit(50)]
        )
        return res.documents || []
    } catch { return [] }
}

async function getUnreadCount(userId) {
    const notifs = await fetchNotifications(userId)
    return notifs.filter(n => !n.is_read).length
}

async function markNotificationRead(notifId) {
    initDb()
    const db = getDb()
    try {
        await db.updateDocument(CONFIG.database.id, CONFIG.database.collections.notifications, notifId, { is_read: true })
        return true
    } catch { return false }
}

async function createNotification(userId, type, title, message) {
    initDb()
    const db = getDb()
    const { ID, Permission, Role } = Appwrite
    try {
        const profileDocId = _profile?.$id
        if (!profileDocId) return null
        return await db.createDocument(
            CONFIG.database.id,
            CONFIG.database.collections.notifications,
            ID.unique(),
            {
                profiles: profileDocId,
                title,
                message,
                notification_type: type || 'info',
                is_read: false,
                created_at: new Date().toISOString(),
                priority: 'medium'
            },
            [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId))
            ]
        )
    } catch (e) { console.warn('createNotification failed:', e); return null }
}
