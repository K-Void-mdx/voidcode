let _user = null
let _profile = null
let _profileDocId = null

function initTheme() {
    const saved = localStorage.getItem('kvoid_theme') || 'dark'
    document.documentElement.setAttribute('data-theme', saved)
    const btn = $('theme-toggle')
    if (btn) btn.textContent = saved === 'dark' ? '◑' : '◐'
}

window.toggleTheme = function() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark'
    const next = current === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('kvoid_theme', next)
    const btn = $('theme-toggle')
    if (btn) btn.textContent = next === 'dark' ? '◑' : '◐'
    if (_user && typeof updateSettings === 'function') {
        updateSettings(_user.$id, { theme: next }).catch(() => {})
    }
}

const _searchDebounce = debounce(function(val) {
    const q = val.trim()
    if (q.length < 1) return
    navigate('search/' + encodeURIComponent(q))
}, 300)
window.debounceSearch = function(val) { _searchDebounce(val) }

async function init() {
    initTheme()
    try {
        const ok = await initAppwrite()
        if (!ok) {
            const el = $('app')
            if (el) el.innerHTML = '<div class="auth-page"><div class="auth-card" style="text-align:center"><div class="auth-header"><h1>Connection Error</h1><p>Could not connect to the server. Please check your internet and try again.</p></div><button class="btn btn-primary" onclick="location.reload()">Retry</button></div></div>'
            return
        }

        initDb()

        const params = new URLSearchParams(window.location.search)
        const userId = params.get('userId')
        const secret = params.get('secret')

        if (userId && secret) {
            try {
                await completeVerification(userId, secret)
                window.history.replaceState({}, '', window.location.pathname)
                showToast('Email verified! You can now log in.', 'success')
                navigate('login')
                return
            } catch (e) {
                try {
                    await completePasswordReset(userId, secret, '')
                    window.history.replaceState({}, '', window.location.pathname)
                    navigate('forgot-confirm', userId + '/' + secret)
                    return
                } catch {}
            }
        }

        _user = await getCurrentUser()
        if (_user) {
            const p = await getProfile(_user.$id)
            if (p) { _profile = p; _profileDocId = p.$id }
            await migrateLocalProgress()
            await migrateLocalBookmarks()
            fetchSettings(_user.$id).then(s => {
                if (s && s.theme) {
                    localStorage.setItem('kvoid_theme', s.theme)
                    document.documentElement.setAttribute('data-theme', s.theme)
                    const btn = $('theme-toggle')
                    if (btn) btn.textContent = s.theme === 'dark' ? '◑' : '◐'
                }
            }).catch(() => {})
        }

        await handleRoute()
    } catch (e) {
        console.error('Init failed:', e)
        showToast('Something went wrong loading the app.', 'error')
    }
}

function navigate(page, data) {
    let hash = page || 'home'
    if (data !== undefined && data !== null) hash += '/' + data
    window.location.hash = hash
}

async function handleRoute() {
    const hash = window.location.hash.slice(1) || 'dashboard'
    const parts = hash.split('/')
    const page = parts[0]
    const p1 = parts[1] || ''
    const p2 = parts[2] || ''

    const app = $('app')
    if (!app) return

    closeSidebar()

    const fab = $('fab-ai')
    const hideFabPages = ['home', 'landing', 'login', 'signup', 'forgot', 'forgot-confirm', 'verify-email', 'complete-profile', 'logout']
    if (fab) fab.style.display = hideFabPages.includes(page) ? 'none' : 'flex'

    if (_user && !_profile && page !== 'complete-profile' && page !== 'logout' && page !== 'home' && page !== 'verify-email') {
        if (page === 'complete-profile') { renderCompleteProfile(app); return }
        navigate('complete-profile'); return
    }

    switch (page) {
        case 'home':
        case 'landing': await renderLanding(app); break
        case 'login': renderLogin(app); break
        case 'signup': renderSignup(app); break
        case 'forgot': renderForgotPassword(app); break
        case 'forgot-confirm': renderForgotPasswordConfirm(app, p1, p2); break
        case 'verify-email': renderVerifyEmail(app); break
        case 'complete-profile': renderCompleteProfile(app); break
        case 'dashboard': await renderDashboard(app); break
        case 'paths': await renderPaths(app); break
        case 'path': await renderPathDetail(app, p1); break
        case 'courses': await renderCourses(app); break
        case 'course': await renderCourseDetail(app, p1); break
        case 'lesson': await renderLessonView(app, p1, p2); break
        case 'profile': await renderProfile(app); break
        case 'profile-edit': renderProfileEdit(app); break
        case 'ai-tutor': renderAiTutor(app); break
        case 'certificates': await renderCertificates(app); break
        case 'bookmarks': await renderBookmarks(app); break
        case 'settings': renderSettings(app); break
        case 'search': await renderSearchResults(app, p1); break
        case 'admin': await renderAdmin(app); break
        case 'logout': handleLogout(); break
        default: renderNotFound(app)
    }
}

window.addEventListener('hashchange', () => handleRoute())

function renderFrame(app, content, sidebar, noScroll) {
    app.innerHTML = '<div class="app-layout">' + renderTopbar() + renderSidebar(sidebar) + '<main class="main-content' + (noScroll ? ' no-scroll' : '') + '">' + content + '</main></div>'
    initTheme()
}

function renderNotFound(app) {
    if (_user) {
        renderFrame(app, '<div class="placeholder-page"><div class="ph-icon">◇</div><h2>Page Not Found</h2><p>The page you\'re looking for doesn\'t exist or has moved.</p><button class="btn btn-primary" style="margin-top:1rem" onclick="navigate(\'dashboard\')">Go to Dashboard</button></div>', '')
    } else {
        app.innerHTML = '<div class="landing-page"><div class="placeholder-page" style="padding:5rem 1.5rem"><div class="ph-icon">◇</div><h2>Page Not Found</h2><p>The page you\'re looking for doesn\'t exist.</p><button class="btn btn-primary" style="margin-top:1rem" onclick="navigate(\'home\')">Go Home</button></div></div>'
    }
}

async function renderSearchResults(app, query) {
    if (!query) { navigate('courses'); return }
    const q = decodeURIComponent(query).toLowerCase()
    const courses = await fetchCourses()
    const results = courses.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.lessons || []).some(l => l.title.toLowerCase().includes(q))
    )
    const progressMap = await getCourseProgressAll(_user?.$id)
    const grid = results.length
        ? (await Promise.all(results.map(c => courseCardMini(c, progressMap[c.id])))).join('')
        : '<p style="color:var(--text-secondary);text-align:center;padding:2rem">No courses found for "' + escapeHtml(decodeURIComponent(query)) + '"</p>'
    renderFrame(app, '<div class="section-header"><h2>Search: "' + escapeHtml(decodeURIComponent(query)) + '"</h2></div><p style="color:var(--text-secondary);margin-bottom:1.5rem">' + results.length + ' course' + (results.length !== 1 ? 's' : '') + ' found</p><div class="course-grid">' + grid + '</div>', 'courses')
}

function renderTopbar() {
    const name = _profile?.first_name || _user?.name || _user?.email?.split('@')[0] || 'User'
    const avatarUrl = _profile?.avatar_url || ''
    const avatarHTML = avatarUrl
        ? '<img src="' + avatarUrl + '" class="avatar avatar-sm" alt="" style="object-fit:cover">'
        : makeAvatarHTML(name, 'sm')
    const theme = document.documentElement.getAttribute('data-theme') || 'dark'
    return '<header class="topbar"><div class="topbar-left"><button class="sidebar-toggle" onclick="toggleSidebar()">&#9776;</button><div class="topbar-logo" onclick="navigate(\'dashboard\')"><span class="topbar-logo-icon">◇</span><span class="topbar-logo-text">K-VOID</span></div><div class="search-bar"><span class="search-icon">&#9906;</span><input type="text" placeholder="Search courses..." oninput="debounceSearch(this.value)"></div></div><div class="topbar-right"><button id="theme-toggle" class="btn btn-ghost btn-sm btn-icon" onclick="toggleTheme()" title="Toggle theme">' + (theme === 'dark' ? '◑' : '◐') + '</button><button class="btn btn-ghost btn-sm" onclick="navigate(\'profile\')" style="display:flex;align-items:center;gap:0.5rem;padding:0.3rem 0.6rem">' + avatarHTML + '<span class="topbar-username">' + escapeHtml(name) + '</span></button></div></header>'
}

function renderSidebar(active) {
    const items = [
        { id: 'dashboard', icon: '▦', label: 'Dashboard' },
        { id: 'paths', icon: '◎', label: 'Learning Paths' },
        { id: 'courses', icon: '▤', label: 'Courses' },
        { id: 'ai-tutor', icon: '◈', label: 'AI Tutor' },
        { id: 'bookmarks', icon: '◆', label: 'Bookmarks' },
        { id: 'certificates', icon: '★', label: 'Certificates' },
        { id: 'profile', icon: '◎', label: 'Profile' },
        { id: 'settings', icon: '⊙', label: 'Settings' },
        ...(isAdmin() ? [{ id: 'admin', icon: '⚙', label: 'Admin Panel' }] : [])
    ]
    const links = items.map(i =>
        '<a class="sidebar-item' + (i.id === active ? ' active' : '') + '" onclick="navigate(\'' + i.id + '\')"><span class="sidebar-icon">' + i.icon + '</span>' + i.label + '</a>'
    ).join('')
    return '<nav class="sidebar" id="sidebar"><div class="sidebar-brand"><span class="sidebar-brand-icon">◇</span><span class="sidebar-brand-text">K-VOID</span></div><div class="sidebar-section">' + links + '</div><div class="sidebar-spacer"></div><a class="sidebar-item sidebar-logout" onclick="handleLogout()"><span class="sidebar-icon">→</span>Log Out</a></nav>'
}

function toggleSidebar() {
    const s = $('sidebar')
    const o = $('sidebar-overlay')
    if (s) s.classList.toggle('open')
    if (o) o.classList.toggle('open')
}
function closeSidebar() {
    const s = $('sidebar')
    const o = $('sidebar-overlay')
    if (s) s.classList.remove('open')
    if (o) o.classList.remove('open')
}

async function renderLanding(app) {
    const courses = await fetchCourses()
    const allLangs = courses.map(c =>
        '<div class="lang-item"><span class="lang-item-icon">' + (c.icon || c.title[0]) + '</span><span class="lang-item-name">' + escapeHtml(c.title) + '</span></div>'
    ).join('')

    const allFeatures = [
        { title: 'Bite-Sized Lessons', desc: 'Each concept takes 2–5 minutes. Learn one thing at a time — perfect for focused sessions.' },
        { title: 'Practice Immediately', desc: '"Your Turn" exercises after every concept. Code right in Termux on your phone.' },
        { title: 'Track Progress', desc: 'Mark lessons complete, track your streak, unlock certificates.' },
        { title: 'Mobile-First', desc: 'Built for Android phones. No laptop required. Learn from anywhere, anytime.' },
        { title: '100% Free', desc: 'No credit card. No subscriptions. Pure learning for everyone.' },
        { title: '12+ Languages', desc: 'Python, JavaScript, Java, C++, Go, Rust, Swift, Kotlin, and more.' }
    ].map(f => '<div class="feature-card"><h3>' + f.title + '</h3><p>' + f.desc + '</p></div>').join('')

    const roadmap = [
        { step: '1', title: 'Pick a Language', desc: 'Start with Python or JavaScript — most beginner-friendly.' },
        { step: '2', title: 'Learn One Concept at a Time', desc: 'Each lesson breaks down into tiny, digestible pieces with examples.' },
        { step: '3', title: 'Practice in Termux', desc: 'Open Termux on your Android phone. Type the code. See it run.' },
        { step: '4', title: 'Complete the Quiz', desc: 'Each lesson ends with a quick check to lock in your understanding.' },
        { step: '5', title: 'Track Your Progress', desc: 'Earn certificates, build streaks, and watch your skills grow.' }
    ].map(r => '<div class="roadmap-item"><div class="roadmap-step">' + r.step + '</div><div class="roadmap-info"><h4>' + r.title + '</h4><p>' + r.desc + '</p></div></div>').join('')

    const faq = [
        { q: 'Do I need a computer?', a: 'No. K-VOID is designed for Android phones. Install Termux from F-Droid and you\'re ready to code.' },
        { q: 'Is this really free?', a: 'Yes. Completely free. No hidden charges, no premium tiers, no credit card required.' },
        { q: 'Which language should I start with?', a: 'Python — it\'s the most beginner-friendly and works great for AI, data science, and automation.' },
        { q: 'How long does each lesson take?', a: 'About 3–5 minutes per concept. Each lesson has 2–3 concepts plus a quiz — about 15 minutes total.' },
        { q: 'Do I need internet?', a: 'Yes, to access the lessons. After that, you can practice coding offline in Termux.' },
        { q: 'Will you add more languages?', a: 'Yes. TypeScript, React, C, Linux, Cybersecurity, and AI/ML are coming.' }
    ].map((f, i) =>
        '<div class="faq-item"><button class="faq-question" onclick="toggleFaq(' + i + ')">' + escapeHtml(f.q) + '<span class="faq-arrow">&#9662;</span></button><div class="faq-answer" id="faq' + i + '">' + escapeHtml(f.a) + '</div></div>'
    ).join('')

    const stats = await getTotalStats()
    const theme = document.documentElement.getAttribute('data-theme') || 'dark'

    app.innerHTML = '<div class="landing-page"><header class="landing-topbar"><div class="topbar-logo" onclick="navigate(\'home\')"><span class="topbar-logo-icon">◇</span><span class="topbar-logo-text">K-VOID</span></div><nav class="landing-nav"><button id="theme-toggle" class="btn btn-ghost btn-sm btn-icon" onclick="toggleTheme()" title="Toggle theme" style="margin-right:0.25rem">' + (theme === 'dark' ? '◑' : '◐') + '</button><a onclick="navigate(\'login\')">Log In</a><button class="btn btn-primary btn-sm" onclick="navigate(\'signup\')">Get Started Free</button></nav></header><section class="lp-hero"><div class="lp-hero-kicker">Programming Hub</div><h1>Learn to Code.<br>Completely Free.</h1><p>Master 12+ programming languages with bite-sized lessons you can do on your phone. No credit card. No excuses.</p><div class="lp-hero-actions"><button class="btn btn-primary btn-lg" onclick="navigate(\'signup\')">Start Learning Free</button><button class="btn btn-outline btn-lg" onclick="document.getElementById(\'lp-courses\').scrollIntoView({behavior:\'smooth\'})">View Courses</button></div></section><div class="lp-stats"><div class="lp-stat"><div class="lp-stat-num">' + stats.courses + '</div><div class="lp-stat-label">Courses</div></div><div class="lp-stat"><div class="lp-stat-num">' + stats.total + '</div><div class="lp-stat-label">Lessons</div></div><div class="lp-stat"><div class="lp-stat-num">12+</div><div class="lp-stat-label">Languages</div></div><div class="lp-stat"><div class="lp-stat-num">Free</div><div class="lp-stat-label">Always</div></div></div><section class="lp-section" id="lp-courses"><h2 class="lp-section-title">Supported Languages</h2><p class="lp-section-subtitle">Each language comes with structured lessons, practice exercises, and quizzes.</p><div class="lang-grid">' + allLangs + '</div></section><section class="lp-section lp-section-alt"><h2 class="lp-section-title">Why Learn Here</h2><p class="lp-section-subtitle">Built differently. Built for you.</p><div class="features-grid">' + allFeatures + '</div></section><section class="lp-section"><h2 class="lp-section-title">Your Learning Roadmap</h2><p class="lp-section-subtitle">From complete beginner to confident programmer.</p><div class="roadmap">' + roadmap + '</div></section><section class="lp-section lp-section-alt"><h2 class="lp-section-title">Common Questions</h2><div class="faq-list">' + faq + '</div></section><footer class="lp-footer"><div class="lp-footer-links"><a onclick="navigate(\'login\')">Log In</a><a onclick="navigate(\'signup\')">Sign Up</a></div><p>K-VOID Programming Hub &mdash; Free programming education for everyone.</p></footer></div>'

    window.toggleFaq = function(i) {
        const a = $('faq' + i)
        const q = a?.previousElementSibling
        if (!a || !q) return
        a.classList.toggle('open')
        q.classList.toggle('open')
    }
}

function renderLogin(app) {
    app.innerHTML = '<div class="auth-page"><div class="auth-card"><div class="auth-header"><div class="auth-logo">◇</div><h1>Welcome Back</h1><p>Log in to continue learning</p></div><form onsubmit="handleLogin(event)"><div class="form-group"><label class="form-label" for="loginEmail">Email</label><input class="form-input" id="loginEmail" type="email" required placeholder="you@example.com"></div><div class="form-group"><label class="form-label" for="loginPassword">Password</label><input class="form-input" id="loginPassword" type="password" required placeholder="Enter your password"></div><button class="btn btn-primary btn-block btn-lg" type="submit" id="loginBtn">Log In</button></form><div id="loginError" class="form-error" style="text-align:center;margin-top:0.5rem"></div><div class="auth-footer" style="margin-top:0.5rem"><a onclick="navigate(\'forgot\')" style="font-size:0.85rem">Forgot password?</a></div><div class="auth-footer">New here? <a onclick="navigate(\'signup\')">Create an account</a></div></div></div>'
    setTimeout(() => $('loginEmail')?.focus(), 100)
}

window.handleLogin = async function(e) {
    e.preventDefault()
    const email = $('loginEmail')?.value.trim()
    const pw = $('loginPassword')?.value
    const err = $('loginError')
    const btn = $('loginBtn')
    if (!email || !pw) { if (err) err.textContent = 'Enter email and password.'; return }
    btn.textContent = 'Logging in...'
    btn.disabled = true
    if (err) err.textContent = ''
    try {
        await logIn(email, pw)
        _user = await getCurrentUser()
        _profile = await getProfile(_user.$id)
        if (_profile) {
            _profileDocId = _profile.$id
            await updateStreak()
        }
        await migrateLocalProgress()
        await migrateLocalBookmarks()
        showToast('Welcome back!', 'success')
        navigate('dashboard')
    } catch (e) {
        if (err) err.textContent = e.message || 'Invalid email or password.'
        btn.textContent = 'Log In'
        btn.disabled = false
    }
}

function renderForgotPassword(app) {
    app.innerHTML = '<div class="auth-page"><div class="auth-card"><div class="auth-header"><div class="auth-logo">◇</div><h1>Reset Password</h1><p>Enter your email and we\'ll send a reset link</p></div><form onsubmit="handleForgot(event)"><div class="form-group"><label class="form-label" for="forgotEmail">Email</label><input class="form-input" id="forgotEmail" type="email" required placeholder="you@example.com"></div><button class="btn btn-primary btn-block btn-lg" type="submit" id="forgotBtn">Send Reset Link</button></form><div id="forgotError" class="form-error" style="text-align:center;margin-top:0.5rem"></div><div class="auth-footer"><a onclick="navigate(\'login\')">Back to login</a></div></div></div>'
}

window.handleForgot = async function(e) {
    e.preventDefault()
    const email = $('forgotEmail')?.value.trim()
    const err = $('forgotError')
    const btn = $('forgotBtn')
    if (!email) { if (err) err.textContent = 'Enter your email.'; return }
    btn.textContent = 'Sending...'
    btn.disabled = true
    try {
        await sendPasswordReset(email)
        showToast('Reset link sent to your email!', 'success')
        navigate('login')
    } catch (e) {
        if (err) err.textContent = e.message || 'Failed to send reset link.'
        btn.textContent = 'Send Reset Link'
        btn.disabled = false
    }
}

function renderForgotPasswordConfirm(app, userId, secret) {
    app.innerHTML = '<div class="auth-page"><div class="auth-card"><div class="auth-header"><div class="auth-logo">◇</div><h1>New Password</h1><p>Choose a new password for your account</p></div><form onsubmit="handleResetConfirm(event)"><div class="form-group"><label class="form-label">New Password</label><input class="form-input" id="newPw" type="password" required minlength="8" placeholder="At least 8 characters"></div><div class="form-group"><label class="form-label">Confirm Password</label><input class="form-input" id="confirmPw" type="password" required minlength="8" placeholder="Repeat password"></div><button class="btn btn-primary btn-block btn-lg" type="submit" id="resetBtn">Set New Password</button></form><div id="resetError" class="form-error" style="text-align:center;margin-top:0.5rem"></div></div></div>'
    window.handleResetConfirm = async function(e) {
        e.preventDefault()
        const pw = $('newPw')?.value
        const confirm = $('confirmPw')?.value
        const err = $('resetError')
        const btn = $('resetBtn')
        if (pw !== confirm) { if (err) err.textContent = 'Passwords do not match.'; return }
        btn.textContent = 'Saving...'
        btn.disabled = true
        try {
            await completePasswordReset(userId, secret, pw)
            showToast('Password updated! Please log in.', 'success')
            navigate('login')
        } catch (e) {
            if (err) err.textContent = e.message || 'Reset failed.'
            btn.textContent = 'Set New Password'
            btn.disabled = false
        }
    }
}

function renderSignup(app) {
    app.innerHTML = '<div class="auth-page"><div class="auth-card"><div class="auth-header"><div class="auth-logo">◇</div><h1>Create Account</h1><p>Join K-VOID and start learning</p></div><form onsubmit="handleSignup(event)"><div class="form-group"><label class="form-label" for="suEmail">Email</label><input class="form-input" id="suEmail" type="email" required placeholder="you@example.com"></div><div class="form-group"><label class="form-label" for="suPassword">Password</label><input class="form-input" id="suPassword" type="password" required minlength="8" placeholder="At least 8 characters" oninput="updatePwStrength()"><div class="pw-strength"><div class="pw-strength-fill" id="pwBar"></div></div><span class="pw-label" id="pwLabel"></span></div><div class="form-group"><label class="form-label" for="suConfirm">Confirm Password</label><input class="form-input" id="suConfirm" type="password" required minlength="8" placeholder="Repeat your password" oninput="updatePwMatch()"><div class="pw-strength"><div class="pw-strength-fill" id="pwMatchBar"></div></div><span class="pw-label" id="pwMatchLabel"></span></div><button class="btn btn-primary btn-block btn-lg" type="submit" id="signupBtn">Create Account</button></form><div id="signupError" class="form-error" style="text-align:center;margin-top:0.5rem"></div><div class="auth-footer">Already have an account? <a onclick="navigate(\'login\')">Log in</a></div></div></div>'
    setTimeout(() => $('suEmail')?.focus(), 100)
}

window.updatePwStrength = function() {
    const pw = $('suPassword')?.value || ''
    const score = getPasswordStrength(pw)
    const bar = $('pwBar'); const label = $('pwLabel')
    if (!bar || !label) return
    bar.style.width = (score / 5 * 100) + '%'
    bar.style.background = strengthColor(score)
    label.textContent = pw.length ? strengthLabel(score) : ''
    label.style.color = strengthColor(score)
}

window.updatePwMatch = function() {
    const pw = $('suPassword')?.value || ''
    const confirm = $('suConfirm')?.value || ''
    const bar = $('pwMatchBar'); const label = $('pwMatchLabel')
    if (!bar || !label) return
    if (!confirm) { bar.style.width = '0'; label.textContent = ''; return }
    if (pw === confirm) {
        bar.style.width = '100%'; bar.style.background = '#22c55e'
        label.textContent = 'Passwords match'; label.style.color = '#22c55e'
    } else {
        bar.style.width = '40%'; bar.style.background = '#ef4444'
        label.textContent = 'Does not match'; label.style.color = '#ef4444'
    }
}

window.handleSignup = async function(e) {
    e.preventDefault()
    const email = $('suEmail')?.value.trim()
    const pw = $('suPassword')?.value
    const confirm = $('suConfirm')?.value
    const err = $('signupError')
    const btn = $('signupBtn')
    if (!email || !pw || !confirm) { if (err) err.textContent = 'Fill all fields.'; return }
    if (pw.length < 8) { if (err) err.textContent = 'Password must be at least 8 characters.'; return }
    if (pw !== confirm) { if (err) err.textContent = 'Passwords do not match.'; return }

    btn.textContent = 'Creating account...'
    btn.disabled = true
    if (err) err.textContent = ''

    try {
        await signUp(email, pw)
        await logIn(email, pw)
        _user = await getCurrentUser()
        await sendVerification()
        navigate('verify-email')
    } catch (e) {
        if (err) err.textContent = e.message || 'Signup failed. Try a different email.'
        btn.textContent = 'Create Account'
        btn.disabled = false
    }
}

function renderVerifyEmail(app) {
    app.innerHTML = '<div class="auth-page"><div class="auth-card"><div class="auth-header"><div style="font-size:3rem;margin-bottom:0.5rem">✉</div><h1>Check Your Email</h1><p>We sent a verification link to your inbox. Click it to verify your account and start learning.</p></div><div style="text-align:center;padding:1rem 0"><p style="font-size:0.85rem;color:var(--text-secondary)">Did not receive it? <a onclick="resendVerification()" style="cursor:pointer">Resend email</a></p></div><button class="btn btn-secondary btn-block" onclick="navigate(\'login\')">Back to Log In</button></div></div>'
}

window.resendVerification = async function() {
    try { await sendVerification(); showToast('Verification email sent!', 'success') }
    catch (e) { showToast(e.message || 'Failed to send.', 'error') }
}

function renderCompleteProfile(app) {
    app.innerHTML = '<div class="auth-page"><div class="auth-card profile-setup-card"><div class="auth-header"><h1>Complete Your Profile</h1><p>A few details to get you started</p></div><form onsubmit="handleCompleteProfile(event)"><div class="form-group" style="text-align:center"><div class="avatar-upload" id="cpAvatar" onclick="document.getElementById(\'cpPhoto\').click()"><span class="avatar-upload-placeholder">+</span></div><input type="file" id="cpPhoto" accept="image/*" style="display:none" onchange="handleCpPhoto(event)"><p style="font-size:0.8rem;color:var(--text-dim);margin-top:0.3rem;cursor:pointer" onclick="document.getElementById(\'cpPhoto\').click()">Add photo (optional)</p></div><div style="display:flex;gap:0.75rem"><div class="form-group" style="flex:1"><label class="form-label">First Name</label><input class="form-input" id="cpFname" required placeholder="John"></div><div class="form-group" style="flex:1"><label class="form-label">Last Name</label><input class="form-input" id="cpLname" required placeholder="Doe"></div></div><div class="form-group"><label class="form-label">Username</label><input class="form-input" id="cpUsername" required placeholder="johndoe"></div><div class="form-group"><label class="form-label">Gender</label><div class="gender-group"><button type="button" class="gender-btn" id="cpGenderMale" onclick="selectCpGender(\'male\')">Male</button><button type="button" class="gender-btn" id="cpGenderFemale" onclick="selectCpGender(\'female\')">Female</button></div></div><div class="form-group"><label class="form-label">Bio <span style="color:var(--text-dim)">(optional)</span></label><textarea class="form-input" id="cpBio" rows="2" placeholder="A short bio about yourself" style="resize:vertical"></textarea></div><button class="btn btn-primary btn-block btn-lg" type="submit" id="cpBtn">Save &amp; Continue</button></form><div id="cpError" class="form-error" style="text-align:center;margin-top:0.5rem"></div></div></div>'

    window._cpGender = ''
    window._cpPhotoFile = null

    window.handleCpPhoto = function(e) {
        const file = e.target.files[0]
        if (!file) return
        window._cpPhotoFile = file
        const url = URL.createObjectURL(file)
        const div = $('cpAvatar')
        if (div) div.innerHTML = '<img src="' + url + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%">'
    }
    window.selectCpGender = function(g) {
        window._cpGender = g
        const m = $('cpGenderMale'); const f = $('cpGenderFemale')
        if (m) m.className = 'gender-btn' + (g === 'male' ? ' selected' : '')
        if (f) f.className = 'gender-btn' + (g === 'female' ? ' selected' : '')
    }
}

window.handleCompleteProfile = async function(e) {
    e.preventDefault()
    const fname = $('cpFname')?.value.trim()
    const lname = $('cpLname')?.value.trim()
    const uname = $('cpUsername')?.value.trim()
    const bio = $('cpBio')?.value.trim() || ''
    const gender = window._cpGender || ''
    const err = $('cpError')
    const btn = $('cpBtn')
    if (!fname || !lname || !uname) { if (err) err.textContent = 'Fill required fields.'; return }
    if (!gender) { if (err) err.textContent = 'Select your gender.'; return }

    btn.textContent = 'Saving...'
    btn.disabled = true

    let avatarUrl = getAvatarUrl(gender, uname)

    if (window._cpPhotoFile) {
        try {
            const fileId = await uploadAvatar(window._cpPhotoFile)
            avatarUrl = getAvatarFileUrl(fileId)
        } catch (e) {
            console.warn('Avatar upload failed, using default:', e)
        }
    }

    try {
        await updateName(fname + ' ' + lname)
        const profileData = {
            first_name: fname,
            last_name: lname,
            username: uname,
            bio: bio,
            avatar_url: avatarUrl,
            level: 1,
            xp: 0,
            streak_days: 0,
            completed_lessons: 0,
            completed_courses: 0,
            role: 'student',
            email_verified: false,
            onboarding_completed: true,
            total_study_minutes: 0
        }
        const doc = await createProfile(_user.$id, profileData)
        _profile = doc
        _profileDocId = doc.$id
        showToast('Profile created!', 'success')
        navigate('dashboard')
    } catch (e) {
        if (err) err.textContent = e.message || 'Failed to save profile.'
        btn.textContent = 'Save & Continue'
        btn.disabled = false
    }
}

async function renderDashboard(app) {
    if (!_user) { navigate('login'); return }
    const stats = await getTotalStats()
    const streak = getStreak()
    const xp = getProfileXp()
    const level = getLevel(xp)
    const nextLevel = CONFIG.limits.levels.find(l => l.xpRequired > xp)
    const xpProgress = nextLevel ? Math.round(((xp - level.xpRequired) / (nextLevel.xpRequired - level.xpRequired)) * 100) : 100
    const name = _profile?.first_name || _user?.name || 'there'

    const courses = await fetchCourses()
    const progressMap = await getCourseProgressAll(_user.$id)
    const inProgress = courses.filter(c => progressMap[c.id] > 0 && progressMap[c.id] < 100).slice(0, 3)
    const popular = courses.filter(c => c.popular).slice(0, 4)

    const inProgressHTML = inProgress.length
        ? (await Promise.all(inProgress.map(c => courseCardMini(c, progressMap[c.id])))).join('')
        : '<p style="color:var(--text-secondary)">No courses in progress. <a onclick="navigate(\'courses\')">Browse courses</a></p>'

    const popularHTML = (await Promise.all(popular.map(c => courseCardMini(c, progressMap[c.id])))).join('')

    let pathRecHTML = ''
    const rec = await getRecommendedPath(_user.$id)
    if (rec) {
        const nextStep = rec.progress.stepStatuses?.find(s => !s.completed && s.exists)
        pathRecHTML = `
            <div class="dash-welcome" style="margin-top:2rem;border-left:4px solid ${rec.path.color}">
                <div class="dash-welcome-text">
                    <h2 style="margin:0;font-size:1.2rem">${rec.path.icon} ${escapeHtml(rec.path.title)}</h2>
                    <p style="margin:0.3rem 0 0;color:var(--text-secondary)">${escapeHtml(rec.path.desc)}</p>
                    ${rec.progress.percent > 0 ? '<div class="xp-bar" style="margin-top:0.5rem;max-width:250px"><div class="xp-bar-fill" style="width:' + rec.progress.percent + '%"></div></div>' : ''}
                    ${nextStep ? '<p style="margin:0.5rem 0 0;font-size:0.85rem"><strong>Next:</strong> ' + escapeHtml(nextStep.title) + '</p>' : ''}
                </div>
                <div>
                    <button class="btn btn-primary btn-sm" onclick="navigate('path','${rec.path.id}')">${rec.progress.percent > 0 ? 'Continue' : 'Start'} Path</button>
                </div>
            </div>`
    }

    renderFrame(app, `
        <div class="dash-welcome">
            <div class="dash-welcome-text">
                <h1>Welcome back, ${escapeHtml(name)}</h1>
                <p>Keep up the momentum — consistency beats intensity.</p>
            </div>
            <div class="dash-welcome-badge">
                <div class="dash-level-badge">Lvl ${level.level}</div>
                <div class="dash-level-title">${level.title}</div>
            </div>
        </div>
        <div class="dash-grid">
            <div class="dash-stat-card">
                <div class="stat-value">${stats.done}</div>
                <div class="stat-label">Lessons Completed</div>
            </div>
            <div class="dash-stat-card">
                <div class="stat-value">${streak.count}</div>
                <div class="stat-label">Day Streak</div>
            </div>
            <div class="dash-stat-card">
                <div class="stat-value">${xp}</div>
                <div class="stat-label">XP Earned</div>
            </div>
            <div class="dash-stat-card">
                <div class="stat-value">${stats.courses}</div>
                <div class="stat-label">Total Courses</div>
            </div>
        </div>
        <div class="xp-bar-section">
            <div class="xp-bar-label"><span>Level ${level.level} — ${level.title}</span><span>${xp} XP${nextLevel ? ' / ' + nextLevel.xpRequired : ''}</span></div>
            <div class="xp-bar"><div class="xp-bar-fill" style="width:${xpProgress}%"></div></div>
        </div>
        ${pathRecHTML}
        ${inProgress.length ? '<div class="section-header" style="margin-top:2rem"><h2>Continue Learning</h2><a onclick="navigate(\'courses\')">All courses</a></div><div class="course-grid">' + inProgressHTML + '</div>' : ''}
        <div class="section-header" style="margin-top:2rem"><h2>Popular Courses</h2><a onclick="navigate(\'courses\')">Browse all</a></div>
        <div class="course-grid">${popularHTML}</div>
    `, 'dashboard')
}

async function renderPaths(app) {
    const paths = getAllPaths()
    const userId = _user?.$id

    let recHTML = ''
    if (userId) {
        const rec = await getRecommendedPath(userId)
        if (rec) {
            const nextStep = rec.progress.stepStatuses?.find(s => !s.completed)
            recHTML = `
                <div class="dash-welcome" style="margin-bottom:1.5rem;border-left:4px solid ${rec.path.color}">
                    <div class="dash-welcome-text">
                        <h2 style="margin:0;font-size:1.2rem">${rec.path.icon} Recommended: ${escapeHtml(rec.path.title)}</h2>
                        <p style="margin:0.3rem 0 0;color:var(--text-secondary)">${escapeHtml(rec.path.desc)}</p>
                        ${nextStep ? '<p style="margin:0.5rem 0 0;font-size:0.85rem"><strong>Next up:</strong> ' + escapeHtml(nextStep.title) + '</p>' : '<p style="margin:0.5rem 0 0;font-size:0.85rem;color:#22c55e">Path complete! Great work.</p>'}
                    </div>
                    <div>
                        <button class="btn btn-primary btn-sm" onclick="navigate('path','${rec.path.id}')">${rec.progress.percent > 0 ? 'Continue' : 'Start'} Path</button>
                    </div>
                </div>`
        }
    }

    const pathCards = await Promise.all(paths.map(async p => {
        const progress = userId ? await getPathProgress(p.id, userId) : { completed: 0, total: p.steps.length, percent: 0 }
        return `
            <div class="course-card" onclick="navigate('path','${p.id}')" style="cursor:pointer">
                <div class="course-card-thumb" style="background:${p.color}22;border-bottom:3px solid ${p.color}">
                    <div class="course-initials" style="color:${p.color};font-size:2rem">${p.icon}</div>
                </div>
                <div class="course-card-body">
                    <h3>${escapeHtml(p.title)}</h3>
                    <p class="desc">${escapeHtml(p.desc)}</p>
                    <div class="course-card-meta">
                        <span>${escapeHtml(p.difficulty)}</span>
                        <span>${p.steps.length} courses</span>
                    </div>
                    ${progress.percent > 0 ? '<div class="course-card-bar"><div class="course-card-fill" style="width:' + progress.percent + '%"></div></div><p style="font-size:0.75rem;color:var(--text-dim);margin-top:0.25rem">' + progress.percent + '% complete</p>' : ''}
                </div>
            </div>`
    }))

    renderFrame(app, `
        <div class="section-header"><h2>Learning Paths</h2></div>
        <p style="color:var(--text-secondary);margin-bottom:1.5rem">Structured courses to take you from beginner to professional. Follow a path to build real skills step by step.</p>
        ${recHTML}
        <div class="course-grid">${pathCards.join('')}</div>
    `, 'paths')
}

async function renderPathDetail(app, pathId) {
    const path = getPath(pathId)
    if (!path) { navigate('paths'); return }

    const userId = _user?.$id
    const progress = userId ? await getPathProgress(pathId, userId) : { completed: 0, total: path.steps.length, percent: 0, stepStatuses: [] }
    const courses = await fetchCourses()

    const stepsHTML = progress.stepStatuses.map((step, i) => {
        let statusIcon = (i + 1).toString()
        let statusClass = ''
        if (step.completed) { statusIcon = '✓'; statusClass = ' completed' }
        else if (step.in_progress) { statusIcon = '→'; statusClass = ' in-progress' }

        const courseExists = step.exists
        const course = courses.find(c => c.id === step.course_slug)

        return `
            <div class="lesson-item${statusClass}" ${courseExists ? 'onclick="navigate(\'course\',\'' + step.course_slug + '\')"' : ''} style="${!courseExists ? 'opacity:0.5;cursor:default' : ''}">
                <div class="lesson-num">${statusIcon}</div>
                <div class="lesson-info">
                    <h4>${escapeHtml(step.title)}</h4>
                    <p>${escapeHtml(step.desc)}</p>
                    ${!courseExists ? '<span style="font-size:0.75rem;color:var(--text-dim)">Coming soon</span>' : ''}
                </div>
                <div style="text-align:right;min-width:60px">
                    ${step.completed ? '<span style="color:#22c55e;font-size:0.8rem">Done</span>' :
                      step.in_progress ? '<span style="color:#f59e0b;font-size:0.8rem">' + step.percent + '%</span>' :
                      '<span style="color:var(--text-dim);font-size:0.8rem">Not started</span>'}
                </div>
            </div>`
    }).join('')

    const nextStep = progress.stepStatuses.find(s => !s.completed && s.exists)

    renderFrame(app, `
        <a class="back-link" onclick="navigate('paths')">&#8592; Learning Paths</a>
        <div class="course-detail-header" style="border-left:4px solid ${path.color}">
            <div style="display:flex;align-items:center;gap:1rem;margin-bottom:0.5rem">
                <span style="font-size:2.5rem">${path.icon}</span>
                <div>
                    <h1 style="margin:0">${escapeHtml(path.title)}</h1>
                    <p style="color:var(--text-secondary);margin:0.2rem 0">${escapeHtml(path.desc)}</p>
                </div>
            </div>
            <div class="course-detail-meta">
                <span class="badge">${escapeHtml(path.difficulty)}</span>
                <span class="badge">${path.steps.length} courses</span>
                <span class="badge">${progress.completed}/${progress.total} completed</span>
            </div>
            ${progress.percent > 0 ? '<div class="xp-bar" style="margin-top:1rem;max-width:400px"><div class="xp-bar-fill" style="width:' + progress.percent + '%"></div></div><p style="font-size:0.8rem;color:var(--text-dim);margin-top:0.25rem">' + progress.percent + '% complete</p>' : ''}
            ${nextStep ? '<button class="btn btn-primary" style="margin-top:1rem" onclick="navigate(\'course\',\'' + nextStep.course_slug + '\')">Continue: ' + escapeHtml(nextStep.title) + '</button>' :
              progress.percent >= 100 ? '<div style="margin-top:1rem;padding:0.75rem 1rem;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:8px;color:#22c55e;font-weight:600">Path Complete! Great work.</div>' : ''}
        </div>
        <div class="lesson-list">${stepsHTML}</div>
    `, 'paths')
}

async function renderCourses(app) {
    const courses = await fetchCourses()
    const progressMap = await getCourseProgressAll(_user?.$id)
    const filters = ['All', 'Beginner', 'Intermediate', 'Advanced']
    const cards = (await Promise.all(courses.map(c => courseCardMini(c, progressMap[c.id])))).join('')

    const tracks = [
        { icon: '🌐', title: 'Build Websites', desc: 'HTML & CSS → JavaScript', color: '#E44D26', courses: ['html-css-beginner', 'javascript-beginner'] },
        { icon: '🤖', title: 'Build AI & Smart Systems', desc: 'Python → SQL → Data Science', color: '#3776AB', courses: ['python-beginner', 'sql-beginner', 'data-science'] },
        { icon: '📱', title: 'Build Phone Apps', desc: 'Kotlin (Android) or Swift (iOS)', color: '#7F52FF', courses: ['kotlin-beginner', 'swift-beginner'] },
        { icon: '⚙️', title: 'Build Systems & Engines', desc: 'C → C++ → Rust', color: '#00599C', courses: ['c-beginner', 'cpp-beginner', 'rust-beginner'] }
    ]
    const tracksHTML = tracks.map(t => `
        <div class="career-track" onclick="navigate('courses')" style="background:${t.color}11;border:1px solid ${t.color}33;border-radius:var(--radius);padding:1rem 1.25rem;cursor:pointer;transition:all 0.2s" onmouseenter="this.style.borderColor='${t.color}';this.style.boxShadow='0 0 12px ${t.color}22'" onmouseleave="this.style.borderColor='${t.color}33';this.style.boxShadow='none'">
            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.4rem">
                <span style="font-size:1.5rem">${t.icon}</span>
                <div>
                    <div style="font-weight:700;font-size:0.95rem;color:var(--text)">${t.title}</div>
                    <div style="font-size:0.8rem;color:var(--text-secondary)">${t.desc}</div>
                </div>
            </div>
        </div>
    `).join('')

    renderFrame(app, `
        <div class="section-header"><h2>What do you want to build?</h2></div>
        <p style="color:var(--text-secondary);margin-bottom:1rem;font-size:0.9rem">Choose a career goal, or browse all courses below.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0.75rem;margin-bottom:2rem">${tracksHTML}</div>
        <div class="section-header"><h2>All Courses</h2></div>
        <p style="color:var(--text-secondary);margin-bottom:1.5rem">${courses.length} courses available</p>
        <div class="course-grid">${cards}</div>
    `, 'courses')
}

async function courseCardMini(course, progress) {
    const pct = progress || 0
    const initials = course.title.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    const bm = _user ? await isBookmarked(course.id) : false
    const thumbContent = course.image_url
        ? '<img src="' + course.image_url + '" style="width:100%;height:100%;object-fit:cover">'
        : '<div class="course-initials" style="color:' + course.color + '">' + initials + '</div>'
    const lessonCount = course.lessons?.length || 0
    const taskLabel = course.difficulty === 'Beginner' ? 'Coding Challenges' :
                      course.difficulty === 'Advanced' ? 'Production Tasks' : 'Project Steps'
    return '<div class="course-card" onclick="navigate(\'course\',\'' + course.id + '\')">' +
        '<div class="course-card-thumb" style="background:' + (course.image_url ? 'var(--surface-2)' : course.color + '22') + ';border-bottom:3px solid ' + course.color + '">' +
        thumbContent +
        (course.popular ? '<span class="course-card-badge">Popular</span>' : '') +
        '</div>' +
        '<div class="course-card-body">' +
        '<h3>' + escapeHtml(course.title) + '</h3>' +
        '<p class="desc">' + escapeHtml(course.desc) + '</p>' +
        '<div class="course-card-meta">' +
        '<span>' + escapeHtml(course.difficulty) + '</span>' +
        '<span>' + escapeHtml(course.duration) + '</span>' +
        '<span>' + lessonCount + ' ' + taskLabel + '</span>' +
        '</div>' +
        (pct > 0 ? '<div class="course-card-bar"><div class="course-card-fill" style="width:' + pct + '%"></div></div><p style="font-size:0.75rem;color:var(--text-dim);margin-top:0.25rem">' + pct + '% complete</p>' : '') +
        '</div></div>'
}

async function renderCourseDetail(app, courseId) {
    const course = await fetchCourse(courseId)
    if (!course) { renderNotFound(app); return }

    const lessons = course.lessons || []
    const progressDocs = _user ? await getLessonProgress(_user.$id, courseId) : []
    const completedIds = new Set(progressDocs.map(p => getLessonSlug(p.lessons)).filter(Boolean))

    const lessonItems = lessons.map((l, i) => {
        const done = completedIds.has(l.id)
        return '<div class="lesson-item' + (done ? ' completed' : '') + '" onclick="navigate(\'lesson\',\'' + courseId + '/' + l.id + '\')">' +
            '<div class="lesson-num">' + (done ? '✓' : (i + 1)) + '</div>' +
            '<div class="lesson-info"><h4>' + escapeHtml(l.title) + '</h4><p>' + escapeHtml(l.desc) + '</p></div>' +
            '<span style="color:var(--text-dim);font-size:0.8rem">' + (l.concepts?.length || 0) + ' concepts</span>' +
            '</div>'
    }).join('')

    const pct = lessons.length ? Math.round((completedIds.size / lessons.length) * 100) : 0

    let pathContextHTML = ''
    if (_user) {
        const pathContexts = await getPathForCourseContext(courseId, _user.$id)
        if (pathContexts && pathContexts.length) {
            const pc = pathContexts[0]
            const stepNum = pc.stepIndex + 1
            const totalSteps = pc.path.steps.length
            pathContextHTML = `
                <div style="margin-top:1rem;padding:0.75rem 1rem;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem">
                    <div>
                        <span style="font-size:0.8rem;color:var(--text-dim)">Part ${stepNum} of ${totalSteps} in</span>
                        <strong style="font-size:0.9rem;cursor:pointer;color:var(--accent)" onclick="navigate('path','${pc.path.id}')">${pc.path.icon} ${escapeHtml(pc.path.title)}</strong>
                    </div>
                    <div style="display:flex;gap:0.5rem;align-items:center">
                        ${pc.isNextAvailable && pc.nextStep ? '<button class="btn btn-secondary btn-sm" onclick="navigate(\'course\',\'' + pc.nextStep.course_slug + '\')">Next: ' + escapeHtml(pc.nextStep.title) + ' →</button>' : ''}
                        <button class="btn btn-ghost btn-sm" onclick="navigate('path','${pc.path.id}')">View Path</button>
                    </div>
                </div>`
        }
    }

    renderFrame(app, '<a class="back-link" onclick="navigate(\'courses\')">&#8592; Courses</a>' +
        '<div class="course-detail-header">' +
        '<h1>' + escapeHtml(course.title) + '</h1>' +
        '<p style="color:var(--text-secondary);margin:0.4rem 0">' + escapeHtml(course.desc) + '</p>' +
        '<div class="course-detail-meta"><span class="badge">' + escapeHtml(course.difficulty) + '</span><span class="badge">' + escapeHtml(course.duration) + '</span><span class="badge">' + lessons.length + ' lessons</span></div>' +
        pathContextHTML +
        (pct > 0 ? '<div class="xp-bar" style="margin-top:1rem;max-width:300px"><div class="xp-bar-fill" style="width:' + pct + '%"></div></div><p style="font-size:0.8rem;color:var(--text-dim);margin-top:0.25rem">' + pct + '% complete</p>' : '') +
        '</div>' +
        '<div class="lesson-list">' + (lessonItems || '<p style="color:var(--text-secondary)">No lessons yet.</p>') + '</div>', 'courses')
}

async function renderLessonView(app, courseId, lessonId) {
    const lesson = await fetchLesson(courseId, lessonId)
    if (!lesson) { renderNotFound(app); return }

    const course = await fetchCourse(courseId)
    const lessons = course?.lessons || []
    const lessonIndex = lessons.findIndex(l => l.id === lessonId)
    const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null
    const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null
    const isDone = _user ? await isLessonComplete(_user.$id, courseId, lessonId) : false
    const interactive = getLessonContent(lessonId)
    const difficulty = course?.difficulty || 'Beginner'

    if (interactive) {
        const progress = lessons.length ? Math.round(((lessonIndex + 1) / lessons.length) * 100) : 0

        let difficultySidebar = ''
        if (difficulty === 'Intermediate') {
            difficultySidebar = `
                <div style="border-bottom:1px solid var(--border);padding:0.5rem 0.75rem;background:var(--bg)">
                    <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;color:var(--text-dim);margin-bottom:0.4rem">📁 Project Files</div>
                    <div style="font-size:0.78rem;color:var(--text-secondary)">
                        <div style="padding:0.2rem 0.4rem;border-radius:3px;background:var(--primary-subtle);color:var(--primary);margin-bottom:0.15rem">📄 main.py</div>
                        <div style="padding:0.2rem 0.4rem;color:var(--text-dim)">📄 helpers.py</div>
                        <div style="padding:0.2rem 0.4rem;color:var(--text-dim)">📄 test_main.py</div>
                    </div>
                </div>
                <div style="border-bottom:1px solid var(--border);padding:0.5rem 0.75rem;background:var(--bg)">
                    <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;color:var(--text-dim);margin-bottom:0.4rem">🎯 Milestones</div>
                    <div style="font-size:0.78rem;color:var(--text-secondary)">
                        <div style="display:flex;align-items:center;gap:0.4rem;padding:0.15rem 0"><span style="color:var(--success)">✓</span> Setup environment</div>
                        <div style="display:flex;align-items:center;gap:0.4rem;padding:0.15rem 0"><span style="color:var(--primary)">○</span> Write core logic</div>
                        <div style="display:flex;align-items:center;gap:0.4rem;padding:0.15rem 0"><span style="color:var(--text-dim)">○</span> Test & debug</div>
                    </div>
                </div>`
        } else if (difficulty === 'Advanced') {
            difficultySidebar = `
                <div style="border-bottom:1px solid var(--border);padding:0.5rem 0.75rem;background:var(--bg)">
                    <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;color:var(--text-dim);margin-bottom:0.4rem">⚡ Performance</div>
                    <div style="font-size:0.78rem;color:var(--text-secondary)">
                        <div style="display:flex;justify-content:space-between;padding:0.15rem 0"><span>Time:</span><span style="color:var(--success)">O(n)</span></div>
                        <div style="display:flex;justify-content:space-between;padding:0.15rem 0"><span>Memory:</span><span style="color:var(--primary)">24 MB</span></div>
                    </div>
                </div>
                <div style="border-bottom:1px solid var(--border);padding:0.5rem 0.75rem;background:var(--bg)">
                    <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;color:var(--text-dim);margin-bottom:0.4rem">🖥️ Terminal</div>
                    <div style="font-size:0.75rem;font-family:monospace;color:#00ff00;background:#0a0a0a;padding:0.4rem;border-radius:4px">$ python main.py</div>
                </div>`
        }

        const friendlyErrorParser = difficulty === 'Beginner' ? `
            <div style="font-size:0.75rem;color:var(--text-dim);padding:0.3rem 0.75rem;border-top:1px solid var(--border);background:var(--bg)">
                💡 Errors shown in plain English — no scary stack traces
            </div>` : ''

        renderFrame(app, `
        <div class="lesson-interactive">
            <div class="lesson-panel panel-story">
                <div class="lesson-panel-header">
                    <span>📖</span> ${escapeHtml(lesson.title)}
                    <span style="margin-left:auto;font-size:0.7rem;font-weight:400;text-transform:none;letter-spacing:0">${progress}%</span>
                </div>
                <div class="lesson-panel-body">
                    <div class="story-title">${escapeHtml(lesson.title)}</div>
                    <div class="story-metaphor">
                        <div class="metaphor-label">💡 Metaphor</div>
                        ${interactive.metaphor}
                    </div>
                    <div class="story-text">${interactive.story}</div>
                    <div class="story-mission">
                        <div class="mission-label">🎯 Your Mission</div>
                        ${interactive.mission}
                    </div>
                </div>
            </div>
            <div class="lesson-panel panel-sandbox" style="border-right:1px solid var(--border)">
                <div class="lesson-panel-header">
                    <span>💻</span> ${difficulty === 'Advanced' ? 'Terminal' : 'Your Workspace'}
                    <span class="badge" style="margin-left:auto;font-size:0.65rem;padding:0.15rem 0.5rem">${difficulty}</span>
                </div>
                ${difficultySidebar}
                <div class="sandbox-editor">
                    <textarea class="sandbox-textarea" id="sandbox-code" spellcheck="false">${escapeHtml(interactive.starterCode)}</textarea>
                    <div class="sandbox-actions">
                        <button class="btn btn-primary" onclick="sandboxRun('${lessonId}')">⚡ Run Code</button>
                        <button class="btn btn-ghost btn-sm" onclick="sandboxReset('${lessonId}')">↺ Reset</button>
                        <button class="btn btn-ghost btn-sm" onclick="sandboxHint('${lessonId}')" id="hint-btn">💡 Hint</button>
                    </div>
                </div>
            </div>
            <div class="lesson-panel panel-console">
                <div class="lesson-panel-header">
                    <span>🖥️</span> Output Console
                </div>
                <div class="console-output console-idle" id="sandbox-output">Click "Run Code" to test your solution...</div>
                <div class="feedback-area" id="sandbox-feedback"></div>
                ${friendlyErrorParser}
                <div class="console-actions">
                    ${!isDone ? '<button class="btn btn-primary btn-sm" onclick="sandboxComplete(\'' + courseId + '\',\'' + lessonId + '\')" id="complete-btn" disabled>✓ Mark Complete</button>' : '<span style="color:var(--success);font-size:0.85rem;font-weight:600">✓ Completed</span>'}
                    <span style="flex:1"></span>
                    ${prevLesson ? '<button class="btn btn-ghost btn-sm" onclick="navigate(\'lesson\',\'' + courseId + '/' + prevLesson.id + '\')">← Prev</button>' : ''}
                    ${nextLesson ? '<button class="btn btn-ghost btn-sm" onclick="navigate(\'lesson\',\'' + courseId + '/' + nextLesson.id + '\')">Next →</button>' : ''}
                </div>
            </div>
        </div>`, '', true)

        window._currentLessonId = lessonId
        window._currentCourseId = courseId
        window._lessonInteractive = interactive
    } else {
        const concepts = (lesson.concepts || []).map((c, i) =>
            '<div class="concept-block">' +
            '<div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.6rem">' +
            '<span class="concept-num">' + (i + 1) + '</span>' +
            '<span class="concept-title">' + escapeHtml(c.title) + '</span>' +
            '</div>' +
            '<p class="concept-text">' + escapeHtml(c.text) + '</p>' +
            (c.code ? '<div class="code-block"><div class="code-header"><span>Code Example</span><button onclick="copyCode(this)">Copy</button></div><pre>' + escapeHtml(c.code) + '</pre></div>' : '') +
            (c.classwork ? '<div class="classwork-box"><p class="classwork-label">Your Turn</p><p>' + escapeHtml(c.classwork) + '</p></div>' : '') +
            '</div>'
        ).join('')

        const summaryHTML = (lesson.summary || []).map(s => '<li>' + escapeHtml(s) + '</li>').join('')

        const quiz = lesson.quiz
        const quizHTML = quiz
            ? '<div class="quiz-section"><h3>Quick Check</h3><p class="quiz-question">' + escapeHtml(quiz.q) + '</p><div class="quiz-options">' +
              quiz.options.map((o, i) => '<button class="quiz-option" onclick="selectQuizOption(this,' + i + ',' + quiz.answer + ',\'' + escapeHtml(quiz.explanation || '') + '\')">' + escapeHtml(o) + '</button>').join('') +
              '</div><div class="quiz-feedback" id="quiz-feedback"></div></div>'
            : ''

        renderFrame(app,
            '<a class="back-link" onclick="navigate(\'course\',\'' + courseId + '\')">&#8592; ' + escapeHtml(course?.title || 'Course') + '</a>' +
            '<div class="lesson-view">' +
            '<h1>' + escapeHtml(lesson.title) + '</h1>' +
            '<p class="lesson-desc">' + escapeHtml(lesson.desc) + '</p>' +
            concepts +
            (summaryHTML ? '<div class="summary-box"><h4>Key Takeaways</h4><ul>' + summaryHTML + '</ul></div>' : '') +
            quizHTML +
            '<div class="lesson-complete-section">' +
            (!isDone ? '<button class="btn btn-primary btn-lg" onclick="markLessonComplete(\'' + courseId + '\',\'' + lessonId + '\')">Mark as Complete</button>' : '<div class="lesson-done-badge">Completed</div>') +
            '</div>' +
            '<div class="lesson-nav">' +
            (prevLesson ? '<button class="btn btn-secondary" onclick="navigate(\'lesson\',\'' + courseId + '/' + prevLesson.id + '\')">&#8592; Previous</button>' : '<span></span>') +
            (nextLesson ? '<button class="btn btn-primary" onclick="navigate(\'lesson\',\'' + courseId + '/' + nextLesson.id + '\')">Next &#8594;</button>' : '<span></span>') +
            '</div></div>', 'courses')
    }
}

function sandboxValidate(code, rules) {
    if (!rules) return false
    const normalized = code.toLowerCase().replace(/\s+/g, ' ').trim()
    const check = (p) => {
        if (typeof p === 'string') return normalized.includes(p.toLowerCase().replace(/\s+/g, ' ').trim())
        if (Array.isArray(p)) return p.every(item => normalized.includes(item.toLowerCase().replace(/\s+/g, ' ').trim()))
        return false
    }
    if (Array.isArray(rules.patterns)) {
        return rules.patterns.some(rule => check(rule))
    }
    return check(rules.patterns)
}

window.sandboxRun = function(lessonId) {
    const code = document.getElementById('sandbox-code')?.value || ''
    const output = document.getElementById('sandbox-output')
    const feedback = document.getElementById('sandbox-feedback')
    const completeBtn = document.getElementById('complete-btn')
    const interactive = window._lessonInteractive
    if (!interactive || !output || !feedback) return

    output.className = 'console-output'
    let outputLines = []
    try {
        const stdout = []
        const fakePrint = (...args) => stdout.push(args.map(a => String(a)).join(' '))
        const fn = new Function('print', 'input', 'len', 'range', 'str', 'int', 'float', 'type',
            'return (function() {\n' +
            '  const __out = [];\n' +
            '  const print = (...a) => __out.push(a.map(x => String(x)).join(" "));\n' +
            '  const len = x => (x && x.length !== undefined) ? x.length : 0;\n' +
            '  const range = n => Array.from({length: n}, (_, i) => i);\n' +
            '  const str = x => String(x);\n' +
            '  const int = x => parseInt(x, 10);\n' +
            '  const float = x => parseFloat(x);\n' +
            '  const type = x => typeof x;\n' +
            code + '\n' +
            '  return __out.join("\\n");\n' +
            '})()')
        const result = fn(fakePrint)
        outputLines = result ? result.split('\n') : []
        output.textContent = outputLines.length ? outputLines.join('\n') : '(no output)'
    } catch (e) {
        const msg = e.message || String(e)
        let friendlyMsg = ''
        if (msg.includes('SyntaxError')) friendlyMsg = '🔧 Syntax error — check your spelling, quotation marks, and parentheses.'
        else if (msg.includes('ReferenceError')) friendlyMsg = '🔍 Name error — did you spell a variable or function name correctly?'
        else if (msg.includes('TypeError')) friendlyMsg = '⚠️ Type error — you might be mixing incompatible data types.'
        else if (msg.includes('IndentationError')) friendlyMsg = '📏 Indentation error — check that your spacing is consistent.'
        else friendlyMsg = '🛠️ Hold up! Something went wrong. Check your code for typos and try again.'
        output.textContent = friendlyMsg
        output.className = 'console-output'
        feedback.innerHTML = '<div class="feedback-msg error">' + friendlyMsg + '</div>'
        return
    }

    if (sandboxValidate(code, interactive.validation)) {
        output.textContent = outputLines.join('\n') + '\n\n✅ All checks passed!'
        feedback.innerHTML = '<div class="feedback-msg success">' + interactive.successMsg + '</div>'
        if (completeBtn) completeBtn.disabled = false
        if (!document.getElementById('lesson-done-flag')) showConfetti()
    } else {
        feedback.innerHTML = '<div class="feedback-msg hint">💡 ' + escapeHtml(interactive.hint) + '</div>'
    }
}

window.sandboxReset = function(lessonId) {
    const interactive = window._lessonInteractive
    if (!interactive) return
    const ta = document.getElementById('sandbox-code')
    if (ta) ta.value = interactive.starterCode
    const output = document.getElementById('sandbox-output')
    if (output) { output.textContent = 'Click "Run Code" to test your solution...'; output.className = 'console-output console-idle' }
    const fb = document.getElementById('sandbox-feedback')
    if (fb) fb.innerHTML = ''
    const btn = document.getElementById('complete-btn')
    if (btn) btn.disabled = true
}

window.sandboxHint = function(lessonId) {
    const feedback = document.getElementById('sandbox-feedback')
    const interactive = window._lessonInteractive
    if (feedback && interactive) {
        feedback.innerHTML = '<div class="feedback-msg hint">💡 ' + escapeHtml(interactive.hint) + '</div>'
    }
}

window.sandboxComplete = async function(courseId, lessonId) {
    if (!_user) { navigate('login'); return }
    await saveLessonProgress(_user.$id, courseId, lessonId)
    await addXp(CONFIG.limits.xpPerLesson)
    showToast('Lesson complete! +' + CONFIG.limits.xpPerLesson + ' XP', 'success')
    showConfetti()
    const course = await fetchCourse(courseId)
    if (course) {
        const progress = await getLessonProgress(_user.$id, courseId)
        if (progress.length === course.lessons?.length) {
            await checkAndAwardCertificate(_user.$id, courseId)
            showToast('Course complete! Certificate earned!', 'success')
        }
    }
    const btn = document.getElementById('complete-btn')
    if (btn) { btn.disabled = true; btn.textContent = '✓ Completed' }
}

function showConfetti() {
    const container = document.createElement('div')
    container.className = 'confetti-container'
    const colors = ['#D4A842', '#4E9DFF', '#22C55E', '#F59E0B', '#EF4444', '#EC4899']
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div')
        piece.className = 'confetti-piece'
        piece.style.left = Math.random() * 100 + '%'
        piece.style.background = colors[Math.floor(Math.random() * colors.length)]
        piece.style.animationDelay = Math.random() * 0.5 + 's'
        piece.style.animationDuration = (1.5 + Math.random()) + 's'
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'
        piece.style.width = (6 + Math.random() * 8) + 'px'
        piece.style.height = (6 + Math.random() * 8) + 'px'
        container.appendChild(piece)
    }
    document.body.appendChild(container)
    setTimeout(() => container.remove(), 3000)
}

window.selectQuizOption = function(btn, idx, correct, explanation) {
    const parent = btn.parentElement
    const options = parent.querySelectorAll('.quiz-option')
    options.forEach((o, i) => {
        o.disabled = true
        if (i === correct) o.classList.add('correct')
        else if (i === idx && idx !== correct) o.classList.add('wrong')
    })
    const feedback = $('quiz-feedback')
    if (feedback) {
        feedback.textContent = idx === correct ? ('Correct! ' + explanation) : ('Not quite. ' + explanation)
        feedback.className = 'quiz-feedback show ' + (idx === correct ? 'correct' : 'wrong')
    }
    if (idx === correct && _user) addXp(CONFIG.limits.xpPerQuiz)
}

window.markLessonComplete = async function(courseId, lessonId) {
    if (!_user) { navigate('login'); return }
    await saveLessonProgress(_user.$id, courseId, lessonId)
    await addXp(CONFIG.limits.xpPerLesson)
    showToast('Lesson complete! +' + CONFIG.limits.xpPerLesson + ' XP', 'success')
    const course = await fetchCourse(courseId)
    if (course) {
        const progress = await getLessonProgress(_user.$id, courseId)
        if (progress.length === course.lessons?.length) {
            await checkAndAwardCertificate(_user.$id, courseId)
            showToast('Course complete! Certificate earned!', 'success')
        }
    }
    navigate('course', courseId)
}

window.copyCode = function(btn) {
    const pre = btn.closest('.code-block').querySelector('pre')
    if (!pre) return
    navigator.clipboard.writeText(pre.textContent).then(() => {
        btn.textContent = 'Copied!'
        setTimeout(() => btn.textContent = 'Copy', 1500)
    })
}

function renderAiTutor(app) {
    let activeChat = getCurrentChat()
    if (!activeChat) {
        activeChat = createNewChat()
        setCurrentChatId(activeChat.id)
    }

    const chats = loadChatHistory()
    const chatListHTML = chats.map(c => `
        <div class="ai-chat-item ${c.id === activeChat.id ? 'active' : ''}" data-chat-id="${c.id}" onclick="aiSwitchChat('${c.id}')" oncontextmenu="event.preventDefault();aiShowCtx(event,'${c.id}')">
            <div class="ai-chat-item-title">${escapeHtml(c.title)}</div>
            <div class="ai-chat-item-time">${formatChatTimestamp(c.updated_at)}</div>
        </div>
    `).join('') || '<div style="padding:1rem;color:var(--text-dim);font-size:0.8rem;text-align:center">No chats yet</div>'

    const savedMsgs = activeChat.messages || []
    const historyHTML = savedMsgs.map(m => {
        if (m.role === 'user') {
            return '<div class="ai-msg ai-msg-user"><div class="ai-msg-content">' + escapeHtml(m.content) + '</div></div>'
        }
        return '<div class="ai-msg ai-msg-assistant"><div class="ai-msg-content">' + formatAiResponse(m.content) + '</div></div>'
    }).join('')

    renderFrame(app, `
        <div class="ai-tutor">
            <div class="ai-history-panel" id="ai-history-panel">
                <div style="padding:1rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
                    <strong style="font-size:0.9rem">History</strong>
                    <button class="btn btn-ghost btn-sm btn-icon" onclick="aiToggleHistory()">✕</button>
                </div>
                <div style="padding:0.75rem;border-bottom:1px solid var(--border)">
                    <button class="btn btn-primary btn-sm btn-block" onclick="aiNewChat()">+ New Chat</button>
                </div>
                <div class="ai-chat-list" style="flex:1;overflow-y:auto;padding:0.5rem">
                    ${chatListHTML}
                </div>
            </div>
            <div class="ai-main">
                <div class="ai-main-topbar">
                    <button class="btn btn-ghost btn-sm btn-icon" onclick="aiToggleHistory()" title="Chat History">☰</button>
                    <span style="font-weight:600;font-size:0.9rem">${escapeHtml(activeChat.title)}</span>
                </div>
                <div class="ai-messages" id="ai-messages">
                    ${historyHTML || '<div class="ai-msg ai-msg-assistant"><div class="ai-msg-content">Hello! I\'m VOID Assistant. Ask me anything about programming.</div></div>'}
                </div>
                <div class="ai-input-area">
                    <textarea class="ai-input" id="ai-input" placeholder="Ask a programming question..." rows="2" onkeydown="handleAiKey(event)"></textarea>
                    <button class="btn btn-primary" onclick="sendAiMessage()">Send</button>
                </div>
            </div>
        </div>
    `, 'ai-tutor', true)

    const scrollMsgs = () => { const el = $('ai-messages'); if (el) el.scrollTop = el.scrollHeight }
    scrollMsgs()

    let _longPressTimer = null
    let _activeCtx = null
    const ITEMS = document.querySelectorAll('.ai-chat-item[data-chat-id]')

    function clearCtx() { if (_activeCtx) { _activeCtx.remove(); _activeCtx = null } }

    ITEMS.forEach(el => {
        const chatId = el.dataset.chatId

        const startPress = (e) => {
            clearCtx()
            _longPressTimer = setTimeout(() => {
                _longPressTimer = null
                const rect = el.getBoundingClientRect()
                showCtxMenu(rect.right + 4, rect.top, chatId)
            }, 2000)
        }
        const cancelPress = () => { if (_longPressTimer) { clearTimeout(_longPressTimer); _longPressTimer = null } }

        el.addEventListener('touchstart', startPress, { passive: true })
        el.addEventListener('touchend', cancelPress)
        el.addEventListener('touchmove', cancelPress)
        el.addEventListener('mousedown', startPress)
        el.addEventListener('mouseup', cancelPress)
        el.addEventListener('mouseleave', cancelPress)
    })

    document.addEventListener('click', clearCtx, { once: true })

    function showCtxMenu(x, y, chatId) {
        clearCtx()
        const menu = document.createElement('div')
        menu.className = 'ai-ctx-menu'
        menu.style.left = x + 'px'
        menu.style.top = y + 'px'
        menu.innerHTML = `
            <button class="ai-ctx-menu-item" data-action="rename">✏️ Rename</button>
            <button class="ai-ctx-menu-item danger" data-action="delete">🗑️ Delete</button>
        `
        menu.addEventListener('click', (e) => {
            e.stopPropagation()
            const action = e.target.dataset.action
            if (action === 'delete') aiDeleteChat(chatId)
            else if (action === 'rename') aiStartRename(chatId)
            clearCtx()
        })
        document.body.appendChild(menu)
        _activeCtx = menu

        const mRect = menu.getBoundingClientRect()
        if (mRect.right > window.innerWidth) menu.style.left = (x - mRect.width - 8) + 'px'
        if (mRect.bottom > window.innerHeight) menu.style.top = (y - mRect.height) + 'px'
    }

    window.aiShowCtx = function(e, chatId) {
        e.preventDefault()
        e.stopPropagation()
        showCtxMenu(e.clientX, e.clientY, chatId)
    }

    window.aiStartRename = function(chatId) {
        const item = document.querySelector(`.ai-chat-item[data-chat-id="${chatId}"]`)
        if (!item) return
        const titleEl = item.querySelector('.ai-chat-item-title')
        const currentTitle = titleEl.textContent
        titleEl.innerHTML = `<input class="ai-rename-input" value="${escapeHtml(currentTitle)}" maxlength="50">`
        const input = titleEl.querySelector('input')
        input.focus()
        input.select()

        const save = () => {
            const val = input.value.trim()
            if (val && val !== currentTitle) renameChat(chatId, val)
            renderAiTutor(app)
        }
        input.addEventListener('blur', save)
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); input.blur() }
            if (e.key === 'Escape') { input.value = currentTitle; input.blur() }
        })
    }

    window.aiToggleHistory = function() {
        const panel = $('ai-history-panel')
        if (panel) panel.classList.toggle('open')
    }

    window.handleAiKey = function(e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAiMessage() }
    }

    window.aiNewChat = function() {
        const chat = createNewChat()
        setCurrentChatId(chat.id)
        renderAiTutor(app)
    }

    window.aiSwitchChat = function(chatId) {
        setCurrentChatId(chatId)
        const panel = $('ai-history-panel')
        if (panel) panel.classList.remove('open')
        renderAiTutor(app)
    }

    window.aiDeleteChat = function(chatId) {
        if (!confirm('Delete this chat?')) return
        deleteChat(chatId)
        renderAiTutor(app)
    }

    window.sendAiMessage = async function() {
        const input = $('ai-input')
        const msgs = $('ai-messages')
        if (!input || !msgs) return
        const msg = input.value.trim()
        if (!msg) return
        input.value = ''

        const chatId = getCurrentChatId()
        if (!chatId) {
            const chat = createNewChat()
            setCurrentChatId(chat.id)
        }

        addMessageToChat(getCurrentChatId(), 'user', msg)

        const userDiv = document.createElement('div')
        userDiv.className = 'ai-msg ai-msg-user'
        userDiv.innerHTML = '<div class="ai-msg-content">' + escapeHtml(msg) + '</div>'
        msgs.appendChild(userDiv)

        const loadDiv = document.createElement('div')
        loadDiv.className = 'ai-msg ai-msg-assistant'
        loadDiv.innerHTML = '<div class="ai-msg-content ai-loading">Thinking...</div>'
        msgs.appendChild(loadDiv)
        msgs.scrollTop = msgs.scrollHeight

        try {
            const chatHistory = getChatMessages(getCurrentChatId())
            const contextMessages = chatHistory.slice(-10).map(m => m.role + ': ' + m.content).join('\n')
            const fullContext = (await getConversationContext()) + '\n\nRecent conversation:\n' + contextMessages

            const reply = await askVoidAssistant(msg, fullContext)
            addMessageToChat(getCurrentChatId(), 'assistant', reply)
            loadDiv.innerHTML = '<div class="ai-msg-content">' + formatAiResponse(reply) + '</div>'
        } catch (e) {
            const errMsg = 'Error: ' + e.message
            addMessageToChat(getCurrentChatId(), 'assistant', errMsg)
            loadDiv.innerHTML = '<div class="ai-msg-content ai-error">' + escapeHtml(errMsg) + '</div>'
        }
        msgs.scrollTop = msgs.scrollHeight

        const titleEl = document.querySelector('.ai-main-topbar span')
        if (titleEl) {
            const chat = getCurrentChat()
            if (chat) titleEl.textContent = chat.title
        }
    }
}

async function renderProfile(app) {
    if (!_user) { navigate('login'); return }
    const xp = getProfileXp()
    const level = getLevel(xp)
    const streak = getStreak()
    const certs = await fetchCertificates(_user.$id)
    const name = _profile ? (_profile.first_name + ' ' + _profile.last_name) : (_user.name || _user.email)
    const avatarUrl = _profile?.avatar_url || ''
    const avatarHTML = avatarUrl
        ? '<img src="' + avatarUrl + '" class="avatar avatar-xl" alt="" style="object-fit:cover">'
        : makeAvatarHTML(name, 'xl')

    renderFrame(app, `
        <div class="profile-header">
            ${avatarHTML}
            <div class="profile-header-info">
                <h1>${escapeHtml(name)}</h1>
                ${_profile?.username ? `<p class="username">@${escapeHtml(_profile.username)}</p>` : ''}
                ${_profile?.bio ? `<p class="bio">${escapeHtml(_profile.bio)}</p>` : ''}
                <div class="profile-meta">
                    <span>Level ${level.level} — ${level.title}</span>
                    <span>${xp} XP</span>
                    <span>${streak.count} day streak</span>
                </div>
            </div>
            <button class="btn btn-secondary" onclick="navigate('profile-edit')">Edit Profile</button>
        </div>
        <div class="dash-grid">
            <div class="dash-stat-card"><div class="stat-value">${xp}</div><div class="stat-label">Total XP</div></div>
            <div class="dash-stat-card"><div class="stat-value">${streak.count}</div><div class="stat-label">Day Streak</div></div>
            <div class="dash-stat-card"><div class="stat-value">${certs.length}</div><div class="stat-label">Certificates</div></div>
            <div class="dash-stat-card"><div class="stat-value">${level.level}</div><div class="stat-label">Current Level</div></div>
        </div>
    `, 'profile')
}

function renderProfileEdit(app) {
    const name = _profile ? _profile.first_name + ' ' + _profile.last_name : ''
    const bio = _profile?.bio || ''
    const avatarUrl = _profile?.avatar_url || ''
    const hasPfp = !!avatarUrl

    const avatarDisplay = hasPfp
        ? '<img id="editAvatarPreview" src="' + avatarUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%">'
        : '<div id="editAvatarPreview" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:#fff;border-radius:50%">' + getInitials(name) + '</div>'

    const avatarBg = hasPfp ? 'transparent' : getNameColor(name)

    renderFrame(app, `
        <a class="back-link" onclick="navigate('profile')">&#8592; Profile</a>
        <h2 style="margin-bottom:1.5rem">Edit Profile</h2>
        <div class="auth-card" style="max-width:500px">
            <form onsubmit="handleProfileEdit(event)">
                <div style="text-align:center;margin-bottom:1rem">
                    <div id="editAvatarWrap" onclick="document.getElementById('editPfpInput').click()" style="width:100px;height:100px;border-radius:50%;margin:0 auto 0.5rem;cursor:pointer;position:relative;overflow:hidden;background:${avatarBg}">
                        ${avatarDisplay}
                        <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.6);color:#fff;font-size:0.7rem;padding:4px 0;text-align:center">Change Photo</div>
                    </div>
                    <input type="file" id="editPfpInput" accept="image/*" style="display:none" onchange="handleEditPfp(event)">
                    ${hasPfp ? '<button type="button" class="btn btn-ghost btn-sm" style="color:var(--danger);font-size:0.8rem" onclick="handleRemovePfp()">Remove Photo</button>' : ''}
                </div>
                <div style="display:flex;gap:0.75rem">
                    <div class="form-group" style="flex:1"><label class="form-label">First Name</label><input class="form-input" id="editFname" value="${escapeHtml(_profile?.first_name||'')}" required></div>
                    <div class="form-group" style="flex:1"><label class="form-label">Last Name</label><input class="form-input" id="editLname" value="${escapeHtml(_profile?.last_name||'')}" required></div>
                </div>
                <div class="form-group"><label class="form-label">Bio</label><textarea class="form-input" id="editBio" rows="3" style="resize:vertical">${escapeHtml(bio)}</textarea></div>
                <button class="btn btn-primary btn-block" type="submit" id="editBtn">Save Changes</button>
            </form>
            <div id="editError" class="form-error" style="text-align:center;margin-top:0.5rem"></div>
        </div>
    `, 'profile')

    window._editPfpFile = null
    window._editRemovePfp = false

    window.handleEditPfp = function(e) {
        const file = e.target.files[0]
        if (!file) return
        window._editPfpFile = file
        window._editRemovePfp = false
        const url = URL.createObjectURL(file)
        const wrap = $('editAvatarWrap')
        const preview = $('editAvatarPreview')
        if (wrap) wrap.style.background = 'transparent'
        if (preview) {
            if (preview.tagName === 'IMG') {
                preview.src = url
            } else {
                preview.outerHTML = '<img id="editAvatarPreview" src="' + url + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%">'
            }
        }
    }

    window.handleRemovePfp = function() {
        window._editPfpFile = null
        window._editRemovePfp = true
        const fname = (_profile?.first_name || 'U') + ' ' + (_profile?.last_name || '')
        const wrap = $('editAvatarWrap')
        const preview = $('editAvatarPreview')
        if (wrap) wrap.style.background = getNameColor(fname.trim())
        if (preview) {
            preview.outerHTML = '<div id="editAvatarPreview" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:#fff;border-radius:50%">' + getInitials(fname.trim()) + '</div>'
        }
    }

    window.handleProfileEdit = async function(e) {
        e.preventDefault()
        const fname = $('editFname')?.value.trim()
        const lname = $('editLname')?.value.trim()
        const bio = $('editBio')?.value.trim()
        const btn = $('editBtn'); const err = $('editError')
        btn.textContent = 'Saving...'; btn.disabled = true
        try {
            await updateName(fname + ' ' + lname)
            const updates = { first_name: fname, last_name: lname, bio }

            if (window._editRemovePfp) {
                updates.avatar_url = ''
            } else if (window._editPfpFile) {
                try {
                    const fileId = await uploadAvatar(window._editPfpFile)
                    const url = getAvatarFileUrl(fileId)
                    if (url) {
                        updates.avatar_url = url
                    } else {
                        showToast('Upload succeeded but URL failed. Check avatars bucket.', 'error')
                    }
                } catch (e) {
                    console.error('Avatar upload failed:', e)
                    showToast('Photo upload failed: ' + (e.message || 'Unknown error'), 'error')
                }
            }

            await updateProfile(_profileDocId, updates)
            _profile.first_name = fname; _profile.last_name = lname; _profile.bio = bio
            if (updates.avatar_url !== undefined) _profile.avatar_url = updates.avatar_url
            showToast('Profile updated!', 'success')
            navigate('profile')
        } catch (e) {
            if (err) err.textContent = e.message || 'Failed to save.'
            btn.textContent = 'Save Changes'; btn.disabled = false
        }
    }
}

async function renderCertificates(app) {
    if (!_user) { navigate('login'); return }
    const certs = await fetchCertificates(_user.$id)
    const html = certs.length
        ? certs.map(c => '<div class="certificate-card"><div class="cert-icon">★</div><div class="cert-info"><h3>' + escapeHtml(c.course_title || c.courseId) + '</h3><p>Completed ' + formatDate(c.completed_at) + '</p></div></div>').join('')
        : '<div class="placeholder-page"><div class="ph-icon">★</div><h2>No Certificates Yet</h2><p>Complete a full course to earn your first certificate.</p><button class="btn btn-primary" style="margin-top:1rem" onclick="navigate(\'courses\')">Browse Courses</button></div>'
    renderFrame(app, '<div class="section-header"><h2>Certificates</h2></div><div class="certificates-grid">' + html + '</div>', 'certificates')
}

async function renderBookmarks(app) {
    if (!_user) { navigate('login'); return }
    const bookmarkedIds = await fetchBookmarks(_user.$id, true)
    const courses = await fetchCourses()
    const bookmarked = courses.filter(c => bookmarkedIds.includes(c.id))
    const progressMap = await getCourseProgressAll(_user.$id)
    const html = bookmarked.length
        ? (await Promise.all(bookmarked.map(c => courseCardMini(c, progressMap[c.id])))).join('')
        : '<div class="placeholder-page"><div class="ph-icon">◆</div><h2>No Bookmarks</h2><p>Bookmark courses to find them quickly later.</p><button class="btn btn-primary" style="margin-top:1rem" onclick="navigate(\'courses\')">Browse Courses</button></div>'
    renderFrame(app, '<div class="section-header"><h2>Bookmarks</h2></div><div class="course-grid">' + html + '</div>', 'bookmarks')
}

function renderSettings(app) {
    renderFrame(app, `
        <div class="section-header"><h2>Settings</h2></div>
        <div class="settings-grid">
            <div class="settings-card">
                <h3>Appearance</h3>
                <div class="setting-row">
                    <div>
                        <div class="setting-label">Theme</div>
                        <div class="setting-hint">Switch between dark and light mode</div>
                    </div>
                    <button class="btn btn-secondary" onclick="toggleTheme()">Toggle Theme</button>
                </div>
            </div>
            <div class="settings-card">
                <h3>Account</h3>
                <div class="setting-row">
                    <div>
                        <div class="setting-label">Email</div>
                        <div class="setting-hint">${escapeHtml(_user?.email || '')}</div>
                    </div>
                </div>
                <div class="setting-row">
                    <div>
                        <div class="setting-label">Edit Profile</div>
                        <div class="setting-hint">Update your name and bio</div>
                    </div>
                    <button class="btn btn-secondary" onclick="navigate('profile-edit')">Edit</button>
                </div>
                <div class="setting-row">
                    <div>
                        <div class="setting-label">Log Out</div>
                        <div class="setting-hint">Sign out of your account</div>
                    </div>
                    <button class="btn btn-danger" onclick="handleLogout()">Log Out</button>
                </div>
            </div>
        </div>
    `, 'settings')
}

async function handleLogout() {
    try { await logOut() } catch {}
    _user = null; _profile = null; _profileDocId = null
    clearProgressCache()
    navigate('home')
}
window.handleLogout = handleLogout

document.addEventListener('DOMContentLoaded', init)
