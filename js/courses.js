const COURSES = [
    {
        id: 'python', icon: '🐍', title: 'Python',
        subtitle: 'Beginner to Intermediate',
        desc: 'The most popular language for beginners. Used in web dev, AI, data science, and automation.',
        difficulty: 'Beginner', duration: '3 hours', category: 'General Purpose',
        color: '#3776AB', popular: true, rating: 4.8,
        lessons: [
            {
                id: 'py-1', title: 'Hello, World!', icon: '🌍',
                desc: 'Your first Python program',
                concepts: [
                    { title: 'What is print()?',
                        text: 'print() is a built-in Python function that displays text on the screen. Anything inside the parentheses gets shown to you.',
                        code: 'print("Hello, World!")\nprint("Welcome to K-VOID!")\nprint("I am learning Python!")',
                        classwork: 'Open Termux, type `python3`, then type `print("K-VOID is awesome")` and press Enter. See what happens!' },
                    { title: 'Strings (text)',
                        text: 'Text in Python is called a "string". You put it inside quotes — single (\') or double (") both work.',
                        code: "print('Single quotes work too')\nprint(\"Double quotes are fine\")\nprint(\"You can use both!\")",
                        classwork: 'Print your name and your favorite food in two separate print() statements.' }
                ],
                summary: ['print() shows text on the screen', 'Text goes inside quotes called "strings"', 'You can use single or double quotes'],
                quiz: { q: 'What does print() do?', options: ['Reads input', 'Displays text', 'Calculates math', 'Saves a file'], answer: 1, explanation: 'print() outputs text to the screen.' }
            },
            {
                id: 'py-2', title: 'Variables', icon: '📦',
                desc: 'Storing data in boxes',
                concepts: [
                    { title: 'What is a variable?',
                        text: 'A variable is like a labeled box where you store a value. Python figures out the type automatically.',
                        code: 'name = "K-VOID"\nyear = 2024\nprice = 9.99\nprint(name)\nprint(year)\nprint(price)',
                        classwork: 'Create a variable called `city` with your city name, and `population` with a number. Print both.' },
                    { title: 'Variable naming rules',
                        text: 'Use letters, numbers, and underscores. Must start with a letter or underscore. No spaces. Case-sensitive.',
                        code: 'my_name = "Alice"\nmy_name2 = "Bob"\n_user = "Charlie"\nprint(my_name, my_name2, _user)',
                        classwork: 'Try creating a variable with a number at the start like `1name = "test"`. See the error?' }
                ],
                summary: ['Variables store values in memory', 'Python detects the type automatically', 'Names: letters, numbers, underscore — no spaces, no starting with a number'],
                quiz: { q: 'Which variable name is INVALID?', options: ['my_var', '_count', '2nd_place', 'userName'], answer: 2, explanation: 'Variable names cannot start with a number.' }
            },
            {
                id: 'py-3', title: 'If/Else', icon: '🔀',
                desc: 'Making decisions',
                concepts: [
                    { title: 'The if statement',
                        text: 'if checks a condition. If it\'s True, the indented code runs. Colon (:) at the end is required.',
                        code: 'age = 18\nif age >= 18:\n    print("You can vote!")',
                        classwork: 'Change age to 15 and run again. Notice nothing prints?' },
                    { title: 'Adding else and elif',
                        text: 'else runs when if is False. elif = "else if" — checks another condition.',
                        code: 'score = 75\nif score >= 90:\n    print("A")\nelif score >= 70:\n    print("B")\nelse:\n    print("C or lower")',
                        classwork: 'Change score to 95, then to 60. Run each time and watch the output change.' }
                ],
                summary: ['if checks a condition (True/False)', 'Use elif for extra conditions', 'else catches everything else', 'Indentation matters!'],
                quiz: { q: 'What goes at the end of an if line?', options: [';', ':', '.', ','], answer: 1, explanation: 'A colon (:) is required after the condition.' }
            },
            {
                id: 'py-4', title: 'Loops', icon: '🔄',
                desc: 'Repeat without copying code',
                concepts: [
                    { title: 'For loops',
                        text: 'A for loop goes through each item in a list or range. range(n) gives 0 to n-1.',
                        code: 'for i in range(5):\n    print(f"Count: {i}")',
                        classwork: 'Change range(5) to range(10). Then try range(2, 7). What happens?' },
                    { title: 'Looping over a list',
                        text: 'You can loop directly through items instead of numbers.',
                        code: 'fruits = ["apple", "banana", "mango"]\nfor fruit in fruits:\n    print(f"I love {fruit}")',
                        classwork: 'Create your own list of 4 favorite movies and loop through them with print().' }
                ],
                summary: ['for loops repeat code for each item', 'range(n) generates 0 to n-1', 'You can loop through any list'],
                quiz: { q: 'What does range(3) produce?', options: ['1,2,3', '0,1,2,3', '0,1,2', '1,2'], answer: 2, explanation: 'range(3) gives 0, 1, 2 — that\'s 3 numbers starting from 0.' }
            },
            {
                id: 'py-5', title: 'Functions', icon: '🔧',
                desc: 'Write once, use many times',
                concepts: [
                    { title: 'Defining a function',
                        text: 'Use def to create a function. Functions group code so you can call it anytime.',
                        code: 'def greet():\n    print("Hello from K-VOID!")\ngreet()\ngreet()',
                        classwork: 'Write a function called `announce()` that prints "New lesson starting!" Call it 3 times.' },
                    { title: 'Parameters & return',
                        text: 'Parameters let you pass data in. return sends data back out.',
                        code: 'def add(a, b):\n    return a + b\n\ndef square(n):\n    return n * n\n\nresult = add(5, 3)\nprint(result)\nprint(square(4))',
                        classwork: 'Write a function `multiply(x, y)` that returns x * y. Call it with 6 and 7.' }
                ],
                summary: ['def creates a reusable function', 'Parameters = inputs', 'return sends a value back'],
                quiz: { q: 'What keyword defines a function?', options: ['func', 'define', 'def', 'function'], answer: 2, explanation: 'def is Python\'s keyword for defining functions.' }
            }
        ]
    },
    {
        id: 'javascript', icon: '🟨', title: 'JavaScript',
        subtitle: 'Web Development',
        desc: 'The language of the web. Makes websites interactive and dynamic.',
        difficulty: 'Beginner', duration: '2 hours', category: 'Web Development',
        color: '#F7DF1E', popular: true, rating: 4.7,
        lessons: [
            {
                id: 'js-1', title: 'Hello, JS!', icon: '🌍',
                desc: 'Your first JavaScript program',
                concepts: [
                    { title: 'console.log',
                        text: 'console.log() prints to the browser\'s developer console. It\'s the JS version of print().',
                        code: 'console.log("Hello, World!")\nconsole.log("Welcome to K-VOID!")\nconsole.log("JavaScript is running!");',
                        classwork: 'Open any website, press F12, go to Console tab. Type `console.log("Hi from K-VOID!")` and press Enter.' },
                    { title: 'Comments',
                        text: 'Comments are notes in your code that JavaScript ignores. Use // for single line.',
                        code: '// This is a comment\nconsole.log("This runs!");\n// console.log("This won\'t run");',
                        classwork: 'Write a comment with your name, then a console.log() with your age.' }
                ],
                summary: ['console.log() prints to the console', 'Comments start with //', 'Use F12 to open dev tools'],
                quiz: { q: 'How do you print to the JS console?', options: ['print()', 'console.log()', 'log()', 'echo()'], answer: 1, explanation: 'console.log() is the standard way to output in JavaScript.' }
            },
            {
                id: 'js-2', title: 'Variables: let & const', icon: '📦',
                desc: 'Storing values in JS',
                concepts: [
                    { title: 'let — can change',
                        text: 'let declares a variable that can be reassigned later. Use for values that will change.',
                        code: 'let name = "K-VOID"\nconsole.log(name)\nname = "Programming Hub"\nconsole.log(name)',
                        classwork: 'Create a let variable called `score` with value 0. Change it to 10 and log it.' },
                    { title: 'const — stays the same',
                        text: 'const cannot be reassigned. Use it for values that shouldn\'t change.',
                        code: 'const birthYear = 2024\nconsole.log(birthYear)\n// birthYear = 2025  // Error!',
                        classwork: 'Try reassigning a const variable and see the error in the console.' }
                ],
                summary: ['let = value can change', 'const = value stays the same', 'Always prefer const unless the value needs to change'],
                quiz: { q: 'Which keyword prevents reassignment?', options: ['let', 'var', 'const', 'static'], answer: 2, explanation: 'const cannot be reassigned after its initial declaration.' }
            },
            {
                id: 'js-3', title: 'Functions', icon: '🔧',
                desc: 'Reusable code blocks',
                concepts: [
                    { title: 'Regular functions',
                        text: 'Use the function keyword. Functions can take parameters and return values.',
                        code: 'function greet(name) {\n    return "Hello, " + name + "!"\n}\nconsole.log(greet("K-VOID"))',
                        classwork: 'Write a function `double(n)` that returns n * 2. Call it with 5 and log the result.' },
                    { title: 'Arrow functions (modern)',
                        text: 'Arrow functions are shorter. () => instead of function().',
                        code: 'const add = (a, b) => a + b\nconst square = n => n * n\nconsole.log(add(3, 4))\nconsole.log(square(5))',
                        classwork: 'Rewrite your `double` function as an arrow function.' }
                ],
                summary: ['function keyword creates regular functions', 'Arrow functions with => are shorter', 'Parameters pass data in, return sends data out'],
                quiz: { q: 'What symbol do arrow functions use?', options: ['->', '=>', '->>', '|>'], answer: 1, explanation: 'Arrow functions use the => syntax.' }
            }
        ]
    },
    {
        id: 'html-css', icon: '🌐', title: 'HTML & CSS',
        subtitle: 'Web Design Basics',
        desc: 'Build beautiful websites. HTML gives structure, CSS adds style.',
        difficulty: 'Beginner', duration: '2 hours', category: 'Web Development',
        color: '#E34F26', popular: true, rating: 4.6,
        lessons: [
            {
                id: 'hc-1', title: 'HTML Structure', icon: '🏗️',
                desc: 'The skeleton of every webpage',
                concepts: [
                    { title: 'Tags & Elements',
                        text: 'HTML uses tags like <tagname>content</tagname>. Most tags have opening and closing parts.',
                        code: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Hello, K-VOID!</h1>\n    <p>This is a paragraph.</p>\n</body>\n</html>',
                        classwork: 'Open a text editor (Termux: `nano test.html`). Type the code above, open in browser.' },
                    { title: 'Common tags',
                        text: 'h1-h6 = headings, p = paragraph, a = link, img = image, ul/li = lists.',
                        code: '<h1>Big Heading</h1>\n<h2>Smaller</h2>\n<p>This is a paragraph with\na <a href="https://google.com">link</a>.</p>\n<ul>\n    <li>Item 1</li>\n    <li>Item 2</li>\n</ul>',
                        classwork: 'Add an image tag `<img src="https://via.placeholder.com/100" alt="test">` to your page.' }
                ],
                summary: ['HTML uses tags like <tag>content</tag>', 'h1-h6 are headings', 'a tags create links'],
                quiz: { q: 'Which tag is the biggest heading?', options: ['<h6>', '<h1>', '<heading>', '<big>'], answer: 1, explanation: '<h1> is the largest heading.' }
            },
            {
                id: 'hc-2', title: 'CSS Basics', icon: '🎨',
                desc: 'Adding style to HTML',
                concepts: [
                    { title: 'How CSS works',
                        text: 'CSS targets HTML elements and styles them. selector { property: value; }',
                        code: 'h1 {\n    color: purple;\n    text-align: center;\n}\np {\n    font-size: 18px;\n    color: #333;\n}',
                        classwork: 'Add a `<style>` tag in your HTML head. Make h1 green.' },
                    { title: 'Classes & IDs',
                        text: 'Classes (.classname) group elements. IDs (#idname) target ONE specific element.',
                        code: '<style>\n.special { color: gold; background: #222; padding: 10px; }\n#main-title { font-size: 32px; border-bottom: 2px solid blue; }\n</style>\n<h1 id="main-title">K-VOID</h1>\n<p class="special">This is special!</p>\n<p class="special">This too!</p>',
                        classwork: 'Create a class called `.card` with border, padding, and margin. Apply to 3 divs.' }
                ],
                summary: ['CSS styles HTML using selectors and rules', 'Classes = .name (reusable)', 'IDs = #name (one per page)'],
                quiz: { q: 'What symbol targets a class in CSS?', options: ['#', '.', '!', '@'], answer: 1, explanation: 'A dot (.) targets classes, hash (#) targets IDs.' }
            }
        ]
    },
    {
        id: 'java', icon: '☕', title: 'Java',
        subtitle: 'Object-Oriented Programming',
        desc: 'One of the most widely-used languages. Powers Android apps and enterprise software.',
        difficulty: 'Intermediate', duration: '3 hours', category: 'General Purpose',
        color: '#ED8B00', popular: true, rating: 4.5,
        lessons: [
            {
                id: 'jv-1', title: 'Hello, Java!', icon: '🌍',
                desc: 'Getting started',
                concepts: [
                    { title: 'Class & main method',
                        text: 'Every Java program needs a class and a main() method. The program starts in main().',
                        code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, K-VOID!");\n    }\n}',
                        classwork: 'Save as Main.java. In Termux: `javac Main.java` then `java Main`.' },
                    { title: 'System.out.println',
                        text: 'System.out.println() prints text and moves to the next line.',
                        code: 'System.out.println("Welcome");\nSystem.out.println("Count: " + 42);',
                        classwork: 'Print "I love " + "Java" using the + operator.' }
                ],
                summary: ['Every Java app needs a class with main()', 'System.out.println() prints output', 'Save filename = classname.java'],
                quiz: { q: 'What is the entry point of a Java program?', options: ['start()', 'main()', 'run()', 'begin()'], answer: 1, explanation: 'The main() method is the entry point.' }
            },
            {
                id: 'jv-2', title: 'Variables & Types', icon: '📦',
                desc: 'Strong typing in Java',
                concepts: [
                    { title: 'Declaring variables',
                        text: 'Java requires you to state the TYPE. int = whole numbers, String = text, double = decimals, boolean = true/false.',
                        code: 'int age = 20;\nString name = "K-VOID";\ndouble price = 19.99;\nboolean isFun = true;\nSystem.out.println(name + " is " + age);',
                        classwork: 'Declare a double for height and a boolean for if you like coding. Print them.' }
                ],
                summary: ['Java is statically typed', 'int, String, double, boolean are common types', 'Variables must be declared before use'],
                quiz: { q: 'Which type stores whole numbers in Java?', options: ['float', 'String', 'int', 'char'], answer: 2, explanation: 'int is for whole numbers (integers).' }
            }
        ]
    },
    {
        id: 'cpp', icon: '⚙️', title: 'C++',
        subtitle: 'Performance & Systems',
        desc: 'Fast and powerful. Used in game dev, operating systems, and high-performance apps.',
        difficulty: 'Intermediate', duration: '2 hours', category: 'Systems',
        color: '#00599C', rating: 4.4,
        lessons: [
            {
                id: 'cpp-1', title: 'Hello, C++!', icon: '🌍',
                desc: 'Your first C++ program',
                concepts: [
                    { title: 'iostream & cout',
                        text: '#include <iostream> lets you use cout for output.',
                        code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, K-VOID!" << endl;\n    cout << "C++ is powerful!";\n    return 0;\n}',
                        classwork: 'Change the message and add a third cout line.' }
                ],
                summary: ['#include <iostream> for input/output', 'cout << "text" prints text', 'endl adds a new line', 'return 0; ends the program'],
                quiz: { q: 'What is cout used for?', options: ['Input', 'Output', 'Math', 'Loops'], answer: 1, explanation: 'cout sends output to the screen.' }
            },
            {
                id: 'cpp-2', title: 'Variables & Input', icon: '⌨️',
                desc: 'Getting user input',
                concepts: [
                    { title: 'cin for input',
                        text: 'cin >> variable reads user input.',
                        code: 'string name;\nint age;\ncout << "Enter name: ";\ncin >> name;\ncout << "Enter age: ";\ncin >> age;\ncout << "Hello " << name << "!";',
                        classwork: 'Add a third variable for your favorite language.' }
                ],
                summary: ['cin >> reads user input', 'Works with strings, ints, etc.', 'cout << outputs variables'],
                quiz: { q: 'What operator does cin use?', options: ['<<', '>>', '->', '::'], answer: 1, explanation: 'cin uses >> (extraction operator).' }
            }
        ]
    },
    {
        id: 'go', icon: '🔵', title: 'Go (Golang)',
        subtitle: 'Modern & Simple',
        desc: 'Built by Google. Simple syntax, fast compilation, great for servers and cloud apps.',
        difficulty: 'Intermediate', duration: '2 hours', category: 'Systems',
        color: '#00ADD8', rating: 4.3,
        lessons: [
            {
                id: 'go-1', title: 'Hello, Go!', icon: '🌍',
                desc: 'Getting started with Go',
                concepts: [
                    { title: 'Package & imports',
                        text: 'Every Go file starts with package main. import "fmt" brings in the formatting package.',
                        code: 'package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, K-VOID!")\n    fmt.Println("Go is simple!")\n}',
                        classwork: 'Install Go: `pkg install golang`, save as main.go, run `go run main.go`.' },
                    { title: 'Short declaration :=',
                        text: ':= declares a variable and infers the type.',
                        code: 'name := "K-VOID"\nyear := 2024\nversion := 1.0\nfmt.Println(name, year, version)',
                        classwork: 'Declare variables for your name and age using := and print them.' }
                ],
                summary: ['package main is required', 'import "fmt" for printing', ':= declares + assigns with type inference'],
                quiz: { q: 'What operator declares variables in Go?', options: ['=', ':=', '==', '=>'], answer: 1, explanation: ':= is the short declaration operator.' }
            }
        ]
    },
    {
        id: 'php', icon: '🐘', title: 'PHP',
        subtitle: 'Server-Side Web',
        desc: 'Powers most websites on the internet (WordPress, Facebook). Runs on servers.',
        difficulty: 'Beginner', duration: '1.5 hours', category: 'Web Development',
        color: '#777BB3', rating: 4.2,
        lessons: [
            {
                id: 'php-1', title: 'Hello, PHP!', icon: '🌍',
                desc: 'Your first PHP script',
                concepts: [
                    { title: 'PHP tags & echo',
                        text: 'PHP code goes inside <?php ?>. echo prints output. Variables start with $.',
                        code: '<?php\n$name = "K-VOID";\necho "Hello, " . $name . "!";\necho "<br>";\necho "PHP runs on the server!";\n?>',
                        classwork: 'Save as index.php. Run `php index.php` if PHP is installed.' },
                    { title: 'Variables & concatenation',
                        text: 'Dot (.) joins strings in PHP. Variables are interpolated inside double quotes.',
                        code: '$lang = "PHP";\n$year = 2024;\necho "I am learning $lang in $year!";\necho "<br>";\necho "String" . " " . "concatenation";',
                        classwork: 'Create variables for your name and a skill, echo a sentence.' }
                ],
                summary: ['PHP code in <?php ?> tags', 'echo prints output', 'Variables start with $', 'Dot (.) joins strings'],
                quiz: { q: 'What character starts a PHP variable?', options: ['@', '$', '&', '%'], answer: 1, explanation: 'All PHP variables start with $.' }
            }
        ]
    },
    {
        id: 'ruby', icon: '💎', title: 'Ruby',
        subtitle: 'Elegant & Productive',
        desc: 'Designed for developer happiness. Used in web dev (Ruby on Rails). Clean syntax.',
        difficulty: 'Beginner', duration: '1.5 hours', category: 'General Purpose',
        color: '#CC342D', rating: 4.1,
        lessons: [
            {
                id: 'rb-1', title: 'Hello, Ruby!', icon: '🌍',
                desc: 'Getting started with Ruby',
                concepts: [
                    { title: 'puts & variables',
                        text: 'puts prints text. Variables need no type declaration.',
                        code: 'name = "K-VOID"\nputs "Hello, #{name}!"\nputs "Ruby is elegant"\nlanguage = "Ruby"\nputs "Learning #{language}"',
                        classwork: 'Install Ruby: `pkg install ruby`. Save as test.rb, run `ruby test.rb`.' },
                    { title: 'String interpolation',
                        text: '#{variable} inside double quotes inserts the variable\'s value.',
                        code: 'user = "K-VOID"\npoints = 100\nputs "#{user} scored #{points} points!"',
                        classwork: 'Create variables for name and age, puts a sentence using interpolation.' }
                ],
                summary: ['puts prints to the screen', 'No type declarations needed', '#{var} inserts values into strings (double quotes only)'],
                quiz: { q: 'How do you insert a variable into a Ruby string?', options: ['${var}', '#{var}', '%{var}%', '{{var}}'], answer: 1, explanation: 'Ruby uses #{variable} for string interpolation.' }
            }
        ]
    },
    {
        id: 'rust', icon: '🦀', title: 'Rust',
        subtitle: 'Safe & Fast Systems',
        desc: 'Memory-safe without garbage collection. Used in browsers, OS, and CLI tools.',
        difficulty: 'Advanced', duration: '2 hours', category: 'Systems',
        color: '#DEA584', rating: 4.6,
        lessons: [
            {
                id: 'rs-1', title: 'Hello, Rust!', icon: '🌍',
                desc: 'Your first Rust program',
                concepts: [
                    { title: 'fn main & println!',
                        text: 'fn main() is the entry point. println! is a macro (note the !) that prints text.',
                        code: 'fn main() {\n    println!("Hello, K-VOID!");\n    println!("Rust is blazingly fast!");\n    println!("{} is learning Rust", "You");\n}',
                        classwork: 'Install Rust: `pkg install rust`. Save as main.rs, run `rustc main.rs && ./main`.' },
                    { title: 'Variables (immutable by default)',
                        text: 'Variables in Rust are immutable by default. Use let mut to make them mutable.',
                        code: 'let name = "K-VOID";\nlet mut score = 0;\nprintln!("Name: {name}");\nscore = 100;\nprintln!("Score: {score}");',
                        classwork: 'Try changing an immutable variable (without mut) and see the compiler error.' }
                ],
                summary: ['fn main() is the entry point', 'println! macro prints (note the !)', 'Variables are immutable by default', 'let mut makes them changeable'],
                quiz: { q: 'How do you make a variable mutable in Rust?', options: ['let var', 'let mut var', 'mut let var', 'var mut'], answer: 1, explanation: 'Add mut after let: let mut x = 5;' }
            }
        ]
    },
    {
        id: 'swift', icon: '🍎', title: 'Swift',
        subtitle: 'Apple Apps',
        desc: 'Apple\'s modern language for iOS, macOS, watchOS, and tvOS apps.',
        difficulty: 'Intermediate', duration: '1.5 hours', category: 'Mobile',
        color: '#F05138', rating: 4.3,
        lessons: [
            {
                id: 'sw-1', title: 'Hello, Swift!', icon: '🌍',
                desc: 'Getting started with Swift',
                concepts: [
                    { title: 'print & variables',
                        text: 'print() outputs text. var = changeable, let = constant.',
                        code: 'let name = "K-VOID"\nvar score = 0\nprint("Hello, \\(name)!")\nscore = 10\nprint("Score: \\(score)")',
                        classwork: 'If you have an iPhone, download "Playgrounds" app.' },
                    { title: 'Type safety',
                        text: 'Swift is strongly typed. Use type annotation if needed.',
                        code: 'let language: String = "Swift"\nlet version: Double = 5.9\nlet year = 2024\nprint(language, version, year)',
                        classwork: 'Declare a constant with type annotation `: Double` and a variable with `: Bool`.' }
                ],
                summary: ['let = constant', 'var = variable', 'Swift is type-safe', 'print() for output'],
                quiz: { q: 'Which keyword creates a constant in Swift?', options: ['const', 'let', 'var', 'static'], answer: 1, explanation: 'let declares a constant.' }
            }
        ]
    },
    {
        id: 'kotlin', icon: '📱', title: 'Kotlin',
        subtitle: 'Modern JVM & Android',
        desc: 'Google\'s preferred language for Android development. Concise, safe, Java-compatible.',
        difficulty: 'Intermediate', duration: '1.5 hours', category: 'Mobile',
        color: '#7F52FF', rating: 4.4,
        lessons: [
            {
                id: 'kt-1', title: 'Hello, Kotlin!', icon: '🌍',
                desc: 'Your first Kotlin program',
                concepts: [
                    { title: 'fun main & println',
                        text: 'fun main() is the entry point. println() prints. val = read-only, var = mutable.',
                        code: 'fun main() {\n    val name = "K-VOID"\n    var count = 0\n    println("Hello, $name!")\n    count++\n    println("Count: $count")\n}',
                        classwork: 'Use an online Kotlin compiler (kotlinlang.org).' },
                    { title: 'String templates',
                        text: 'Use $variable or ${expression} inside strings.',
                        code: 'val user = "K-VOID"\nval points = 42\nprintln("User: $user, Points: $points")\nprintln("Double: ${points * 2}")',
                        classwork: 'Create val for name and var for age. Print using templates.' }
                ],
                summary: ['fun main() is the entry point', 'val = read-only, var = mutable', '$variable inserts values'],
                quiz: { q: 'Which keyword creates a read-only variable in Kotlin?', options: ['val', 'var', 'let', 'const'], answer: 0, explanation: 'val creates an immutable reference.' }
            }
        ]
    },
    {
        id: 'sql', icon: '🗄️', title: 'SQL',
        subtitle: 'Database Queries',
        desc: 'The language of databases. Store, query, and manipulate data. Essential for backend dev.',
        difficulty: 'Intermediate', duration: '2 hours', category: 'Data',
        color: '#336791', rating: 4.5,
        lessons: [
            {
                id: 'sql-1', title: 'SELECT & FROM', icon: '🔍',
                desc: 'Reading data from a database',
                concepts: [
                    { title: 'What is SQL?',
                        text: 'SQL retrieves data. SELECT specifies columns, FROM specifies the table.',
                        code: '-- Get all columns\nSELECT * FROM users;\n\n-- Get only name and email\nSELECT name, email FROM users;\n\n-- Filter\nSELECT * FROM users WHERE age > 18;',
                        classwork: 'Imagine a "products" table. Write a SELECT for names where stock > 0.' },
                    { title: 'WHERE & ORDER BY',
                        text: 'WHERE filters. ORDER BY sorts. AND/OR combine conditions.',
                        code: 'SELECT name, price\nFROM products\nWHERE price < 100 AND stock > 0\nORDER BY price DESC;',
                        classwork: 'Get all students where grade = "A", sorted by name.' }
                ],
                summary: ['SELECT column FROM table reads data', 'WHERE filters rows', 'ORDER BY sorts results', '* = all columns'],
                quiz: { q: 'Which keyword filters results in SQL?', options: ['WHERE', 'FILTER', 'IF', 'HAVING'], answer: 0, explanation: 'WHERE is the primary clause for filtering rows.' }
            },
            {
                id: 'sql-2', title: 'INSERT & UPDATE', icon: '✏️',
                desc: 'Adding and changing data',
                concepts: [
                    { title: 'INSERT new rows',
                        text: 'INSERT INTO adds new rows. VALUES specifies the data.',
                        code: "INSERT INTO users (name, email, age)\nVALUES ('K-VOID', 'hello@kvoid.com', 20);\n\nINSERT INTO products (name, price)\nVALUES ('Course', 0.00);",
                        classwork: 'Write an INSERT into a "posts" table with title, content, author_id.' },
                    { title: 'UPDATE existing rows',
                        text: 'UPDATE changes existing data. Always use WHERE or you\'ll update EVERY row!',
                        code: "UPDATE users\nSET age = 21\nWHERE name = 'K-VOID';\n\nUPDATE products\nSET price = 9.99\nWHERE price = 0;",
                        classwork: 'Write an UPDATE that raises all prices by 10%.' }
                ],
                summary: ['INSERT INTO adds new rows', 'UPDATE SET changes existing rows', 'ALWAYS use WHERE with UPDATE'],
                quiz: { q: 'What happens if you UPDATE without WHERE?', options: ['Nothing', 'Updates first row', 'Updates ALL rows', 'Error'], answer: 2, explanation: 'UPDATE without WHERE applies to every row.' }
            }
        ]
    }
]
