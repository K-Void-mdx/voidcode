const PROGRESS_KEY = 'kvoid_progress';

function getProgress() {
    try {
        return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
    } catch { return {}; }
}

function saveProgress(p) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

function markLessonComplete(courseId, lessonId) {
    const p = getProgress();
    if (!p[courseId]) p[courseId] = [];
    if (!p[courseId].includes(lessonId)) {
        p[courseId].push(lessonId);
        saveProgress(p);
    }
    updateGlobalProgress();
}

function isLessonComplete(courseId, lessonId) {
    const p = getProgress();
    return p[courseId] && p[courseId].includes(lessonId);
}

function getCourseProgress(courseId) {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return 0;
    const p = getProgress();
    const done = (p[courseId] || []).length;
    return Math.round((done / course.lessons.length) * 100);
}

function getTotalStats() {
    const p = getProgress();
    let totalLessons = 0;
    let totalDone = 0;
    COURSES.forEach(c => {
        totalLessons += c.lessons.length;
        totalDone += (p[c.id] || []).length;
    });
    return { total: totalLessons, done: totalDone, courses: COURSES.length };
}

function updateGlobalProgress() {
    const stats = getTotalStats();
    const bar = document.getElementById('globalProgress');
    if (bar) {
        const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
        bar.style.width = pct + '%';
    }
}

function navigate(page, data) {
    window._navData = data;
    window.location.hash = page;
}

window.addEventListener('hashchange', render);
window.addEventListener('load', () => {
    if (!window.location.hash) {
        window.location.hash = 'home';
    } else {
        render();
    }
});

function render() {
    const hash = window.location.hash.slice(1) || 'home';
    const [page, ...params] = hash.split('/');
    const app = document.getElementById('app');

    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('show');

    switch (page) {
        case 'home': renderHome(app); break;
        case 'courses': renderCourses(app); break;
        case 'course': renderCourse(app, params[0]); break;
        case 'lesson': renderLesson(app, params[0], params[1]); break;
        case 'progress': renderProgress(app); break;
        case 'about': renderAbout(app); break;
        default: renderHome(app);
    }

    updateGlobalProgress();
}

function toggleNav() {
    document.getElementById('navLinks').classList.toggle('show');
}

// ===== HOME =====
function renderHome(app) {
    const stats = getTotalStats();
    app.innerHTML = `
        <div class="page">
            <div class="hero">
                <h1>◇ K-VOID Programming Hub</h1>
                <p>Learn programming from scratch — 100% free. No account needed. Just you and the code.</p>
                <button class="hero-cta" onclick="navigate('courses')">Start Learning →</button>
                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-number">${COURSES.length}</div>
                        <div class="stat-label">Courses</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.total}</div>
                        <div class="stat-label">Lessons</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.done}</div>
                        <div class="stat-label">Completed</div>
                    </div>
                </div>
            </div>
            <h2 class="section-title">Popular Courses</h2>
            <div class="course-grid">
                ${COURSES.slice(0, 3).map(c => courseCardHTML(c)).join('')}
            </div>
            <div style="text-align:center;margin:1.5rem 0">
                <button class="hero-cta" style="background:var(--bg-card);color:var(--text);border:1px solid var(--border)" onclick="navigate('courses')">View All Courses →</button>
            </div>
        </div>
    `;
}

// ===== COURSES LIST =====
function renderCourses(app) {
    app.innerHTML = `
        <div class="page">
            <h1 class="section-title" style="font-size:1.8rem;margin-bottom:0.5rem">All Courses</h1>
            <p style="color:var(--text-dim);margin-bottom:1.5rem">Choose a course and start learning. Track your progress as you go.</p>
            <div class="course-grid">
                ${COURSES.map(c => courseCardHTML(c)).join('')}
            </div>
        </div>
    `;
}

function courseCardHTML(c) {
    const prog = getCourseProgress(c.id);
    return `
        <div class="course-card" onclick="navigate('course','${c.id}')">
            ${prog === 100 ? '<span class="card-badge">✓ Complete</span>' : ''}
            <div class="card-icon">${c.icon}</div>
            <h3>${c.title}</h3>
            <p class="card-desc">${c.desc}</p>
            <div class="card-meta">
                <span>${c.subtitle}</span>
                <span>${c.lessons.length} lessons</span>
            </div>
            <div class="card-progress">
                <div class="card-progress-fill" style="width:${prog}%"></div>
            </div>
        </div>
    `;
}

// ===== COURSE DETAIL =====
function renderCourse(app, courseId) {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) { navigate('courses'); return; }

    const prog = getCourseProgress(courseId);
    const lessonsHTML = course.lessons.map((l, i) => {
        const done = isLessonComplete(courseId, l.id);
        return `
            <div class="lesson-item ${done ? 'completed' : ''}" onclick="navigate('lesson','${courseId}','${l.id}')">
                <div class="lesson-num">${done ? '✓' : (i + 1)}</div>
                <div class="lesson-info">
                    <h4>${l.title}</h4>
                    <p>${l.desc}</p>
                </div>
                <div class="lesson-status">${done ? '✅' : '📖'}</div>
            </div>
        `;
    }).join('');

    app.innerHTML = `
        <div class="page">
            <div class="course-header">
                <button class="back-btn" onclick="navigate('courses')">← Back to Courses</button>
                <h1>${course.icon} ${course.title}</h1>
                <p class="course-subtitle">${course.subtitle} • ${course.lessons.length} lessons • ${prog}% complete</p>
                <div class="card-progress" style="margin-top:0.8rem">
                    <div class="card-progress-fill" style="width:${prog}%"></div>
                </div>
            </div>
            <h2 class="section-title">Lessons</h2>
            <div class="lesson-list">${lessonsHTML}</div>
        </div>
    `;
}

// ===== LESSON VIEW =====
function renderLesson(app, courseId, lessonId) {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) { navigate('courses'); return; }
    const lesson = course.lessons.find(l => l.id === lessonId);
    if (!lesson) { navigate('course', courseId); return; }

    const idx = course.lessons.findIndex(l => l.id === lessonId);
    const prev = idx > 0 ? course.lessons[idx - 1] : null;
    const next = idx < course.lessons.length - 1 ? course.lessons[idx + 1] : null;

    const codeHTML = lesson.code ? `
        <div class="code-block">
            <div class="code-header">
                <span>example.${extFor(courseId)}</span>
                <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
            </div>
            <pre>${highlightCode(lesson.code)}</pre>
        </div>
    ` : '';

    const quizHTML = lesson.quiz ? `
        <div class="quiz-section" data-lesson="${lesson.id}">
            <h3>📝 Quick Quiz</h3>
            <p class="quiz-question">${lesson.quiz.q}</p>
            <div class="quiz-options">
                ${lesson.quiz.options.map((opt, i) => `
                    <button class="quiz-option" onclick="answerQuiz(this, ${i}, ${lesson.quiz.answer}, '${lesson.quiz.explanation.replace(/'/g, "\\'")}')">
                        ${opt}
                    </button>
                `).join('')}
            </div>
            <div class="quiz-feedback" id="quiz-feedback-${lesson.id}"></div>
        </div>
    ` : '';

    app.innerHTML = `
        <div class="page">
            <div class="lesson-view">
                <button class="back-btn" onclick="navigate('course','${courseId}')">← Back to ${course.title}</button>
                <h1>${lesson.title}</h1>
                <div class="lesson-content">${lesson.content}</div>
                ${codeHTML}
                ${quizHTML}
                <div class="lesson-nav">
                    ${prev ? `<button onclick="navigate('lesson','${courseId}','${prev.id}')">← ${prev.title}</button>` : '<button disabled>← Previous</button>'}
                    ${next ? `<button class="primary-btn" onclick="navigate('lesson','${courseId}','${next.id}')">${next.title} →</button>` : '<button class="primary-btn" onclick="navigate(\'course\',\''+courseId+'\')">✅ Complete Course</button>'}
                </div>
            </div>
        </div>
    `;

    // mark complete when viewing
    setTimeout(() => {
        if (!isLessonComplete(courseId, lessonId)) {
            markLessonComplete(courseId, lessonId);
        }
    }, 1000);
}

function extFor(courseId) {
    const map = { python: 'py', javascript: 'js', 'html-css': 'html', java: 'java', cpp: 'cpp', go: 'go' };
    return map[courseId] || 'txt';
}

function highlightCode(code) {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return escaped;
    // Simple highlighting is handled by CSS classes but we keep it clean for now
}

function copyCode(btn) {
    const pre = btn.parentElement.nextElementSibling;
    const code = pre.textContent;
    navigator.clipboard.writeText(code).then(() => {
        btn.textContent = '✅ Copied!';
        setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000);
    }).catch(() => {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = '✅ Copied!';
        setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000);
    });
}

function answerQuiz(btn, selected, correct, explanation) {
    const section = btn.closest('.quiz-section');
    const options = section.querySelectorAll('.quiz-option');
    const feedback = section.querySelector('.quiz-feedback');

    options.forEach(o => o.disabled = true);

    options.forEach((o, i) => {
        if (i === correct) o.classList.add('correct');
        if (i === selected && i !== correct) o.classList.add('wrong');
        if (i === selected) o.classList.add('selected');
    });

    feedback.className = 'quiz-feedback show ' + (selected === correct ? 'correct' : 'wrong');
    feedback.textContent = selected === correct
        ? '✅ Correct! ' + explanation
        : '❌ Not quite. ' + explanation;
}

// ===== PROGRESS =====
function renderProgress(app) {
    const stats = getTotalStats();
    const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

    const courseItems = COURSES.map(c => {
        const prog = getCourseProgress(c.id);
        const done = (getProgress()[c.id] || []).length;
        return `
            <div class="progress-course-item" onclick="navigate('course','${c.id}')" style="cursor:pointer">
                <div class="pci-header">
                    <h4>${c.icon} ${c.title}</h4>
                    <span>${done}/${c.lessons.length}</span>
                </div>
                <div class="progress-bar-full">
                    <div class="pbf-fill" style="width:${prog}%"></div>
                </div>
            </div>
        `;
    }).join('');

    app.innerHTML = `
        <div class="page">
            <h1 class="section-title">Your Progress</h1>
            <div class="progress-stats">
                <div class="progress-stat-card">
                    <div class="stat-value">${stats.done}</div>
                    <div class="stat-label">Lessons Done</div>
                </div>
                <div class="progress-stat-card">
                    <div class="stat-value">${pct}%</div>
                    <div class="stat-label">Overall Progress</div>
                </div>
                <div class="progress-stat-card">
                    <div class="stat-value">${stats.total - stats.done}</div>
                    <div class="stat-label">Remaining</div>
                </div>
            </div>
            <h2 class="section-title">Course Breakdown</h2>
            <div class="progress-course-list">${courseItems}</div>
            ${stats.done === 0 ? '<p style="color:var(--text-dim);text-align:center;margin-top:2rem">Start a course to see your progress here!</p>' : ''}
        </div>
    `;
}

// ===== ABOUT =====
function renderAbout(app) {
    app.innerHTML = `
        <div class="page">
            <div class="about-page">
                <h1>◇ K-VOID Programming Hub</h1>
                <p class="about-subtitle">Learn to code. Completely free.</p>
                <div class="about-card">
                    <h3>🎯 Our Mission</h3>
                    <p>To make programming education accessible to anyone with a phone and an internet connection. No credit cards, no barriers.</p>
                </div>
                <div class="about-card">
                    <h3>📚 What We Offer</h3>
                    <p>Free interactive courses in Python, JavaScript, HTML/CSS, Java, C++, Go, and more coming soon. Each course has hands-on lessons with code examples and quizzes.</p>
                </div>
                <div class="about-card">
                    <h3>🚀 Built For</h3>
                    <p>Beginners who want to start coding. No experience needed. Learn at your own pace, right from your phone or browser.</p>
                </div>
                <div class="about-card">
                    <h3>💜 Join Us</h3>
                    <p>Start learning today. Every master was once a beginner. K-VOID is here to help you take that first step.</p>
                </div>
            </div>
        </div>
    `;
}
