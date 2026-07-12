const CONFIG = {
    app: {
        name: 'K-VOID',
        fullName: 'K-VOID Programming Hub',
        version: '1.0.0',
        tagline: 'Learn to Code. Completely Free.',
        domain: 'voidcode.tech'
    },

    appwrite: {
        endpoint: 'https://fra.cloud.appwrite.io/v1',
        projectId: '6a4f8acd002d44e26f1c'
    },

    database: {
        id: '6a4f8dc30008cee8c6b8',
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
        avatarsBucketId: 'avatars'
    },

    ai: {
        proxyEndpoint: '/api/ai',
        defaultProvider: 'groq',
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
