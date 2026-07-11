let _aiProvider = CONFIG.ai.defaultProvider
let _aiListeners = []

function onAiProviderChange(fn) {
    _aiListeners.push(fn)
}

function setAiProvider(provider) {
    if (CONFIG.ai.providers[provider]) {
        _aiProvider = provider
        _aiListeners.forEach(fn => fn(provider))
        return true
    }
    return false
}

function getAiProvider() {
    return _aiProvider
}

function getAiProviderConfig() {
    return CONFIG.ai.providers[_aiProvider]
}

function buildApiKeyName(provider) {
    const keyMap = {
        groq: 'GROQ_API_KEY',
        gemini: 'GEMINI_API_KEY',
        openrouter: 'OPENROUTER_API_KEY',
        opencodezen: 'OPENCODE_ZEN_API_KEY'
    }
    return keyMap[provider] || null
}

async function askVoidAssistant(message, context) {
    const provider = getAiProviderConfig()
    if (!provider) throw new Error('No AI provider configured')

    const apiKeyName = buildApiKeyName(_aiProvider)
    const apiKey = (typeof window[apiKeyName] !== 'undefined') ? window[apiKeyName] :
                   (typeof __AI_KEYS__ !== 'undefined' && __AI_KEYS__[apiKeyName]) ? __AI_KEYS__[apiKeyName] :
                   promptForAiKey(apiKeyName)

    if (!apiKey) throw new Error('API key required for ' + provider.name + '. Set ' + apiKeyName + ' in your environment.')

    const systemMsg = CONFIG.ai.systemPrompt
    const courseContext = context || await getConversationContext()

    try {
        if (_aiProvider === 'gemini') {
            return await askGemini(apiKey, provider, systemMsg, message, courseContext)
        }
        return await askOpenAiLike(apiKey, provider, systemMsg, message, courseContext)
    } catch (e) {
        return await tryFallbackProvider(message, context)
    }
}

async function askOpenAiLike(apiKey, provider, systemMsg, message, context) {
    const resp = await fetch(provider.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
            model: provider.model,
            messages: [
                { role: 'system', content: systemMsg },
                ...(context ? [{ role: 'system', content: 'Current course context: ' + context }] : []),
                { role: 'user', content: message }
            ],
            max_tokens: 1024,
            temperature: 0.7
        })
    })
    if (!resp.ok) {
        const err = await resp.text()
        throw new Error(provider.name + ' error: ' + (err || resp.statusText))
    }
    const data = await resp.json()
    return data.choices[0].message.content
}

async function askGemini(apiKey, provider, systemMsg, message, context) {
    const url = provider.endpoint + '?key=' + apiKey
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: systemMsg + '\n\n' + (context ? 'Context: ' + context + '\n\n' : '') + message }]
            }],
            generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
        })
    })
    if (!resp.ok) {
        const err = await resp.text()
        throw new Error(provider.name + ' error: ' + (err || resp.statusText))
    }
    const data = await resp.json()
    return data.candidates[0].content.parts[0].text
}

async function tryFallbackProvider(message, context) {
    const providers = Object.keys(CONFIG.ai.providers)
    const currentIdx = providers.indexOf(_aiProvider)
    for (let i = 0; i < providers.length; i++) {
        const p = providers[(currentIdx + 1 + i) % providers.length]
        if (p === _aiProvider) continue
        const keyName = buildApiKeyName(p)
        const key = (typeof __AI_KEYS__ !== 'undefined' && __AI_KEYS__[keyName]) ? __AI_KEYS__[keyName] : null
        if (!key) continue
        try {
            _aiProvider = p
            const provider = CONFIG.ai.providers[p]
            if (p === 'gemini') return await askGemini(key, provider, CONFIG.ai.systemPrompt, message, context)
            return await askOpenAiLike(key, provider, CONFIG.ai.systemPrompt, message, context)
        } catch {}
    }
    throw new Error('All AI providers unavailable.')
}

async function getConversationContext() {
    const courses = await fetchCourses()
    const courseInfo = courses.slice(0, 3).map(c => c.title + ' (' + c.difficulty + ', ' + c.category + ')').join(', ')
    const userLevel = _profile?.learning_level || 'beginner'
    return 'Available courses: ' + courseInfo + '. User level: ' + userLevel + '.'
}

function promptForAiKey(keyName) {
    const key = prompt(CONFIG.app.fullName + ' needs an API key for ' + keyName + ' to use VOID Assistant.\n\nEnter your ' + keyName + ':')
    if (key && key.trim()) {
        if (!window.__AI_KEYS__) window.__AI_KEYS__ = {}
        window.__AI_KEYS__[keyName] = key.trim()
        return key.trim()
    }
    return null
}
