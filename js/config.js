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
        avatarsBucketId: 'uploads'
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
                { course_slug: 'python-basics', title: 'Python Fundamentals', desc: 'Variables, data types, operators, and your first programs.' },
                { course_slug: 'python-control-flow', title: 'Control Flow', desc: 'If/else, loops, and decision-making in code.' },
                { course_slug: 'python-functions', title: 'Functions & Modules', desc: 'Write reusable code and organize with modules.' },
                { course_slug: 'python-data-structures', title: 'Data Structures', desc: 'Lists, dictionaries, sets, and tuples.' },
                { course_slug: 'python-oop', title: 'Object-Oriented Python', desc: 'Classes, objects, inheritance, and encapsulation.' },
                { course_slug: 'python-file-handling', title: 'File Handling & Errors', desc: 'Read/write files and handle exceptions gracefully.' },
                { course_slug: 'python-projects', title: 'Mini Projects', desc: 'Apply everything: calculator, to-do app, simple games.' }
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
                { course_slug: 'html-basics', title: 'HTML Fundamentals', desc: 'Structure web pages with semantic HTML.' },
                { course_slug: 'css-basics', title: 'CSS Styling', desc: 'Make beautiful layouts with Flexbox and Grid.' },
                { course_slug: 'javascript-basics', title: 'JavaScript Essentials', desc: 'Add interactivity to your websites.' },
                { course_slug: 'javascript-dom', title: 'DOM Manipulation', desc: 'Dynamically update pages with JavaScript.' },
                { course_slug: 'javascript-fetch', title: 'APIs & Fetch', desc: 'Connect to real data from the web.' },
                { course_slug: 'web-projects', title: 'Build Projects', desc: 'Portfolio site, weather app, and more.' }
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
                { course_slug: 'javascript-advanced', title: 'Advanced JavaScript', desc: 'Closures, prototypes, and the event loop.' },
                { course_slug: 'javascript-async', title: 'Async Programming', desc: 'Promises, async/await, and error handling.' },
                { course_slug: 'javascript-es6', title: 'ES6+ Features', desc: 'Arrow functions, destructuring, modules, and more.' },
                { course_slug: 'javascript-patterns', title: 'Design Patterns', desc: 'Common patterns every JS developer should know.' },
                { course_slug: 'nodejs-basics', title: 'Node.js Introduction', desc: 'Run JavaScript on the server.' }
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
                { course_slug: 'java-basics', title: 'Java Fundamentals', desc: 'Syntax, variables, data types, and first programs.' },
                { course_slug: 'java-control-flow', title: 'Control Flow', desc: 'Conditionals, loops, and switch statements.' },
                { course_slug: 'java-oop', title: 'Object-Oriented Java', desc: 'Classes, inheritance, polymorphism, interfaces.' },
                { course_slug: 'java-collections', title: 'Collections Framework', desc: 'Lists, maps, sets, and iterators.' },
                { course_slug: 'java-exceptions', title: 'Exception Handling', desc: 'Try/catch, custom exceptions, and best practices.' },
                { course_slug: 'java-projects', title: 'Java Projects', desc: 'Student manager, simple games, file processor.' }
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
                { course_slug: 'c-basics', title: 'C Programming Basics', desc: 'Variables, loops, functions, and arrays.' },
                { course_slug: 'c-pointers', title: 'Pointers & Memory', desc: 'Master pointers, dynamic allocation, and memory management.' },
                { course_slug: 'c-structures', title: 'Structures & Files', desc: 'Custom data types and file I/O.' },
                { course_slug: 'cpp-basics', title: 'C++ Introduction', desc: 'Classes, objects, and the C++ standard library.' },
                { course_slug: 'cpp-oop', title: 'C++ OOP', desc: 'Inheritance, polymorphism, templates.' },
                { course_slug: 'cpp-projects', title: 'C++ Projects', desc: 'Banking system, student records, mini games.' }
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
                { course_slug: 'python-basics', title: 'Python Fundamentals', desc: 'Get comfortable with Python first.' },
                { course_slug: 'python-data-structures', title: 'Data Structures', desc: 'Work with lists, dicts, and sets.' },
                { course_slug: 'data-analysis', title: 'Data Analysis with Python', desc: 'NumPy, Pandas, and data cleaning.' },
                { course_slug: 'data-visualization', title: 'Data Visualization', desc: 'Matplotlib, Seaborn, and charts.' },
                { course_slug: 'ml-intro', title: 'Intro to Machine Learning', desc: 'Scikit-learn, basic algorithms, and evaluation.' }
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
                { course_slug: 'rust-basics', title: 'Rust Fundamentals', desc: 'Ownership, borrowing, and lifetimes.' },
                { course_slug: 'rust-structs', title: 'Structs & Enums', desc: 'Custom types and pattern matching.' },
                { course_slug: 'rust-errors', title: 'Error Handling', desc: 'Result, Option, and panic.' },
                { course_slug: 'rust-collections', title: 'Collections & Iterators', desc: 'Vecs, hashmaps, and iterator adapters.' },
                { course_slug: 'rust-projects', title: 'Rust Projects', desc: 'CLI tools, web servers, and more.' }
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
