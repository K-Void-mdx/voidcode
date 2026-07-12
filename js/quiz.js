async function fetchQuiz(lessonId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.quizzes,
            [Query.equal('lessonId', lessonId)]
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
            [Query.equal('quizId', quizId), Query.orderAsc('order')]
        )
        return res.documents || []
    } catch { return [] }
}

async function submitQuizAttempt(userId, quizId, answers, score, total) {
    initDb()
    const db = getDb()
    const { ID } = Appwrite
    try {
        return await db.createDocument(
            CONFIG.database.id,
            CONFIG.database.collections.quizAttempts,
            ID.unique(),
            { userId, quizId, answers: JSON.stringify(answers), score, total, completed_at: new Date().toISOString() }
        )
    } catch (e) { console.warn('submitQuizAttempt failed:', e); return null }
}

async function getQuizAttempts(userId, quizId) {
    initDb()
    const db = getDb()
    const Query = getQuery()
    try {
        const queries = [Query.equal('userId', userId)]
        if (quizId) queries.push(Query.equal('quizId', quizId))
        queries.push(Query.orderDesc('completed_at'))
        const res = await db.listDocuments(CONFIG.database.id, CONFIG.database.collections.quizAttempts, queries)
        return res.documents || []
    } catch { return [] }
}
