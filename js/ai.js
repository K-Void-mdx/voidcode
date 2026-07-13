let _aiProvider = null

function setAiProvider(provider) {
    _aiProvider = provider
    return true
}

function getAiProvider() {
    return _aiProvider
}

function _getAdminAiKeys() {
    try { return JSON.parse(localStorage.getItem('kvoid_ai_keys') || '{}') }
    catch { return {} }
}

async function askVoidAssistant(message, context) {
    const courseContext = context || await getConversationContext()
    const keys = _getAdminAiKeys()

    const resp = await fetch(CONFIG.ai.proxyEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            context: courseContext,
            provider: _aiProvider || undefined,
            keys: Object.keys(keys).length ? keys : undefined
        })
    })

    if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: resp.statusText }))
        throw new Error(err.error || 'AI request failed')
    }

    const data = await resp.json()
    if (data.provider) {
        _aiProvider = data.provider
    }
    return data.reply
}

async function getConversationContext() {
    const courses = await fetchCourses()
    const courseInfo = courses.slice(0, 3).map(c => c.title + ' (' + c.difficulty + ', ' + c.category + ')').join(', ')
    const userLevel = _profile?.level || 1
    return 'Available courses: ' + courseInfo + '. User level: ' + userLevel + '.'
}
