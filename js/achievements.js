let _achievementsCache = null

async function fetchAchievements(force) {
    if (_achievementsCache && !force) return _achievementsCache
    initDb()
    const db = getDb()
    try {
        const res = await db.listDocuments(CONFIG.database.id, CONFIG.database.collections.achievements)
        _achievementsCache = res.documents || []
        return _achievementsCache
    } catch { _achievementsCache = []; return _achievementsCache }
}

async function fetchUserAchievements(userId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.userAchievements,
            [Query.equal('userId', userId)]
        )
        return res.documents || []
    } catch { return [] }
}

async function awardAchievement(userId, achievementId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    const { ID, Permission, Role } = Appwrite
    try {
        const existing = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.userAchievements,
            [Query.equal('userId', userId), Query.equal('achievementId', achievementId)]
        )
        if (existing.documents.length) return existing.documents[0]
        return await db.createDocument(
            CONFIG.database.id,
            CONFIG.database.collections.userAchievements,
            ID.unique(),
            { userId, achievementId, earned_at: new Date().toISOString() },
            [
                Permission.read(Role.user(userId))
            ]
        )
    } catch (e) { console.warn('awardAchievement failed:', e); return null }
}

async function checkAndAwardCertificate(userId, courseId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    const { ID, Permission, Role } = Appwrite
    try {
        const course = await fetchCourse(courseId)
        if (!course) return null
        const existing = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.certificates,
            [Query.equal('userId', userId), Query.equal('courseId', courseId)]
        )
        if (existing.documents.length) return existing.documents[0]
        return await db.createDocument(
            CONFIG.database.id,
            CONFIG.database.collections.certificates,
            ID.unique(),
            { userId, courseId, course_title: course.title, completed_at: new Date().toISOString() },
            [
                Permission.read(Role.user(userId))
            ]
        )
    } catch (e) { console.warn('checkAndAwardCertificate failed:', e); return null }
}

async function fetchCertificates(userId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.certificates,
            [Query.equal('userId', userId)]
        )
        return res.documents || []
    } catch { return [] }
}
