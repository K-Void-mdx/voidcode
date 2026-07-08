const SUPABASE_URL = 'https://ihgtkkjhcffwbcvgbvxr.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZ3Rra2poY2Zmd2JjdmdidnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MzE0OTIsImV4cCI6MjA5OTEwNzQ5Mn0.km2Ot8-ilJVQ8CIKqHRHt8LC5YmEakitujNu79xCRZU'

let _supabase = null
let _user = null

function init() {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        return true
    }
    return false
}
if (!init()) setTimeout(() => init() || setTimeout(() => init(), 500), 300)

window.currentUser = null

// STEP 1: Create account with email + password (stores profile data in metadata)
// With "Confirm email" OFF, user is auto-logged in after signup
window.signUpWithEmail = async function(email, password, profile) {
    if (!_supabase) throw new Error('Connecting...')
    const { data, error } = await _supabase.auth.signUp({
        email,
        password,
        options: { data: profile }
    })
    if (error) throw error
    _user = data.user
    window.currentUser = _user
    updateUI()
    return data
}

// STEP 2: Send 6-digit verification code to email
window.sendCode = async function(email) {
    if (!_supabase) throw new Error('Connecting...')
    const { data, error } = await _supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false }
    })
    if (error) throw error
    return data
}

// STEP 3: Verify 6-digit code and login
window.verifyCode = async function(email, token) {
    if (!_supabase) throw new Error('Connecting...')
    const { data, error } = await _supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
    })
    if (error) throw error
    _user = data.user
    window.currentUser = _user
    updateUI()
    return data
}

// Update profile metadata
window.updateProfile = async function(data) {
    if (!_supabase) throw new Error('Connecting...')
    const { data: res, error } = await _supabase.auth.updateUser({ data })
    if (error) throw error
    _user = res.user
    window.currentUser = _user
    return res
}

// Set password after OTP signup
window.setPassword = async function(pw) {
    if (!_supabase) throw new Error('Connecting...')
    const { data, error } = await _supabase.auth.updateUser({ password: pw })
    if (error) throw error
    return data
}

// Standard login with email + password
window.loginWithPassword = async function(email, password) {
    if (!_supabase) throw new Error('Connecting...')
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    _user = data.user
    window.currentUser = _user
    updateUI()
    return data
}

// Google login
window.loginWithGoogle = async function() {
    if (!_supabase) throw new Error('Connecting...')
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
    updateUI()
    navigate('home')
}

// Restore session
async function restore() {
    if (!_supabase) { setTimeout(restore, 500); return }
    try {
        const { data: { user } } = await _supabase.auth.getUser()
        if (user) { _user = user; window.currentUser = user }
    } catch {}
    updateUI()
}

function updateUI() {
    const btn = document.getElementById('navAuthBtn')
    if (!btn) return
    if (_user) {
        const m = _user.user_metadata || {}
        btn.textContent = `👤 ${m.first_name || m.username || _user.email?.split('@')[0] || 'User'}`
        btn.onclick = window.logout
    } else {
        btn.textContent = 'Login'
        btn.onclick = () => navigate('login')
    }
}

setTimeout(restore, 1000)
