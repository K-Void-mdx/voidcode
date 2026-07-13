let _coursesCache = null
let _lessonsCache = {}

async function fetchCourses(force) {
    if (_coursesCache && !force) return _coursesCache
    try {
        initDb()
        const db = getDb()
        const res = await db.listDocuments(CONFIG.database.id, CONFIG.database.collections.courses)
        _coursesCache = (res.documents || []).map(formatCourseDoc)

        const docIdToSlug = {}
        for (const c of _coursesCache) docIdToSlug[c.$id] = c.id

        const allLessonsRes = await db.listDocuments(CONFIG.database.id, CONFIG.database.collections.lessons)
        const allLessons = (allLessonsRes.documents || []).map(formatLessonDoc)
        _lessonsCache = {}
        for (const l of allLessons) {
            const key = docIdToSlug[l.courseId] || l.courseId
            if (!_lessonsCache[key]) _lessonsCache[key] = []
            _lessonsCache[key].push(l)
        }
        for (const c of _coursesCache) c.lessons = _lessonsCache[c.id] || []
        return _coursesCache
    } catch (e) {
        console.warn('Failed to fetch from Appwrite, using local data:', e)
        return COURSES || []
    }
}

async function fetchCourse(courseId) {
    const courses = await fetchCourses()
    return courses.find(c => c.id === courseId) || null
}

async function fetchLessons(courseId, force) {
    if (_lessonsCache[courseId] && !force) return _lessonsCache[courseId]
    try {
        initDb()
        const db = getDb()
        const Query = getQuery()
        const courseDocId = getCourseDocId(courseId) || courseId
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.lessons,
            [Query.equal('courses', courseDocId), Query.orderAsc('lesson_order')]
        )
        const lessons = (res.documents || []).map(formatLessonDoc)
        _lessonsCache[courseId] = lessons
        return lessons
    } catch (e) {
        console.warn('Failed to fetch lessons:', e)
        const course = COURSES.find(c => c.id === courseId)
        return course ? course.lessons : []
    }
}

async function fetchLesson(courseId, lessonId) {
    const lessons = await fetchLessons(courseId)
    return lessons.find(l => l.id === lessonId) || null
}

function formatCourseDoc(doc) {
    return {
        $id: doc.$id,
        id: doc.slug || doc.$id,
        title: doc.course_title || '',
        icon: '',
        subtitle: '',
        desc: doc.description || '',
        difficulty: doc.difficulty || 'Beginner',
        duration: doc.estimated_hours ? doc.estimated_hours + ' hours' : '',
        category: doc.category || '',
        color: '#C9922A',
        popular: false,
        rating: 4.5,
        lessons: []
    }
}

function formatLessonDoc(doc) {
    let concepts = []
    let summary = []
    try {
        const contentData = JSON.parse(doc.content || '{}')
        if (contentData.concepts) {
            concepts = contentData.concepts.map(c => {
                if (typeof c === 'string') return JSON.parse(c)
                return c
            }).filter(c => c && c.title)
        }
        if (contentData.summary) summary = contentData.summary.filter(Boolean)
    } catch {
        try { concepts = JSON.parse(doc.content || '[]') } catch {}
    }

    return {
        $id: doc.$id,
        id: doc.slug || doc.$id,
        courseId: getCourseSlug(doc.courses) || doc.courses || '',
        title: doc.lesson_title || '',
        icon: '',
        desc: doc.description || '',
        concepts,
        summary,
        quiz: null,
        order: parseInt(doc.lesson_order) || 0
    }
}

function clearContentCache() { _coursesCache = null; _lessonsCache = {} }

function getLessonDocId(slug) {
    for (const lessons of Object.values(_lessonsCache)) {
        const found = lessons.find(l => l.id === slug)
        if (found) return found.$id
    }
    return null
}

function getLessonSlug(docId) {
    for (const lessons of Object.values(_lessonsCache)) {
        const found = lessons.find(l => l.$id === docId)
        if (found) return found.id
    }
    return null
}

function getCourseDocId(slug) {
    if (!_coursesCache) return null
    const found = _coursesCache.find(c => c.id === slug)
    return found ? found.$id : null
}

function getCourseSlug(docId) {
    if (!_coursesCache) return null
    const found = _coursesCache.find(c => c.$id === docId)
    return found ? found.id : null
}

function getLessonCourseMap() {
    const map = {}
    for (const [courseSlug, lessons] of Object.entries(_lessonsCache)) {
        for (const l of lessons) {
            map[l.$id] = courseSlug
        }
    }
    return map
}
