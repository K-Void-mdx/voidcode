const SUPABASE_URL = 'https://ihgtkkjhcffwbcvgbvxr.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZ3Rra2poY2Zmd2JjdmdidnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MzE0OTIsImV4cCI6MjA5OTEwNzQ5Mn0.km2Ot8-ilJVQ8CIKqHRHt8LC5YmEakitujNu79xCRZU'

let supabase = null
let currentUser = null

function initSupabase() {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        checkUser()
    } else {
        console.warn('Supabase SDK not loaded yet, retrying...')
        setTimeout(initSupabase, 500)
    }
}

async function checkUser() {
    if (!supabase) return
    try {
        const { data: { user } } = await supabase.auth.getUser()
        currentUser = user
    } catch {}
    updateAuthUI()
}

function updateAuthUI() {
    const btn = document.getElementById('navAuthBtn')
    if (!btn) return
    if (currentUser) {
        const name = currentUser.email ? currentUser.email.split('@')[0] : 'User'
        btn.innerHTML = `👤 ${name}`
        btn.onclick = logout
        btn.style.cursor = 'pointer'
    } else {
        btn.textContent = 'Login'
        btn.onclick = () => navigate('login')
    }
}

async function signUp(email, password) {
    if (!supabase) throw new Error('Supabase not initialized')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
}

async function signIn(email, password) {
    if (!supabase) throw new Error('Supabase not initialized')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    currentUser = data.user
    updateAuthUI()
    return data
}

async function signInWithGoogle() {
    if (!supabase) throw new Error('Supabase not initialized')
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + window.location.pathname }
    })
    if (error) throw error
    return data
}

async function logout() {
    if (!supabase) return
    await supabase.auth.signOut()
    currentUser = null
    updateAuthUI()
    navigate('home')
}

initSupabase()
