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
        const profileDocId = _profile?.$id
        if (!profileDocId) return []
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.userAchievements,
            [Query.equal('profiles', profileDocId)]
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
        const profileDocId = _profile?.$id
        if (!profileDocId) return null
        const existing = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.userAchievements,
            [Query.equal('profiles', profileDocId), Query.equal('achievementId', achievementId)]
        )
        if (existing.documents.length) return existing.documents[0]
        return await db.createDocument(
            CONFIG.database.id,
            CONFIG.database.collections.userAchievements,
            ID.unique(),
            { profiles: profileDocId, achievementId, earned_at: new Date().toISOString() },
            [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId))
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
        const profileDocId = _profile?.$id
        const courseDocId = getCourseDocId(courseId)
        if (!profileDocId || !courseDocId) return null
        const existing = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.certificates,
            [Query.equal('profiles', profileDocId), Query.equal('courses', courseDocId)]
        )
        if (existing.documents.length) return existing.documents[0]
        const code = 'KVOID-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
        return await db.createDocument(
            CONFIG.database.id,
            CONFIG.database.collections.certificates,
            ID.unique(),
            {
                profiles: profileDocId,
                courses: courseDocId,
                certificate_code: code,
                issued_at: new Date().toISOString(),
                final_score: 100,
                verification_status: 'verified',
                shared_publicly: false,
                verification_count: 0
            },
            [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId))
            ]
        )
    } catch (e) { console.warn('checkAndAwardCertificate failed:', e); return null }
}

async function fetchCertificates(userId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const profileDocId = _profile?.$id
        if (!profileDocId) return []
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.certificates,
            [Query.equal('profiles', profileDocId)]
        )
        return (res.documents || []).map(c => ({
            ...c,
            courseId: getCourseSlug(c.courses) || c.courses,
            course_title: getCourseSlug(c.courses) || 'Course',
            completed_at: c.issued_at
        }))
    } catch { return [] }
}
