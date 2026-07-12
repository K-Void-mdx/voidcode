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
            profiles: '6a4f8f1300021a4f830b',
            courses: '6a4fb2030032c06ed6b2',
            lessons: '6a4fbb3600109b8fe277',
            lessonProgress: '6a4fcd27000c92d63a9e',
            learningEvents: '6a4ffbe600101ad65bf3',
            notes: '6a50010500008cd5a588',
            bookmarks: '6a50037a000353186782',
            courseProgress: '6a500cbf0013aa95a1ae',
            quizzes: '6a500f85001c638e4793',
            quizQuestions: '6a5013cf00056b581bf5',
            quizAttempts: '6a50176100190e57a576',
            achievements: '6a504b6f00165590e89b',
            userAchievements: '6a504daf0016ad7019ed',
            certificates: '6a50500d000a3b33d7a6',
            notifications: '6a5053ea0037a5c41b76',
            settings: '6a5055f10023c29b5e76'
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
