function getProfileXp() { return _profile?.xp || 0 }

async function addXp(amount) {
    const current = getProfileXp()
    const total = current + amount
    if (_profileDocId) {
        try {
            await updateProfile(_profileDocId, { xp: total })
            _profile.xp = total
        } catch (e) {
            console.warn('Failed to save XP:', e)
            _profile.xp = total
        }
    } else {
        _profile = _profile || {}
        _profile.xp = total
    }
    checkLevelUp(current, total)
    return total
}

function getLevel(xp) {
    const levels = CONFIG.limits.levels
    let lvl = levels[0]
    for (const l of levels) {
        if (xp >= l.xpRequired) lvl = l
        else break
    }
    return lvl
}

function checkLevelUp(oldXp, newXp) {
    const oldLevel = getLevel(oldXp).level
    const newLevel = getLevel(newXp).level
    if (newLevel > oldLevel) {
        showToast('Level Up! You reached level ' + newLevel + ': ' + getLevel(newXp).title, 'success')
    }
}

function getStreak() {
    if (!_profile) return { count: 0, lastDate: null }
    const count = _profile.streak_days || 0
    const lastDate = localStorage.getItem('kvoid_streak_date') || null
    const today = new Date().toDateString()
    const last = lastDate ? new Date(lastDate).toDateString() : null
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    if (last === today) return { count, lastDate }
    if (last === yesterday) return { count, lastDate }
    return { count: 0, lastDate: null }
}

async function updateStreak() {
    const s = getStreak()
    const today = new Date().toDateString()
    if (s.lastDate === today) return s.count
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    let count = (s.lastDate === yesterday) ? s.count + 1 : 1
    if (count > 1) await addXp(CONFIG.limits.xpStreakBonus)
    localStorage.setItem('kvoid_streak_date', today)
    if (_profileDocId) {
        try {
            await updateProfile(_profileDocId, { streak_days: count })
            _profile.streak_days = count
        } catch (e) { console.warn('Failed to save streak:', e) }
    }
    return count
}
