let _client = null
let _account = null

async function initAppwrite() {
    if (_client) return true
    if (typeof Appwrite === 'undefined') {
        showToast('Failed to load Appwrite SDK. Check your internet connection.', 'error')
        return false
    }
    try {
        const { Client, Account } = Appwrite
        _client = new Client()
            .setEndpoint(CONFIG.appwrite.endpoint)
            .setProject(CONFIG.appwrite.projectId)
        _account = new Account(_client)
        return true
    } catch (e) {
        console.error('Appwrite init failed:', e)
        showToast('Failed to connect to server.', 'error')
        return false
    }
}

function getAccount() {
    if (!_account) throw new Error('Connecting to server...')
    return _account
}

async function getCurrentUser() {
    try {
        const acc = getAccount()
        const user = await acc.get()
        return user
    } catch {
        return null
    }
}

async function signUp(email, password) {
    const acc = getAccount()
    const { ID } = Appwrite
    const user = await acc.create(ID.unique(), email, password)
    return user
}

async function sendVerification() {
    const acc = getAccount()
    await acc.createVerification(window.location.origin + window.location.pathname)
}

async function completeVerification(userId, secret) {
    const acc = getAccount()
    await acc.updateVerification(userId, secret)
}

async function logIn(email, password) {
    const acc = getAccount()
    const session = await acc.createEmailPasswordSession(email, password)
    return session
}

async function logOut() {
    const acc = getAccount()
    try { await acc.deleteSession('current') } catch {}
}

async function sendPasswordReset(email) {
    const acc = getAccount()
    await acc.createRecovery(email, window.location.origin + window.location.pathname)
}

async function completePasswordReset(userId, secret, password) {
    const acc = getAccount()
    await acc.updateRecovery(userId, secret, password, password)
}

async function updateName(name) {
    const acc = getAccount()
    await acc.updateName(name)
}
