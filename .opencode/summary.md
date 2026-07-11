# K-VOID Programming Hub — Project Summary

## Project Type
Static vanilla HTML/CSS/JS web app — **no framework, no bundler, no TypeScript**.

## Architecture
- Minimal `index.html` shell with CDN links (Appwrite v26 SDK, Google Fonts) + CDN fallback (unpkg)
- **Hash-based SPA router** in `js/app.js`
- Dark theme design system in `css/style.css` (~852 lines)
- Vanilla JS globals (no modules, no imports)
- 7 JS files loaded sequentially, 3 new files added in this session

## New Files (this session)
- `js/config.js` — centralized configuration (app, appwrite, database, storage, AI, features, limits)
- `js/ai.js` — VOID Assistant multi-provider abstraction (Groq, Gemini, OpenRouter, OpenCode Zen)
- `.env.example` — documents all environment variables

## Changed Files (this session)
- `index.html` — added CDN fallback, new script loads (config.js, ai.js)
- `css/style.css` — added search dropdown, XP bar, AI chat, certificates styles
- `js/app.js` — major rewrite: 713 → 964 lines
- `js/auth.js` — improved init with error handling, centralized config
- `js/profile.js` — fixed Query destructuring, removed dead code, fixed avatar bug, centralized config
- `js/courses.js` — added `rating` field to all 12 courses

## Backend
- **Appwrite** (self-hosted on Coolify)
- Auth: `Client` + `Account` API
- Database: `Databases` API (profiles collection + 15 more collections designed)
- Storage: `Storage` API (avatars bucket)
- **Configurable** via `js/config.js` — IDs read from env vars or fall back to placeholders
- Appwrite project/database/bucket **not yet created** by user

## Auth Flow (preserved)
1. Signup → email verification link → Login → Complete Profile → Dashboard
2. Password reset via email recovery
3. Session restored on every page load via `getCurrentUser()`

## Features Implemented
| Feature | Status |
|---------|--------|
| Config module | ✅ Centralized |
| CDN fallback | ✅ unpkg backup |
| 404 handler | ✅ Logged-in & logged-out |
| Loading states | ✅ Login/signup/save buttons |
| Error boundaries | ✅ init() + AI catch blocks |
| Intelligent search | ✅ Prefix-based dropdown |
| Course thumbnails | ✅ Styled initials (no emoji icons) |
| Ratings (1-5 stars) | ✅ All courses |
| XP system | ✅ 10 levels |
| Streak tracking | ✅ Daily streak |
| Level-up notifications | ✅ Toast on level up |
| Bookmarks | ✅ Toggle + dedicated page |
| Certificates | ✅ Course completion tracking |
| AI Tutor (VOID Assistant) | ✅ Multi-provider abstraction |
| AI fallback | ✅ Automatic provider fallback |

## Bugs Fixed
1. `Appwrite.Query` — now destructured `const { Query } = Appwrite` in `profile.js`
2. Login "Send code instead" — removed, replaced with standard login flow
3. `getProfileDefaultAvatar()` — removed entirely; `getAvatarUrl()` in `utils.js` used instead
4. `init()` silent failure — now shows connection error screen with retry button
5. Dead code removed: `_pendingAvatarFile`, `uploadAvatar()`, `getAvatarUrl()` (profile.js), `getProfileDefaultAvatar()`
6. `renderFrame` dead branch removed (no more logged-out path)
7. Operator precedence bug in profile page fixed (`||` in string concatenation)
8. Course thumbnails now use styled initials instead of emoji icons

## Data Layer
- **Appwrite Database:** profiles collection (userId, firstName, lastName, username, gender, bio, avatar_url, display_name, learning_level, created_at)
- 15 additional collections designed (courses, lessons, lesson_progress, learning_events, notes, bookmarks, course_progress, quizzes, quiz_questions, quiz_attempts, achievements, user_achievements, certificates, notifications, settings)
- **Progress tracking:** localStorage (XP, streaks, bookmarks, lesson completion) — temporary
- **Course data:** embedded in `js/courses.js` (12 courses, 450 lines)

## Known Remaining Issues
1. Course data is embedded (not lazy loaded)
2. No Service Worker for offline access
3. No Google OAuth
4. Appwrite collections not yet created by user
5. Avatar storage functions defined but not fully integrated into profile flow

## Deployment
- **Netlify** auto-deploy from GitHub (`main` branch)
- Domain: `voidcode.tech`
- No build step — push raw files

## Git
- 21 commits, `main` branch
- Remote: `https://github.com/K-Void-mdx/voidcode.git`
- Latest: `8f76e63` — "feat: complete platform redesign with Appwrite architecture"
