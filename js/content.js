let _coursesCache = null
let _lessonsCache = {}

async function fetchCourses(force) {
    if (_coursesCache && !force) return _coursesCache
    try {
        initDb()
        const db = getDb()
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.courses
        )
        _coursesCache = (res.documents || []).map(formatCourseDoc)

        const allLessonsRes = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.lessons
        )
        const allLessons = (allLessonsRes.documents || []).map(formatLessonDoc)
        _lessonsCache = {}
        for (const l of allLessons) {
            if (!_lessonsCache[l.courseId]) _lessonsCache[l.courseId] = []
            _lessonsCache[l.courseId].push(l)
        }
        for (const c of _coursesCache) {
            c.lessons = _lessonsCache[c.id] || []
        }

        return _coursesCache
    } catch (e) {
        console.warn('Failed to fetch courses from Appwrite, using local data:', e)
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
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.lessons,
            [Query.equal('courseId', courseId), Query.orderAsc('order')]
        )
        const lessons = (res.documents || []).map(formatLessonDoc)
        _lessonsCache[courseId] = lessons
        return lessons
    } catch (e) {
        console.warn('Failed to fetch lessons from Appwrite:', e)
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
        id: doc.id || doc.$id,
        title: doc.title || '',
        icon: doc.icon || '',
        subtitle: doc.subtitle || '',
        desc: doc.description || doc.desc || '',
        difficulty: doc.difficulty || 'Beginner',
        duration: doc.duration || '',
        category: doc.category || '',
        color: doc.color || '#7c3aed',
        popular: !!doc.popular,
        rating: parseFloat(doc.rating) || 4.5,
        lessons: []
    }
}

function formatLessonDoc(doc) {
    return {
        $id: doc.$id,
        id: doc.id || doc.$id,
        courseId: doc.courseId || '',
        title: doc.title || '',
        icon: doc.icon || '',
        desc: doc.description || doc.desc || '',
        concepts: Array.isArray(doc.concepts) ? doc.concepts : [],
        summary: Array.isArray(doc.summary) ? doc.summary : [],
        quiz: doc.quiz || null,
        order: parseInt(doc.order) || 0
    }
}

function clearContentCache() {
    _coursesCache = null
    _lessonsCache = {}
}
