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

function getInitials(name) {
    if (!name) return '?'
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function getAvatarUrl(gender, seed) {
    const s = seed || 'user'
    if (gender === 'male') {
        return 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + s + '&accessoriesType=blank&topType=shortHairShortWaved&facialHairType=beardMedium&clothingType=blazer&eyeType=default&mouthType=smile&skinColor=light'
    }
    if (gender === 'female') {
        return 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + s + '_f&accessoriesType=blank&topType=longHairStraight&facialHairType=blank&clothingType=blazer&eyeType=default&mouthType=smile&skinColor=light'
    }
    return 'https://api.dicebear.com/7.x/initials/svg?seed=' + s + '&backgroundColor=7c3aed'
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
    return '#06d6a0'
}

function strengthLabel(score) {
    if (score <= 1) return 'Weak'
    if (score <= 3) return 'Medium'
    return 'Strong'
}
