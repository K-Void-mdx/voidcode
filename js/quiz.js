async function fetchQuiz(lessonId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const lessonDocId = getLessonDocId(lessonId)
        if (!lessonDocId) return null
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.quizzes,
            [Query.equal('lessons', lessonDocId)]
        )
        return res.documents[0] || null
    } catch { return null }
}

async function fetchQuizQuestions(quizId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.quizQuestions,
            [Query.equal('quizzes', quizId), Query.orderAsc('display_order')]
        )
        return (res.documents || []).map(q => ({
            ...q,
            options: q.options ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : []
        }))
    } catch { return [] }
}

async function submitQuizAttempt(userId, quizId, answers, score, total) {
    initDb()
    const db = getDb()
    const { ID, Permission, Role } = Appwrite
    try {
        const profileDocId = _profile?.$id
        if (!profileDocId) return null

        const existingAttempts = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.quizAttempts,
            [Query.equal('profiles', profileDocId), Query.equal('quizzes', quizId)]
        )
        const attemptNumber = existingAttempts.documents.length + 1
        const passed = total > 0 ? (score / total * 100) >= 70 : false

        return await db.createDocument(
            CONFIG.database.id,
            CONFIG.database.collections.quizAttempts,
            ID.unique(),
            {
                profiles: profileDocId,
                quizzes: quizId,
                attempt_number: attemptNumber,
                score: total > 0 ? (score / total * 100) : 0,
                passed,
                time_taken_minutes: 0,
                started_at: new Date().toISOString(),
                submitted_at: new Date().toISOString(),
                answers: JSON.stringify(answers),
                feedback_generated: false
            },
            [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId))
            ]
        )
    } catch (e) { console.warn('submitQuizAttempt failed:', e); return null }
}

async function getQuizAttempts(userId, quizId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const profileDocId = _profile?.$id
        if (!profileDocId) return []
        const queries = [Query.equal('profiles', profileDocId)]
        if (quizId) queries.push(Query.equal('quizzes', quizId))
        queries.push(Query.orderDesc('submitted_at'))
        const res = await db.listDocuments(CONFIG.database.id, CONFIG.database.collections.quizAttempts, queries)
        return res.documents || []
    } catch { return [] }
}
