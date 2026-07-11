async function createProfile(userId, data) {
    initDb()
    const db = getDb()
    const { ID } = Appwrite
    const doc = await db.createDocument(
        CONFIG.database.id,
        CONFIG.database.collections.profiles,
        ID.unique(),
        { userId, ...data }
    )
    return doc
}

async function getProfile(userId) {
    if (!initDb()) return null
    try {
        const Query = getQuery()
        const docs = await getDb().listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.profiles,
            [Query.equal('userId', userId)]
        )
        return docs.documents[0] || null
    } catch { return null }
}

async function updateProfile(docId, data) {
    initDb()
    const db = getDb()
    const doc = await db.updateDocument(
        CONFIG.database.id,
        CONFIG.database.collections.profiles,
        docId,
        data
    )
    return doc
}

async function uploadAvatar(file) {
    initDb()
    const storage = getStorage()
    const { ID } = Appwrite
    const result = await storage.createFile(
        CONFIG.storage.avatarsBucketId,
        ID.unique(),
        file
    )
    return result.$id
}

function getAvatarFileUrl(fileId) {
    try {
        const storage = getStorage()
        return storage.getFileView(CONFIG.storage.avatarsBucketId, fileId).toString()
    } catch {
        return ''
    }
}
