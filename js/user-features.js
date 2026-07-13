let _bookmarksCache = null

async function fetchBookmarks(userId, force) {
    if (_bookmarksCache && !force) return _bookmarksCache
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.bookmarks,
            [Query.equal('userId', userId)]
        )
        _bookmarksCache = (res.documents || []).map(d => d.courseId)
        return _bookmarksCache
    } catch { _bookmarksCache = []; return _bookmarksCache }
}

async function addBookmark(userId, courseId) {
    initDb()
    const db = getDb()
    const { ID, Permission, Role } = Appwrite
    try {
        await db.createDocument(
            CONFIG.database.id,
            CONFIG.database.collections.bookmarks,
            ID.unique(),
            { userId, courseId, created_at: new Date().toISOString() },
            [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId))
            ]
        )
        if (_bookmarksCache && !_bookmarksCache.includes(courseId)) _bookmarksCache.push(courseId)
        return true
    } catch (e) { console.warn('addBookmark failed:', e); return false }
}

async function removeBookmark(userId, courseId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.bookmarks,
            [Query.equal('userId', userId), Query.equal('courseId', courseId)]
        )
        if (res.documents.length) {
            await db.deleteDocument(CONFIG.database.id, CONFIG.database.collections.bookmarks, res.documents[0].$id)
        }
        if (_bookmarksCache) _bookmarksCache = _bookmarksCache.filter(id => id !== courseId)
        return true
    } catch (e) { console.warn('removeBookmark failed:', e); return false }
}

async function isBookmarked(courseId) {
    if (!_bookmarksCache) return false
    return _bookmarksCache.includes(courseId)
}

async function toggleBookmark(courseId) {
    const userId = _user?.$id
    if (!userId) return false
    const isBm = await isBookmarked(courseId)
    if (isBm) { await removeBookmark(userId, courseId); return false }
    else { await addBookmark(userId, courseId); return true }
}

async function migrateLocalBookmarks() {
    if (!_user) return
    try {
        const localData = localStorage.getItem('kvoid_bookmarks')
        if (!localData) return
        const bookmarks = JSON.parse(localData) || []
        for (const courseId of bookmarks) await addBookmark(_user.$id, courseId)
        localStorage.removeItem('kvoid_bookmarks')
    } catch (e) { console.warn('Bookmark migration skipped:', e) }
}

async function fetchNotes(userId, lessonId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const queries = [Query.equal('userId', userId)]
        if (lessonId) queries.push(Query.equal('lessonId', lessonId))
        queries.push(Query.orderDesc('created_at'))
        const res = await db.listDocuments(CONFIG.database.id, CONFIG.database.collections.notes, queries)
        return res.documents || []
    } catch { return [] }
}

async function createNote(userId, lessonId, content) {
    initDb()
    const db = getDb()
    const { ID, Permission, Role } = Appwrite
    try {
        return await db.createDocument(
            CONFIG.database.id,
            CONFIG.database.collections.notes,
            ID.unique(),
            { userId, lessonId, content, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId))
            ]
        )
    } catch (e) { console.warn('createNote failed:', e); return null }
}

async function updateNote(noteId, content) {
    initDb()
    const db = getDb()
    try {
        return await db.updateDocument(
            CONFIG.database.id,
            CONFIG.database.collections.notes,
            noteId,
            { content, updated_at: new Date().toISOString() }
        )
    } catch (e) { console.warn('updateNote failed:', e); return null }
}

async function deleteNote(noteId) {
    initDb()
    const db = getDb()
    try {
        await db.deleteDocument(CONFIG.database.id, CONFIG.database.collections.notes, noteId)
        return true
    } catch { return false }
}
