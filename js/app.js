const PROGRESS_KEY = 'kvoid_progress'

function getProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {} }
    catch { return {} }
}
function saveProgress(p) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)) }

function markLessonComplete(courseId, lessonId) {
    const p = getProgress()
    if (!p[courseId]) p[courseId] = []
    if (!p[courseId].includes(lessonId)) { p[courseId].push(lessonId); saveProgress(p) }
    updateGlobalProgress()
}
function isLessonComplete(courseId, lessonId) {
    const p = getProgress()
    return p[courseId] && p[courseId].includes(lessonId)
}
function getCourseProgress(courseId) {
    const course = COURSES.find(c => c.id === courseId)
    if (!course) return 0
    const p = getProgress()
    const done = (p[courseId] || []).length
    return Math.round((done / course.lessons.length) * 100)
}
function getTotalStats() {
    const p = getProgress()
    let total = 0, done = 0
    COURSES.forEach(c => { total += c.lessons.length; done += (p[c.id] || []).length })
    return { total, done, courses: COURSES.length }
}
function updateGlobalProgress() {
    const s = getTotalStats()
    const bar = document.getElementById('globalProgress')
    if (bar) bar.style.width = (s.total > 0 ? Math.round((s.done / s.total) * 100) : 0) + '%'
}

function navigate(page, data) {
    let hash = page
    if (data !== undefined && data !== null) hash += '/' + data
    window.location.hash = hash
}
window.addEventListener('hashchange', render)
window.addEventListener('load', () => {
    if (!window.location.hash) window.location.hash = 'home'
    else render()
})

function render() {
    const hash = window.location.hash.slice(1) || 'home'
    const [page, ...params] = hash.split('/')
    const app = document.getElementById('app')
    const nl = document.getElementById('navLinks')
    if (nl) nl.classList.remove('show')
    switch (page) {
        case 'home': renderHome(app); break
        case 'courses': renderCourses(app); break
        case 'course': renderCourse(app, params[0]); break
        case 'lesson': renderLesson(app, params[0], params[1]); break
        case 'progress': renderProgress(app); break
        case 'about': renderAbout(app); break
        case 'login': renderLogin(app); break
        case 'signup': renderSignup(app); break
        case 'verify': renderVerify(app, params[0]); break
        default: renderHome(app)
    }
    updateGlobalProgress()
}

function toggleNav() { document.getElementById('navLinks').classList.toggle('show') }

// ===== HOME =====
function renderHome(app) {
    const stats = getTotalStats()
    const user = window.currentUser
    const meta = user?.user_metadata || {}
    const name = meta.first_name || meta.username || user?.email?.split('@')[0] || ''
    const avatar = meta.avatar_url || ''
    const gender = meta.gender || ''
    app.innerHTML = `
    <div class="page"><div class="hero">
      ${user ? `
        <div style="display:flex;align-items:center;justify-content:center;gap:1rem;margin-bottom:1rem">
          ${avatar ? `<img src="${avatar}" style="width:56px;height:56px;border-radius:50%;border:2px solid var(--primary)">` : `<div style="width:56px;height:56px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:white">${name.charAt(0).toUpperCase()}</div>`}
          <div style="text-align:left">
            <h2 style="font-size:1.1rem;font-weight:600">Welcome, ${name}! 👋</h2>
            <p style="color:var(--text-dim);font-size:0.85rem">${stats.done}/${stats.total} lessons completed</p>
          </div>
        </div>
      ` : ''}
      <h1>◇ K-VOID Programming Hub</h1>
      <p>Learn programming from scratch — free. Tiny lessons, immediate practice, real progress.</p>
      <button class="hero-cta" onclick="navigate('courses')">Start Learning →</button>
      <div class="stats">
        <div class="stat-item"><div class="stat-number">${COURSES.length}</div><div class="stat-label">Courses</div></div>
        <div class="stat-item"><div class="stat-number">${stats.total}</div><div class="stat-label">Lessons</div></div>
        <div class="stat-item"><div class="stat-number">${stats.done}</div><div class="stat-label">Completed</div></div>
      </div>
      ${!user ? '<p style="margin-top:1.5rem"><a onclick="navigate(\'login\')" style="color:var(--accent);cursor:pointer;text-decoration:underline">Sign up / Login</a> to save your progress</p>' : ''}
    </div>
    <h2 class="section-title">Popular Courses</h2>
    <div class="course-grid">${COURSES.slice(0,3).map(c => courseCardHTML(c)).join('')}</div>
    <div style="text-align:center;margin:1.5rem 0">
      <button class="hero-cta" style="background:var(--bg-card);color:var(--text);border:1px solid var(--border)" onclick="navigate('courses')">View All Courses →</button>
    </div></div>`
}

// ===== COURSES =====
function renderCourses(app) {
    app.innerHTML = `
    <div class="page">
      <h1 class="section-title" style="font-size:1.8rem;margin-bottom:0.5rem">All Courses</h1>
      <p style="color:var(--text-dim);margin-bottom:1.5rem">Pick a course. Each lesson is bite-sized with practice exercises to lock it in.</p>
      <div class="course-grid">${COURSES.map(c => courseCardHTML(c)).join('')}</div>
    </div>`
}

function courseCardHTML(c) {
    const prog = getCourseProgress(c.id)
    return `
    <div class="course-card" onclick="navigate('course','${c.id}')">
      ${prog === 100 ? '<span class="card-badge">✓ Complete</span>' : ''}
      <div class="card-icon">${c.icon}</div>
      <h3>${c.title}</h3>
      <p class="card-desc">${c.desc}</p>
      <div class="card-meta"><span>${c.subtitle}</span><span>${c.lessons.length} lessons</span></div>
      <div class="card-progress"><div class="card-progress-fill" style="width:${prog}%"></div></div>
    </div>`
}

// ===== COURSE DETAIL =====
function renderCourse(app, courseId) {
    const course = COURSES.find(c => c.id === courseId)
    if (!course) { navigate('courses'); return }
    const prog = getCourseProgress(courseId)
    app.innerHTML = `
    <div class="page">
      <div class="course-header">
        <button class="back-btn" onclick="navigate('courses')">← Back to Courses</button>
        <h1>${course.icon} ${course.title}</h1>
        <p class="course-subtitle">${course.subtitle} • ${course.lessons.length} lessons • ${prog}% complete</p>
        <div class="card-progress" style="margin-top:0.8rem"><div class="card-progress-fill" style="width:${prog}%"></div></div>
      </div>
      <h2 class="section-title">Lessons</h2>
      <div class="lesson-list">${course.lessons.map((l,i) => {
        const done = isLessonComplete(courseId, l.id)
        return `<div class="lesson-item ${done?'completed':''}" onclick="navigate('lesson','${courseId}','${l.id}')">
          <div class="lesson-num">${done?'✓':(i+1)}</div>
          <div class="lesson-info"><h4>${l.title}</h4><p>${l.desc}</p></div>
          <div class="lesson-status">${done?'✅':'📖'}</div>
        </div>`
      }).join('')}</div>
    </div>`
}

// ===== LESSON =====
function renderLesson(app, courseId, lessonId) {
    const course = COURSES.find(c => c.id === courseId)
    if (!course) { navigate('courses'); return }
    const lesson = course.lessons.find(l => l.id === lessonId)
    if (!lesson) { navigate('course', courseId); return }
    const idx = course.lessons.findIndex(l => l.id === lessonId)
    const prev = idx > 0 ? course.lessons[idx - 1] : null
    const next = idx < course.lessons.length - 1 ? course.lessons[idx + 1] : null

    // concept blocks
    const conceptsHTML = lesson.concepts ? lesson.concepts.map((c, i) => `
      <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:1rem;margin:1rem 0">
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem">
          <span style="background:var(--primary);color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;flex-shrink:0">${i+1}</span>
          <strong>${c.title}</strong>
        </div>
        <p style="color:var(--text-dim);font-size:0.9rem;margin-bottom:0.5rem">${c.text}</p>
        ${c.code ? `<div class="code-block"><div class="code-header"><span>example.${extFor(courseId)}</span><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button></div><pre>${c.code}</pre></div>` : ''}
        ${c.classwork ? `
        <div style="background:var(--bg);border:1px solid var(--accent);border-radius:8px;padding:0.8rem;margin-top:0.5rem">
          <strong style="color:var(--accent);font-size:0.85rem">✏️ Your Turn:</strong>
          <p style="color:var(--text-dim);font-size:0.85rem;margin-top:0.3rem">${c.classwork}</p>
        </div>` : ''}
      </div>
    `).join('') : ''

    // summary
    const summaryHTML = lesson.summary ? `
    <div style="background:var(--bg);border:1px solid var(--primary);border-radius:10px;padding:1rem;margin:1rem 0">
      <strong style="color:var(--primary)">📌 Quick Recap:</strong>
      <ul style="margin-top:0.5rem;color:var(--text-dim);font-size:0.9rem">
        ${lesson.summary.map(s => `<li style="margin-bottom:0.3rem">${s}</li>`).join('')}
      </ul>
    </div>` : ''

    const quizHTML = lesson.quiz ? `
    <div class="quiz-section" data-lesson="${lesson.id}">
      <h3>📝 Check Yourself</h3>
      <p class="quiz-question">${lesson.quiz.q}</p>
      <div class="quiz-options">${lesson.quiz.options.map((opt,i) =>
        `<button class="quiz-option" onclick="answerQuiz(this,${i},${lesson.quiz.answer},'${lesson.quiz.explanation.replace(/'/g,"\\'")}')">${opt}</button>`
      ).join('')}</div>
      <div class="quiz-feedback" id="quiz-feedback-${lesson.id}"></div>
    </div>` : ''

    app.innerHTML = `
    <div class="page"><div class="lesson-view">
      <button class="back-btn" onclick="navigate('course','${courseId}')">← Back to ${course.title}</button>
      <h1>${lesson.icon || '📘'} ${lesson.title}</h1>
      <p style="color:var(--text-dim);margin-bottom:1rem">${lesson.desc}</p>
      ${conceptsHTML}
      ${summaryHTML}
      ${quizHTML}
      <div class="lesson-nav">
        ${prev ? `<button onclick="navigate('lesson','${courseId}','${prev.id}')">← ${prev.title}</button>` : '<button disabled>← Previous</button>'}
        ${next ? `<button class="primary-btn" onclick="navigate('lesson','${courseId}','${next.id}')">${next.title} →</button>` : `<button class="primary-btn" onclick="navigate('course','${courseId}')">✅ Complete Course</button>`}
      </div>
    </div></div>`

    setTimeout(() => {
        if (!isLessonComplete(courseId, lessonId)) markLessonComplete(courseId, lessonId)
    }, 1000)
}

function extFor(id) {
    const m = { python:'py', javascript:'js', 'html-css':'html', java:'java', cpp:'cpp', go:'go', rust:'rs', php:'php', swift:'swift', kotlin:'kt', ruby:'rb', sql:'sql' }
    return m[id] || 'txt'
}

function copyCode(btn) {
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

function answerQuiz(btn, selected, correct, explanation) {
    const section = btn.closest('.quiz-section')
    const options = section.querySelectorAll('.quiz-option')
    const feedback = section.querySelector('.quiz-feedback')
    options.forEach(o => o.disabled = true)
    options.forEach((o, i) => {
        if (i === correct) o.classList.add('correct')
        if (i === selected && i !== correct) o.classList.add('wrong')
        if (i === selected) o.classList.add('selected')
    })
    feedback.className = 'quiz-feedback show ' + (selected === correct ? 'correct' : 'wrong')
    feedback.textContent = selected === correct ? '✅ Correct! ' + explanation : '❌ Not quite. ' + explanation
}

// ===== PROGRESS =====
function renderProgress(app) {
    const stats = getTotalStats()
    const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0
    app.innerHTML = `
    <div class="page">
      <h1 class="section-title">Your Progress</h1>
      <div class="progress-stats">
        <div class="progress-stat-card"><div class="stat-value">${stats.done}</div><div class="stat-label">Lessons Done</div></div>
        <div class="progress-stat-card"><div class="stat-value">${pct}%</div><div class="stat-label">Progress</div></div>
        <div class="progress-stat-card"><div class="stat-value">${stats.total - stats.done}</div><div class="stat-label">Remaining</div></div>
      </div>
      <h2 class="section-title">Courses</h2>
      <div class="progress-course-list">${COURSES.map(c => {
        const prog = getCourseProgress(c.id); const done = (getProgress()[c.id]||[]).length
        return `<div class="progress-course-item" onclick="navigate('course','${c.id}')" style="cursor:pointer">
          <div class="pci-header"><h4>${c.icon} ${c.title}</h4><span>${done}/${c.lessons.length}</span></div>
          <div class="progress-bar-full"><div class="pbf-fill" style="width:${prog}%"></div></div>
        </div>`
      }).join('')}</div>
      ${stats.done === 0 ? '<p style="color:var(--text-dim);text-align:center;margin-top:2rem">Start a course to see your progress here!</p>' : ''}
    </div>`
}

// ===== ABOUT =====
function renderAbout(app) {
    app.innerHTML = `
    <div class="page"><div class="about-page">
      <h1>◇ K-VOID Programming Hub</h1>
      <p class="about-subtitle">Learn to code. Completely free.</p>
      <div class="about-card"><h3>🎯 Our Mission</h3><p>To make programming education accessible to anyone with a phone and internet. No credit cards, no barriers.</p></div>
      <div class="about-card"><h3>📚 Courses</h3><p>12 programming languages. Bite-sized lessons with practice exercises. Built for short attention spans — learn one concept at a time.</p></div>
      <div class="about-card"><h3>🧠 STM-Friendly</h3><p>Each lesson is broken into tiny concepts with "Your Turn" exercises after each one. A recap at the end locks it into memory.</p></div>
      <div class="about-card"><h3>💜 Join Us</h3><p>Every master was once a beginner. Start today.</p></div>
    </div></div>`
}

// ===== PASSWORD STRENGTH =====
function getPasswordStrength(pw) {
    let score = 0
    if (pw.length >= 6) score++
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[a-z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return Math.min(score, 5)
}
function strengthColor(score) {
    if (score <= 1) return '#ef4444'
    if (score <= 3) return '#f59e0b'
    return '#06d6a0'
}
function strengthLabel(score) {
    if (score <= 1) return 'Weak'
    if (score <= 3) return 'Medium'
    return 'Strong'
}

// ===== AVATAR =====
function getAvatarURL(gender, seed) {
    const s = seed || 'user'
    if (gender === 'male') {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${s}&accessoriesType=blank&topType=shortHairShortWaved&facialHairType=beardMedium&clothingType=blazer&eyeType=default&mouthType=smile&skinColor=light`
    } else if (gender === 'female') {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${s}_f&accessoriesType=blank&topType=longHairStraight&facialHairType=blank&clothingType=blazer&eyeType=default&mouthType=smile&skinColor=light`
    }
    return `https://api.dicebear.com/7.x/initials/svg?seed=${s}&backgroundColor=7c3aed`
}

// ===== AUTH PAGES =====
function renderLogin(app) {
    app.innerHTML = `
    <div class="page" style="max-width:400px;margin:2rem auto">
      <div style="text-align:center;margin-bottom:1.5rem">
        <div style="font-size:2rem;margin-bottom:0.5rem">◇</div>
        <h1 style="font-size:1.5rem">Welcome Back</h1>
        <p style="color:var(--text-dim);font-size:0.9rem">Log in to continue learning</p>
      </div>
      <form id="loginForm" onsubmit="handleLoginSubmit(event)" style="display:flex;flex-direction:column;gap:1rem">
        <div>
          <label style="display:block;font-size:0.85rem;color:var(--text-dim);margin-bottom:0.2rem">Email</label>
          <input type="email" id="loginEmail" required style="width:100%;padding:0.8rem;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:1rem">
        </div>
        <div>
          <label style="display:block;font-size:0.85rem;color:var(--text-dim);margin-bottom:0.2rem">Password</label>
          <input type="password" id="loginPassword" required style="width:100%;padding:0.8rem;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:1rem">
        </div>
        <button type="submit" style="padding:0.8rem;background:var(--primary);border:none;border-radius:8px;color:white;font-size:1rem;font-weight:600;cursor:pointer">Log In</button>
        <p style="text-align:center;font-size:0.85rem">
          <a onclick="handleSendCodeLogin()" style="color:var(--accent);cursor:pointer;text-decoration:underline">Send code instead</a>
        </p>
        <div style="position:relative;text-align:center">
          <span style="background:var(--bg);padding:0 0.8rem;color:var(--text-dark);font-size:0.8rem;position:relative;z-index:1">or</span>
          <div style="border-top:1px solid var(--border);margin-top:-0.6rem"></div>
        </div>
        <button type="button" onclick="handleGoogleLogin()" style="padding:0.8rem;background:white;border:none;border-radius:8px;color:#333;font-size:1rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem">
          <span style="font-size:1.2rem">G</span> Continue with Google
        </button>
        <p style="text-align:center;color:var(--text-dim);font-size:0.85rem;margin-top:0.3rem">
          New here? <a onclick="navigate('signup')" style="color:var(--accent);cursor:pointer;text-decoration:underline">Create an account</a>
        </p>
      </form>
      <div id="loginError" style="color:var(--danger);font-size:0.85rem;text-align:center;margin-top:0.5rem"></div>
    </div>`
    setTimeout(() => document.getElementById('loginEmail')?.focus(), 100)
}

// ===== SIGNUP PAGE =====
function renderSignup(app) {
    app.innerHTML = `
    <div class="page" style="max-width:480px;margin:1rem auto">
      <div style="text-align:center;margin-bottom:1.2rem">
        <h1 style="font-size:1.4rem">Create Your Account</h1>
        <p style="color:var(--text-dim);font-size:0.85rem">Join K-VOID and start learning</p>
      </div>
      <form id="signupForm" onsubmit="handleSignupSubmit(event)" style="display:flex;flex-direction:column;gap:1rem">
        <div style="text-align:center">
          <div id="photoPreview" style="width:90px;height:90px;border-radius:50%;background:var(--bg-card);border:2px dashed var(--border);margin:0 auto;overflow:hidden;display:flex;align-items:center;justify-content:center;cursor:pointer" onclick="document.getElementById('photoInput').click()">
            <span style="font-size:2rem;color:var(--text-dark)">+</span>
          </div>
          <input type="file" id="photoInput" accept="image/*" style="display:none" onchange="handlePhotoPick(event)">
          <p style="font-size:0.75rem;color:var(--text-dim);margin-top:0.3rem;cursor:pointer" onclick="document.getElementById('photoInput').click()">Add profile photo</p>
        </div>
        <div style="display:flex;gap:0.8rem">
          <div style="flex:1">
            <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:0.2rem">First name</label>
            <input type="text" id="sfname" required style="width:100%;padding:0.7rem;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:0.95rem">
          </div>
          <div style="flex:1">
            <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:0.2rem">Last name</label>
            <input type="text" id="slname" required style="width:100%;padding:0.7rem;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:0.95rem">
          </div>
        </div>
        <div>
          <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:0.2rem">Username</label>
          <input type="text" id="susername" required style="width:100%;padding:0.7rem;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:0.95rem">
        </div>
        <div>
          <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:0.3rem">Gender</label>
          <div style="display:flex;gap:0.8rem">
            <button type="button" id="genderMale" onclick="selectGender('male')" style="flex:1;padding:0.6rem;border:1px solid var(--border);border-radius:8px;background:var(--bg-card);color:var(--text);font-size:0.9rem;cursor:pointer">♂ Male</button>
            <button type="button" id="genderFemale" onclick="selectGender('female')" style="flex:1;padding:0.6rem;border:1px solid var(--border);border-radius:8px;background:var(--bg-card);color:var(--text);font-size:0.9rem;cursor:pointer">♀ Female</button>
          </div>
        </div>
        <div>
          <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:0.2rem">Email</label>
          <input type="email" id="semail" required style="width:100%;padding:0.7rem;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:0.95rem">
        </div>
        <div>
          <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:0.2rem">Password</label>
          <input type="password" id="spassword" required minlength="6" style="width:100%;padding:0.7rem;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:0.95rem" oninput="updatePasswordStrength()">
          <div style="height:4px;background:var(--border);border-radius:2px;margin-top:0.3rem;overflow:hidden">
            <div id="pwStrengthBar" style="height:100%;width:0%;border-radius:2px;transition:all 0.3s"></div>
          </div>
          <p id="pwStrengthLabel" style="font-size:0.75rem;color:var(--text-dark);margin-top:0.2rem"></p>
        </div>
        <div>
          <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:0.2rem">Confirm password</label>
          <input type="password" id="sconfirm" required minlength="6" style="width:100%;padding:0.7rem;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:0.95rem" oninput="updatePasswordMatch()">
          <div style="height:4px;background:var(--border);border-radius:2px;margin-top:0.3rem;overflow:hidden">
            <div id="pwMatchBar" style="height:100%;width:0%;border-radius:2px;transition:all 0.3s"></div>
          </div>
          <p id="pwMatchLabel" style="font-size:0.75rem;color:var(--text-dark);margin-top:0.2rem"></p>
        </div>
        <button type="submit" id="signupBtn" style="padding:0.8rem;background:var(--primary);border:none;border-radius:8px;color:white;font-size:1rem;font-weight:600;cursor:pointer">Create Account →</button>
        <p style="text-align:center;color:var(--text-dim);font-size:0.85rem">
          Already have an account? <a onclick="navigate('login')" style="color:var(--accent);cursor:pointer;text-decoration:underline">Log in</a>
        </p>
      </form>
      <div id="signupError" style="color:var(--danger);font-size:0.85rem;text-align:center;margin-top:0.5rem"></div>
    </div>`
}

// ===== GENDER SELECT =====
window.selectGender = function(g) {
    window._selectedGender = g
    const m = document.getElementById('genderMale')
    const f = document.getElementById('genderFemale')
    if (!m || !f) return
    m.style.borderColor = g === 'male' ? 'var(--primary)' : 'var(--border)'
    m.style.background = g === 'male' ? 'var(--primary-glow)' : 'var(--bg-card)'
    f.style.borderColor = g === 'female' ? 'var(--primary)' : 'var(--border)'
    f.style.background = g === 'female' ? 'var(--primary-glow)' : 'var(--bg-card)'
}

// ===== PHOTO PICK =====
window.handlePhotoPick = function(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = function(ev) {
        const div = document.getElementById('photoPreview')
        if (div) div.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
        window._avatarData = ev.target.result
    }
    reader.readAsDataURL(file)
}

// ===== PASSWORD STRENGTH =====
window.updatePasswordStrength = function() {
    const pw = document.getElementById('spassword')?.value || ''
    const score = getPasswordStrength(pw)
    const bar = document.getElementById('pwStrengthBar')
    const label = document.getElementById('pwStrengthLabel')
    if (!bar || !label) return
    const pct = (score / 5) * 100
    bar.style.width = pct + '%'
    bar.style.background = strengthColor(score)
    label.textContent = pw.length ? strengthLabel(score) : ''
}

// ===== PASSWORD MATCH =====
window.updatePasswordMatch = function() {
    const pw = document.getElementById('spassword')?.value || ''
    const confirm = document.getElementById('sconfirm')?.value || ''
    const bar = document.getElementById('pwMatchBar')
    const label = document.getElementById('pwMatchLabel')
    if (!bar || !label) return
    if (!confirm) { bar.style.width = '0%'; label.textContent = ''; return }
    if (pw === confirm) {
        bar.style.width = '100%'; bar.style.background = '#06d6a0'
        label.textContent = '✓ Match'; label.style.color = '#06d6a0'
    } else {
        bar.style.width = pw.startsWith(confirm) ? '60%' : '30%'; bar.style.background = '#ef4444'
        label.textContent = '✗ No match'; label.style.color = '#ef4444'
    }
}

// ===== SIGNUP: CREATE ACCOUNT + SEND CODE =====
window.handleSignupSubmit = async function(e) {
    e.preventDefault()
    const err = document.getElementById('signupError')
    const btn = document.getElementById('signupBtn')
    err.textContent = ''
    const fname = document.getElementById('sfname').value.trim()
    const lname = document.getElementById('slname').value.trim()
    const uname = document.getElementById('susername').value.trim()
    const email = document.getElementById('semail').value.trim()
    const pw = document.getElementById('spassword').value
    const confirm = document.getElementById('sconfirm').value
    const gender = window._selectedGender || ''
    if (!fname || !lname || !uname || !email || !pw || !confirm) { err.textContent = 'Fill all fields.'; return }
    if (!gender) { err.textContent = 'Select your gender.'; return }
    if (pw.length < 6) { err.textContent = 'Password min 6 characters.'; return }
    if (pw !== confirm) { err.textContent = 'Passwords do not match.'; return }
    btn.textContent = 'Creating account...'
    btn.disabled = true
    window._pendingProfile = {
        first_name: fname, last_name: lname, username: uname,
        gender: gender, avatar_url: window._avatarData || getAvatarURL(gender, uname),
        password: pw, email: email
    }
    try {
        // 1. Create user with email + password (stores profile in metadata)
        await window.signUpWithEmail(email, pw, {
            first_name: fname, last_name: lname, username: uname,
            gender: gender, avatar_url: window._avatarData || getAvatarURL(gender, uname)
        })
        // 2. Send 6-digit verification code to email
        await window.sendCode(email)
        navigate('verify', encodeURIComponent(email))
    } catch (e) {
        err.textContent = e.message || 'Signup failed.'
        btn.textContent = 'Create Account →'
        btn.disabled = false
    }
}

// ===== LOGIN: EMAIL + PASSWORD =====
window.handleLoginSubmit = async function(e) {
    e.preventDefault()
    const email = document.getElementById('loginEmail').value.trim()
    const pw = document.getElementById('loginPassword').value
    const err = document.getElementById('loginError')
    err.textContent = ''
    if (!email || !pw) { err.textContent = 'Enter email and password.'; return }
    try {
        await window.loginWithPassword(email, pw)
        navigate('home')
    } catch (e) {
        err.textContent = e.message || 'Invalid email or password.'
    }
}

// ===== LOGIN: SEND CODE (instead of password) =====
window.handleSendCodeLogin = async function() {
    const email = document.getElementById('loginEmail')?.value.trim()
    const err = document.getElementById('loginError')
    err.textContent = ''
    if (!email || !email.includes('@')) { err.textContent = 'Enter your email first.'; return }
    try {
        await window.sendCode(email)
        navigate('verify', encodeURIComponent(email))
    } catch (e) {
        err.textContent = e.message || 'Failed to send code.'
    }
}

// ===== VERIFY PAGE =====
function renderVerify(app, email) {
    if (!email) { navigate('login'); return }
    const decoded = decodeURIComponent(email)
    app.innerHTML = `
    <div class="page" style="max-width:400px;margin:2rem auto">
      <div style="text-align:center;margin-bottom:1.5rem">
        <div style="font-size:2rem;margin-bottom:0.5rem">✉️</div>
        <h1 style="font-size:1.3rem">Check your email</h1>
        <p style="color:var(--text-dim);font-size:0.9rem">We sent a 6-digit code to</p>
        <p style="color:var(--text);font-weight:600;font-size:0.95rem">${decoded}</p>
        <p style="color:var(--text-dark);font-size:0.8rem;margin-top:0.5rem">The code is in the email <strong>subject line</strong></p>
      </div>
      <div style="display:flex;flex-direction:column;gap:1rem">
        <div style="display:flex;gap:0.5rem;justify-content:center">
          ${[1,2,3,4,5,6].map(i => `<input type="text" maxlength="1" id="c${i}" class="code-digit" style="width:44px;height:52px;text-align:center;font-size:1.4rem;font-weight:700;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;color:var(--text)">`).join('')}
        </div>
        <button id="verifyBtn" onclick="handleVerifyCode('${decoded}')" style="padding:0.8rem;background:var(--primary);border:none;border-radius:8px;color:white;font-size:1rem;font-weight:600;cursor:pointer">Verify →</button>
        <button onclick="navigate('login')" style="padding:0.5rem;background:transparent;border:1px solid var(--border);border-radius:8px;color:var(--text-dim);font-size:0.85rem;cursor:pointer">Back to login</button>
      </div>
      <div id="verifyError" style="color:var(--danger);font-size:0.85rem;text-align:center;margin-top:0.5rem"></div>
    </div>`
    setTimeout(() => document.getElementById('c1')?.focus(), 100)
    for (let i = 1; i <= 6; i++) {
        const el = document.getElementById(`c${i}`)
        if (!el) continue
        el.addEventListener('input', () => { if (el.value && i < 6) document.getElementById(`c${i+1}`)?.focus() })
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !el.value && i > 1) document.getElementById(`c${i-1}`)?.focus()
            if (e.key === 'Enter') handleVerifyCode(decoded)
        })
    }
}

// ===== VERIFY CODE =====
window.handleVerifyCode = async function(email) {
    let token = ''
    for (let i = 1; i <= 6; i++) token += document.getElementById(`c${i}`)?.value || ''
    const err = document.getElementById('verifyError')
    const btn = document.getElementById('verifyBtn')
    err.textContent = ''
    if (token.length !== 6) { err.textContent = 'Enter all 6 digits.'; return }
    btn.textContent = 'Verifying...'
    btn.disabled = true
    try {
        await window.verifyCode(email, token)
        // If this was a signup (pending profile), set password + update metadata
        if (window._pendingProfile) {
            try {
                const p = { ...window._pendingProfile }
                const pw = p.password
                delete p.password
                delete p.email
                await window.updateProfile(p)
                if (pw) { try { await window.setPassword(pw) } catch {} }
            } catch {}
            delete window._pendingProfile
        }
        navigate('home')
    } catch (e) {
        err.textContent = e.message || 'Invalid code.'
        btn.textContent = 'Verify →'
        btn.disabled = false
    }
}

// ===== GOOGLE LOGIN =====
window.handleGoogleLogin = async function() {
    try { await window.loginWithGoogle() }
    catch { const el = document.getElementById('loginError'); if (el) el.textContent = 'Google not configured.' }
}
