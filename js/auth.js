const SUPABASE_URL = 'https://ihgtkkjhcffwbcvgbvxr.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZ3Rra2poY2Zmd2JjdmdidnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MzE0OTIsImV4cCI6MjA5OTEwNzQ5Mn0.km2Ot8-ilJVQ8CIKqHRHt8LC5YmEakitujNu79xCRZU'

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

let currentUser = null

async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    currentUser = user
    updateAuthUI()
    return user
}

function updateAuthUI() {
    const btn = document.getElementById('navAuthBtn')
    if (!btn) return
    if (currentUser) {
        btn.textContent = `👤 ${currentUser.email.split('@')[0]} (Logout)`
        btn.onclick = logout
    } else {
        btn.textContent = 'Login'
        btn.onclick = () => navigate('login')
    }
}

async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
}

async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    currentUser = data.user
    updateAuthUI()
    return data
}

async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
    })
    if (error) throw error
    return data
}

async function logout() {
    await supabase.auth.signOut()
    currentUser = null
    updateAuthUI()
    navigate('home')
}

checkUser()
