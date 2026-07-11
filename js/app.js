let _user = null
let _profile = null
let _profileDocId = null

async function init() {
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
                showToast('Email verified! Log in to continue.', 'success')
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

    if (_user && (!_profile && page !== 'complete-profile' && page !== 'logout' && page !== 'home' && page !== 'verify-email')) {
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
        case 'logout': handleLogout(); break
        default:
            renderNotFound(app)
    }
}

window.addEventListener('hashchange', () => handleRoute())

function renderFrame(app, content, sidebar) {
    app.innerHTML = '<div class="app-layout">' + renderTopbar() + renderSidebar(sidebar) + '<main class="main-content">' + content + '</main></div>'
}

function renderNotFound(app) {
    if (_user) {
        renderFrame(app, '<div class="placeholder-page"><div class="icon" style="font-size:4rem">🔮</div><h2>Page Not Found</h2><p>The page you\'re looking for doesn\'t exist or has moved.</p><button class="btn btn-primary" style="margin-top:1rem" onclick="navigate(\'dashboard\')">Go to Dashboard</button></div>', '')
    } else {
        app.innerHTML = '<div class="landing-page"><div class="placeholder-page" style="padding:5rem 1.5rem"><div class="icon" style="font-size:4rem">🔮</div><h2>Page Not Found</h2><p>The page you\'re looking for doesn\'t exist.</p><button class="btn btn-primary" style="margin-top:1rem" onclick="navigate(\'home\')">Go Home</button></div></div>'
    }
}

async function renderSearchResults(app, query) {
    if (!query) { navigate('courses'); return }
    const q = query.toLowerCase()
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
        : '<p style="color:var(--text-secondary);text-align:center;padding:2rem">No courses found for "' + escapeHtml(query) + '"</p>'
    renderFrame(app, '<div class="section-header"><h2>🔍 Search Results for "' + escapeHtml(query) + '"</h2></div><p style="color:var(--text-secondary);margin-bottom:1.5rem">' + results.length + ' course' + (results.length !== 1 ? 's' : '') + ' found</p><div class="course-grid">' + grid + '</div>', 'courses')
}

function renderTopbar() {
    const name = _profile?.first_name || _user?.name || _user?.email?.split('@')[0] || 'User'
    const avatarUrl = _profile?.avatar_url || ''
    const avatarHTML = avatarUrl
        ? '<img src="' + avatarUrl + '" class="avatar avatar-sm" alt="">'
        : '<div class="avatar avatar-sm avatar-initials" style="font-size:0.8rem">' + getInitials(name) + '</div>'
    return '<header class="topbar"><div class="topbar-left"><button class="sidebar-toggle" onclick="toggleSidebar()">☰</button><div class="topbar-logo" onclick="navigate(\'dashboard\')"><span class="topbar-logo-icon">◇</span><span class="topbar-logo-text">K-VOID</span></div><div class="search-bar"><span class="search-icon">🔍</span><input type="text" placeholder="Search courses..." oninput="debounceSearch(this.value)"></div></div><div class="topbar-right"><button class="btn btn-ghost btn-sm" onclick="navigate(\'profile\')" style="display:flex;align-items:center;gap:0.5rem;padding:0.3rem 0.6rem">' + avatarHTML + '<span style="font-size:0.85rem;font-weight:500;color:var(--text-secondary)">' + name + '</span></button></div></header>'
}

function renderSidebar(active) {
    const items = [
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
        { id: 'courses', icon: '📚', label: 'Courses' },
        { id: 'ai-tutor', icon: '🤖', label: 'AI Tutor' },
        { id: 'bookmarks', icon: '🔖', label: 'Bookmarks' },
        { id: 'certificates', icon: '🏆', label: 'Certificates' },
        { id: 'profile', icon: '👤', label: 'Profile' },
        { id: 'settings', icon: '⚙️', label: 'Settings' }
    ]
    const links = items.map(i =>
        '<a class="sidebar-item' + (i.id === active ? ' active' : '') + '" onclick="navigate(\'' + i.id + '\')"><span class="icon">' + i.icon + '</span>' + i.label + '</a>'
    ).join('')
    return '<nav class="sidebar" id="sidebar"><div class="sidebar-section">' + links + '</div><div class="sidebar-spacer"></div><a class="sidebar-item" onclick="handleLogout()"><span class="icon">🚪</span>Log Out</a></nav>'
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
        '<div class="lang-item"><span class="lang-item-icon">' + c.icon + '</span><span class="lang-item-name">' + c.title + '</span></div>'
    ).join('')

    const allFeatures = [
        { icon: '🧩', title: 'Bite-Sized Lessons', desc: 'Each concept takes 2-5 minutes. Learn one thing at a time — perfect for short attention spans.' },
        { icon: '✏️', title: 'Practice Immediately', desc: '"Your Turn" exercises after every concept. Code right in Termux on your phone.' },
        { icon: '📊', title: 'Track Progress', desc: 'See how far you\'ve come. Mark lessons complete, track your streak, unlock certificates.' },
        { icon: '📱', title: 'Mobile-First', desc: 'Built for Android phones. No laptop required. Learn from anywhere, anytime.' },
        { icon: '💰', title: '100% Free', desc: 'No credit card. No subscriptions. Just pure learning for everyone.' },
        { icon: '🚀', title: '12+ Languages', desc: 'Python, JavaScript, Java, C++, Go, Rust, Swift, Kotlin, and more. Start anywhere.' }
    ].map(f => '<div class="feature-card"><span class="icon">' + f.icon + '</span><h3>' + f.title + '</h3><p>' + f.desc + '</p></div>').join('')

    const roadmap = [
        { step: '1', title: 'Pick a Language', desc: 'Start with Python or JavaScript — they\'re the most beginner-friendly.' },
        { step: '2', title: 'Learn One Concept at a Time', desc: 'Each lesson breaks down into tiny, digestible pieces with examples.' },
        { step: '3', title: 'Practice in Termux', desc: 'Open Termux on your Android phone. Type the code. See it run.' },
        { step: '4', title: 'Complete the Quiz', desc: 'Each lesson ends with a quick check to lock in your understanding.' },
        { step: '5', title: 'Track Your Progress', desc: 'Earn certificates, build streaks, and watch your skills grow.' }
    ].map(r => '<div class="roadmap-item"><div class="roadmap-step">' + r.step + '</div><div class="roadmap-info"><h4>' + r.title + '</h4><p>' + r.desc + '</p></div></div>').join('')

    const faq = [
        { q: 'Do I need a computer?', a: 'No. K-VOID is designed for Android phones. Install Termux from F-Droid and you\'re ready to code.' },
        { q: 'Is this really free?', a: 'Yes. Completely free. No hidden charges, no premium tiers, no credit card required.' },
        { q: 'Which language should I start with?', a: 'Python — it\'s the most beginner-friendly and works great for AI, data science, and automation.' },
        { q: 'How long does each lesson take?', a: 'About 3-5 minutes per concept. Each lesson has 2-3 concepts plus a quiz — about 15 minutes total.' },
        { q: 'Do I need internet?', a: 'Yes, to access the lessons. But after that, you can practice coding offline in Termux.' },
        { q: 'Will you add more languages?', a: 'Yes. TypeScript, React, C, Linux, Cybersecurity, and AI/ML are coming.' }
    ].map((f, i) =>
        '<div class="faq-item"><button class="faq-question" onclick="toggleFaq(' + i + ')">' + f.q + '<span class="arrow">▾</span></button><div class="faq-answer" id="faq' + i + '">' + f.a + '</div></div>'
    ).join('')

    const stats = await getTotalStats()

    app.innerHTML = '<div class="landing-page"><header class="landing-topbar"><div class="topbar-logo" onclick="navigate(\'home\')"><span class="topbar-logo-icon">◇</span><span class="topbar-logo-text">K-VOID</span></div><nav class="landing-nav"><a onclick="navigate(\'login\')">Log In</a><button class="btn btn-primary btn-sm" onclick="navigate(\'signup\')">Sign Up Free</button></nav></header><section class="lp-hero"><h1>Learn to Code.<br>Completely Free.</h1><p>Master 12+ programming languages with bite-sized lessons you can do on your phone. No credit card. No excuses.</p><div class="lp-hero-actions"><button class="btn btn-primary btn-lg" onclick="navigate(\'signup\')">Start Learning Free →</button><button class="btn btn-secondary btn-lg" onclick="document.getElementById(\'lp-courses\').scrollIntoView({behavior:\'smooth\'})">View Courses</button></div></section><div class="lp-stats"><div class="lp-stat"><div class="lp-stat-num">' + stats.courses + '</div><div class="lp-stat-label">Courses</div></div><div class="lp-stat"><div class="lp-stat-num">' + stats.total + '</div><div class="lp-stat-label">Lessons</div></div><div class="lp-stat"><div class="lp-stat-num">12+</div><div class="lp-stat-label">Languages</div></div><div class="lp-stat"><div class="lp-stat-num">100%</div><div class="lp-stat-label">Free</div></div></div><section class="lp-section" id="lp-courses"><h2 class="lp-section-title">🚀 Supported Languages</h2><p class="lp-section-subtitle">Each language comes with structured lessons, practice exercises, and quizzes.</p><div class="lang-grid">' + allLangs + '</div></section><section class="lp-section"><h2 class="lp-section-title">🎯 Why Learn Here</h2><p class="lp-section-subtitle">Built differently. Built for you.</p><div class="features-grid">' + allFeatures + '</div></section><section class="lp-section"><h2 class="lp-section-title">🧭 Your Learning Roadmap</h2><p class="lp-section-subtitle">From complete beginner to confident programmer.</p><div class="roadmap">' + roadmap + '</div></section><section class="lp-section"><h2 class="lp-section-title">❓ FAQ</h2><div class="faq-list">' + faq + '</div></section><footer class="lp-footer"><p>© 2024 K-VOID Programming Hub. Learn to code. Completely free.</p></footer></div>'

    window.toggleFaq = function(i) {
        const a = $('faq' + i)
        const q = a?.previousElementSibling
        if (!a || !q) return
        a.classList.toggle('open')
        q.classList.toggle('open')
    }
}

function renderLogin(app) {
    app.innerHTML = '<div class="auth-page"><div class="auth-card"><div class="auth-header"><div class="brand">◇</div><h1>Welcome Back</h1><p>Log in to continue learning</p></div><form onsubmit="handleLogin(event)"><div class="form-group"><label class="form-label" for="loginEmail">Email</label><input class="form-input" id="loginEmail" type="email" required placeholder="you@example.com"></div><div class="form-group"><label class="form-label" for="loginPassword">Password</label><input class="form-input" id="loginPassword" type="password" required placeholder="Enter your password"></div><button class="btn btn-primary btn-block btn-lg" type="submit" id="loginBtn">Log In</button></form><div id="loginError" class="form-error" style="text-align:center;margin-top:0.5rem"></div><div class="auth-footer" style="margin-top:0.5rem"><a onclick="navigate(\'forgot\')" style="font-size:0.85rem">Forgot password?</a></div><div class="auth-footer">New here? <a onclick="navigate(\'signup\')">Create an account</a></div></div></div>'
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
        if (_user) await updateStreak()
        _profile = await getProfile(_user.$id)
        if (_profile) _profileDocId = _profile.$id
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

window.handleSendResetLink = async function() {
    const email = $('loginEmail')?.value.trim()
    const err = $('loginError')
    if (!email) { if (err) err.textContent = 'Enter your email first.'; return }
    try {
        await sendPasswordReset(email)
        showToast('Password reset link sent to your email!', 'success')
    } catch (e) {
        if (err) err.textContent = e.message || 'Failed to send.'
    }
}

function renderSignup(app) {
    app.innerHTML = '<div class="auth-page"><div class="auth-card"><div class="auth-header"><div class="brand">◇</div><h1>Create Account</h1><p>Join K-VOID and start learning</p></div><form onsubmit="handleSignup(event)"><div class="form-group"><label class="form-label" for="suEmail">Email</label><input class="form-input" id="suEmail" type="email" required placeholder="you@example.com"></div><div class="form-group"><label class="form-label" for="suPassword">Password</label><input class="form-input" id="suPassword" type="password" required minlength="6" placeholder="At least 6 characters" oninput="updatePwStrength()"><div class="pw-strength"><div class="pw-strength-fill" id="pwBar"></div></div><span class="pw-label" id="pwLabel"></span></div><div class="form-group"><label class="form-label" for="suConfirm">Password</label><input class="form-input" id="suConfirm" type="password" required minlength="6" placeholder="Repeat your password" oninput="updatePwMatch()"><div class="pw-strength"><div class="pw-strength-fill" id="pwMatchBar"></div></div><span class="pw-label" id="pwMatchLabel"></span></div><button class="btn btn-primary btn-block btn-lg" type="submit" id="signupBtn">Create Account →</button></form><div id="signupError" class="form-error" style="text-align:center;margin-top:0.5rem"></div><div class="auth-footer">Already have an account? <a onclick="navigate(\'login\')">Log in</a></div></div></div>'
    setTimeout(() => $('suEmail')?.focus(), 100)
}

window.updatePwStrength = function() {
    const pw = $('suPassword')?.value || ''
    const score = getPasswordStrength(pw)
    const bar = $('pwBar')
    const label = $('pwLabel')
    if (!bar || !label) return
    bar.style.width = (score / 5 * 100) + '%'
    bar.style.background = strengthColor(score)
    label.textContent = pw.length ? strengthLabel(score) : ''
    label.style.color = strengthColor(score)
}

window.updatePwMatch = function() {
    const pw = $('suPassword')?.value || ''
    const confirm = $('suConfirm')?.value || ''
    const bar = $('pwMatchBar')
    const label = $('pwMatchLabel')
    if (!bar || !label) return
    if (!confirm) { bar.style.width = '0'; label.textContent = ''; return }
    if (pw === confirm) {
        bar.style.width = '100%'; bar.style.background = '#06d6a0'
        label.textContent = '✓ Match'; label.style.color = '#06d6a0'
    } else {
        bar.style.width = pw.startsWith(confirm) ? '60%' : '30%'; bar.style.background = '#ef4444'
        label.textContent = '✗ No match'; label.style.color = '#ef4444'
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
    if (pw.length < 6) { if (err) err.textContent = 'Password must be at least 6 characters.'; return }
    if (pw !== confirm) { if (err) err.textContent = 'Passwords do not match.'; return }
    if (!email.includes('@')) { if (err) err.textContent = 'Enter a valid email.'; return }

    btn.textContent = 'Creating account...'
    btn.disabled = true
    if (err) err.textContent = ''

    try {
        await signUp(email, pw)
        _user = await getCurrentUser()
        await sendVerification()
        navigate('verify-email')
    } catch (e) {
        if (err) err.textContent = e.message || 'Signup failed.'
        btn.textContent = 'Create Account →'
        btn.disabled = false
    }
}

function renderVerifyEmail(app) {
    app.innerHTML = '<div class="auth-page"><div class="auth-card"><div class="auth-header"><div style="font-size:3rem">✉️</div><h1>Check Your Email</h1><p>We sent a verification link to your inbox. Click it to verify your account.</p></div><div style="text-align:center;padding:1rem 0"><p style="font-size:0.85rem;color:var(--text-secondary)">Didn\'t get it? <a onclick="resendVerification()" style="cursor:pointer">Resend</a></p></div><button class="btn btn-secondary btn-block" onclick="navigate(\'login\')">Back to Log In</button></div></div>'
}

window.resendVerification = async function() {
    try {
        await sendVerification()
        showToast('Verification email sent!', 'success')
    } catch (e) {
        showToast(e.message || 'Failed to send.', 'error')
    }
}

function renderCompleteProfile(app) {
    app.innerHTML = '<div class="auth-page"><div class="auth-card profile-setup-card"><div class="auth-header"><h1>Complete Your Profile</h1><p>Tell us about yourself</p></div><form onsubmit="handleCompleteProfile(event)"><div class="form-group" style="text-align:center"><div class="avatar-upload" id="cpAvatar" onclick="document.getElementById(\'cpPhoto\').click()"><span class="avatar-upload-placeholder">+</span></div><input type="file" id="cpPhoto" accept="image/*" style="display:none" onchange="handleCpPhoto(event)"><p style="font-size:0.8rem;color:var(--text-dim);margin-top:0.3rem;cursor:pointer" onclick="document.getElementById(\'cpPhoto\').click()">Add profile photo (optional)</p></div><div style="display:flex;gap:0.75rem"><div class="form-group" style="flex:1"><label class="form-label">First Name</label><input class="form-input" id="cpFname" required placeholder="John"></div><div class="form-group" style="flex:1"><label class="form-label">Last Name</label><input class="form-input" id="cpLname" required placeholder="Doe"></div></div><div class="form-group"><label class="form-label">Username</label><input class="form-input" id="cpUsername" required placeholder="johndoe"></div><div class="form-group"><label class="form-label">Gender</label><div class="gender-group"><button type="button" class="gender-btn" id="cpGenderMale" onclick="selectCpGender(\'male\')">♂ Male</button><button type="button" class="gender-btn" id="cpGenderFemale" onclick="selectCpGender(\'female\')">♀ Female</button></div></div><div class="form-group"><label class="form-label">Bio (optional)</label><textarea class="form-input" id="cpBio" rows="2" placeholder="A short bio about yourself" style="resize:vertical"></textarea></div><button class="btn btn-primary btn-block btn-lg" type="submit" id="cpBtn">Save & Continue →</button></form><div id="cpError" class="form-error" style="text-align:center;margin-top:0.5rem"></div></div></div>'

    window._cpGender = ''
    window.handleCpPhoto = function(e) {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = function(ev) {
            const div = $('cpAvatar')
            if (div) div.innerHTML = '<img src="' + ev.target.result + '" alt="">'
            window._cpPhotoData = ev.target.result
        }
        reader.readAsDataURL(file)
    }
    window.selectCpGender = function(g) {
        window._cpGender = g
        const m = $('cpGenderMale')
        const f = $('cpGenderFemale')
        if (m) { m.className = 'gender-btn' + (g === 'male' ? ' selected' : '') }
        if (f) { f.className = 'gender-btn' + (g === 'female' ? ' selected' : '') }
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

    const avatar = window._cpPhotoData || getAvatarUrl(gender, uname)

    try {
        await updateName(fname + ' ' + lname)
        const profileData = {
            first_name: fname,
            last_name: lname,
            username: uname,
            display_name: fname + ' ' + lname,
            gender: gender,
            bio: bio,
            avatar_url: avatar,
            learning_level: 'beginner',
            created_at: new Date().toISOString(),
            xp: 0,
            streak_count: 0,
            streak_last_date: null
        }
        const doc = await createProfile(_user.$id, profileData)
        _profile = { ...profileData, $id: doc.$id }
        _profileDocId = doc.$id
        await addXp(100)
        await updateStreak()
        showToast('Welcome to K-VOID!', 'success')
        navigate('dashboard')
    } catch (e) {
        if (err) err.textContent = e.message || 'Failed to save profile.'
        btn.textContent = 'Save & Continue →'
        btn.disabled = false
    }
}

function renderForgotPassword(app) {
    app.innerHTML = '<div class="auth-page"><div class="auth-card"><div class="auth-header"><h1>Reset Password</h1><p>Enter your email and we\'ll send a reset link</p></div><form onsubmit="handleForgot(event)"><div class="form-group"><label class="form-label">Email</label><input class="form-input" id="forgotEmail" type="email" required placeholder="you@example.com"></div><button class="btn btn-primary btn-block btn-lg" type="submit">Send Reset Link</button></form><div id="forgotError" class="form-error" style="text-align:center;margin-top:0.5rem"></div><div class="auth-footer"><a onclick="navigate(\'login\')">Back to Log In</a></div></div></div>'
}

window.handleForgot = async function(e) {
    e.preventDefault()
    const email = $('forgotEmail')?.value.trim()
    const err = $('forgotError')
    if (!email) { if (err) err.textContent = 'Enter your email.'; return }
    try {
        await sendPasswordReset(email)
        showToast('Reset link sent! Check your email.', 'success')
        navigate('login')
    } catch (e) {
        if (err) err.textContent = e.message || 'Failed to send.'
    }
}

function renderForgotPasswordConfirm(app, userId, secret) {
    app.innerHTML = '<div class="auth-page"><div class="auth-card"><div class="auth-header"><h1>Set New Password</h1><p>Choose a new password for your account</p></div><form onsubmit="handleResetConfirm(event)"><input type="hidden" id="resetUserId" value="' + userId + '"><input type="hidden" id="resetSecret" value="' + secret + '"><div class="form-group"><label class="form-label">New Password</label><input class="form-input" id="resetPw" type="password" required minlength="6" placeholder="At least 6 characters"></div><div class="form-group"><label class="form-label">Confirm Password</label><input class="form-input" id="resetConfirm" type="password" required minlength="6" placeholder="Repeat password"></div><button class="btn btn-primary btn-block btn-lg" type="submit">Reset Password</button></form><div id="resetError" class="form-error" style="text-align:center;margin-top:0.5rem"></div></div></div>'
}

window.handleResetConfirm = async function(e) {
    e.preventDefault()
    const userId = $('resetUserId')?.value
    const secret = $('resetSecret')?.value
    const pw = $('resetPw')?.value
    const confirm = $('resetConfirm')?.value
    const err = $('resetError')
    if (!pw || !confirm) { if (err) err.textContent = 'Fill both fields.'; return }
    if (pw.length < 6) { if (err) err.textContent = 'Password must be at least 6 characters.'; return }
    if (pw !== confirm) { if (err) err.textContent = 'Passwords do not match.'; return }
    try {
        await completePasswordReset(userId, secret, pw)
        showToast('Password reset! Log in with your new password.', 'success')
        navigate('login')
    } catch (e) {
        if (err) err.textContent = e.message || 'Failed to reset.'
    }
}

async function renderDashboard(app) {
    const stats = await getTotalStats()
    const name = _profile?.first_name || _user?.name || 'Learner'
    const avatar = _profile?.avatar_url || ''
    const avatarHTML = avatar
        ? '<img src="' + avatar + '" class="avatar avatar-lg" alt="">'
        : '<div class="avatar avatar-lg avatar-initials" style="font-size:1.5rem;width:80px;height:80px">' + getInitials(name) + '</div>'

    const xp = getProfileXp()
    const level = getLevel(xp)
    const streak = getStreak()
    const xpNext = CONFIG.limits.levels.find(l => l.xpRequired > xp) || CONFIG.limits.levels[CONFIG.limits.levels.length - 1]
    const xpProgress = xpNext ? Math.round((xp / xpNext.xpRequired) * 100) : 100
    const nextTitle = xpNext ? xpNext.title : 'Legend'

    const courses = await fetchCourses()
    const progressMap = await getCourseProgressAll(_user?.$id)
    const continueCourses = courses.filter(c => {
        const p = progressMap[c.id] || 0
        return p > 0 && p < 100
    }).slice(0, 3)
    const popularCourses = courses.filter(c => c.popular).slice(0, 3)

    const continueHTML = continueCourses.length
        ? (await Promise.all(continueCourses.map(c => courseCardMini(c, progressMap[c.id])))).join('')
        : '<p style="color:var(--text-secondary);font-size:0.9rem;padding:1.5rem;text-align:center">Start your first course below!</p>'

    const popularHTML = (await Promise.all(popularCourses.map(c => courseCardMini(c)))).join('')

    renderFrame(app, '<div class="dash-welcome">' + avatarHTML + '<div class="dash-welcome-text"><h1>Welcome back, ' + name + '</h1><p>' + stats.done + ' of ' + stats.total + ' lessons completed</p></div></div><div class="dash-grid"><div class="dash-stat-card"><div class="stat-value">' + xp + '</div><div class="stat-label">Total XP</div></div><div class="dash-stat-card"><div class="stat-value" style="color:var(--accent)">Lv.' + level.level + '</div><div class="stat-label">' + level.title + '</div></div><div class="dash-stat-card"><div class="stat-value">' + streak.count + '</div><div class="stat-label">Day Streak</div></div><div class="dash-stat-card"><div class="stat-value">' + stats.done + '/' + stats.total + '</div><div class="stat-label">Lessons</div></div></div><div class="xp-bar-container"><div class="xp-bar-label"><span>Level ' + level.level + ': ' + level.title + '</span><span>Next: ' + nextTitle + '</span></div><div class="xp-bar"><div class="xp-bar-fill" style="width:' + Math.min(xpProgress, 100) + '%"></div></div><div class="xp-bar-label" style="font-size:0.75rem"><span>' + xp + ' XP</span><span>' + (xpNext ? xpNext.xpRequired + ' XP' : 'MAX') + '</span></div></div><div class="section-header"><h2>▶ Continue Learning</h2><a onclick="navigate(\'courses\')">View all →</a></div><div class="course-grid">' + continueHTML + '</div><div class="section-header" style="margin-top:2rem"><h2>🔥 Popular Courses</h2><a onclick="navigate(\'courses\')">View all →</a></div><div class="course-grid">' + popularHTML + '</div>', 'dashboard')
}

async function renderCourses(app) {
    const courses = await fetchCourses()
    const progressMap = await getCourseProgressAll(_user?.$id)
    const grid = (await Promise.all(courses.map(c => courseCardMini(c, progressMap[c.id])))).join('')
    renderFrame(app, '<div class="section-header"><h2 style="font-size:1.4rem">📚 All Courses</h2></div><p style="color:var(--text-secondary);margin-bottom:1.5rem">Pick a course. Each lesson is bite-sized with practice exercises to lock it in.</p><div class="course-grid">' + grid + '</div>', 'courses')
}

async function renderCourseDetail(app, courseId) {
    const course = await fetchCourse(courseId)
    if (!course) { navigate('courses'); return }
    const prog = await getCourseProgress(_user?.$id, courseId)
    const bookmarked = await isBookmarked(course.id)

    const completedLessons = await getLessonProgress(_user?.$id, courseId)
    const completedIds = completedLessons.map(p => p.lessonId)
    const lessonsHTML = (course.lessons || []).map(l => {
        const done = completedIds.includes(l.id)
        const num = done ? '✓' : ((course.lessons.indexOf(l) + 1))
        return '<div class="lesson-item' + (done ? ' completed' : '') + '" onclick="navigate(\'lesson\',\'' + courseId + '\',\'' + l.id + '\')"><div class="lesson-num">' + num + '</div><div class="lesson-info"><h4>' + l.icon + ' ' + l.title + '</h4><p>' + l.desc + '</p></div></div>'
    }).join('')

    const cr = course.rating || 4.5
    const stars = Math.round(cr)
    const starHTML = '★'.repeat(stars) + '☆'.repeat(5 - stars)
    renderFrame(app, '<a class="back-link" onclick="navigate(\'courses\')">← Back to Courses</a><div class="course-detail-header"><div class="course-detail-icon" style="background:' + course.color + '22;color:' + course.color + ';width:64px;height:64px;border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;margin-bottom:0.75rem">' + course.title.charAt(0) + '</div><div style="display:flex;justify-content:space-between;align-items:flex-start"><h1>' + course.title + '</h1><button class="btn btn-ghost btn-sm" onclick="toggleBookmarkCourse(\'' + course.id + '\')" id="bmBtn-' + course.id + '" style="font-size:1.2rem">' + (bookmarked ? '🔖' : '🔖') + '</button></div><div class="course-detail-meta"><span>' + course.difficulty + '</span><span>' + course.duration + '</span><span>' + (course.lessons || []).length + ' lessons</span><span>' + course.category + '</span><span style="color:' + (cr >= 4.5 ? 'var(--accent)' : 'var(--warning)') + '">' + starHTML + ' ' + cr.toFixed(1) + '</span></div><p style="color:var(--text-secondary);margin-top:0.5rem">' + course.desc + '</p><div class="course-card-bar" style="margin-top:0.75rem"><div class="course-card-fill" style="width:' + prog + '%"></div></div></div><div class="lesson-list">' + lessonsHTML + '</div>', 'courses')
}

async function renderLessonView(app, courseId, lessonId) {
    const course = await fetchCourse(courseId)
    if (!course) { navigate('courses'); return }
    const lesson = (course.lessons || []).find(l => l.id === lessonId)
    if (!lesson) { navigate('course', courseId); return }
    const idx = (course.lessons || []).indexOf(lesson)
    const prev = idx > 0 ? course.lessons[idx - 1] : null
    const next = idx < course.lessons.length - 1 ? course.lessons[idx + 1] : null

    const conceptsHTML = (lesson.concepts || []).map((c, i) =>
        '<div class="concept-block"><div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem"><span class="num">' + (i + 1) + '</span><span class="title">' + c.title + '</span></div><p class="text">' + c.text + '</p>' +
        (c.code ? '<div class="code-block"><div class="code-header"><span>example.' + extFor(courseId) + '</span><button onclick="copyCode(this)">📋 Copy</button></div><pre>' + escapeHtml(c.code) + '</pre></div>' : '') +
        (c.classwork ? '<div class="classwork-box"><div class="label">✏️ Your Turn:</div><p>' + c.classwork + '</p></div>' : '') +
        '</div>'
    ).join('')

    const summaryHTML = lesson.summary
        ? '<div style="background:var(--bg);border:1px solid var(--primary);border-radius:var(--radius);padding:1rem;margin:1rem 0"><strong style="color:var(--primary)">📌 Quick Recap:</strong><ul style="margin-top:0.5rem;color:var(--text-secondary);font-size:0.9rem;list-style:disc;padding-left:1.2rem">' + lesson.summary.map(s => '<li style="margin-bottom:0.25rem">' + s + '</li>').join('') + '</ul></div>'
        : ''

    const quizHTML = lesson.quiz
        ? '<div class="quiz-section"><h3>📝 Check Yourself</h3><p class="quiz-question">' + lesson.quiz.q + '</p><div class="quiz-options">' + lesson.quiz.options.map((opt, i) =>
            '<button class="quiz-option" onclick="answerQuiz(this,' + i + ',' + lesson.quiz.answer + ',\'' + lesson.quiz.explanation.replace(/'/g, "\\'") + '\')">' + opt + '</button>'
          ).join('') + '</div><div class="quiz-feedback" id="qf-' + lessonId + '"></div></div>'
        : ''

    const navHTML = '<div class="lesson-nav">' +
        (prev ? '<button class="btn btn-secondary" onclick="navigate(\'lesson\',\'' + courseId + '\',\'' + prev.id + '\')">← ' + prev.title + '</button>' : '<button class="btn btn-secondary" disabled>← Previous</button>') +
        (next ? '<button class="btn btn-primary" onclick="navigate(\'lesson\',\'' + courseId + '\',\'' + next.id + '\')">' + next.title + ' →</button>' : '<button class="btn btn-primary" onclick="navigate(\'course\',\'' + courseId + '\')">✅ Complete Course</button>') +
        '</div>'

    renderFrame(app, '<div class="lesson-view"><a class="back-link" onclick="navigate(\'course\',\'' + courseId + '\')">← Back to ' + course.title + '</a><h1>' + (lesson.icon || '📘') + ' ' + lesson.title + '</h1><p class="lesson-desc">' + lesson.desc + '</p>' + conceptsHTML + summaryHTML + quizHTML + navHTML + '</div>', 'courses')

    setTimeout(async () => {
        if (!_user) return
        const done = await isLessonComplete(_user.$id, courseId, lessonId)
        if (!done) {
            await saveLessonProgress(_user.$id, courseId, lessonId)
            await addXp(CONFIG.limits.xpPerLesson)
            await updateStreak()
        }
    }, 1000)
}

async function renderProfile(app) {
    const p = _profile || {}
    const avatar = p.avatar_url || ''
    const avatarHTML = avatar
        ? '<img src="' + avatar + '" class="avatar avatar-xl" alt="" style="width:120px;height:120px">'
        : '<div class="avatar avatar-xl avatar-initials" style="width:120px;height:120px;font-size:2.5rem">' + getInitials(p.display_name) + '</div>'
    const joined = p.created_at ? formatDate(p.created_at) : 'Today'
    const stats = await getTotalStats()

    const level = (p.learning_level || 'beginner')
    renderFrame(app, '<div class="profile-header">' + avatarHTML + '<div class="profile-header-info"><h1>' + (p.display_name || 'User') + '</h1><div class="username">@' + (p.username || 'user') + '</div>' + (p.bio ? '<div class="bio">' + p.bio + '</div>' : '') + '<div class="profile-meta"><span>📅 Joined ' + joined + '</span><span>📊 ' + level + '</span><span>' + (p.gender === 'male' ? '♂' : '♀') + '</span></div></div><button class="btn btn-secondary btn-sm" onclick="navigate(\'profile-edit\')">✏️ Edit Profile</button></div><div class="profile-stats"><div class="dash-stat-card"><div class="stat-value">' + stats.done + '</div><div class="stat-label">Lessons Done</div></div><div class="dash-stat-card"><div class="stat-value">' + stats.courses + '</div><div class="stat-label">Courses</div></div><div class="dash-stat-card"><div class="stat-value">' + Math.round((stats.done / stats.total) * 100) + '%</div><div class="stat-label">Overall Progress</div></div></div>', 'profile')
}

function renderProfileEdit(app) {
    const p = _profile || {}
    const avatar = p.avatar_url || ''
    const avatarHTML = avatar
        ? '<img src="' + avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%" alt="">'
        : '<span class="avatar-upload-placeholder">+</span>'

    renderFrame(app, '<div style="max-width:520px"><h2 style="margin-bottom:1rem">Edit Profile</h2><form onsubmit="handleProfileEdit(event)"><div class="form-group" style="text-align:center"><div class="avatar-upload" id="peAvatar" onclick="document.getElementById(\'pePhoto\').click()">' + avatarHTML + '</div><input type="file" id="pePhoto" accept="image/*" style="display:none" onchange="handlePePhoto(event)"><p style="font-size:0.8rem;color:var(--text-dim);margin-top:0.3rem;cursor:pointer" onclick="document.getElementById(\'pePhoto\').click()">Change photo</p></div><div style="display:flex;gap:0.75rem"><div class="form-group" style="flex:1"><label class="form-label">First Name</label><input class="form-input" id="peFname" value="' + (p.first_name || '') + '" required></div><div class="form-group" style="flex:1"><label class="form-label">Last Name</label><input class="form-input" id="peLname" value="' + (p.last_name || '') + '" required></div></div><div class="form-group"><label class="form-label">Username</label><input class="form-input" id="peUsername" value="' + (p.username || '') + '" required></div><div class="form-group"><label class="form-label">Bio</label><textarea class="form-input" id="peBio" rows="2">' + (p.bio || '') + '</textarea></div><button class="btn btn-primary btn-block" type="submit" id="peBtn">Save Changes</button></form><div id="peError" class="form-error" style="text-align:center;margin-top:0.5rem"></div></div>', 'profile')

    window.handlePePhoto = function(e) {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = function(ev) {
            const div = $('peAvatar')
            if (div) div.innerHTML = '<img src="' + ev.target.result + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%" alt="">'
            window._pePhotoData = ev.target.result
        }
        reader.readAsDataURL(file)
    }
}

window.handleProfileEdit = async function(e) {
    e.preventDefault()
    const fname = $('peFname')?.value.trim()
    const lname = $('peLname')?.value.trim()
    const uname = $('peUsername')?.value.trim()
    const bio = $('peBio')?.value.trim() || ''
    const err = $('peError')
    const btn = $('peBtn')
    if (!fname || !lname || !uname) { if (err) err.textContent = 'Fill required fields.'; return }
    btn.textContent = 'Saving...'
    btn.disabled = true
    try {
        const data = {
            first_name: fname,
            last_name: lname,
            username: uname,
            display_name: fname + ' ' + lname,
            bio: bio
        }
        if (window._pePhotoData) data.avatar_url = window._pePhotoData
        const updated = await updateProfile(_profileDocId, data)
        _profile = { ..._profile, ...data }
        if (window._pePhotoData) _profile.avatar_url = window._pePhotoData
        showToast('Profile updated!', 'success')
        navigate('profile')
    } catch (e) {
        if (err) err.textContent = e.message || 'Failed to update.'
        btn.textContent = 'Save Changes'
        btn.disabled = false
    }
}

window.toggleBookmarkCourse = async function(courseId) {
    const now = await toggleBookmark(courseId)
    const btn = $('bmBtn-' + courseId)
    if (btn) btn.style.opacity = now ? '1' : '0.5'
    showToast(now ? 'Course bookmarked!' : 'Bookmark removed.', 'info')
}

function renderSettings(app) {
    const email = _user?.email || ''
    renderFrame(app, '<div style="max-width:520px"><h2 style="margin-bottom:1rem">⚙️ Settings</h2><div class="card" style="margin-bottom:1rem"><h3 style="margin-bottom:0.5rem">Account</h3><p style="color:var(--text-secondary);font-size:0.9rem">Email: ' + email + '</p></div><div class="card" style="margin-bottom:1rem"><h3 style="margin-bottom:0.5rem">Learning Preferences</h3><button class="btn btn-secondary btn-sm" onclick="showToast(\'Coming soon!\', \'info\')">Change Learning Level</button></div><div class="card"><h3 style="margin-bottom:0.5rem">Danger Zone</h3><button class="btn btn-danger btn-sm" onclick="showToast(\'Logging out...\', \'info\');handleLogout()">Log Out</button></div></div>', 'settings')
}

function renderAiTutor(app) {
    renderFrame(app, '<div style="max-width:800px;margin:0 auto"><div class="section-header"><h2>🤖 VOID Assistant</h2></div><p style="color:var(--text-secondary);margin-bottom:1.5rem">Ask me anything about programming. I can explain concepts, help debug, suggest learning paths, or answer questions about your courses.</p><div id="ai-chat" class="ai-chat"><div class="ai-message ai-bot"><div class="ai-avatar">◇</div><div class="ai-bubble"><p>Hi! I\'m VOID Assistant. Ask me anything about programming or your courses!</p><p style="font-size:0.8rem;color:var(--text-dim);margin-top:0.5rem">Try: "Explain loops in Python" or "What should I learn after HTML?"</p></div></div></div><div class="ai-input-row"><input class="form-input" id="aiInput" placeholder="Ask VOID Assistant..." onkeydown="if(event.key===\'Enter\')sendAiMessage()"><button class="btn btn-primary" onclick="sendAiMessage()" id="aiSendBtn">Send</button></div></div>', 'ai-tutor')

    if (!window._aiProvider) {
        window._aiProvider = CONFIG.ai.defaultProvider
    }
}

window.sendAiMessage = async function() {
    const input = $('aiInput')
    const chat = $('ai-chat')
    const btn = $('aiSendBtn')
    const msg = input?.value.trim()
    if (!msg || !chat) return

    chat.innerHTML += '<div class="ai-message ai-user"><div class="ai-bubble ai-user-bubble"><p>' + escapeHtml(msg) + '</p></div></div>'
    input.value = ''
    btn.disabled = true
    btn.textContent = 'Thinking...'
    chat.scrollTop = chat.scrollHeight

    try {
        const reply = await askVoidAssistant(msg)
        chat.innerHTML += '<div class="ai-message ai-bot"><div class="ai-avatar">◇</div><div class="ai-bubble"><p>' + reply.replace(/\n/g, '<br>') + '</p></div></div>'
    } catch (e) {
        chat.innerHTML += '<div class="ai-message ai-bot"><div class="ai-avatar">◇</div><div class="ai-bubble ai-error"><p>Sorry, I couldn\'t reach the AI. ' + escapeHtml(e.message || 'Check your connection and try again.') + '</p></div></div>'
    }
    btn.disabled = false
    btn.textContent = 'Send'
    chat.scrollTop = chat.scrollHeight
}

async function renderCertificates(app) {
    const stats = await getTotalStats()
    const courses = await fetchCourses()
    const progressMap = await getCourseProgressAll(_user?.$id)
    const completedIds = Object.entries(progressMap).filter(([, p]) => p === 100).map(([id]) => id)
    const certs = courses.filter(c => completedIds.includes(c.id))
    const certHTML = certs.length
        ? certs.map(c =>
            '<div class="cert-card"><div class="cert-icon">🏆</div><div class="cert-info"><h3>' + c.title + '</h3><p>Completed all ' + (c.lessons || []).length + ' lessons</p></div><span class="cert-badge">✓ Earned</span></div>'
          ).join('')
        : '<div class="placeholder-page" style="padding:2rem"><div class="icon" style="font-size:3rem">🎯</div><h2>No Certificates Yet</h2><p>Complete a course to earn your first certificate!</p><button class="btn btn-primary" style="margin-top:1rem" onclick="navigate(\'courses\')">Browse Courses</button></div>'

    renderFrame(app, '<div class="section-header"><h2>🏆 Certificates</h2></div><p style="color:var(--text-secondary);margin-bottom:1.5rem">' + stats.done + ' of ' + stats.total + ' lessons completed • ' + certs.length + ' course' + (certs.length !== 1 ? 's' : '') + ' fully completed</p><div class="cert-grid">' + certHTML + '</div>', 'certificates')
}

async function renderBookmarks(app) {
    const userId = _user?.$id
    let bookmarkedIds = []
    if (userId) {
        bookmarkedIds = await fetchBookmarks(userId)
    }
    const courses = await fetchCourses()
    const bookmarkedCourses = bookmarkedIds.map(id => courses.find(c => c.id === id)).filter(Boolean)

    let html
    const progressMap = await getCourseProgressAll(_user?.$id)
    if (bookmarkedCourses.length) {
        html = '<div class="course-grid">' + (await Promise.all(bookmarkedCourses.map(c => courseCardMini(c, progressMap[c.id])))).join('') + '</div>'
    } else {
        html = '<div class="placeholder-page" style="padding:2rem"><div class="icon" style="font-size:3rem">🔖</div><h2>No Bookmarks Yet</h2><p>Bookmark courses to find them quickly later.</p><button class="btn btn-primary" style="margin-top:1rem" onclick="navigate(\'courses\')">Browse Courses</button></div>'
    }
    renderFrame(app, '<div class="section-header"><h2>🔖 Bookmarks</h2></div>' + html, 'bookmarks')
}

window.handleLogout = async function() {
    await logOut()
    _user = null
    _profile = null
    _profileDocId = null
    clearContentCache()
    clearProgressCache()
    showToast('Logged out.', 'info')
    navigate('home')
}

function extFor(id) {
    const m = { python: 'py', javascript: 'js', 'html-css': 'html', java: 'java', cpp: 'cpp', go: 'go', rust: 'rs', php: 'php', swift: 'swift', kotlin: 'kt', ruby: 'rb', sql: 'sql' }
    return m[id] || 'txt'
}

function escapeHtml(str) {
    const d = document.createElement('div')
    d.textContent = str
    return d.innerHTML
}

window.copyCode = function(btn) {
    const pre = btn.parentElement.nextElementSibling
    const code = pre.textContent
    navigator.clipboard.writeText(code).then(() => {
        btn.textContent = '✅ Copied!'
        setTimeout(() => { btn.textContent = '📋 Copy' }, 2000)
    }).catch(() => {
        const ta = document.createElement('textarea')
        ta.value = code; document.body.appendChild(ta); ta.select()
        document.execCommand('copy'); document.body.removeChild(ta)
        btn.textContent = '✅ Copied!'
        setTimeout(() => { btn.textContent = '📋 Copy' }, 2000)
    })
}

window.answerQuiz = function(btn, selected, correct, explanation) {
    const section = btn.closest('.quiz-section')
    if (!section) return
    const options = section.querySelectorAll('.quiz-option')
    const feedback = section.querySelector('.quiz-feedback')
    options.forEach(o => o.disabled = true)
    options.forEach((o, i) => {
        if (i === correct) o.classList.add('correct')
        if (i === selected && i !== correct) o.classList.add('wrong')
        if (i === selected) o.classList.add('selected')
    })
    if (!feedback) return
    feedback.className = 'quiz-feedback show ' + (selected === correct ? 'correct' : 'wrong')
    feedback.textContent = selected === correct ? '✅ Correct! ' + explanation : '❌ Not quite. ' + explanation
}

async function courseCardMini(c, prog) {
    if (prog === undefined) {
        prog = _user ? await getCourseProgress(_user.$id, c.id) : 0
    }
    const initial = c.title.charAt(0)
    const thumbBg = c.color + '22'
    const thumbText = c.color
    const rating = c.rating || 4.5
    const stars = Math.round(rating)
    const starHTML = '★'.repeat(stars) + '☆'.repeat(5 - stars)
    return '<div class="course-card" onclick="navigate(\'course\',\'' + c.id + '\')"><div class="course-card-thumb" style="background:' + thumbBg + ';color:' + c.color + ';font-size:2.5rem;font-weight:800">' + (prog === 100 ? '<span class="course-card-badge">Done</span>' : '') + initial + '</div><div class="course-card-body"><h3>' + c.title + '</h3><div class="desc">' + c.desc + '</div><div class="course-card-meta"><span>' + c.difficulty + '</span><span>' + c.duration + '</span><span>' + (c.lessons || []).length + ' lessons</span><span style="color:' + (rating >= 4 ? 'var(--accent)' : 'var(--warning)') + '">' + starHTML + ' ' + rating.toFixed(1) + '</span></div><div class="course-card-bar"><div class="course-card-fill" style="width:' + prog + '%"></div></div></div></div>'
}

function courseCardFull(c, prog) {
    return courseCardMini(c, prog)
}

const _doSearch = debounce(async function(q) {
    if (!q || q.length < CONFIG.limits.searchMinChars) {
        const existing = document.getElementById('search-results')
        if (existing) existing.remove()
        return
    }
    const query = q.toLowerCase()
    const courses = await fetchCourses()
    const results = courses.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.desc.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query)
    ).slice(0, CONFIG.limits.searchMaxResults)

    let existing = document.getElementById('search-results')
    if (!results.length) {
        if (existing) existing.remove()
        return
    }
    if (!existing) {
        existing = document.createElement('div')
        existing.id = 'search-results'
        existing.className = 'search-dropdown'
        const searchBar = document.querySelector('.search-bar')
        if (searchBar) {
            searchBar.style.position = 'relative'
            searchBar.appendChild(existing)
        }
    }
    existing.innerHTML = results.map(c =>
        '<div class="search-result-item" onclick="navigate(\'course\',\'' + c.id + '\')"><span class="search-result-icon" style="background:' + c.color + '22;color:' + c.color + '">' +
        '<span class="sr-icon-text">' + c.title.charAt(0) + '</span></span><div class="search-result-info"><div class="search-result-title">' + c.title + '</div><div class="search-result-meta">' + c.difficulty + ' • ' + c.category + '</div></div></div>'
    ).join('')
}, 200)

function clearSearchDropdown() {
    const existing = document.getElementById('search-results')
    if (existing) existing.remove()
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-bar')) clearSearchDropdown()
})

function debounceSearch(val) {
    _doSearch(val)
}

document.addEventListener('DOMContentLoaded', init)
