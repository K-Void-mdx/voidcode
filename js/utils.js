function $(id) { return document.getElementById(id) }
function qs(sel, ctx) { return (ctx || document).querySelector(sel) }
function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel) }

function showToast(msg, type) {
    const c = $('toast-container')
    if (!c) return
    const t = document.createElement('div')
    t.className = 'toast toast-' + (type || 'info')
    t.textContent = msg
    c.appendChild(t)
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300) }, 3500)
}

function debounce(fn, ms) {
    let timer
    return function(...args) {
        clearTimeout(timer)
        timer = setTimeout(() => fn.apply(this, args), ms || 300)
    }
}

function formatDate(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const _avatarColors = [
    '#E17076', '#7BC862', '#E5CA77', '#65AADD', '#A695E7',
    '#EE7AAE', '#6EC9CB', '#FAA774', '#E47272', '#78C862',
    '#6BB5E0', '#A37DD4', '#E88D93', '#6DC8B8', '#EDB553',
    '#D4A842', '#5CA0D2', '#C68FE6', '#E0804E', '#5DB5A4'
]

function getNameColor(name) {
    if (!name) return _avatarColors[0]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return _avatarColors[Math.abs(hash) % _avatarColors.length]
}

function getInitials(name) {
    if (!name) return '?'
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return '?'
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function makeAvatarHTML(name, size) {
    const initials = getInitials(name)
    const color = getNameColor(name)
    const sz = size || 'sm'
    return '<div class="avatar avatar-' + sz + ' avatar-initials" style="background:' + color + ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;border-radius:50%">' + initials + '</div>'
}

function getAvatarUrl(gender, seed) {
    return ''
}

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
    return '#22c55e'
}

function strengthLabel(score) {
    if (score <= 1) return 'Weak'
    if (score <= 3) return 'Medium'
    return 'Strong'
}

function escapeHtml(str) {
    if (!str) return ''
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

function formatAiResponse(text) {
    if (!text) return ''
    let html = escapeHtml(text)

    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, function(match, lang, code) {
        return '<div class="code-block"><div class="code-header"><span>' + (lang || 'code') + '</span><button onclick="copyCode(this)">Copy</button></div><pre>' + code.trim() + '</pre></div>'
    })

    html = html.replace(/`([^`\n]+)`/g, '<code style="background:var(--surface-2);padding:0.15em 0.4em;border-radius:4px;font-family:JetBrains Mono,monospace;font-size:0.85em">$1</code>')

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

    html = html.replace(/\n/g, '<br>')

    return html
}
