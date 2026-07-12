async function fetchNotifications(userId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.notifications,
            [Query.equal('userId', userId), Query.orderDesc('created_at'), Query.limit(50)]
        )
        return res.documents || []
    } catch { return [] }
}

async function getUnreadCount(userId) {
    const notifs = await fetchNotifications(userId)
    return notifs.filter(n => !n.read).length
}

async function markNotificationRead(notifId) {
    initDb()
    const db = getDb()
    try {
        await db.updateDocument(CONFIG.database.id, CONFIG.database.collections.notifications, notifId, { read: true })
        return true
    } catch { return false }
}

async function createNotification(userId, type, title, message) {
    initDb()
    const db = getDb()
    const { ID } = Appwrite
    try {
        return await db.createDocument(
            CONFIG.database.id,
            CONFIG.database.collections.notifications,
            ID.unique(),
            { userId, type: type || 'info', title, message, read: false, created_at: new Date().toISOString() }
        )
    } catch (e) { console.warn('createNotification failed:', e); return null }
}
