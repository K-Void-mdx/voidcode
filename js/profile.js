const DATABASE_ID = 'main'
const PROFILES_COLLECTION_ID = 'profiles'
const AVATARS_BUCKET_ID = 'avatars'

let _databases = null
let _storage = null

function ensureServices() {
    if (typeof Appwrite === 'undefined') return false
    if (!_databases) {
        const { Databases, Storage } = Appwrite
        _databases = new Databases(_client)
        _storage = new Storage(_client)
    }
    return true
}

async function createProfile(userId, data) {
    ensureServices()
    const { ID } = Appwrite
    const doc = await _databases.createDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        ID.unique(),
        { userId, ...data }
    )
    return doc
}

async function getProfile(userId) {
    ensureServices()
    try {
        const docs = await _databases.listDocuments(
            DATABASE_ID,
            PROFILES_COLLECTION_ID,
            [Appwrite.Query.equal('userId', userId)]
        )
        return docs.documents[0] || null
    } catch { return null }
}

async function updateProfile(docId, data) {
    ensureServices()
    const doc = await _databases.updateDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        docId,
        data
    )
    return doc
}

async function uploadAvatar(file) {
    ensureServices()
    const { ID } = Appwrite
    const result = await _storage.createFile(
        AVATARS_BUCKET_ID,
        ID.unique(),
        file
    )
    return result.$id
}

function getAvatarUrl(fileId) {
    if (!_storage) return ''
    return _storage.getFileView(AVATARS_BUCKET_ID, fileId)
}

function getProfileDefaultAvatar(gender, seed) {
    return getAvatarUrl(gender, seed)
}
