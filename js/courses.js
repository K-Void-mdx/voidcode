function _c(id, icon, title, subtitle, desc, diff, dur, cat, color, lessons) {
    return { id, icon, title, subtitle, desc, difficulty: diff, duration: dur, category: cat, color, popular: false, rating: 4.5, lessons: lessons.map((l, i) => ({
        id: l[0], title: l[1], icon: '', desc: l[2], concepts: [], summary: [], quiz: null
    }))}
}

const COURSES = [
    _c('python-beginner', '🐍', 'Python', 'Beginner', 'The calculator with superpowers. It reads like plain English. Perfect for automating boring tasks and coding your first AI chatbot.', 'Beginner', '8 hours', 'General Purpose', '#3776AB', [
        ['py-b-1', 'Making Your Computer Talk', 'Write your first program and make the screen respond'],
        ['py-b-2', 'Digital Brain Cells (Variables)', 'Create virtual memory boxes to save names, scores, and passwords'],
        ['py-b-3', 'Your Program Talks Back (I/O)', 'Ask the user questions and respond with answers'],
        ['py-b-4', 'Teaching Your App to Decide (If/Else)', 'Build a security guard system that checks passwords'],
        ['py-b-5', 'Automating Boring Tasks (Loops)', 'Make your computer repeat anything 10,000 times in a second'],
        ['py-b-6', 'Shopping Carts (Lists)', 'Store and organize collections of data in one place'],
        ['py-b-7', 'Building Custom Tools (Functions)', 'Write code once, reuse it forever'],
        ['py-b-8', 'The Text Swiss Army Knife (Strings)', 'Capitalize, search, replace — master text manipulation'],
        ['py-b-9', 'Math at Light Speed', 'Add, multiply, and power through calculations instantly'],
        ['py-b-10', 'Sticky Notes for Code (Comments)', 'Write notes only humans read — keep your code understandable'],
        ['py-b-11', 'Bug Detective (Debugging)', 'Follow the clues to find and fix errors in your code'],
        ['py-b-12', 'Mini Project: Calculator', 'Build a working calculator from scratch']
    ]),
    _c('python-intermediate', '🐍', 'Python', 'Intermediate', 'Go beyond basics. Data structures, OOP, file handling, and error management.', 'Intermediate', '10 hours', 'General Purpose', '#3776AB', [
        ['py-i-1', 'Lists on Steroids (Comprehensions)', 'Condense 5 lines of loop code into one elegant line'],
        ['py-i-2', 'Multi-Key Filing Cabinets (Dicts)', 'Store structured data with real-world key-value pairs'],
        ['py-i-3', 'Defensive Programming (Error Handling)', 'try/except blocks so your app never crashes'],
        ['py-i-4', 'Interacting with Files (File I/O)', 'Read, write, and update .txt and .csv files'],
        ['py-i-5', 'The Object Blueprint (OOP Basics)', 'Create classes to generate repeating app objects'],
        ['py-i-6', 'Object Inheritance & Family Trees', 'Pass properties from parent classes to child classes'],
        ['py-i-7', 'Supercharging Functions (Args & Kwargs)', 'Build flexible functions that accept infinite settings'],
        ['py-i-8', 'Importing External Brains (Modules)', 'Use math, random, datetime for complex heavy lifting'],
        ['py-i-9', 'Custom Code Wrappers (Decorators)', 'Add behaviors around functions without rewriting them'],
        ['py-i-10', 'Memory-Friendly Loops (Generators)', 'Handle millions of rows without overloading RAM'],
        ['py-i-11', 'Reading Live Internet Data (JSON & APIs)', 'Fetch live data from web servers and parse it'],
        ['py-i-12', 'Mini Project: Expense Tracker', 'Read entries, save to file, categorize costs']
    ]),
    _c('python-advanced', '🐍', 'Python', 'Advanced', 'Advanced patterns, concurrency, testing, and real-world project architecture.', 'Advanced', '12 hours', 'General Purpose', '#3776AB', [
        ['py-a-1', 'Generators & Iterators', 'Memory-efficient data streaming'],
        ['py-a-2', 'Context Managers', 'The with statement and resource management'],
        ['py-a-3', 'Metaclasses', 'Classes that create classes'],
        ['py-a-4', 'Threading & Multiprocessing', 'Running code in parallel'],
        ['py-a-5', 'Async/Await', 'Asynchronous programming in Python'],
        ['py-a-6', 'Unit Testing', 'Writing tests with unittest and pytest'],
        ['py-a-7', 'Virtual Environments', 'Isolating project dependencies'],
        ['py-a-8', 'API Development with Flask', 'Building REST APIs'],
        ['py-a-9', 'Database with SQLite', 'Storing data in real databases'],
        ['py-a-10', 'Design Patterns', 'Singleton, Factory, Observer patterns'],
        ['py-a-11', 'Performance Optimization', 'Profiling and speeding up code'],
        ['py-a-12', 'Packaging & Distribution', 'Creating pip-installable packages'],
        ['py-a-13', 'Mini Project: Web Scraper', 'Scrape and analyze real websites']
    ]),

    _c('javascript-beginner', '⚡', 'JavaScript', 'Beginner', 'The engine that brings websites to life. Use it to build video players, pop-up menus, and web-based video games.', 'Beginner', '8 hours', 'Web Development', '#F7DF1E', [
        ['js-b-1', 'Bringing Pages to Life', 'Run your first code inside a web browser'],
        ['js-b-2', 'Digital Memory Boxes (Variables)', 'Store usernames, scores, and settings'],
        ['js-b-3', 'What\'s Inside? (Data Types)', 'Strings, numbers, booleans — knowing what you have'],
        ['js-b-4', 'Math & Logic Tools (Operators)', 'Compare, calculate, and make decisions'],
        ['js-b-5', 'Your App\'s Decision Maker (If/Switch)', 'Route users based on what they click'],
        ['js-b-6', 'The Repeat Machine (Loops)', 'Process thousands of items in milliseconds'],
        ['js-b-7', 'Code Recipe Cards (Functions)', 'Package logic into reusable blocks'],
        ['js-b-8', 'Data Buckets (Arrays)', 'Manage collections of anything'],
        ['js-b-9', 'Named Data Boxes (Objects)', 'Group related info like a real-world profile'],
        ['js-b-10', 'Smart String Building (Templates)', 'Mix variables into text effortlessly'],
        ['js-b-11', 'Talking to HTML (DOM)', 'Select and change page elements live'],
        ['js-b-12', 'Click! Tap! Scroll! (Events)', 'React to every user interaction'],
        ['js-b-13', 'Mini Project: Interactive To-Do', 'A working to-do list in the browser']
    ]),
    _c('javascript-intermediate', '⚡', 'JavaScript', 'Intermediate', 'Async programming, fetch API, closures, and modern ES6+ patterns.', 'Intermediate', '10 hours', 'Web Development', '#F7DF1E', [
        ['js-i-1', 'Closures', 'Functions that remember their scope'],
        ['js-i-2', 'Prototypes & Prototypal Inheritance', 'How JS objects really work'],
        ['js-i-3', 'The this Keyword', 'Understanding context in JavaScript'],
        ['js-i-4', 'Promises', 'Handling async operations elegantly'],
        ['js-i-5', 'Async/Await', 'Writing clean asynchronous code'],
        ['js-i-6', 'Fetch API', 'Getting data from the internet'],
        ['js-i-7', 'Error Handling', 'Try/catch and custom errors'],
        ['js-i-8', 'LocalStorage & SessionStorage', 'Persisting data in the browser'],
        ['js-i-9', 'ES6+ Destructuring', 'Extracting values elegantly'],
        ['js-i-10', 'Spread & Rest Operators', 'Expanding and collecting data'],
        ['js-i-11', 'Modules: Import & Export', 'Organizing code into files'],
        ['js-i-12', 'Higher-Order Functions', 'Functions that accept/return functions'],
        ['js-i-13', 'Mini Project: Weather App', 'Fetch real weather data and display it']
    ]),
    _c('javascript-advanced', '⚡', 'JavaScript', 'Advanced', 'Design patterns, optimization, Web APIs, and building production-ready applications.', 'Advanced', '12 hours', 'Web Development', '#F7DF1E', [
        ['js-a-1', 'Event Loop Deep Dive', 'How JavaScript really runs'],
        ['js-a-2', 'Web Workers', 'Background threading in the browser'],
        ['js-a-3', 'Service Workers & PWA', 'Offline-first web applications'],
        ['js-a-4', 'Canvas & Drawing', 'Programmatic graphics and animation'],
        ['js-a-5', 'WebSockets', 'Real-time bidirectional communication'],
        ['js-a-6', 'Design Patterns in JS', 'Module, Observer, Singleton, Factory'],
        ['js-a-7', 'Functional Programming', 'Pure functions, immutability, composition'],
        ['js-a-8', 'Performance Optimization', 'Profiling, lazy loading, memoization'],
        ['js-a-9', 'Security Best Practices', 'XSS, CSRF, and input sanitization'],
        ['js-a-10', 'Testing with Jest', 'Unit and integration testing'],
        ['js-a-11', 'Building a Framework', 'Mini framework from scratch'],
        ['js-a-12', 'Mini Project: Real-Time Chat', 'WebSocket chat application']
    ]),

    _c('java-beginner', '☕', 'Java', 'Beginner', 'Strong OOP foundations. The language behind Android apps and enterprise software.', 'Beginner', '8 hours', 'General Purpose', '#ED8B00', [
        ['java-b-1', 'Hello, World!', 'Writing and running your first Java program'],
        ['java-b-2', 'Variables & Data Types', 'int, double, String, boolean and more'],
        ['java-b-3', 'Operators', 'Arithmetic, relational, and logical'],
        ['java-b-4', 'If/Else & Switch', 'Control flow in Java'],
        ['java-b-5', 'Loops: for, while, do-while', 'Repeating code with precision'],
        ['java-b-6', 'Arrays', 'Storing multiple values'],
        ['java-b-7', 'Methods', 'Writing reusable Java methods'],
        ['java-b-8', 'Strings', 'String manipulation and methods'],
        ['java-b-9', 'Scanner: User Input', 'Reading input from the console'],
        ['java-b-10', 'Type Casting', 'Converting between data types'],
        ['java-b-11', 'Comments & Naming', 'Writing clean Java code'],
        ['java-b-12', 'Mini Project: Number Guessing Game', 'A complete guessing game']
    ]),
    _c('java-intermediate', '☕', 'Java', 'Intermediate', 'OOP mastery, collections, exception handling, and file I/O.', 'Intermediate', '10 hours', 'General Purpose', '#ED8B00', [
        ['java-i-1', 'Classes & Objects', 'The building blocks of OOP'],
        ['java-i-2', 'Constructors', 'Creating objects with parameters'],
        ['java-i-3', 'Inheritance', 'Extending classes and code reuse'],
        ['java-i-4', 'Polymorphism', 'Method overloading and overriding'],
        ['java-i-5', 'Abstract Classes & Interfaces', 'Contracts and blueprints'],
        ['java-i-6', 'Encapsulation', 'Getters, setters, and access modifiers'],
        ['java-i-7', 'ArrayList & HashMap', 'Dynamic collections'],
        ['java-i-8', 'Generics', 'Type-safe collections'],
        ['java-i-9', 'Exception Handling', 'Try/catch and custom exceptions'],
        ['java-i-10', 'File I/O', 'Reading and writing files'],
        ['java-i-11', 'Inner Classes & Lambdas', 'Nested code structures'],
        ['java-i-12', 'Mini Project: Student Manager', 'CRUD system with file storage']
    ]),
    _c('java-advanced', '☕', 'Java', 'Advanced', 'Concurrency, design patterns, JDBC, and building robust applications.', 'Advanced', '12 hours', 'General Purpose', '#ED8B00', [
        ['java-a-1', 'Multi-Threading', 'Parallel execution in Java'],
        ['java-a-2', 'Synchronization & Locks', 'Thread safety and race conditions'],
        ['java-a-3', 'Executor Framework', 'Thread pools and scheduling'],
        ['java-a-4', 'Streams API', 'Functional data processing'],
        ['java-a-5', 'Lambda Expressions', 'Functional Java programming'],
        ['java-a-6', 'Design Patterns', 'Singleton, Factory, Builder, Observer'],
        ['java-a-7', 'JDBC & Databases', 'Connecting Java to SQL databases'],
        ['java-a-8', 'Collections Deep Dive', 'Advanced data structures'],
        ['java-a-9', 'Network Programming', 'Sockets and HTTP clients'],
        ['java-a-10', 'Annotations & Reflection', 'Runtime metadata manipulation'],
        ['java-a-11', 'Testing with JUnit', 'Unit testing Java applications'],
        ['java-a-12', 'Mini Project: Chat Server', 'Multi-threaded TCP chat']
    ]),

    _c('c-beginner', '⚙️', 'C', 'Beginner', 'The foundation of modern programming. Memory, pointers, and systems-level thinking.', 'Beginner', '8 hours', 'Systems', '#00599C', [
        ['c-b-1', 'Hello, World!', 'Compiling and running C programs'],
        ['c-b-2', 'Variables & Data Types', 'int, float, char, and sizeof'],
        ['c-b-3', 'printf & scanf', 'Output and user input'],
        ['c-b-4', 'Operators & Expressions', 'Arithmetic and bitwise operators'],
        ['c-b-5', 'If/Else & Switch', 'Conditional execution'],
        ['c-b-6', 'Loops', 'for, while, do-while in C'],
        ['c-b-7', 'Arrays', 'Sequential data storage'],
        ['c-b-8', 'Strings in C', 'Character arrays and string.h'],
        ['c-b-9', 'Functions', 'Declaring, calling, and scope'],
        ['c-b-10', 'Header Files & Compilation', 'Organizing multi-file programs'],
        ['c-b-11', 'Preprocessor Directives', '#define, #include, macros'],
        ['c-b-12', 'Mini Project: Simple Calculator', 'Menu-driven calculator']
    ]),
    _c('c-intermediate', '⚙️', 'C', 'Intermediate', 'Pointers, dynamic memory, structs, and file I/O.', 'Intermediate', '10 hours', 'Systems', '#00599C', [
        ['c-i-1', 'Pointers Basics', 'Memory addresses and dereferencing'],
        ['c-i-2', 'Pointer Arithmetic', 'Moving through memory'],
        ['c-i-3', 'Pointers & Arrays', 'The deep connection'],
        ['c-i-4', 'Pointers & Functions', 'Pass by reference'],
        ['c-i-5', 'Dynamic Memory: malloc & free', 'Heap allocation and deallocation'],
        ['c-i-6', 'Structs', 'Custom data types'],
        ['c-i-7', 'Structs & Pointers', 'Linked data structures'],
        ['c-i-8', 'File I/O', 'fopen, fread, fwrite, fclose'],
        ['c-i-9', 'Command Line Arguments', 'argc and argv'],
        ['c-i-10', 'Recursion', 'Functions that call themselves'],
        ['c-i-11', 'Memory Layout', 'Stack, heap, data, text segments'],
        ['c-i-12', 'Mini Project: Contact Book', 'File-based contact management']
    ]),
    _c('c-advanced', '⚙️', 'C', 'Advanced', 'Data structures, system calls, networking, and low-level programming.', 'Advanced', '12 hours', 'Systems', '#00599C', [
        ['c-a-1', 'Linked Lists', 'Singly and doubly linked'],
        ['c-a-2', 'Stacks & Queues', 'LIFO and FIFO data structures'],
        ['c-a-3', 'Trees & Binary Search', 'Hierarchical data organization'],
        ['c-a-4', 'Hash Tables', 'O(1) lookup data structures'],
        ['c-a-5', 'Sorting Algorithms', 'Bubble, merge, quick sort'],
        ['c-a-6', 'Searching Algorithms', 'Linear and binary search'],
        ['c-a-7', 'Bit Manipulation', 'Advanced bitwise operations'],
        ['c-a-8', 'System Calls', 'Interfacing with the OS'],
        ['c-a-9', 'Process Management', 'fork, exec, wait'],
        ['c-a-10', 'Network Programming', 'Sockets and client-server'],
        ['c-a-11', 'Build Systems: Makefile', 'Automating compilation'],
        ['c-a-12', 'Mini Project: HTTP Server', 'Simple web server from scratch']
    ]),

    _c('cpp-beginner', '🔧', 'C++', 'Beginner', 'C with classes. Learn modern C++ with OSTL, object orientation, and memory safety.', 'Beginner', '8 hours', 'Systems', '#00599C', [
        ['cpp-b-1', 'Hello, World!', 'Compiling C++ with g++'],
        ['cpp-b-2', 'Variables & Data Types', 'auto, int, string, and type inference'],
        ['cpp-b-3', 'Input/Output', 'cin, cout, and string getline'],
        ['cpp-b-4', 'Operators & Expressions', 'All operator types in C++'],
        ['cpp-b-5', 'If/Else & Switch', 'Conditional logic'],
        ['cpp-b-6', 'Loops', 'for, while, range-based for'],
        ['cpp-b-7', 'Functions & Overloading', 'Multiple functions, same name'],
        ['cpp-b-8', 'Arrays & Vectors', 'Static and dynamic arrays'],
        ['cpp-b-9', 'Strings', 'std::string and methods'],
        ['cpp-b-10', 'References & Pointers', 'Aliases and addresses'],
        ['cpp-b-11', 'Namespaces', 'Organizing code scope'],
        ['cpp-b-12', 'Mini Project: Student Grades', 'Grade tracker with vectors']
    ]),
    _c('cpp-intermediate', '🔧', 'C++', 'Intermediate', 'OOP, templates, STL algorithms, and smart pointers.', 'Intermediate', '10 hours', 'Systems', '#00599C', [
        ['cpp-i-1', 'Classes & Objects', 'Encapsulation in C++'],
        ['cpp-i-2', 'Constructors & Destructors', 'Object lifecycle management'],
        ['cpp-i-3', 'Inheritance', 'Public, protected, private derivation'],
        ['cpp-i-4', 'Polymorphism & Virtual Functions', 'Runtime dispatch'],
        ['cpp-i-5', 'Operator Overloading', 'Custom operators for classes'],
        ['cpp-i-6', 'Templates', 'Generic programming'],
        ['cpp-i-7', 'STL Containers', 'map, set, list, deque'],
        ['cpp-i-8', 'STL Algorithms', 'sort, find, transform'],
        ['cpp-i-9', 'Smart Pointers', 'unique_ptr, shared_ptr'],
        ['cpp-i-10', 'Move Semantics', 'std::move and rvalue references'],
        ['cpp-i-11', 'Lambdas', 'Anonymous functions in C++'],
        ['cpp-i-12', 'Mini Project: Library System', 'Book management with OOP']
    ]),
    _c('cpp-advanced', '🔧', 'C++', 'Advanced', 'Memory management, multithreading, optimization, and systems-level programming.', 'Advanced', '12 hours', 'Systems', '#00599C', [
        ['cpp-a-1', 'Memory Model', 'Stack vs heap in depth'],
        ['cpp-a-2', 'Custom Allocators', 'Memory pool allocation'],
        ['cpp-a-3', 'Multithreading', 'std::thread and synchronization'],
        ['cpp-a-4', 'Lock-Free Programming', 'Atomic operations'],
        ['cpp-a-5', 'Compile-Time Programming', 'constexpr and templates'],
        ['cpp-a-6', 'Design Patterns', 'CRTP, RAII, Pimpl'],
        ['cpp-a-7', 'Network Programming', 'Boost.Asio and sockets'],
        ['cpp-a-8', 'Template Metaprogramming', 'Type traits and SFINAE'],
        ['cpp-a-9', 'Performance Optimization', 'Cache friendly code'],
        ['cpp-a-10', 'Build Systems', 'CMake and package management'],
        ['cpp-a-11', 'Undefined Behavior', 'What to avoid and why'],
        ['cpp-a-12', 'Mini Project: Web Server', 'HTTP server from scratch']
    ]),

    _c('html-css-beginner', '🌐', 'HTML & CSS Essentials', 'Beginner', 'The skeleton and wardrobe of the web. HTML builds the walls, CSS paints them beautiful colors. One course, two superpowers.', 'Beginner', '8 hours', 'Web Development', '#E44D26', [
        ['html-b-1', 'The Web\'s Building Blocks', 'What HTML is and why every website uses it'],
        ['html-b-2', 'Blueprint of a Page', 'The head, body, and skeleton of every HTML file'],
        ['html-b-3', 'Headlines & Paragraphs', 'Organizing content that people actually read'],
        ['html-b-4', 'Clicking Through the Web (Links)', 'How one page connects to another — the web\'s glue'],
        ['html-b-5', 'Adding Photos & Videos', 'Embed images, audio, and video into your pages'],
        ['html-b-6', 'Making Lists & Tables', 'Organize data in bullet points, numbers, and grids'],
        ['html-b-7', 'Forms That Collect Info', 'Build the inputs that power sign-ups and search bars'],
        ['css-b-1', 'Painting the Web (CSS Intro)', 'What CSS is and how it transforms plain HTML'],
        ['css-b-2', 'Picking Your Targets (Selectors)', 'Tell CSS exactly which elements to style'],
        ['css-b-3', 'Colors, Fonts & The Box Model', 'Make text beautiful — every element is a box'],
        ['css-b-4', 'Flexbox & Grid: Layout Superpowers', 'Align anything in one dimension or two'],
        ['css-b-5', 'Responsive: Phones to Desktops', 'Sites that look great on every screen size'],
        ['css-b-6', 'Mini Project: Portfolio Page', 'Build your personal developer showcase']
    ]),

    _c('go-beginner', '🐹', 'Go', 'Beginner', 'Simple, fast, and built for the modern web. Google\'s language for servers and CLI tools.', 'Beginner', '8 hours', 'General Purpose', '#00ADD8', [
        ['go-b-1', 'Hello, World!', 'Setting up Go and running code'],
        ['go-b-2', 'Variables & Types', 'var, const, and short declaration'],
        ['go-b-3', 'Functions', 'Multiple return values and errors'],
        ['go-b-4', 'If/Else & Switch', 'Go\'s clean control flow'],
        ['go-b-5', 'Loops', 'Only for — Go\'s loop keyword'],
        ['go-b-6', 'Arrays & Slices', 'Fixed and dynamic collections'],
        ['go-b-7', 'Maps', 'Key-value data structures'],
        ['go-b-8', 'Structs', 'Custom types with fields'],
        ['go-b-9', 'Methods & Interfaces', 'Go\'s unique OOP approach'],
        ['go-b-10', 'Pointers', 'Memory addresses in Go'],
        ['go-b-11', 'Error Handling', 'if err != nil pattern'],
        ['go-b-12', 'Mini Project: CLI Tool', 'Command-line todo list']
    ]),
    _c('go-intermediate', '🐹', 'Go', 'Intermediate', 'Concurrency, HTTP servers, middleware, and production Go patterns.', 'Intermediate', '10 hours', 'General Purpose', '#00ADD8', [
        ['go-i-1', 'Goroutines', 'Lightweight concurrent functions'],
        ['go-i-2', 'Channels', 'Communicating between goroutines'],
        ['go-i-3', 'Select Statement', 'Multiplexing channel operations'],
        ['go-i-4', 'HTTP Servers', 'net/http and routing'],
        ['go-i-5', 'Middleware', 'Logging, auth, and CORS'],
        ['go-i-6', 'JSON Handling', 'Marshal and unmarshal'],
        ['go-i-7', 'Database with sql', 'MySQL/PostgreSQL drivers'],
        ['go-i-8', 'File I/O', 'Reading and writing files'],
        ['go-i-9', 'Testing', 'Unit tests and benchmarks'],
        ['go-i-10', 'Packages & Modules', 'Organizing Go projects'],
        ['go-i-11', 'Context', 'Cancellation and deadlines'],
        ['go-i-12', 'Mini Project: REST API', 'Full CRUD API with database']
    ]),

    _c('rust-beginner', '🦀', 'Rust', 'Beginner', 'Safe, fast, and concurrent. The language everyone is switching to.', 'Beginner', '8 hours', 'Systems', '#CE422B', [
        ['rust-b-1', 'Hello, World!', 'Installing Rust and cargo new'],
        ['rust-b-2', 'Variables & Mutability', 'let vs let mut'],
        ['rust-b-3', 'Data Types', 'Scalar and compound types'],
        ['rust-b-4', 'Functions', 'fn, parameters, return values'],
        ['rust-b-5', 'Ownership', 'Rust\'s unique memory model'],
        ['rust-b-6', 'References & Borrowing', 'Accessing data without ownership'],
        ['rust-b-7', 'Structs', 'Custom data types'],
        ['rust-b-8', 'Enums & Pattern Matching', 'Option, match, if let'],
        ['rust-b-9', 'Vectors', 'Dynamic arrays'],
        ['rust-b-10', 'Strings', 'String vs &str'],
        ['rust-b-11', 'Error Handling', 'Result and the ? operator'],
        ['rust-b-12', 'Mini Project: CLI Calculator', 'Terminal calculator with error handling']
    ]),
    _c('rust-intermediate', '🦀', 'Rust', 'Intermediate', 'Lifetimes, traits, generics, async Rust, and unsafe.', 'Intermediate', '10 hours', 'Systems', '#CE422B', [
        ['rust-i-1', 'Lifetimes', 'Explicit lifetime annotations'],
        ['rust-i-2', 'Traits', 'Defining shared behavior'],
        ['rust-i-3', 'Generics', 'Flexible type parameters'],
        ['rust-i-4', 'Trait Objects', 'Dynamic dispatch with dyn'],
        ['rust-i-5', 'Closures', 'Anonymous functions and captures'],
        ['rust-i-6', 'Iterators', 'Lazy evaluation chains'],
        ['rust-i-7', 'Smart Pointers', 'Box, Rc, RefCell'],
        ['rust-i-8', 'Concurrency', 'Threads and message passing'],
        ['rust-i-9', 'Async/Await', 'Futures and async runtimes'],
        ['rust-i-10', 'Unsafe Rust', 'Raw pointers and FFI'],
        ['rust-i-11', 'Macros', 'Declarative macro_rules!'],
        ['rust-i-12', 'Mini Project: Web Server', 'HTTP server with Tokio']
    ]),

    _c('php-beginner', '🐘', 'PHP', 'Beginner', 'The language that powers WordPress and 77% of the web. Server-side fundamentals.', 'Beginner', '6 hours', 'Web Development', '#777BB4', [
        ['php-b-1', 'Hello, World!', 'Running PHP scripts'],
        ['php-b-2', 'Variables & Data Types', '$variables and type juggling'],
        ['php-b-3', 'Strings', 'Concatenation and interpolation'],
        ['php-b-4', 'Operators', 'Arithmetic, comparison, logical'],
        ['php-b-5', 'If/Else & Switch', 'PHP control structures'],
        ['php-b-6', 'Loops', 'for, foreach, while'],
        ['php-b-7', 'Arrays', 'Indexed and associative'],
        ['php-b-8', 'Functions', 'User-defined functions'],
        ['php-b-9', 'Superglobals', '$_GET, $_POST, $_SESSION'],
        ['php-b-10', 'Forms & PHP', 'Processing HTML forms'],
        ['php-b-11', 'Include & Require', 'Combining PHP files'],
        ['php-b-12', 'Mini Project: Guestbook', 'Form-based guestbook']
    ]),

    _c('ruby-beginner', '💎', 'Ruby', 'Beginner', 'Elegant, readable, and fun. The language behind Rails and scripting magic.', 'Beginner', '6 hours', 'General Purpose', '#CC342D', [
        ['ruby-b-1', 'Hello, World!', 'Running Ruby scripts'],
        ['ruby-b-2', 'Variables & Types', 'Symbols, strings, numbers'],
        ['ruby-b-3', 'Methods', 'def, parameters, return'],
        ['ruby-b-4', 'If/Unless/Case', 'Ruby\'s expressive conditionals'],
        ['ruby-b-5', 'Loops & Iterators', '.each, .times, .map'],
        ['ruby-b-6', 'Arrays', 'Collections and methods'],
        ['ruby-b-7', 'Hashes', 'Key-value pairs'],
        ['ruby-b-8', 'Blocks & Procs', 'Code blocks and closures'],
        ['ruby-b-9', 'Classes & Objects', 'OOP the Ruby way'],
        ['ruby-b-10', 'String Methods', 'Powerful text manipulation'],
        ['ruby-b-11', 'File I/O', 'Reading and writing files'],
        ['ruby-b-12', 'Mini Project: CLI App', 'Interactive command-line tool']
    ]),

    _c('swift-beginner', '📱', 'Swift', 'Beginner', 'Apple\'s modern language for iOS, macOS, and app development.', 'Beginner', '6 hours', 'Mobile', '#FA7343', [
        ['swift-b-1', 'Hello, World!', 'Setting up Swift and playgrounds'],
        ['swift-b-2', 'Variables & Constants', 'var vs let'],
        ['swift-b-3', 'Data Types', 'String, Int, Double, Bool'],
        ['swift-b-4', 'Operators', 'Arithmetic and comparison'],
        ['swift-b-5', 'If/Else & Switch', 'Control flow with where clauses'],
        ['swift-b-6', 'Loops', 'for-in, while, repeat-while'],
        ['swift-b-7', 'Arrays & Dictionaries', 'Collections in Swift'],
        ['swift-b-8', 'Functions', 'Parameters, return, labels'],
        ['swift-b-9', 'Optionals', 'Handling missing values'],
        ['swift-b-10', 'Classes & Structs', 'Reference vs value types'],
        ['swift-b-11', 'Enums', 'Enumerations with associated values'],
        ['swift-b-12', 'Mini Project: Simple App', 'Basic iOS app prototype']
    ]),

    _c('kotlin-beginner', '🇰', 'Kotlin', 'Beginner', 'Google\'s preferred language for Android. Modern, concise, and null-safe.', 'Beginner', '6 hours', 'Mobile', '#7F52FF', [
        ['kt-b-1', 'Hello, World!', 'Kotlin setup and first program'],
        ['kt-b-2', 'Variables', 'val vs var, type inference'],
        ['kt-b-3', 'Data Types', 'String, Int, Double, Boolean'],
        ['kt-b-4', 'Functions', 'Named parameters, defaults'],
        ['kt-b-5', 'If/When', 'Expression-based conditionals'],
        ['kt-b-6', 'Loops', 'for, while, ranges'],
        ['kt-b-7', 'Null Safety', '?., ?:, !! operators'],
        ['kt-b-8', 'Lists & Maps', 'Immutable and mutable collections'],
        ['kt-b-9', 'Classes & Objects', 'Kotlin OOP basics'],
        ['kt-b-10', 'Data Classes', 'Auto-generated equals, hashCode'],
        ['kt-b-11', 'Lambdas & Higher-Order Functions', 'Functional Kotlin'],
        ['kt-b-12', 'Mini Project: Android App', 'Basic Android UI']
    ]),

    _c('sql-beginner', '🗄️', 'SQL', 'Beginner', 'The digital filing cabinet. Learn how tech giants like Netflix and Instagram organize and fetch billions of user profiles instantly.', 'Beginner', '6 hours', 'Data', '#4479A1', [
        ['sql-b-1', 'The World\'s Filing Cabinet', 'What databases are and why every app needs one'],
        ['sql-b-2', 'Asking the Cabinet (SELECT)', 'Pull exactly the data you need from massive tables'],
        ['sql-b-3', 'Filtering the Pile (WHERE)', 'Narrow down millions of rows to just the ones you want'],
        ['sql-b-4', 'Combining Filters (AND/OR)', 'Stack conditions to find the perfect records'],
        ['sql-b-5', 'Sorting & Limiting (ORDER BY)', 'Arrange results and grab just the top ones'],
        ['sql-b-6', 'Adding New Records (INSERT)', 'Create new entries — the "C" in CRUD'],
        ['sql-b-7', 'Changing What Exists (UPDATE)', 'Modify data without breaking anything'],
        ['sql-b-8', 'Deleting Records (DELETE)', 'Remove what you don\'t need cleanly'],
        ['sql-b-9', 'Designing Your Cabinet (CREATE TABLE)', 'Build the schema that holds your data'],
        ['sql-b-10', 'Data Types: Choosing the Right Box', 'INT, VARCHAR, DATE — match data to its container'],
        ['sql-b-11', 'Math on Your Data (Aggregates)', 'COUNT, SUM, AVG — stats on millions of rows in seconds'],
        ['sql-b-12', 'Grouping Data (GROUP BY)', 'Organize results into meaningful buckets'],
        ['sql-b-13', 'Connecting Tables (JOINs)', 'Link related data across multiple tables'],
        ['sql-b-14', 'Mini Project: E-Commerce DB', 'Design a complete database from scratch']
    ]),

    _c('data-science', '📊', 'Data Science', 'Beginner', 'Python-powered data analysis, visualization, and machine learning foundations.', 'Beginner', '10 hours', 'Data', '#FF6F00', [
        ['ds-b-1', 'Python for Data Science', 'Setting up your environment'],
        ['ds-b-2', 'NumPy Basics', 'Arrays and mathematical operations'],
        ['ds-b-3', 'Pandas: DataFrames', 'Loading and exploring data'],
        ['ds-b-4', 'Data Cleaning', 'Handling missing values and duplicates'],
        ['ds-b-5', 'Data Selection', 'Filtering rows and columns'],
        ['ds-b-6', 'Grouping & Aggregation', 'GroupBy and pivot tables'],
        ['ds-b-7', 'Matplotlib Basics', 'Line, bar, and scatter plots'],
        ['ds-b-8', 'Seaborn Statistical Plots', 'Heatmaps, boxplots, distributions'],
        ['ds-b-9', 'Data Types & Conversions', 'Working with dates and categories'],
        ['ds-b-10', 'Correlation & Relationships', 'Finding patterns in data'],
        ['ds-b-11', 'Intro to Machine Learning', 'Scikit-learn and basic models'],
        ['ds-b-12', 'Mini Project: Analysis', 'Analyze a real-world dataset']
    ]),

    _c('git-github', '🔀', 'Git & GitHub', 'Beginner', 'Version control essentials. Track changes, collaborate, and manage code like a pro.', 'Beginner', '4 hours', 'Tools', '#F05032', [
        ['git-b-1', 'What is Version Control?', 'Why Git matters'],
        ['git-b-2', 'git init & git add', 'Starting a repository'],
        ['git-b-3', 'git commit', 'Saving snapshots of your work'],
        ['git-b-4', 'git status & git log', 'Tracking changes'],
        ['git-b-5', 'Branches', 'Parallel lines of development'],
        ['git-b-6', 'git merge', 'Combining branches'],
        ['git-b-7', 'Merge Conflicts', 'Resolving code conflicts'],
        ['git-b-8', 'GitHub Basics', 'Creating repositories online'],
        ['git-b-9', 'git push & git pull', 'Syncing local and remote'],
        ['git-b-10', 'Pull Requests', 'Code review workflow'],
        ['git-b-11', '.gitignore', 'Excluding files from tracking'],
        ['git-b-12', 'Mini Project: Open Source', 'Contribute to a repository']
    ]),

    _c('linux-cli', '🐧', 'Linux & CLI', 'Beginner', 'Master the terminal. Navigation, permissions, scripting, and server management.', 'Beginner', '6 hours', 'Tools', '#333333', [
        ['linux-b-1', 'The Terminal', 'Why and how to use it'],
        ['linux-b-2', 'Navigating Files', 'cd, ls, pwd'],
        ['linux-b-3', 'Creating & Moving', 'mkdir, mv, cp, rm'],
        ['linux-b-4', 'Viewing Files', 'cat, less, head, tail'],
        ['linux-b-5', 'Permissions', 'chmod, chown, and access rights'],
        ['linux-b-6', 'Piping & Redirection', '|, >, >>, < operators'],
        ['linux-b-7', 'Finding Files', 'find and locate commands'],
        ['linux-b-8', 'Text Processing', 'grep, sed, awk basics'],
        ['linux-b-9', 'Processes', 'ps, top, kill, background jobs'],
        ['linux-b-10', 'Package Managers', 'apt, yum, pacman'],
        ['linux-b-11', 'Shell Scripting Basics', 'Writing your first .sh scripts'],
        ['linux-b-12', 'Mini Project: System Monitor', 'Shell script dashboard']
    ])
]

function groupCoursesByLanguage(courses) {
    const groups = {}
    for (const c of courses) {
        const key = c.title
        if (!groups[key]) {
            groups[key] = { title: key, icon: c.icon, color: c.color, category: c.category, courses: [] }
        }
        groups[key].courses.push(c)
    }
    return Object.values(groups)
}

const THUMBNAILS = {
    'Python': 'https://i.postimg.cc/GB1kH38t/Chat-GPT-Image-Jul-15-2026-11-31-06-AM-(1).png',
    'JavaScript': 'https://i.postimg.cc/JDxcwwhR/Jul-15-2026-11-52-23-AM.png',
    'Java': 'https://i.postimg.cc/D88QNM32/Chat-GPT-Image-Jul-15-2026-11-55-49-AM.png',
    'C': 'https://i.postimg.cc/ZCCPQMz0/Chat-GPT-Image-Jul-15-2026-11-57-45-AM.png',
    'C++': 'https://i.postimg.cc/gnny7TbJ/Chat-GPT-Image-Jul-15-2026-11-59-52-AM.png',
    'HTML & CSS Essentials': 'https://i.postimg.cc/mtt3n5Wk/Chat-GPT-Image-Jul-15-2026-12-01-33-PM.png',
    'Go': 'https://i.postimg.cc/dLpRcjJG/Chat-GPT-Image-Jul-15-2026-12-10-04-PM.png',
    'Rust': 'https://i.postimg.cc/6ygVxfBL/Chat-GPT-Image-Jul-15-2026-12-06-48-PM.png',
    'PHP': 'https://i.postimg.cc/dLpRcjJG/Chat-GPT-Image-Jul-15-2026-12-10-04-PM.png',
    'Ruby': 'https://i.postimg.cc/HVR019Tv/Chat-GPT-Image-Jul-15-2026-12-12-30-PM.png',
    'Swift': 'https://i.postimg.cc/3kGX80wj/Chat-GPT-Image-Jul-15-2026-12-14-37-PM.png',
    'Kotlin': 'https://i.postimg.cc/9D9dmwfb/Chat-GPT-Image-Jul-15-2026-12-17-55-PM.png',
    'SQL': 'https://i.postimg.cc/yDRm13Nb/Chat-GPT-Image-Jul-15-2026-12-20-43-PM.png',
    'Data Science': 'https://i.postimg.cc/Sn96SYsm/Chat-GPT-Image-Jul-15-2026-12-23-18-PM.png',
    'Git & GitHub': 'https://i.postimg.cc/FYSyrkRr/Chat-GPT-Image-Jul-15-2026-12-25-49-PM.png',
    'Linux & CLI': 'https://i.postimg.cc/WDPMhpFs/Chat-GPT-Image-Jul-15-2026-12-28-19-PM.png'
}
