let _adminCourses = []
let _adminTab = 'courses'
let _adminSelectedCourseId = null

function isAdmin() {
    return !!(CONFIG.adminEmail && _user && _user.email === CONFIG.adminEmail)
}

async function renderAdmin(app) {
    if (!_user) { navigate('login'); return }
    if (!isAdmin()) {
        renderFrame(app, '<div class="placeholder-page"><div class="ph-icon">✕</div><h2>Access Denied</h2><p>You need admin privileges to access this page.</p><button class="btn btn-primary" style="margin-top:1rem" onclick="navigate(\'dashboard\')">Back to Dashboard</button></div>', '')
        return
    }
    renderFrame(app, '<div id="admin-root"></div>', 'admin')
    await _adminRefresh()
}

async function _adminRefresh() {
    const root = document.getElementById('admin-root')
    if (!root) return
    try {
        initDb()
        const db = getDb()
        const cRes = await db.listDocuments(CONFIG.database.id, CONFIG.database.collections.courses)
        _adminCourses = cRes.documents || []
    } catch (e) {
        _adminCourses = []
    }
    _adminRender()
}

function _adminRender() {
    const root = document.getElementById('admin-root')
    if (!root) return

    const selCourse = _adminCourses.find(c => c.$id === _adminSelectedCourseId)

    root.innerHTML = `
    <div class="admin-page">
      <div class="admin-header">
        <div style="display:flex;align-items:center;gap:0.75rem">
          <button class="btn btn-ghost btn-sm btn-icon" onclick="navigate('dashboard')" title="Back">&#8592;</button>
          <h1 style="font-size:1.3rem;font-weight:800;margin:0">Admin Panel</h1>
          <span class="badge badge-gold" style="font-size:0.7rem">ADMIN</span>
        </div>
        <div style="display:flex;gap:0.5rem">
          <button class="btn btn-primary btn-sm" onclick="adminNewCourse()">+ Course</button>
          <button class="btn btn-secondary btn-sm" onclick="adminNewLesson()">+ Lesson</button>
        </div>
      </div>

      <div class="admin-notice">
        ⚠ Make sure <strong>courses</strong> and <strong>lessons</strong> collections have <strong>Users → Create, Update, Delete</strong> permissions in Appwrite for the admin panel to save content.
      </div>

      <div class="admin-tabs">
        <button class="admin-tab ${_adminTab === 'courses' ? 'active' : ''}" onclick="adminSetTab('courses')">
          Courses <span class="badge">${_adminCourses.length}</span>
        </button>
        <button class="admin-tab ${_adminTab === 'lessons' ? 'active' : ''}" onclick="adminSetTab('lessons')">
          Lessons${selCourse ? ' — ' + escapeHtml(selCourse.course_title || '') : ''}
        </button>
      </div>

      <div id="admin-content"></div>
    </div>
    <div id="admin-course-modal" class="admin-modal-overlay" style="display:none" onclick="adminCloseModals(event)">
      <div class="admin-modal" onclick="event.stopPropagation()">
        <div id="admin-course-modal-body"></div>
      </div>
    </div>
    <div id="admin-lesson-modal" class="admin-modal-overlay" style="display:none" onclick="adminCloseModals(event)">
      <div class="admin-modal admin-modal-wide" onclick="event.stopPropagation()">
        <div id="admin-lesson-modal-body"></div>
      </div>
    </div>`

    _adminTab === 'courses' ? _renderAdminCourses() : _renderAdminLessons()
}

function _renderAdminCourses() {
    const el = document.getElementById('admin-content')
    if (!el) return
    if (!_adminCourses.length) {
        el.innerHTML = '<div class="admin-empty"><div style="font-size:3rem;margin-bottom:1rem">◇</div><p>No courses yet.</p><button class="btn btn-primary" onclick="adminNewCourse()">Create First Course</button></div>'
        return
    }
    el.innerHTML = _adminCourses.map(c => `
    <div class="admin-card" style="border-left:4px solid #D4A842">
      <div class="admin-card-main">
        <div class="admin-card-icon" style="background:#D4A84222;color:#D4A842">◇</div>
        <div class="admin-card-info">
          <div class="admin-card-title">${escapeHtml(c.course_title || '')}</div>
          <div class="admin-card-meta">${escapeHtml(c.difficulty || '')} · ${escapeHtml(c.category || '')} · ${c.estimated_hours || 0}h</div>
          <div class="admin-card-id">Slug: ${escapeHtml(c.slug || c.$id)}</div>
        </div>
      </div>
      <div class="admin-card-actions">
        <button class="btn btn-ghost btn-sm" onclick="adminManageLessons('${c.$id}')">Lessons</button>
        <button class="btn btn-ghost btn-sm" onclick="adminEditCourse('${c.$id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="adminDeleteCourse('${c.$id}')">Delete</button>
      </div>
    </div>`).join('')
}

async function _renderAdminLessons() {
    const el = document.getElementById('admin-content')
    if (!el) return

    if (!_adminSelectedCourseId) {
        el.innerHTML = `<div class="admin-empty"><p>Select a course to manage its lessons.</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;margin-top:1rem">
          ${_adminCourses.map(c => `<button class="btn btn-secondary btn-sm" onclick="adminManageLessons('${c.$id}')">${escapeHtml(c.course_title || '')}</button>`).join('')}
        </div></div>`
        return
    }

    el.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-dim)">Loading lessons...</div>'
    try {
        initDb()
        const db = getDb()
        const Query = getQuery()
        const res = await db.listDocuments(
            CONFIG.database.id,
            CONFIG.database.collections.lessons,
            [Query.equal('courses', _adminSelectedCourseId), Query.orderAsc('lesson_order')]
        )
        const lessons = res.documents || []
        if (!lessons.length) {
            el.innerHTML = '<div class="admin-empty"><p>No lessons yet for this course.</p><button class="btn btn-primary" onclick="adminNewLesson()">Add First Lesson</button></div>'
            return
        }
        el.innerHTML = lessons.map(l => `
        <div class="admin-card">
          <div class="admin-card-main">
            <div class="admin-card-icon">◈</div>
            <div class="admin-card-info">
              <div class="admin-card-title">#${l.lesson_order || 0} — ${escapeHtml(l.lesson_title || '')}</div>
              <div class="admin-card-meta">${escapeHtml(l.description || '')}</div>
              <div class="admin-card-id">Slug: ${escapeHtml(l.slug || l.$id)}</div>
            </div>
          </div>
          <div class="admin-card-actions">
            <button class="btn btn-ghost btn-sm" onclick="adminEditLesson('${l.$id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="adminDeleteLesson('${l.$id}')">Delete</button>
          </div>
        </div>`).join('')
    } catch (e) {
        el.innerHTML = '<div class="admin-empty"><p style="color:var(--danger)">Failed to load lessons: ' + escapeHtml(e.message) + '</p></div>'
    }
}

window.adminSetTab = function(tab) {
    _adminTab = tab
    _adminRender()
}

window.adminManageLessons = function(courseId) {
    _adminSelectedCourseId = courseId
    _adminTab = 'lessons'
    _adminRender()
}

window.adminNewCourse = function() { _showCourseModal(null) }
window.adminEditCourse = function(id) {
    const course = _adminCourses.find(c => c.$id === id)
    if (course) _showCourseModal(course)
}

window.adminDeleteCourse = async function(id) {
    if (!confirm('Delete this course? This cannot be undone.')) return
    try {
        initDb()
        const db = getDb()
        await db.deleteDocument(CONFIG.database.id, CONFIG.database.collections.courses, id)
        showToast('Course deleted.', 'success')
        if (_adminSelectedCourseId === id) _adminSelectedCourseId = null
        await _adminRefresh()
    } catch (e) { showToast('Delete failed: ' + e.message, 'error') }
}

window.adminNewLesson = function() { _showLessonModal(null) }
window.adminEditLesson = async function(id) {
    try {
        initDb()
        const db = getDb()
        const doc = await db.getDocument(CONFIG.database.id, CONFIG.database.collections.lessons, id)
        _showLessonModal(doc)
    } catch (e) { showToast('Failed to load lesson: ' + e.message, 'error') }
}

window.adminDeleteLesson = async function(id) {
    if (!confirm('Delete this lesson?')) return
    try {
        initDb()
        const db = getDb()
        await db.deleteDocument(CONFIG.database.id, CONFIG.database.collections.lessons, id)
        showToast('Lesson deleted.', 'success')
        _renderAdminLessons()
    } catch (e) { showToast('Delete failed: ' + e.message, 'error') }
}

function _showCourseModal(course) {
    const modal = document.getElementById('admin-course-modal')
    const body = document.getElementById('admin-course-modal-body')
    if (!modal || !body) return
    const isEdit = !!course
    body.innerHTML = `
    <div class="admin-modal-header">
      <h2>${isEdit ? 'Edit Course' : 'New Course'}</h2>
      <button class="btn btn-ghost btn-sm btn-icon" onclick="document.getElementById('admin-course-modal').style.display='none'">✕</button>
    </div>
    <form onsubmit="adminSaveCourse(event)" style="display:flex;flex-direction:column;gap:0.75rem">
      <input type="hidden" id="ac-docid" value="${isEdit ? course.$id : ''}">
      <div class="form-group">
        <label class="form-label">Slug *</label>
        <input class="form-input" id="ac-slug" required placeholder="python" value="${escapeHtml(course?.slug || '')}">
      </div>
      <div class="form-group">
        <label class="form-label">Course Title *</label>
        <input class="form-input" id="ac-title" required placeholder="Python Programming" value="${escapeHtml(course?.course_title || '')}">
      </div>
      <div class="form-group">
        <label class="form-label">Description *</label>
        <textarea class="form-input" id="ac-desc" rows="2" placeholder="Short description of the course" required>${escapeHtml(course?.description || '')}</textarea>
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Difficulty *</label>
          <select class="form-input" id="ac-difficulty" required>
            ${['Beginner','Intermediate','Advanced'].map(d => `<option value="${d}" ${(course?.difficulty === d) ? 'selected' : ''}>${d}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Category *</label>
          <input class="form-input" id="ac-category" required placeholder="General Purpose" value="${escapeHtml(course?.category || '')}">
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Estimated Hours *</label>
          <input class="form-input" id="ac-hours" type="number" min="1" required placeholder="3" value="${course?.estimated_hours || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Instructor *</label>
          <input class="form-input" id="ac-instructor" required placeholder="K-VOID" value="${escapeHtml(course?.instructor || 'K-VOID')}">
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Language *</label>
          <input class="form-input" id="ac-language" required placeholder="Python" value="${escapeHtml(course?.language || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">XP Reward *</label>
          <input class="form-input" id="ac-xp" type="number" min="0" required placeholder="50" value="${course?.xp_reward || 50}">
        </div>
      </div>
      <div style="display:flex;gap:1.5rem;align-items:center;padding:0.25rem 0">
        <label style="display:flex;align-items:center;gap:0.4rem;cursor:pointer;font-size:0.85rem">
          <input type="checkbox" id="ac-published" ${course?.published !== false ? 'checked' : ''} style="accent-color:var(--primary)"> Published
        </label>
        <label style="display:flex;align-items:center;gap:0.4rem;cursor:pointer;font-size:0.85rem">
          <input type="checkbox" id="ac-cert" ${course?.certificate_available !== false ? 'checked' : ''} style="accent-color:var(--primary)"> Certificate Available
        </label>
      </div>
      <div style="display:flex;gap:0.75rem;justify-content:flex-end;margin-top:0.5rem">
        <button type="button" class="btn btn-secondary" onclick="document.getElementById('admin-course-modal').style.display='none'">Cancel</button>
        <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Create Course'}</button>
      </div>
    </form>`
    modal.style.display = 'flex'
}

window.adminSaveCourse = async function(e) {
    e.preventDefault()
    const docId = document.getElementById('ac-docid')?.value
    const data = {
        slug: document.getElementById('ac-slug')?.value.trim(),
        course_title: document.getElementById('ac-title')?.value.trim(),
        description: document.getElementById('ac-desc')?.value.trim(),
        difficulty: document.getElementById('ac-difficulty')?.value,
        category: document.getElementById('ac-category')?.value.trim(),
        estimated_hours: parseInt(document.getElementById('ac-hours')?.value) || 1,
        instructor: document.getElementById('ac-instructor')?.value.trim() || 'K-VOID',
        language: document.getElementById('ac-language')?.value.trim() || 'General',
        xp_reward: parseInt(document.getElementById('ac-xp')?.value) || 50,
        total_lessons: 0,
        certificate_available: document.getElementById('ac-cert')?.checked || false,
        published: document.getElementById('ac-published')?.checked || false,
        created_by: _user?.email || 'admin'
    }
    try {
        initDb()
        const db = getDb()
        const { ID, Permission, Role } = Appwrite
        if (docId) {
            await db.updateDocument(CONFIG.database.id, CONFIG.database.collections.courses, docId, data)
            showToast('Course updated!', 'success')
        } else {
            await db.createDocument(CONFIG.database.id, CONFIG.database.collections.courses, ID.unique(), data,
                [Permission.read(Role.any()), Permission.update(Role.user(_user.$id)), Permission.delete(Role.user(_user.$id))])
            showToast('Course created!', 'success')
        }
        document.getElementById('admin-course-modal').style.display = 'none'
        clearContentCache()
        await _adminRefresh()
    } catch (err) { showToast('Save failed: ' + err.message, 'error') }
}

function _showLessonModal(lesson) {
    const modal = document.getElementById('admin-lesson-modal')
    const body = document.getElementById('admin-lesson-modal-body')
    if (!modal || !body) return
    const isEdit = !!lesson

    let courseDocId = _adminSelectedCourseId || ''
    if (lesson?.courses) {
        courseDocId = lesson.courses
    }

    let existingConcepts = []
    try {
        if (lesson?.content) {
            const contentData = JSON.parse(lesson.content)
            if (contentData.concepts) existingConcepts = contentData.concepts.map(c => typeof c === 'string' ? JSON.parse(c) : c)
        }
    } catch {}

    let existingSummary = []
    try {
        if (lesson?.content) {
            const contentData = JSON.parse(lesson.content)
            if (contentData.summary) existingSummary = contentData.summary
        }
    } catch {}

    body.innerHTML = `
    <div class="admin-modal-header">
      <h2>${isEdit ? 'Edit Lesson' : 'New Lesson'}</h2>
      <button class="btn btn-ghost btn-sm btn-icon" onclick="document.getElementById('admin-lesson-modal').style.display='none'">✕</button>
    </div>
    <form onsubmit="adminSaveLesson(event)" style="display:flex;flex-direction:column;gap:0.75rem">
      <input type="hidden" id="al-docid" value="${isEdit ? lesson.$id : ''}">
      <div class="form-group">
        <label class="form-label">Course *</label>
        <select class="form-input" id="al-courseid" required>
          <option value="">Select a course</option>
          ${_adminCourses.map(c => `<option value="${c.$id}" ${c.$id === courseDocId ? 'selected' : ''}>${escapeHtml(c.course_title || '')}</option>`).join('')}
        </select>
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Slug *</label>
          <input class="form-input" id="al-slug" required placeholder="py-1" value="${escapeHtml(lesson?.slug || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Order # *</label>
          <input class="form-input" id="al-order" type="number" min="1" required placeholder="1" value="${lesson?.lesson_order || ''}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Title *</label>
        <input class="form-input" id="al-title" required placeholder="Hello, World!" value="${escapeHtml(lesson?.lesson_title || '')}">
      </div>
      <div class="form-group">
        <label class="form-label">Description *</label>
        <input class="form-input" id="al-desc" placeholder="Your first program" value="${escapeHtml(lesson?.description || '')}">
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Estimated Minutes *</label>
          <input class="form-input" id="al-minutes" type="number" min="1" required placeholder="15" value="${lesson?.estimated_minutes || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">XP Reward *</label>
          <input class="form-input" id="al-xp" type="number" min="0" required placeholder="50" value="${lesson?.xp_reward || 50}">
        </div>
      </div>
      <div style="display:flex;gap:1.5rem;align-items:center;padding:0.25rem 0">
        <label style="display:flex;align-items:center;gap:0.4rem;cursor:pointer;font-size:0.85rem">
          <input type="checkbox" id="al-published" ${lesson?.published !== false ? 'checked' : ''} style="accent-color:var(--primary)"> Published
        </label>
        <label style="display:flex;align-items:center;gap:0.4rem;cursor:pointer;font-size:0.85rem">
          <input type="checkbox" id="al-free" ${lesson?.is_free !== false ? 'checked' : ''} style="accent-color:var(--primary)"> Free
        </label>
      </div>

      <div class="admin-section-label">Concepts <button type="button" class="btn btn-secondary btn-sm" onclick="adminAddConcept()" style="margin-left:0.5rem">+ Add</button></div>
      <div id="al-concepts">
        ${existingConcepts.map((c, i) => _conceptBlock(i, c)).join('') || _conceptBlock(0, null)}
      </div>

      <div class="admin-section-label">Key Takeaways <button type="button" class="btn btn-secondary btn-sm" onclick="adminAddSummary()" style="margin-left:0.5rem">+ Add</button></div>
      <div id="al-summary">
        ${existingSummary.map((s, i) => _summaryRow(i, s)).join('') || _summaryRow(0, null)}
      </div>

      <div style="display:flex;gap:0.75rem;justify-content:flex-end;margin-top:0.5rem">
        <button type="button" class="btn btn-secondary" onclick="document.getElementById('admin-lesson-modal').style.display='none'">Cancel</button>
        <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Create Lesson'}</button>
      </div>
    </form>`
    modal.style.display = 'flex'
}

function _conceptBlock(i, c) {
    return `<div class="concept-block" data-idx="${i}">
      <div class="concept-block-header">
        <span style="font-weight:600;font-size:0.85rem;color:var(--primary)">Concept ${i + 1}</span>
        <button type="button" class="btn btn-ghost btn-sm" onclick="this.closest('.concept-block').remove()" style="color:var(--danger);padding:0.1rem 0.4rem">✕</button>
      </div>
      <input class="form-input" placeholder="Concept title (e.g. What is print()?)" style="margin-bottom:0.4rem" value="${escapeHtml(c?.title || '')}">
      <textarea class="form-input" placeholder="Explanation text..." rows="2" style="margin-bottom:0.4rem">${escapeHtml(c?.text || '')}</textarea>
      <textarea class="form-input code-input" placeholder="Code example (optional)" rows="3" style="margin-bottom:0.4rem;font-family:var(--font-mono)">${escapeHtml(c?.code || '')}</textarea>
      <input class="form-input" placeholder="Practice task / classwork (optional)" value="${escapeHtml(c?.classwork || '')}">
    </div>`
}

function _summaryRow(i, s) {
    return `<div class="summary-row" style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.4rem">
      <input class="form-input" placeholder="Key point (e.g. print() displays text)" value="${escapeHtml(s || '')}" style="flex:1">
      <button type="button" class="btn btn-ghost btn-sm" onclick="this.closest('.summary-row').remove()" style="color:var(--danger);padding:0.1rem 0.4rem;flex-shrink:0">✕</button>
    </div>`
}

window.adminAddConcept = function() {
    const container = document.getElementById('al-concepts')
    if (!container) return
    const idx = container.querySelectorAll('.concept-block').length
    const div = document.createElement('div')
    div.innerHTML = _conceptBlock(idx, null)
    container.appendChild(div.firstElementChild)
    div.firstElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

window.adminAddSummary = function() {
    const container = document.getElementById('al-summary')
    if (!container) return
    const idx = container.querySelectorAll('.summary-row').length
    const div = document.createElement('div')
    div.innerHTML = _summaryRow(idx, null)
    container.appendChild(div.firstElementChild)
}

window.adminSaveLesson = async function(e) {
    e.preventDefault()
    const docId = document.getElementById('al-docid')?.value
    const courseDocId = document.getElementById('al-courseid')?.value

    const conceptBlocks = document.getElementById('al-concepts')?.querySelectorAll('.concept-block') || []
    const concepts = Array.from(conceptBlocks).map(block => {
        const inputs = block.querySelectorAll('input, textarea')
        return {
            title: inputs[0]?.value?.trim() || '',
            text: inputs[1]?.value?.trim() || '',
            code: inputs[2]?.value?.trim() || '',
            classwork: inputs[3]?.value?.trim() || ''
        }
    }).filter(c => c.title)

    const summaryInputs = document.getElementById('al-summary')?.querySelectorAll('input') || []
    const summary = Array.from(summaryInputs).map(i => i.value.trim()).filter(Boolean)

    const contentPayload = JSON.stringify({ concepts, summary })

    const data = {
        courses: courseDocId,
        slug: document.getElementById('al-slug')?.value.trim(),
        lesson_title: document.getElementById('al-title')?.value.trim(),
        lesson_order: parseInt(document.getElementById('al-order')?.value) || 1,
        description: document.getElementById('al-desc')?.value.trim(),
        content: contentPayload,
        lesson_type: 'theory',
        estimated_minutes: parseInt(document.getElementById('al-minutes')?.value) || 15,
        xp_reward: parseInt(document.getElementById('al-xp')?.value) || 50,
        is_free: document.getElementById('al-free')?.checked ?? true,
        published: document.getElementById('al-published')?.checked ?? false
    }

    try {
        initDb()
        const db = getDb()
        const { ID, Permission, Role } = Appwrite
        if (docId) {
            await db.updateDocument(CONFIG.database.id, CONFIG.database.collections.lessons, docId, data)
            showToast('Lesson updated!', 'success')
        } else {
            await db.createDocument(CONFIG.database.id, CONFIG.database.collections.lessons, ID.unique(), data,
                [Permission.read(Role.any()), Permission.update(Role.user(_user.$id)), Permission.delete(Role.user(_user.$id))])
            showToast('Lesson created!', 'success')
        }
        document.getElementById('admin-lesson-modal').style.display = 'none'
        if (courseDocId) { _adminSelectedCourseId = courseDocId; _adminTab = 'lessons' }
        clearContentCache()
        await _adminRefresh()
    } catch (err) { showToast('Save failed: ' + err.message, 'error') }
}

window.adminCloseModals = function(e) {
    if (e.target === document.getElementById('admin-course-modal')) document.getElementById('admin-course-modal').style.display = 'none'
    if (e.target === document.getElementById('admin-lesson-modal')) document.getElementById('admin-lesson-modal').style.display = 'none'
}
