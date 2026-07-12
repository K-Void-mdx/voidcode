let _allUserProgressCache = null

async function saveLessonProgress(userId, courseId, lessonId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    const { ID } = Appwrite
    try {
        const existing = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.lessonProgress,
            [Query.equal('userId', userId), Query.equal('courseId', courseId), Query.equal('lessonId', lessonId)]
        )
        if (existing.documents.length) return existing.documents[0]
        const doc = await db.createDocument(
            CONFIG.database.id,
            CONFIG.database.collections.lessonProgress,
            ID.unique(),
            { userId, courseId, lessonId, completed_at: new Date().toISOString() }
        )
        if (_allUserProgressCache) _allUserProgressCache.push(doc)
        return doc
    } catch (e) {
        console.warn('saveLessonProgress failed:', e)
        return null
    }
}

async function getLessonProgress(userId, courseId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.lessonProgress,
            [Query.equal('userId', userId), Query.equal('courseId', courseId)]
        )
        return res.documents || []
    } catch { return [] }
}

async function getAllUserProgress(userId) {
    if (_allUserProgressCache) return _allUserProgressCache
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.lessonProgress,
            [Query.equal('userId', userId)]
        )
        _allUserProgressCache = res.documents || []
        return _allUserProgressCache
    } catch {
        _allUserProgressCache = []
        return _allUserProgressCache
    }
}

function clearProgressCache() { _allUserProgressCache = null }

async function isLessonComplete(userId, courseId, lessonId) {
    const progress = await getLessonProgress(userId, courseId)
    return progress.some(p => p.lessonId === lessonId)
}

async function getCourseProgress(userId, courseId) {
    const course = await fetchCourse(courseId)
    if (!course || !course.lessons || !course.lessons.length) return 0
    const progress = await getLessonProgress(userId, courseId)
    return Math.round((progress.length / course.lessons.length) * 100)
}

async function getCourseProgressAll(userId) {
    const courses = await fetchCourses()
    const result = {}
    if (!userId) { for (const c of courses) result[c.id] = 0; return result }
    const allProgress = await getAllUserProgress(userId)
    const progressByCourse = {}
    for (const p of allProgress) {
        if (!progressByCourse[p.courseId]) progressByCourse[p.courseId] = 0
        progressByCourse[p.courseId]++
    }
    for (const c of courses) {
        const total = c.lessons?.length || 0
        const done = progressByCourse[c.id] || 0
        result[c.id] = total ? Math.round((done / total) * 100) : 0
    }
    return result
}

async function getTotalStats() {
    const courses = await fetchCourses()
    const userId = _user?.$id
    let total = 0
    for (const c of courses) total += c.lessons?.length || 0
    if (!userId) return { total, done: 0, courses: courses.length }
    const allProgress = await getAllUserProgress(userId)
    return { total, done: allProgress.length, courses: courses.length }
}

async function migrateLocalProgress() {
    if (!_user) return
    try {
        const localData = localStorage.getItem('kvoid_progress')
        if (localData) {
            const progress = JSON.parse(localData) || {}
            let migrated = 0
            for (const [courseId, lessonIds] of Object.entries(progress)) {
                for (const lessonId of lessonIds) {
                    const result = await saveLessonProgress(_user.$id, courseId, lessonId)
                    if (result) migrated++
                }
            }
            if (migrated) localStorage.removeItem('kvoid_progress')
        }
    } catch (e) { console.warn('Local progress migration skipped:', e) }
}
