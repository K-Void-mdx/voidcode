const SUPABASE_URL = 'https://ihgtkkjhcffwbcvgbvxr.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZ3Rra2poY2Zmd2JjdmdidnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MzE0OTIsImV4cCI6MjA5OTEwNzQ5Mn0.km2Ot8-ilJVQ8CIKqHRHt8LC5YmEakitujNu79xCRZU'

let _supabase = null
let _user = null

function loadSDK() {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        return true
    }
    return false
}
function tryInit() { if (!loadSDK()) setTimeout(tryInit, 300) }
tryInit()

window.currentUser = null

// Send OTP code to email (creates user automatically if new)
window.sendOTP = async function(email) {
    if (!_supabase) throw new Error('Supabase not ready')
    const { data, error } = await _supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true }
    })
    if (error) throw error
    return data
}

// Verify OTP code
window.verifyOTP = async function(email, token) {
    if (!_supabase) throw new Error('Supabase not ready')
    const { data, error } = await _supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
    })
    if (error) throw error
    _user = data.user
    window.currentUser = _user
    updateAuthUI()
    return data
}

// Update user metadata after signup (name, username, gender, avatar)
window.updateUserProfile = async function(profileData) {
    if (!_supabase) throw new Error('Supabase not ready')
    const { data, error } = await _supabase.auth.updateUser({
        data: profileData
    })
    if (error) throw error
    _user = data.user
    window.currentUser = _user
    return data
}

// Update password
window.updatePassword = async function(newPassword) {
    if (!_supabase) throw new Error('Supabase not ready')
    const { data, error } = await _supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
    return data
}

// Login with email + password (for returning users)
window.signInWithPassword = async function(email, password) {
    if (!_supabase) throw new Error('Supabase not ready')
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    _user = data.user
    window.currentUser = _user
    updateAuthUI()
    return data
}

// Google login
window.signInWithGoogle = async function() {
    if (!_supabase) throw new Error('Supabase not ready')
    const { data, error } = await _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + window.location.pathname }
    })
    if (error) throw error
    return data
}

// Logout
window.logout = async function() {
    if (!_supabase) return
    await _supabase.auth.signOut()
    _user = null
    window.currentUser = null
    updateAuthUI()
    navigate('home')
}

// Check existing session
async function checkUser() {
    if (!_supabase) { setTimeout(checkUser, 500); return }
    try {
        const { data: { user } } = await _supabase.auth.getUser()
        if (user) { _user = user; window.currentUser = user }
    } catch {}
    updateAuthUI()
}

function updateAuthUI() {
    const btn = document.getElementById('navAuthBtn')
    if (!btn) return
    if (_user) {
        const name = _user.user_metadata?.first_name || _user.email?.split('@')[0] || 'User'
        btn.textContent = `👤 ${name}`
        btn.onclick = window.logout
    } else {
        btn.textContent = 'Login'
        btn.onclick = () => navigate('login')
    }
}

setTimeout(checkUser, 1000)
