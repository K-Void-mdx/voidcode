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
          Lessons${selCourse ? ' — ' + escapeHtml(selCourse.title) : ''}
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
    <div class="admin-card" style="border-left:4px solid ${escapeHtml(c.color || '#D4A842')}">
      <div class="admin-card-main">
        <div class="admin-card-icon" style="background:${escapeHtml(c.color || '#D4A842')}22;color:${escapeHtml(c.color || '#D4A842')}">${escapeHtml(c.icon || '◇')}</div>
        <div class="admin-card-info">
          <div class="admin-card-title">${escapeHtml(c.title)}</div>
          <div class="admin-card-meta">${escapeHtml(c.difficulty || 'Beginner')} · ${escapeHtml(c.category || '')} · ${escapeHtml(c.duration || '')}</div>
          <div class="admin-card-id">ID: ${escapeHtml(c.id || c.$id)}</div>
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
          ${_adminCourses.map(c => `<button class="btn btn-secondary btn-sm" onclick="adminManageLessons('${c.$id}')">${escapeHtml(c.title)}</button>`).join('')}
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
            [Query.equal('courseId', _adminSelectedCourseId), Query.orderAsc('order')]
        )
        const lessons = res.documents || []
        if (!lessons.length) {
            el.innerHTML = '<div class="admin-empty"><p>No lessons yet for this course.</p><button class="btn btn-primary" onclick="adminNewLesson()">Add First Lesson</button></div>'
            return
        }
        el.innerHTML = lessons.map(l => `
        <div class="admin-card">
          <div class="admin-card-main">
            <div class="admin-card-icon">${escapeHtml(l.icon || '◈')}</div>
            <div class="admin-card-info">
              <div class="admin-card-title">#${l.order || 0} — ${escapeHtml(l.title)}</div>
              <div class="admin-card-meta">${escapeHtml(l.description || '')}</div>
              <div class="admin-card-id">ID: ${escapeHtml(l.id || l.$id)}</div>
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
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Course ID (slug) *</label>
          <input class="form-input" id="ac-id" required placeholder="python" value="${escapeHtml(course?.id || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Icon (emoji) *</label>
          <input class="form-input" id="ac-icon" required placeholder="🐍" value="${escapeHtml(course?.icon || '')}" maxlength="4">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Title *</label>
        <input class="form-input" id="ac-title" required placeholder="Python Programming" value="${escapeHtml(course?.title || '')}">
      </div>
      <div class="form-group">
        <label class="form-label">Subtitle</label>
        <input class="form-input" id="ac-subtitle" placeholder="Beginner to Intermediate" value="${escapeHtml(course?.subtitle || '')}">
      </div>
      <div class="form-group">
        <label class="form-label">Description *</label>
        <textarea class="form-input" id="ac-desc" rows="2" placeholder="Short description of the course" required>${escapeHtml(course?.description || course?.desc || '')}</textarea>
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Difficulty</label>
          <select class="form-input" id="ac-difficulty">
            ${['Beginner','Intermediate','Advanced'].map(d => `<option value="${d}" ${(course?.difficulty === d) ? 'selected' : ''}>${d}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Duration</label>
          <input class="form-input" id="ac-duration" placeholder="3 hours" value="${escapeHtml(course?.duration || '')}">
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Category</label>
          <input class="form-input" id="ac-category" placeholder="General Purpose" value="${escapeHtml(course?.category || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Color (hex)</label>
          <input class="form-input" id="ac-color" placeholder="#3776AB" value="${escapeHtml(course?.color || '#C9922A')}">
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Rating (0-5)</label>
          <input class="form-input" id="ac-rating" type="number" min="0" max="5" step="0.1" placeholder="4.5" value="${course?.rating || 4.5}">
        </div>
        <div class="form-group" style="display:flex;align-items:center;gap:0.5rem;padding-top:1.75rem">
          <input type="checkbox" id="ac-popular" ${course?.popular ? 'checked' : ''} style="width:1rem;height:1rem;accent-color:var(--primary)">
          <label for="ac-popular" class="form-label" style="margin:0">Popular course</label>
        </div>
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
        id: document.getElementById('ac-id')?.value.trim(),
        icon: document.getElementById('ac-icon')?.value.trim(),
        title: document.getElementById('ac-title')?.value.trim(),
        subtitle: document.getElementById('ac-subtitle')?.value.trim(),
        description: document.getElementById('ac-desc')?.value.trim(),
        difficulty: document.getElementById('ac-difficulty')?.value,
        duration: document.getElementById('ac-duration')?.value.trim(),
        category: document.getElementById('ac-category')?.value.trim(),
        color: document.getElementById('ac-color')?.value.trim(),
        rating: parseFloat(document.getElementById('ac-rating')?.value) || 4.5,
        popular: document.getElementById('ac-popular')?.checked || false
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
    const courseId = lesson?.courseId || _adminSelectedCourseId || ''

    let existingConcepts = []
    try {
        if (Array.isArray(lesson?.concepts)) {
            existingConcepts = lesson.concepts.map(c => typeof c === 'string' ? JSON.parse(c) : c)
        }
    } catch {}

    let existingSummary = []
    try {
        if (Array.isArray(lesson?.summary)) existingSummary = lesson.summary
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
          ${_adminCourses.map(c => `<option value="${c.$id}" ${c.$id === courseId ? 'selected' : ''}>${escapeHtml(c.title)}</option>`).join('')}
        </select>
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Lesson ID (slug) *</label>
          <input class="form-input" id="al-id" required placeholder="py-1" value="${escapeHtml(lesson?.id || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Order #</label>
          <input class="form-input" id="al-order" type="number" min="1" placeholder="1" value="${lesson?.order || ''}">
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Title *</label>
          <input class="form-input" id="al-title" required placeholder="Hello, World!" value="${escapeHtml(lesson?.title || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Icon (emoji)</label>
          <input class="form-input" id="al-icon" placeholder="🌍" value="${escapeHtml(lesson?.icon || '')}" maxlength="4">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Short Description</label>
        <input class="form-input" id="al-desc" placeholder="Your first program" value="${escapeHtml(lesson?.description || lesson?.desc || '')}">
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
    const course = _adminCourses.find(c => c.$id === courseDocId)

    const conceptBlocks = document.getElementById('al-concepts')?.querySelectorAll('.concept-block') || []
    const concepts = Array.from(conceptBlocks).map(block => {
        const inputs = block.querySelectorAll('input, textarea')
        return JSON.stringify({
            title: inputs[0]?.value?.trim() || '',
            text: inputs[1]?.value?.trim() || '',
            code: inputs[2]?.value?.trim() || '',
            classwork: inputs[3]?.value?.trim() || ''
        })
    }).filter(c => { try { return JSON.parse(c).title; } catch { return false; } })

    const summaryInputs = document.getElementById('al-summary')?.querySelectorAll('input') || []
    const summary = Array.from(summaryInputs).map(i => i.value.trim()).filter(Boolean)

    const data = {
        id: document.getElementById('al-id')?.value.trim(),
        courseId: courseDocId,
        title: document.getElementById('al-title')?.value.trim(),
        icon: document.getElementById('al-icon')?.value.trim(),
        description: document.getElementById('al-desc')?.value.trim(),
        order: parseInt(document.getElementById('al-order')?.value) || 1,
        concepts,
        summary
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
