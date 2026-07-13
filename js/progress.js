let _allUserProgressCache = null

async function saveLessonProgress(userId, courseId, lessonId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    const { ID, Permission, Role } = Appwrite
    try {
        const profileDocId = _profile?.$id
        const lessonDocId = getLessonDocId(lessonId)
        if (!profileDocId || !lessonDocId) return null

        const existing = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.lessonProgress,
            [Query.equal('profiles', profileDocId), Query.equal('lessons', lessonDocId)]
        )
        if (existing.documents.length) return existing.documents[0]

        const doc = await db.createDocument(
            CONFIG.database.id,
            CONFIG.database.collections.lessonProgress,
            ID.unique(),
            {
                profiles: profileDocId,
                lessons: lessonDocId,
                status: 'completed',
                completion_percentage: 100,
                started_at: new Date().toISOString(),
                completed_at: new Date().toISOString(),
                last_opened_at: new Date().toISOString(),
                time_spent_minutes: 0,
                review_status: 'not_reviewed'
            },
            [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId))
            ]
        )
        if (_allUserProgressCache) _allUserProgressCache.push(doc)
        return doc
    } catch (e) {
        console.warn('saveLessonProgress failed:', e)
        return null
    }
}

async function getAllUserProgress(userId) {
    if (_allUserProgressCache) return _allUserProgressCache
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const profileDocId = _profile?.$id
        if (!profileDocId) { _allUserProgressCache = []; return _allUserProgressCache }
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.lessonProgress,
            [Query.equal('profiles', profileDocId)]
        )
        _allUserProgressCache = res.documents || []
        return _allUserProgressCache
    } catch {
        _allUserProgressCache = []
        return _allUserProgressCache
    }
}

function clearProgressCache() { _allUserProgressCache = null }

async function getLessonProgress(userId, courseId) {
    const allProgress = await getAllUserProgress(userId)
    const courseLessons = await fetchLessons(courseId)
    const lessonDocIds = new Set(courseLessons.map(l => l.$id))
    return allProgress.filter(p => lessonDocIds.has(p.lessons))
}

async function isLessonComplete(userId, courseId, lessonId) {
    const lessonDocId = getLessonDocId(lessonId)
    if (!lessonDocId) return false
    const progress = await getLessonProgress(userId, courseId)
    return progress.some(p => p.lessons === lessonDocId)
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
    const lessonToCourse = getLessonCourseMap()
    const progressByCourse = {}
    for (const p of allProgress) {
        const courseId = lessonToCourse[p.lessons]
        if (courseId) {
            if (!progressByCourse[courseId]) progressByCourse[courseId] = 0
            progressByCourse[courseId]++
        }
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
