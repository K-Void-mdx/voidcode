function getProfileXp() {
    return _profile?.xp || 0
}

async function addXp(amount) {
    const current = getProfileXp()
    const total = current + amount
    if (_profileDocId) {
        try {
            await updateProfile(_profileDocId, { xp: total })
            _profile.xp = total
        } catch (e) {
            console.warn('Failed to save XP to Appwrite:', e)
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
        showToast('🎉 Level Up! You reached level ' + newLevel + ': ' + getLevel(newXp).title, 'success')
    }
}

function getStreak() {
    if (!_profile) return { count: 0, lastDate: null }
    const data = {
        count: _profile.streak_count || 0,
        lastDate: _profile.streak_last_date || null
    }
    const today = new Date().toDateString()
    const last = data.lastDate ? new Date(data.lastDate).toDateString() : null
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    if (last === today) return data
    if (last === yesterday) return data
    return { count: 0, lastDate: null }
}

async function updateStreak() {
    const s = getStreak()
    const today = new Date().toDateString()
    if (s.lastDate === today) return s.count
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    let count = (s.lastDate === yesterday) ? s.count + 1 : 1
    if (count > 1) await addXp(CONFIG.limits.xpStreakBonus)
    if (_profileDocId) {
        try {
            await updateProfile(_profileDocId, {
                streak_count: count,
                streak_last_date: today
            })
            _profile.streak_count = count
            _profile.streak_last_date = today
        } catch (e) {
            console.warn('Failed to save streak:', e)
        }
    }
    return count
}
