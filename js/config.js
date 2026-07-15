const CONFIG = {
    app: {
        name: 'K-VOID',
        fullName: 'K-VOID Programming Hub',
        version: '1.0.0',
        tagline: 'Learn to Code. Completely Free.',
        domain: 'voidcode.tech'
    },

    adminEmail: 'migsun890@gmail.com',

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
        uploadsBucketId: '6a54c7ea00173643fdca'
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
        aiTutor: true,
        learningPaths: true
    },

    learningPaths: [
        {
            id: 'python-mastery',
            title: 'Python Mastery',
            desc: 'From zero to confident Python programmer. Start with basics, build up to OOP and real projects.',
            icon: '🐍',
            difficulty: 'Beginner → Advanced',
            color: '#3776AB',
            steps: [
                { course_slug: 'python-beginner', title: 'Python Fundamentals', desc: 'Variables, data types, operators, and your first programs.' },
                { course_slug: 'python-intermediate', title: 'Intermediate Python', desc: 'Data structures, OOP, file handling, and error management.' },
                { course_slug: 'python-advanced', title: 'Advanced Python', desc: 'Concurrency, testing, design patterns, and real projects.' }
            ]
        },
        {
            id: 'web-dev',
            title: 'Web Development',
            desc: 'Build real websites from scratch. HTML, CSS, JavaScript — the full stack foundation.',
            icon: '🌐',
            difficulty: 'Beginner → Intermediate',
            color: '#E44D26',
            steps: [
                { course_slug: 'html-css-beginner', title: 'HTML & CSS Essentials', desc: 'Build the structure and style of websites.' },
                { course_slug: 'javascript-beginner', title: 'JavaScript Essentials', desc: 'Add interactivity to your websites.' },
                { course_slug: 'javascript-intermediate', title: 'Intermediate JavaScript', desc: 'Async programming, closures, and modern patterns.' },
                { course_slug: 'javascript-advanced', title: 'Advanced JavaScript', desc: 'Design patterns, optimization, and production apps.' }
            ]
        },
        {
            id: 'javascript-pro',
            title: 'JavaScript Professional',
            desc: 'Go beyond basics. Master modern JS, async patterns, and prepare for frameworks.',
            icon: '⚡',
            difficulty: 'Intermediate → Advanced',
            color: '#F7DF1E',
            steps: [
                { course_slug: 'javascript-intermediate', title: 'Intermediate JavaScript', desc: 'Async, fetch, closures, and ES6+ patterns.' },
                { course_slug: 'javascript-advanced', title: 'Advanced JavaScript', desc: 'Design patterns, optimization, and Web APIs.' }
            ]
        },
        {
            id: 'java-track',
            title: 'Java Development',
            desc: 'Strong OOP foundations. Perfect for Android, enterprise, and competitive programming.',
            icon: '☕',
            difficulty: 'Beginner → Advanced',
            color: '#ED8B00',
            steps: [
                { course_slug: 'java-beginner', title: 'Java Fundamentals', desc: 'Syntax, variables, data types, and first programs.' },
                { course_slug: 'java-intermediate', title: 'Intermediate Java', desc: 'OOP, collections, exception handling, and file I/O.' },
                { course_slug: 'java-advanced', title: 'Advanced Java', desc: 'Concurrency, design patterns, JDBC, and robust apps.' }
            ]
        },
        {
            id: 'c-cpp-track',
            title: 'C & C++ Mastery',
            desc: 'Master the fundamentals of systems programming. Build高性能 applications.',
            icon: '⚙️',
            difficulty: 'Beginner → Advanced',
            color: '#00599C',
            steps: [
                { course_slug: 'c-beginner', title: 'C Programming Basics', desc: 'Variables, loops, functions, and arrays.' },
                { course_slug: 'c-intermediate', title: 'Intermediate C', desc: 'Pointers, dynamic memory, structs, and file I/O.' },
                { course_slug: 'c-advanced', title: 'Advanced C', desc: 'Data structures, system calls, networking, and low-level programming.' },
                { course_slug: 'cpp-beginner', title: 'C++ Introduction', desc: 'C with classes, STL, and modern C++.' },
                { course_slug: 'cpp-intermediate', title: 'Intermediate C++', desc: 'OOP, templates, STL algorithms, and smart pointers.' },
                { course_slug: 'cpp-advanced', title: 'Advanced C++', desc: 'Memory management, multithreading, optimization.' }
            ]
        },
        {
            id: 'data-science',
            title: 'Data Science Path',
            desc: 'Learn Python for data analysis, visualization, and machine learning foundations.',
            icon: '📊',
            difficulty: 'Intermediate → Advanced',
            color: '#FF6F00',
            steps: [
                { course_slug: 'python-beginner', title: 'Python Fundamentals', desc: 'Get comfortable with Python first.' },
                { course_slug: 'sql-beginner', title: 'SQL & Databases', desc: 'Query, insert, and manage data.' },
                { course_slug: 'data-science', title: 'Data Science with Python', desc: 'NumPy, Pandas, visualization, and ML basics.' }
            ]
        },
        {
            id: 'rust-systems',
            title: 'Rust Systems Programming',
            desc: 'Modern systems programming with safety and performance. The future of systems code.',
            icon: '🦀',
            difficulty: 'Intermediate → Advanced',
            color: '#CE422B',
            steps: [
                { course_slug: 'rust-beginner', title: 'Rust Fundamentals', desc: 'Ownership, borrowing, lifetimes, and safety.' },
                { course_slug: 'rust-intermediate', title: 'Intermediate Rust', desc: 'Lifetimes, traits, generics, async, and unsafe.' }
            ]
        }
    ],

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
