function _chatStorageKey() {
    return 'kvoid_chats_' + (_user?.$id || 'anon')
}

function loadChatHistory() {
    try {
        return JSON.parse(localStorage.getItem(_chatStorageKey()) || '[]')
    } catch { return [] }
}

function saveChatHistory(chats) {
    localStorage.setItem(_chatStorageKey(), JSON.stringify(chats))
}

function createNewChat() {
    const chats = loadChatHistory()
    const chat = {
        id: 'chat_' + Date.now(),
        title: 'New Chat',
        messages: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
    chats.unshift(chat)
    saveChatHistory(chats)
    return chat
}

function getCurrentChatId() {
    return localStorage.getItem('kvoid_current_chat_' + (_user?.$id || 'anon')) || null
}

function setCurrentChatId(chatId) {
    localStorage.setItem('kvoid_current_chat_' + (_user?.$id || 'anon'), chatId || '')
}

function getCurrentChat() {
    const chatId = getCurrentChatId()
    if (!chatId) return null
    const chats = loadChatHistory()
    return chats.find(c => c.id === chatId) || null
}

function addMessageToChat(chatId, role, content) {
    const chats = loadChatHistory()
    const chat = chats.find(c => c.id === chatId)
    if (!chat) return
    chat.messages.push({ role, content, timestamp: new Date().toISOString() })
    chat.updated_at = new Date().toISOString()

    if (chat.messages.length === 1 && role === 'user') {
        chat.title = content.slice(0, 50) + (content.length > 50 ? '...' : '')
    }

    saveChatHistory(chats)
    return chat
}

function deleteChat(chatId) {
    let chats = loadChatHistory()
    chats = chats.filter(c => c.id !== chatId)
    saveChatHistory(chats)
    if (getCurrentChatId() === chatId) {
        setCurrentChatId(chats.length ? chats[0].id : null)
    }
}

function getChatMessages(chatId) {
    const chats = loadChatHistory()
    const chat = chats.find(c => c.id === chatId)
    return chat ? chat.messages : []
}

function formatChatTimestamp(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now - d
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return diffMins + 'm ago'
    if (diffHours < 24) return diffHours + 'h ago'
    if (diffDays < 7) return diffDays + 'd ago'
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
