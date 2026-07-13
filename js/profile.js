function _userPerms(userId) {
    const { Permission, Role } = Appwrite
    return [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId))
    ]
}

async function createProfile(userId, data) {
    initDb()
    const db = getDb()
    const { ID } = Appwrite
    const doc = await db.createDocument(
        CONFIG.database.id,
        CONFIG.database.collections.profiles,
        ID.unique(),
        { appwrite_user_id: userId, ...data },
        _userPerms(userId)
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
            [Query.equal('appwrite_user_id', userId)]
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
    const { ID, Permission, Role } = Appwrite
    const result = await storage.createFile(
        CONFIG.storage.uploadsBucketId,
        ID.unique(),
        file,
        [Permission.read(Role.any())]
    )
    return result.$id
}

function getAvatarFileUrl(fileId) {
    if (!fileId) return ''
    try {
        const endpoint = CONFIG.appwrite.endpoint.replace(/\/v1$/, '')
        const projectId = CONFIG.appwrite.projectId
        const bucket = CONFIG.storage.uploadsBucketId
        return endpoint + '/v1/storage/buckets/' + bucket + '/files/' + fileId + '/view?project=' + projectId
    } catch {
        return ''
    }
}
