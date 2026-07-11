const CONFIG = {
    app: {
        name: 'K-VOID',
        fullName: 'K-VOID Programming Hub',
        version: '1.0.0',
        tagline: 'Learn to Code. Completely Free.',
        domain: 'voidcode.tech'
    },

    appwrite: {
        endpoint: (typeof __APPWRITE_ENDPOINT__ !== 'undefined' ? __APPWRITE_ENDPOINT__ : 'https://cloud.appwrite.io/v1'),
        projectId: (typeof __APPWRITE_PROJECT_ID__ !== 'undefined' ? __APPWRITE_PROJECT_ID__ : 'YOUR_PROJECT_ID'),
    },

    database: {
        id: (typeof __DATABASE_ID__ !== 'undefined' ? __DATABASE_ID__ : 'main'),
        collections: {
            profiles: 'profiles',
            courses: 'courses',
            lessons: 'lessons',
            lessonProgress: 'lesson_progress',
            learningEvents: 'learning_events',
            notes: 'notes',
            bookmarks: 'bookmarks',
            courseProgress: 'course_progress',
            quizzes: 'quizzes',
            quizQuestions: 'quiz_questions',
            quizAttempts: 'quiz_attempts',
            achievements: 'achievements',
            userAchievements: 'user_achievements',
            certificates: 'certificates',
            notifications: 'notifications',
            settings: 'settings'
        }
    },

    storage: {
        avatarsBucketId: (typeof __AVATARS_BUCKET_ID__ !== 'undefined' ? __AVATARS_BUCKET_ID__ : 'avatars')
    },

    ai: {
        defaultProvider: 'groq',
        providers: {
            groq: {
                name: 'Groq',
                model: 'llama-3.3-70b-versatile',
                endpoint: 'https://api.groq.com/openai/v1/chat/completions'
            },
            gemini: {
                name: 'Gemini',
                model: 'gemini-2.0-flash',
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
            },
            openrouter: {
                name: 'OpenRouter',
                model: 'openai/gpt-4o-mini',
                endpoint: 'https://openrouter.ai/api/v1/chat/completions'
            },
            opencodezen: {
                name: 'OpenCode Zen',
                model: 'opencode-zen-1',
                endpoint: 'https://zen.opencode.ai/v1/chat/completions'
            }
        },
        systemPrompt: `You are VOID Assistant, the intelligent learning companion for K-VOID Programming Hub.
You help users learn to code by:
- Explaining programming concepts clearly
- Providing code examples
- Debugging issues
- Suggesting learning paths
- Answering questions about courses and lessons
Be concise, accurate, and encouraging. Use code examples when helpful.`
    },

    features: {
        gamification: true,
        certificates: true,
        notes: true,
        bookmarks: true,
        notifications: true,
        aiTutor: true
    },

    limits: {
        searchMinChars: 1,
        searchMaxResults: 10,
        streakGraceDays: 1,
        xpPerLesson: 50,
        xpPerQuiz: 25,
        xpStreakBonus: 10,
        levels: [
            { level: 1, xpRequired: 0, title: 'Novice' },
            { level: 2, xpRequired: 200, title: 'Apprentice' },
            { level: 3, xpRequired: 500, title: 'Developer' },
            { level: 4, xpRequired: 1000, title: 'Coder' },
            { level: 5, xpRequired: 2000, title: 'Programmer' },
            { level: 6, xpRequired: 3500, title: 'Engineer' },
            { level: 7, xpRequired: 5000, title: 'Architect' },
            { level: 8, xpRequired: 7500, title: 'Master' },
            { level: 9, xpRequired: 10000, title: 'Void Walker' },
            { level: 10, xpRequired: 15000, title: 'Legend' }
        ]
    }
}
