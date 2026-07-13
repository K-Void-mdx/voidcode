function getAllPaths() {
    return CONFIG.learningPaths || []
}

function getPath(pathId) {
    return getAllPaths().find(p => p.id === pathId) || null
}

function getPathsForCourse(courseSlug) {
    return getAllPaths().filter(p => p.steps.some(s => s.course_slug === courseSlug))
}

async function getPathProgress(pathId, userId) {
    const path = getPath(pathId)
    if (!path || !userId) return { completed: 0, total: path?.steps.length || 0, percent: 0, stepStatuses: [] }

    const courses = await fetchCourses()
    const progressMap = await getCourseProgressAll(userId)

    const stepStatuses = path.steps.map(step => {
        const course = courses.find(c => c.id === step.course_slug)
        const pct = course ? (progressMap[course.id] || 0) : 0
        return {
            course_slug: step.course_slug,
            title: step.title,
            desc: step.desc,
            exists: !!course,
            completed: pct >= 100,
            in_progress: pct > 0 && pct < 100,
            percent: pct
        }
    })

    const completed = stepStatuses.filter(s => s.completed).length
    const total = stepStatuses.length
    return {
        completed,
        total,
        percent: total ? Math.round((completed / total) * 100) : 0,
        stepStatuses
    }
}

async function getNextPathStep(pathId, userId) {
    const progress = await getPathProgress(pathId, userId)
    return progress.stepStatuses.find(s => !s.completed) || null
}

async function getRecommendedPath(userId) {
    if (!userId) return null
    const paths = getAllPaths()
    if (!paths.length) return null

    let bestPath = null
    let bestScore = -1

    for (const path of paths) {
        const progress = await getPathProgress(path.id, userId)
        if (progress.completed === 0) {
            if (bestScore < 0) {
                bestScore = 0
                bestPath = { path, progress, reason: 'new' }
            }
        } else if (progress.percent < 100) {
            if (progress.percent > bestScore) {
                bestScore = progress.percent
                bestPath = { path, progress, reason: 'in_progress' }
            }
        }
    }

    if (!bestPath) {
        bestPath = { path: paths[0], progress: { completed: 0, total: paths[0].steps.length, percent: 0 }, reason: 'suggested' }
    }

    return bestPath
}

async function getPathForCourseContext(courseSlug, userId) {
    const paths = getPathsForCourse(courseSlug)
    if (!paths.length) return null

    const results = []
    for (const path of paths) {
        const progress = await getPathProgress(path.id, userId)
        const stepIdx = path.steps.findIndex(s => s.course_slug === courseSlug)
        results.push({
            path,
            progress,
            stepIndex: stepIdx,
            isPreviousCompleted: stepIdx === 0 ? true : progress.stepStatuses[stepIdx - 1]?.completed,
            isNextAvailable: stepIdx < path.steps.length - 1,
            nextStep: stepIdx < path.steps.length - 1 ? path.steps[stepIdx + 1] : null
        })
    }
    return results.length ? results : null
}

function isCourseUnlocked(courseSlug, pathId, userId) {
    const path = getPath(pathId)
    if (!path) return true
    const stepIdx = path.steps.findIndex(s => s.course_slug === courseSlug)
    if (stepIdx <= 0) return true
    return true
}

function getPathStepNumber(courseSlug, pathId) {
    const path = getPath(pathId)
    if (!path) return null
    const idx = path.steps.findIndex(s => s.course_slug === courseSlug)
    return idx >= 0 ? idx + 1 : null
}
