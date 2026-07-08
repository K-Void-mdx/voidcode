const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1'
const APPWRITE_PROJECT_ID = 'YOUR_PROJECT_ID'

let _client = null
let _account = null

async function initAppwrite() {
    if (typeof Appwrite === 'undefined') {
        setTimeout(initAppwrite, 200)
        return false
    }
    if (_client) return true
    const { Client, Account } = Appwrite
    _client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID)
    _account = new Account(_client)
    return true
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
    const user = await acc.create({
        userId: ID.unique(),
        email,
        password
    })
    return user
}

async function sendVerification() {
    const acc = getAccount()
    await acc.createVerification({
        url: window.location.origin + window.location.pathname
    })
}

async function completeVerification(userId, secret) {
    const acc = getAccount()
    await acc.updateVerification({ userId, secret })
}

async function logIn(email, password) {
    const acc = getAccount()
    const session = await acc.createEmailPasswordSession({ email, password })
    return session
}

async function logOut() {
    const acc = getAccount()
    try { await acc.deleteSession('current') } catch {}
}

async function sendPasswordReset(email) {
    const acc = getAccount()
    await acc.createRecovery({
        email,
        url: window.location.origin + window.location.pathname
    })
}

async function completePasswordReset(userId, secret, password) {
    const acc = getAccount()
    await acc.updateRecovery({ userId, secret, password })
}

async function updateName(name) {
    const acc = getAccount()
    await acc.updateName(name)
}
