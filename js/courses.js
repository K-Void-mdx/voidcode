const COURSES = [
    {
        id: 'python',
        icon: '🐍',
        title: 'Python',
        subtitle: 'Beginner to Intermediate',
        desc: 'The most popular language for beginners. Used in web dev, AI, data science, and automation.',
        color: '#3776AB',
        lessons: [
            {
                id: 'py-1',
                title: 'Hello, World!',
                desc: 'Your first Python program',
                content: `<p>Python is a powerful, easy-to-learn programming language. Let's start with the classic first program.</p>
<p>In Python, <code>print()</code> is a function that outputs text to the screen. Text inside quotes is called a <strong>string</strong>.</p>`,
                code: `print("Hello, World!")
print("Welcome to Python!")
print("Let's learn together 💪")`,
                quiz: {
                    q: 'What function do we use to display text in Python?',
                    options: ['output()', 'display()', 'print()', 'show()'],
                    answer: 2,
                    explanation: 'print() is the built-in Python function for displaying output.'
                }
            },
            {
                id: 'py-2',
                title: 'Variables & Data Types',
                desc: 'Storing values in Python',
                content: `<p>Variables store data. Python figures out the type automatically — you don't need to declare it.</p>
<p>Common types:</p>
<ul>
  <li><strong>int</strong> — whole numbers (e.g., <code>42</code>)</li>
  <li><strong>float</strong> — decimal numbers (e.g., <code>3.14</code>)</li>
  <li><strong>str</strong> — text (e.g., <code>"hello"</code>)</li>
  <li><strong>bool</strong> — True/False</li>
</ul>`,
                code: `name = "K-VOID"
age = 2024
pi = 3.14159
is_cool = True

print(name)
print(age + 1)
print(f"Pi is {pi}")`,
                quiz: {
                    q: 'What type is the value 3.14 in Python?',
                    options: ['int', 'float', 'str', 'double'],
                    answer: 1,
                    explanation: '3.14 has a decimal point, so Python treats it as a float.'
                }
            },
            {
                id: 'py-3',
                title: 'If Statements',
                desc: 'Making decisions in code',
                content: `<p>Conditional statements let your code make decisions based on conditions.</p>
<p>Use <code>if</code>, <code>elif</code>, and <code>else</code> to control the flow of your program.</p>`,
                code: `score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"Your grade is: {grade}")`,
                quiz: {
                    q: 'What does elif stand for?',
                    options: ['else if', 'element if', 'elevate if', 'else'],
                    answer: 0,
                    explanation: 'elif is Python\'s shorter way of saying "else if".'
                }
            },
            {
                id: 'py-4',
                title: 'Loops (For & While)',
                desc: 'Doing things repeatedly',
                content: `<p>Loops let you repeat code. Python has two main loops:</p>
<ul>
  <li><code>for</code> — loop through a sequence (list, range, string)</li>
  <li><code>while</code> — loop while a condition is True</li>
</ul>`,
                code: `# For loop
for i in range(5):
    print(f"Count: {i}")

# While loop
count = 0
while count < 3:
    print(f"While: {count}")
    count += 1

# Loop through a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I love {fruit}")`,
                quiz: {
                    q: 'What does range(5) generate?',
                    options: ['0,1,2,3,4,5', '0,1,2,3,4', '1,2,3,4,5', '1,2,3,4'],
                    answer: 1,
                    explanation: 'range(5) generates numbers 0 through 4 (5 numbers total).'
                }
            },
            {
                id: 'py-5',
                title: 'Functions',
                desc: 'Reusable blocks of code',
                content: `<p>Functions let you write code once and use it many times. Use <code>def</code> to define a function.</p>
<p>Functions can take <strong>parameters</strong> and <strong>return</strong> values.</p>`,
                code: `def greet(name):
    return f"Hello, {name}!"

def add(a, b):
    return a + b

def is_even(num):
    return num % 2 == 0

print(greet("K-VOID"))
print(add(10, 20))
print(is_even(7))`,
                quiz: {
                    q: 'Which keyword defines a function in Python?',
                    options: ['func', 'define', 'def', 'function'],
                    answer: 2,
                    explanation: 'def is the keyword used to define functions in Python.'
                }
            }
        ]
    },
    {
        id: 'javascript',
        icon: '🟨',
        title: 'JavaScript',
        subtitle: 'Web Development',
        desc: 'The language of the web. Makes websites interactive and dynamic.',
        color: '#F7DF1E',
        lessons: [
            {
                id: 'js-1',
                title: 'Hello, JavaScript!',
                desc: 'Your first JS program',
                content: `<p>JavaScript runs in the browser and makes web pages interactive. You can write JS directly in an HTML file or in a separate .js file.</p>
<p><code>console.log()</code> prints to the browser's developer console.</p>`,
                code: `console.log("Hello, World!");
console.log("Welcome to JavaScript!");

// This is a comment
alert("Welcome to K-VOID Hub!");`,
                quiz: {
                    q: 'How do you print to the console in JS?',
                    options: ['print()', 'console.log()', 'echo()', 'log()'],
                    answer: 1,
                    explanation: 'console.log() is the standard way to output to the browser console.'
                }
            },
            {
                id: 'js-2',
                title: 'Variables (let, const, var)',
                desc: 'Declaring variables in JS',
                content: `<p>JavaScript has three ways to declare variables:</p>
<ul>
  <li><code>let</code> — can be reassigned (use this most often)</li>
  <li><code>const</code> — cannot be reassigned (use for values that won't change)</li>
  <li><code>var</code> — old way, avoid using</li>
</ul>`,
                code: `let name = "K-VOID";
const birthYear = 2024;
var oldWay = "avoid this";

name = "Programming Hub";  // OK
// birthYear = 2025;  // Error! const can't change

console.log(name);
console.log(typeof name);  // "string"`,
                quiz: {
                    q: 'Which keyword creates a variable that cannot be reassigned?',
                    options: ['let', 'const', 'var', 'static'],
                    answer: 1,
                    explanation: 'const variables cannot be reassigned after declaration.'
                }
            },
            {
                id: 'js-3',
                title: 'Functions & Arrow Functions',
                desc: 'Writing reusable code',
                content: `<p>Functions are blocks of reusable code. JavaScript has two main syntaxes: regular functions and arrow functions.</p>`,
                code: `// Regular function
function greet(name) {
    return "Hello, " + name + "!";
}

// Arrow function (modern)
const greetArrow = (name) => {
    return \`Hello, \${name}!\`;
};

// Shorter arrow (implicit return)
const add = (a, b) => a + b;

console.log(greet("K-VOID"));
console.log(greetArrow("K-VOID"));
console.log(add(5, 3));`,
                quiz: {
                    q: 'What symbol is used for arrow functions?',
                    options: ['->', '=>', '->>', '==>'],
                    answer: 1,
                    explanation: 'Arrow functions use the => syntax (fat arrow).'
                }
            },
            {
                id: 'js-4',
                title: 'DOM Manipulation',
                desc: 'Changing HTML with JS',
                content: `<p>The DOM (Document Object Model) lets JavaScript change HTML elements on the page.</p>
<p>Use <code>document.querySelector()</code> to find elements and change their content, style, or behavior.</p>`,
                code: `// Find an element
const heading = document.querySelector('h1');

// Change its content
heading.textContent = "Hello K-VOID!";

// Change its style
heading.style.color = "purple";

// Add a click event
heading.addEventListener('click', () => {
    alert('You clicked the heading!');
});`,
                quiz: {
                    q: 'Which method finds an HTML element using a CSS selector?',
                    options: ['getElementById()', 'querySelector()', 'findElement()', 'select()'],
                    answer: 1,
                    explanation: 'querySelector() returns the first element matching a CSS selector.'
                }
            },
            {
                id: 'js-5',
                title: 'Arrays & Objects',
                desc: 'Organizing data',
                content: `<p>Arrays store ordered lists. Objects store key-value pairs. These are the two main data structures in JavaScript.</p>`,
                code: `// Array
const languages = ["Python", "JS", "Java"];
console.log(languages[0]);  // "Python"
console.log(languages.length);  // 3

// Object
const course = {
    title: "JavaScript",
    lessons: 5,
    isFree: true
};

console.log(course.title);
console.log(course["lessons"]);

// Array of objects
const students = [
    { name: "K-VOID", score: 100 },
    { name: "Dev", score: 95 }
];`,
                quiz: {
                    q: 'How do you access a property of an object?',
                    options: ['obj->prop', 'obj[prop]', 'obj.prop', 'Both B and C'],
                    answer: 3,
                    explanation: 'You can use dot notation (obj.prop) or bracket notation (obj["prop"]).'
                }
            }
        ]
    },
    {
        id: 'html-css',
        icon: '🌐',
        title: 'HTML & CSS',
        subtitle: 'Web Design Basics',
        desc: 'Build beautiful websites. HTML gives structure, CSS adds style.',
        color: '#E34F26',
        lessons: [
            {
                id: 'hc-1',
                title: 'HTML Structure',
                desc: 'The skeleton of every webpage',
                content: `<p>HTML (HyperText Markup Language) uses <strong>tags</strong> to structure content. Every page starts with <code>&lt;!DOCTYPE html&gt;</code>.</p>
<p>Common tags: <code>&lt;h1&gt;</code> to <code>&lt;h6&gt;</code> for headings, <code>&lt;p&gt;</code> for paragraphs, <code>&lt;a&gt;</code> for links.</p>`,
                code: `<!DOCTYPE html>
<html>
<head>
    <title>K-VOID Hub</title>
</head>
<body>
    <h1>Welcome to K-VOID</h1>
    <p>Learn to code for free!</p>
    <a href="https://k-void.vercel.app">Visit Us</a>
</body>
</html>`,
                quiz: {
                    q: 'Which tag is the largest heading?',
                    options: ['<heading>', '<h6>', '<h1>', '<head>'],
                    answer: 2,
                    explanation: '<h1> is the largest/most important heading tag.'
                }
            },
            {
                id: 'hc-2',
                title: 'CSS Basics',
                desc: 'Adding style to HTML',
                content: `<p>CSS (Cascading Style Sheets) makes your HTML look good. You can style colors, fonts, spacing, layout, and more.</p>
<p>Three ways to add CSS: inline, internal (&lt;style&gt;), or external (.css file).</p>`,
                code: `/* style.css */
body {
    font-family: Arial, sans-serif;
    background: #0a0a0f;
    color: white;
}

h1 {
    color: #7c3aed;
    text-align: center;
    font-size: 2.5rem;
}

.card {
    background: #12121a;
    border-radius: 12px;
    padding: 20px;
    margin: 10px;
}`,
                quiz: {
                    q: 'What does CSS stand for?',
                    options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets', 'Creative Style Sheets'],
                    answer: 1,
                    explanation: 'CSS stands for Cascading Style Sheets.'
                }
            },
            {
                id: 'hc-3',
                title: 'Flexbox Layout',
                desc: 'Creating responsive layouts',
                content: `<p>Flexbox makes it easy to arrange elements in rows or columns. It's perfect for responsive designs that work on all screen sizes.</p>`,
                code: `.container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
}

.item {
    background: #7c3aed;
    color: white;
    padding: 20px;
    border-radius: 10px;
    flex: 1;
    min-width: 200px;
    text-align: center;
}`,
                quiz: {
                    q: 'Which property turns an element into a flex container?',
                    options: ['position: flex', 'display: flex', 'flex: true', 'layout: flex'],
                    answer: 1,
                    explanation: 'display: flex; creates a flexbox container.'
                }
            },
            {
                id: 'hc-4',
                title: 'Responsive Design',
                desc: 'Works on all devices',
                content: `<p>Use <strong>media queries</strong> to make your site look great on phones, tablets, and desktops. The <code>@media</code> rule applies styles based on screen size.</p>`,
                code: `/* Default: desktop styles */
.grid { 
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}

/* Tablet */
@media (max-width: 768px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Phone */
@media (max-width: 480px) {
    .grid {
        grid-template-columns: 1fr;
    }
    body {
        font-size: 14px;
    }
}`,
                quiz: {
                    q: 'What does a media query do?',
                    options: ['Plays media files', 'Applies styles based on conditions', 'Queries a database', 'Loads images'],
                    answer: 1,
                    explanation: 'Media queries apply CSS rules based on conditions like screen width.'
                }
            },
            {
                id: 'hc-5',
                title: 'Forms & Buttons',
                desc: 'User input and interaction',
                content: `<p>Forms collect user input. Combine HTML form elements with CSS styling for beautiful, functional forms.</p>`,
                code: `<form class="signup-form">
    <label for="name">Name:</label>
    <input type="text" id="name" 
           placeholder="Enter your name">

    <label for="email">Email:</label>
    <input type="email" id="email"
           placeholder="you@example.com">

    <button type="submit">Join K-VOID</button>
</form>`,
                quiz: {
                    q: 'Which input type collects email addresses?',
                    options: ['text', 'email', 'url', 'password'],
                    answer: 1,
                    explanation: 'type="email" validates that the input is an email address format.'
                }
            }
        ]
    },
    {
        id: 'java',
        icon: '☕',
        title: 'Java',
        subtitle: 'Object-Oriented Programming',
        desc: 'One of the most widely-used languages. Powers Android apps, enterprise software, and more.',
        color: '#ED8B00',
        lessons: [
            {
                id: 'jv-1',
                title: 'Hello, Java!',
                desc: 'Getting started with Java',
                content: `<p>Java is a strongly-typed, object-oriented language. Every Java program must have a <code>main</code> method — this is where the program starts.</p>`,
                code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, K-VOID!");
        System.out.println("Welcome to Java!");
    }
}`,
                quiz: {
                    q: 'What is the entry point of a Java program?',
                    options: ['start()', 'main()', 'run()', 'begin()'],
                    answer: 1,
                    explanation: 'The main() method is the entry point of every Java application.'
                }
            },
            {
                id: 'jv-2',
                title: 'Variables & Types',
                desc: 'Strong typing in Java',
                content: `<p>Java requires you to declare the <strong>type</strong> of every variable. This is called <strong>static typing</strong> — the type cannot change.</p>`,
                code: `public class Types {
    public static void main(String[] args) {
        int age = 20;
        double price = 19.99;
        String name = "K-VOID";
        boolean isActive = true;
        
        System.out.println(name + " is " + age);
        System.out.println("Price: $" + price);
    }
}`,
                quiz: {
                    q: 'Which type stores whole numbers in Java?',
                    options: ['float', 'double', 'int', 'string'],
                    answer: 2,
                    explanation: 'int is used for whole numbers (integers) in Java.'
                }
            },
            {
                id: 'jv-3',
                title: 'Object-Oriented Basics',
                desc: 'Classes and objects',
                content: `<p>Java is all about <strong>objects</strong>. A class is a blueprint, and an object is an instance of that class.</p>`,
                code: `// Define a class
class Student {
    String name;
    int score;
    
    void sayHello() {
        System.out.println("Hi, I'm " + name);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student();
        s.name = "K-VOID";
        s.score = 100;
        s.sayHello();
    }
}`,
                quiz: {
                    q: 'What is an object in Java?',
                    options: ['A variable', 'An instance of a class', 'A function', 'A data type'],
                    answer: 1,
                    explanation: 'An object is an instance created from a class blueprint.'
                }
            }
        ]
    },
    {
        id: 'cpp',
        icon: '⚙️',
        title: 'C++',
        subtitle: 'Performance & Systems',
        desc: 'Fast and powerful. Used in game dev, operating systems, and high-performance applications.',
        color: '#00599C',
        lessons: [
            {
                id: 'cpp-1',
                title: 'Hello, C++!',
                desc: 'Your first C++ program',
                content: `<p>C++ is a compiled language known for speed and control over hardware. It extends C with <strong>object-oriented</strong> features.</p>`,
                code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, K-VOID!" << endl;
    cout << "Welcome to C++!" << endl;
    return 0;
}`,
                quiz: {
                    q: 'What header is needed for input/output in C++?',
                    options: ['<stdio.h>', '<iostream>', '<console>', '<io>'],
                    answer: 1,
                    explanation: '#include <iostream> provides cout, cin, and other I/O functions.'
                }
            },
            {
                id: 'cpp-2',
                title: 'Variables & Input',
                desc: 'Working with data',
                content: `<p>C++ is statically typed like Java. Use <code>cin</code> for user input and <code>cout</code> for output.</p>`,
                code: `#include <iostream>
using namespace std;

int main() {
    string name;
    int age;
    
    cout << "Enter your name: ";
    cin >> name;
    
    cout << "Enter your age: ";
    cin >> age;
    
    cout << "Hello, " << name;
    cout << "! You are " << age;
    cout << " years old." << endl;
    
    return 0;
}`,
                quiz: {
                    q: 'What operator reads user input in C++?',
                    options: ['>> (cin)', '<< (cin)', '-> (cin)', '|| (cin)'],
                    answer: 0,
                    explanation: 'cin uses >> to read input from the user.'
                }
            },
            {
                id: 'cpp-3',
                title: 'Pointers',
                desc: 'Memory addresses',
                content: `<p>Pointers store memory addresses. They give you direct access to memory — powerful but requires caution.</p>`,
                code: `#include <iostream>
using namespace std;

int main() {
    int x = 42;
    int* ptr = &x;  // ptr stores address of x
    
    cout << "Value of x: " << x << endl;
    cout << "Address of x: " << ptr << endl;
    cout << "Value at ptr: " << *ptr << endl;
    
    *ptr = 100;  // change x through pointer
    cout << "New x: " << x << endl;
    
    return 0;
}`,
                quiz: {
                    q: 'What does the * operator do when declaring a pointer?',
                    options: ['Multiplies values', 'Creates a pointer', 'Dereferences a pointer', 'Both B and C depending on context'],
                    answer: 3,
                    explanation: 'In declarations, * creates a pointer. In expressions, * dereferences (accesses the value at the address).'
                }
            }
        ]
    },
    {
        id: 'go',
        icon: '🔵',
        title: 'Go (Golang)',
        subtitle: 'Modern & Simple',
        desc: 'Built by Google. Simple syntax, fast compilation, great for servers and cloud apps.',
        color: '#00ADD8',
        lessons: [
            {
                id: 'go-1',
                title: 'Hello, Go!',
                desc: 'Getting started with Go',
                content: `<p>Go is a compiled language with simple syntax and built-in concurrency. Every Go program starts with a <code>package main</code> declaration.</p>`,
                code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, K-VOID!")
    fmt.Println("Welcome to Go!")
}`,
                quiz: {
                    q: 'What package must every runnable Go program start with?',
                    options: ['package run', 'package main', 'package go', 'package start'],
                    answer: 1,
                    explanation: 'The "main" package is required for executable Go programs.'
                }
            },
            {
                id: 'go-2',
                title: 'Variables & Types',
                desc: 'Declaration in Go',
                content: `<p>Go supports type inference with <code>:=</code> or explicit declarations with <code>var</code>. Go is statically typed.</p>`,
                code: `package main

import "fmt"

func main() {
    // Type inference
    name := "K-VOID"
    age := 2024
    
    // Explicit
    var version float64 = 1.0
    var isAwesome bool = true
    
    fmt.Printf("Name: %s\\n", name)
    fmt.Printf("Age: %d\\n", age)
    fmt.Printf("Version: %.1f\\n", version)
    fmt.Printf("Awesome: %t\\n", isAwesome)
}`,
                quiz: {
                    q: 'What operator declares and assigns in Go?',
                    options: ['=', ':=', '==', '=>'],
                    answer: 1,
                    explanation: ':= is the short declaration operator that infers the type.'
                }
            }
        ]
    }
];
