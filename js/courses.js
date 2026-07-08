const COURSES = [
  // ============================================================
  // PYTHON
  // ============================================================
  {
    id: 'python', icon: '🐍', title: 'Python',
    subtitle: 'Beginner to Intermediate',
    desc: 'The most popular language for beginners. Used in web dev, AI, data science, and automation.',
    color: '#3776AB',
    lessons: [
      {
        id: 'py-1', title: 'Hello, World!', icon: '🌍',
        desc: 'Your first Python program',
        concepts: [
          { title: 'What is print()?',
            text: 'print() is a built-in Python function that displays text on the screen. Anything inside the parentheses gets shown to you.',
            code: `print("Hello, World!")
print("Welcome to K-VOID!")
print("I am learning Python!")`,
            classwork: 'Open Termux, type `python3`, then type `print("K-VOID is awesome")` and press Enter. See what happens!' },
          { title: 'Strings (text)',
            text: 'Text in Python is called a "string". You put it inside quotes — single (\') or double (") both work.',
            code: `print('Single quotes work too')
print("Double quotes are fine")
print("You can use both!")`,
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
            code: `name = "K-VOID"
year = 2024
price = 9.99
print(name)
print(year)
print(price)`,
            classwork: 'Create a variable called `city` with your city name, and `population` with a number. Print both.' },
          { title: 'Variable naming rules',
            text: 'Use letters, numbers, and underscores. Must start with a letter or underscore. No spaces. Case-sensitive (Age ≠ age).',
            code: `my_name = "Alice"
my_name2 = "Bob"
_user = "Charlie"
print(my_name, my_name2, _user)`,
            classwork: 'Try creating a variable with a number at the start like `1name = "test"`. See the error? Now fix it.' }
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
            code: `age = 18
if age >= 18:
    print("You can vote!")`,
            classwork: 'Change age to 15 and run again. Notice nothing prints? Now add the else block (see next concept).' },
          { title: 'Adding else and elif',
            text: 'else runs when if is False. elif = "else if" — checks another condition.',
            code: `score = 75
if score >= 90:
    print("A")
elif score >= 70:
    print("B")
else:
    print("C or lower")`,
            classwork: 'Change score to 95, then to 60. Run each time and watch the output change.' }
        ],
        summary: ['if checks a condition (True/False)', 'Use elif for extra conditions', 'else catches everything else', 'Indentation matters!'],
        quiz: { q: 'What goes at the end of an if line?', options: [';', ':', '.', ','], answer: 1, explanation: 'A colon (:) is required after the condition in if/elif/else.' }
      },
      {
        id: 'py-4', title: 'Loops', icon: '🔄',
        desc: 'Repeat without copying code',
        concepts: [
          { title: 'For loops',
            text: 'A for loop goes through each item in a list or range. range(n) gives 0 to n-1.',
            code: `for i in range(5):
    print(f"Count: {i}")`,
            classwork: 'Change range(5) to range(10). Then try range(2, 7). What happens?' },
          { title: 'Looping over a list',
            text: 'You can loop directly through items instead of numbers.',
            code: `fruits = ["apple", "banana", "mango"]
for fruit in fruits:
    print(f"I love {fruit}")`,
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
            code: `def greet():
    print("Hello from K-VOID!")
greet()
greet()`,
            classwork: 'Write a function called `announce()` that prints "New lesson starting!" Call it 3 times.' },
          { title: 'Parameters & return',
            text: 'Parameters let you pass data in. return sends data back out.',
            code: `def add(a, b):
    return a + b

def square(n):
    return n * n

result = add(5, 3)
print(result)
print(square(4))`,
            classwork: 'Write a function `multiply(x, y)` that returns x * y. Call it with 6 and 7, print the result.' }
        ],
        summary: ['def creates a reusable function', 'Parameters = inputs to the function', 'return sends a value back'],
        quiz: { q: 'What keyword defines a function?', options: ['func', 'define', 'def', 'function'], answer: 2, explanation: 'def is Python\'s keyword for defining functions.' }
      }
    ]
  },

  // ============================================================
  // JAVASCRIPT
  // ============================================================
  {
    id: 'javascript', icon: '🟨', title: 'JavaScript',
    subtitle: 'Web Development',
    desc: 'The language of the web. Makes websites interactive and dynamic.',
    color: '#F7DF1E',
    lessons: [
      {
        id: 'js-1', title: 'Hello, JS!', icon: '🌍',
        desc: 'Your first JavaScript program',
        concepts: [
          { title: 'console.log',
            text: 'console.log() prints to the browser\'s developer console. It\'s the JS version of print().',
            code: `console.log("Hello, World!")
console.log("Welcome to K-VOID!")
console.log("JavaScript is running!");`,
            classwork: 'Open any website, press F12, go to Console tab. Type `console.log("Hi from K-VOID!")` and press Enter.' },
          { title: 'Comments',
            text: 'Comments are notes in your code that JavaScript ignores. Use // for single line.',
            code: `// This is a comment
console.log("This runs!");
// console.log("This won't run");`,
            classwork: 'Write a comment with your name, then a console.log() with your age.' }
        ],
        summary: ['console.log() prints to the console', 'Comments start with // and are ignored', 'Use F12 to open dev tools'],
        quiz: { q: 'How do you print to the JavaScript console?', options: ['print()', 'console.log()', 'log()', 'echo()'], answer: 1, explanation: 'console.log() is the standard way to output in JavaScript.' }
      },
      {
        id: 'js-2', title: 'Variables: let & const', icon: '📦',
        desc: 'Storing values in JS',
        concepts: [
          { title: 'let — can change',
            text: 'let declares a variable that can be reassigned later. Use this for values that will change.',
            code: `let name = "K-VOID"
console.log(name)
name = "Programming Hub"
console.log(name)`,
            classwork: 'Create a let variable called `score` with value 0. Then change it to 10 and log it.' },
          { title: 'const — stays the same',
            text: 'const cannot be reassigned. Use it for values that shouldn\'t change. It\'s safer.',
            code: `const birthYear = 2024
console.log(birthYear)
// birthYear = 2025  // Error!`,
            classwork: 'Try reassigning a const variable and see the error in the console.' }
        ],
        summary: ['let = value can change', 'const = value stays the same (can\'t reassign)', 'Always prefer const unless the value needs to change'],
        quiz: { q: 'Which keyword prevents reassignment?', options: ['let', 'var', 'const', 'static'], answer: 2, explanation: 'const cannot be reassigned after its initial declaration.' }
      },
      {
        id: 'js-3', title: 'Functions', icon: '🔧',
        desc: 'Reusable code blocks',
        concepts: [
          { title: 'Regular functions',
            text: 'Use the function keyword. Functions can take parameters and return values.',
            code: `function greet(name) {
    return "Hello, " + name + "!"
}
console.log(greet("K-VOID"))`,
            classwork: 'Write a function `double(n)` that returns n * 2. Call it with 5 and log the result.' },
          { title: 'Arrow functions (modern)',
            text: 'Arrow functions are shorter. () => instead of function(). They work the same way.',
            code: `const add = (a, b) => a + b
const square = n => n * n
console.log(add(3, 4))
console.log(square(5))`,
            classwork: 'Rewrite your `double` function as an arrow function.' }
        ],
        summary: ['function keyword creates regular functions', 'Arrow functions with => are modern and shorter', 'Parameters pass data in, return sends data out'],
        quiz: { q: 'What symbol do arrow functions use?', options: ['->', '=>', '->>', '|>'], answer: 1, explanation: 'Arrow functions use the => syntax.' }
      }
    ]
  },

  // ============================================================
  // HTML & CSS
  // ============================================================
  {
    id: 'html-css', icon: '🌐', title: 'HTML & CSS',
    subtitle: 'Web Design Basics',
    desc: 'Build beautiful websites. HTML gives structure, CSS adds style.',
    color: '#E34F26',
    lessons: [
      {
        id: 'hc-1', title: 'HTML Structure', icon: '🏗️',
        desc: 'The skeleton of every webpage',
        concepts: [
          { title: 'Tags & Elements',
            text: 'HTML uses tags like <tagname>content</tagname>. Most tags have an opening and closing part.',
            code: `<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Hello, K-VOID!</h1>
    <p>This is a paragraph.</p>
</body>
</html>`,
            classwork: 'Open a text editor (Termux: `nano test.html`). Type the code above, save it, open in browser.' },
          { title: 'Common tags',
            text: 'h1-h6 = headings, p = paragraph, a = link, img = image, ul/li = lists.',
            code: `<h1>Big Heading</h1>
<h2>Smaller</h2>
<p>This is a paragraph with
a <a href="https://google.com">link</a>.</p>
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
</ul>`,
            classwork: 'Add an image tag `<img src="https://via.placeholder.com/100" alt="test">` to your page.' }
        ],
        summary: ['HTML uses tags like <tag>content</tag>', 'h1-h6 are headings', 'a tags create links', 'Tags build the page structure'],
        quiz: { q: 'Which tag is the biggest heading?', options: ['<h6>', '<h1>', '<heading>', '<big>'], answer: 1, explanation: '<h1> is the largest/most important heading.' }
      },
      {
        id: 'hc-2', title: 'CSS Basics', icon: '🎨',
        desc: 'Adding style to HTML',
        concepts: [
          { title: 'How CSS works',
            text: 'CSS targets HTML elements and styles them. selector { property: value; }',
            code: `/* Make all h1 purple and centered */
h1 {
    color: purple;
    text-align: center;
}
/* Style paragraphs */
p {
    font-size: 18px;
    color: #333;
}`,
            classwork: 'Add a `<style>` tag in your HTML head. Make h1 green and paragraphs have a background color.' },
          { title: 'Classes & IDs',
            text: 'Classes (.classname) group elements. IDs (#idname) target ONE specific element.',
            code: `<style>
.special { color: gold; background: #222; padding: 10px; }
#main-title { font-size: 32px; border-bottom: 2px solid blue; }
</style>
<h1 id="main-title">K-VOID</h1>
<p class="special">This is special!</p>
<p class="special">This too!</p>`,
            classwork: 'Create a class called `.card` with border, padding, and margin. Apply it to 3 different divs.' }
        ],
        summary: ['CSS styles HTML using selectors and rules', 'Classes = .name (reusable)', 'IDs = #name (one per page)', 'Inline, internal, and external CSS'],
        quiz: { q: 'What symbol targets a class in CSS?', options: ['#', '.', '!', '@'], answer: 1, explanation: 'A dot (.) targets classes, hash (#) targets IDs.' }
      }
    ]
  },

  // ============================================================
  // JAVA
  // ============================================================
  {
    id: 'java', icon: '☕', title: 'Java',
    subtitle: 'Object-Oriented Programming',
    desc: 'One of the most widely-used languages. Powers Android apps, enterprise software, and more.',
    color: '#ED8B00',
    lessons: [
      {
        id: 'jv-1', title: 'Hello, Java!', icon: '🌍',
        desc: 'Getting started',
        concepts: [
          { title: 'Class & main method',
            text: 'Every Java program needs a class and a main() method. The main() is where the program starts running.',
            code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, K-VOID!");
    }
}`,
            classwork: 'Save as Main.java. In Termux: `javac Main.java` then `java Main`. Change the message and run again.' },
          { title: 'System.out.println',
            text: 'System.out.println() prints text and moves to the next line. Use \'+\' to combine text.',
            code: `System.out.println("Welcome");
System.out.println("Count: " + 42);`,
            classwork: 'Print "I love " + "Java" using the + operator to combine two strings.' }
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
            code: `int age = 20;
String name = "K-VOID";
double price = 19.99;
boolean isFun = true;
System.out.println(name + " is " + age);`,
            classwork: 'Declare a double variable for your height (in meters) and a boolean for if you like coding. Print them.' }
        ],
        summary: ['Java is statically typed — declare the type', 'int, String, double, boolean are common types', 'Variables must be declared before use'],
        quiz: { q: 'Which type stores whole numbers in Java?', options: ['float', 'String', 'int', 'char'], answer: 2, explanation: 'int is for whole numbers (integers).' }
      }
    ]
  },

  // ============================================================
  // C++
  // ============================================================
  {
    id: 'cpp', icon: '⚙️', title: 'C++',
    subtitle: 'Performance & Systems',
    desc: 'Fast and powerful. Used in game dev, operating systems, and high-performance apps.',
    color: '#00599C',
    lessons: [
      {
        id: 'cpp-1', title: 'Hello, C++!', icon: '🌍',
        desc: 'Your first C++ program',
        concepts: [
          { title: 'iostream & cout',
            text: '#include <iostream> lets you use cout for output. using namespace std; saves you from typing std:: everywhere.',
            code: `#include <iostream>
using namespace std;
int main() {
    cout << "Hello, K-VOID!" << endl;
    cout << "C++ is powerful!";
    return 0;
}`,
            classwork: 'Change the message and add a third cout line. Use << endl; at the end to add a newline.' }
        ],
        summary: ['#include <iostream> for input/output', 'cout << "text" prints text', 'endl adds a new line', 'return 0; ends the program'],
        quiz: { q: 'What is cout used for?', options: ['Input', 'Output', 'Math', 'Loops'], answer: 1, explanation: 'cout (character out) sends output to the screen.' }
      },
      {
        id: 'cpp-2', title: 'Variables & Input', icon: '⌨️',
        desc: 'Getting user input',
        concepts: [
          { title: 'cin for input',
            text: 'cin >> variable reads user input. The >> operator pulls data from the input stream into your variable.',
            code: `string name;
int age;
cout << "Enter name: ";
cin >> name;
cout << "Enter age: ";
cin >> age;
cout << "Hello " << name << "!";`,
            classwork: 'Add a third variable for your favorite language and ask the user for it.' }
        ],
        summary: ['cin >> reads user input', 'Works with strings, ints, etc.', 'cout << outputs variables'],
        quiz: { q: 'What operator does cin use?', options: ['<<', '>>', '->', '::'], answer: 1, explanation: 'cin uses >> (extraction operator) to read input.' }
      }
    ]
  },

  // ============================================================
  // GO
  // ============================================================
  {
    id: 'go', icon: '🔵', title: 'Go (Golang)',
    subtitle: 'Modern & Simple',
    desc: 'Built by Google. Simple syntax, fast compilation, great for servers and cloud apps.',
    color: '#00ADD8',
    lessons: [
      {
        id: 'go-1', title: 'Hello, Go!', icon: '🌍',
        desc: 'Getting started with Go',
        concepts: [
          { title: 'Package & imports',
            text: 'Every Go file starts with package main. import "fmt" brings in the formatting package for printing.',
            code: `package main
import "fmt"
func main() {
    fmt.Println("Hello, K-VOID!")
    fmt.Println("Go is simple!")
}`,
            classwork: 'In Termux: install Go with `pkg install golang`, save file as main.go, run `go run main.go`.' },
          { title: 'Short declaration :=',
            text: ':= declares a variable and infers the type. It\'s the Go way — clean and short.',
            code: `name := "K-VOID"
year := 2024
version := 1.0
fmt.Println(name, year, version)`,
            classwork: 'Declare variables for your name and age using := and print them.' }
        ],
        summary: ['package main is required for executable programs', 'import "fmt" for printing', ':= declares + assigns with type inference'],
        quiz: { q: 'What operator declares variables in Go?', options: ['=', ':=', '==', '=>'], answer: 1, explanation: ':= is the short declaration operator.' }
      }
    ]
  },

  // ============================================================
  // PHP
  // ============================================================
  {
    id: 'php', icon: '🐘', title: 'PHP',
    subtitle: 'Server-Side Web',
    desc: 'Powers most websites on the internet (WordPress, Facebook). Runs on servers.',
    color: '#777BB3',
    lessons: [
      {
        id: 'php-1', title: 'Hello, PHP!', icon: '🌍',
        desc: 'Your first PHP script',
        concepts: [
          { title: 'PHP tags & echo',
            text: 'PHP code goes inside <?php ?>. echo prints output. Variable names start with $.',
            code: `<?php
$name = "K-VOID";
echo "Hello, " . $name . "!";
echo "<br>";
echo "PHP runs on the server!";
?>`,
            classwork: 'Save as index.php. If you have PHP installed (`pkg install php`), run `php index.php`.' },
          { title: 'Variables & concatenation',
            text: 'Dot (.) joins strings in PHP. Variables are interpolated inside double quotes.',
            code: `$lang = "PHP";
$year = 2024;
echo "I am learning $lang in $year!";
echo "<br>";
echo "String" . " " . "concatenation";`,
            classwork: 'Create variables for your name and a skill, then echo a sentence using both . and "".' }
        ],
        summary: ['PHP code in <?php ?> tags', 'echo prints output', 'Variables start with $', 'Dot (.) joins strings'],
        quiz: { q: 'What character starts a PHP variable?', options: ['@', '$', '&', '%'], answer: 1, explanation: 'All PHP variables start with $. Example: $name.' }
      }
    ]
  },

  // ============================================================
  // RUBY
  // ============================================================
  {
    id: 'ruby', icon: '💎', title: 'Ruby',
    subtitle: 'Elegant & Productive',
    desc: 'Designed for developer happiness. Used in web dev (Ruby on Rails). Clean, readable syntax.',
    color: '#CC342D',
    lessons: [
      {
        id: 'rb-1', title: 'Hello, Ruby!', icon: '🌍',
        desc: 'Getting started with Ruby',
        concepts: [
          { title: 'puts & variables',
            text: 'puts prints text. Variables need no type declaration. Everything is an object.',
            code: `name = "K-VOID"
puts "Hello, #{name}!"
puts "Ruby is elegant"
language = "Ruby"
puts "Learning #{language}"`,
            classwork: 'Install Ruby: `pkg install ruby`. Save file as test.rb, run `ruby test.rb`.' },
          { title: 'String interpolation',
            text: '#{variable} inside double quotes inserts the variable\'s value. Only works with double quotes.',
            code: `user = "K-VOID"
points = 100
puts "#{user} scored #{points} points!"`,
            classwork: 'Create variables for your name and age, then puts a sentence using interpolation.' }
        ],
        summary: ['puts prints to the screen', 'No type declarations needed', '#{var} inserts variables into strings (double quotes only)'],
        quiz: { q: 'How do you insert a variable into a Ruby string?', options: ['${var}', '#{var}', '%{var}%', '{{var}}'], answer: 1, explanation: 'Ruby uses #{variable} for string interpolation inside double quotes.' }
      }
    ]
  },

  // ============================================================
  // RUST
  // ============================================================
  {
    id: 'rust', icon: '🦀', title: 'Rust',
    subtitle: 'Safe & Fast Systems',
    desc: 'Memory-safe without garbage collection. Loved by developers. Used in browsers, OS, and CLI tools.',
    color: '#DEA584',
    lessons: [
      {
        id: 'rs-1', title: 'Hello, Rust!', icon: '🌍',
        desc: 'Your first Rust program',
        concepts: [
          { title: 'fn main & println!',
            text: 'fn main() is the entry point. println! is a macro (note the !) that prints text.',
            code: `fn main() {
    println!("Hello, K-VOID!");
    println!("Rust is blazingly fast!");
    println!("{} is learning Rust", "You");
}`,
            classwork: 'Install Rust: `pkg install rust`. Save as main.rs, run `rustc main.rs && ./main`.' },
          { title: 'Variables (immutable by default)',
            text: 'Variables in Rust are immutable (can\'t change) by default. Use let mut to make them mutable.',
            code: `let name = "K-VOID";  // immutable
let mut score = 0;  // mutable
println!("Name: {name}");
score = 100;
println!("Score: {score}");`,
            classwork: 'Try changing an immutable variable (without mut) and see the compiler error.' }
        ],
        summary: ['fn main() is the entry point', 'println! macro prints (note the !)', 'Variables are immutable by default', 'let mut makes them changeable'],
        quiz: { q: 'How do you make a variable mutable in Rust?', options: ['let var', 'let mut var', 'mut let var', 'var mut'], answer: 1, explanation: 'Add mut after let: let mut x = 5; allows x to change.' }
      }
    ]
  },

  // ============================================================
  // SWIFT
  // ============================================================
  {
    id: 'swift', icon: '🍎', title: 'Swift',
    subtitle: 'Apple Apps',
    desc: 'Apple\'s modern language for iOS, macOS, watchOS, and tvOS apps. Clean and safe.',
    color: '#F05138',
    lessons: [
      {
        id: 'sw-1', title: 'Hello, Swift!', icon: '🌍',
        desc: 'Getting started with Swift',
        concepts: [
          { title: 'print & variables',
            text: 'print() outputs text. var = changeable, let = constant. Swift infers types but you can also specify them.',
            code: `let name = "K-VOID"
var score = 0
print("Hello, \\(name)!")
score = 10
print("Score: \\(score)")`,
            classwork: 'If you have an iPhone, download "Playgrounds" app. Otherwise, use a Swift online compiler.' },
          { title: 'Type safety',
            text: 'Swift is strongly typed. Once a variable is a String, it can\'t hold an Int. Use type annotation if needed.',
            code: `let language: String = "Swift"
let version: Double = 5.9
let year = 2024  // inferred as Int
print(language, version, year)`,
            classwork: 'Declare a constant with type annotation `: Double` and a variable with `: Bool`.' }
        ],
        summary: ['let = constant (can\'t change)', 'var = variable (can change)', 'Swift is type-safe', 'print() for output'],
        quiz: { q: 'Which keyword creates a constant in Swift?', options: ['const', 'let', 'var', 'static'], answer: 1, explanation: 'let declares a constant that cannot be changed.' }
      }
    ]
  },

  // ============================================================
  // KOTLIN
  // ============================================================
  {
    id: 'kotlin', icon: '📱', title: 'Kotlin',
    subtitle: 'Modern JVM & Android',
    desc: 'Google\'s preferred language for Android development. Concise, safe, and Java-compatible.',
    color: '#7F52FF',
    lessons: [
      {
        id: 'kt-1', title: 'Hello, Kotlin!', icon: '🌍',
        desc: 'Your first Kotlin program',
        concepts: [
          { title: 'fun main & println',
            text: 'fun main() is the entry point. println() prints. val = read-only, var = mutable.',
            code: `fun main() {
    val name = "K-VOID"
    var count = 0
    println("Hello, $name!")
    count++
    println("Count: $count")
}`,
            classwork: 'Use an online Kotlin compiler (try kotlinlang.org). Change the message and add more printlns.' },
          { title: 'String templates',
            text: 'Use $variable or ${expression} inside strings to insert values. No concatenation needed!',
            code: `val user = "K-VOID"
val points = 42
println("User: $user, Points: $points")
println("Double: ${points * 2}")`,
            classwork: 'Create val for your name and var for your age. Print "I am [name] and I am [age] years old." using templates.' }
        ],
        summary: ['fun main() is the entry point', 'val = read-only, var = mutable', '$variable inserts values into strings'],
        quiz: { q: 'Which keyword creates a read-only variable in Kotlin?', options: ['val', 'var', 'let', 'const'], answer: 0, explanation: 'val creates a read-only (immutable) reference. var creates a mutable one.' }
      }
    ]
  },

  // ============================================================
  // SQL
  // ============================================================
  {
    id: 'sql', icon: '🗄️', title: 'SQL',
    subtitle: 'Database Queries',
    desc: 'The language of databases. Store, query, and manipulate data. Essential for any backend developer.',
    color: '#336791',
    lessons: [
      {
        id: 'sql-1', title: 'SELECT & FROM', icon: '🔍',
        desc: 'Reading data from a database',
        concepts: [
          { title: 'What is SQL?',
            text: 'SQL (Structured Query Language) talks to databases. SELECT retrieves data. FROM specifies which table.',
            code: `-- Get all columns from users table
SELECT * FROM users;

-- Get only name and email
SELECT name, email FROM users;

-- Get users over 18
SELECT * FROM users WHERE age > 18;`,
            classwork: 'Imagine a "products" table with columns: id, name, price, stock. Write a SELECT query to get names where stock > 0.' },
          { title: 'WHERE & ORDER BY',
            text: 'WHERE filters rows. ORDER BY sorts results. AND/OR combine conditions.',
            code: `SELECT name, price
FROM products
WHERE price < 100 AND stock > 0
ORDER BY price DESC;`,
            classwork: 'Write a query to get all users from a "students" table where grade = "A", sorted by name alphabetically.' }
        ],
        summary: ['SELECT column FROM table reads data', 'WHERE filters rows', 'ORDER BY sorts results', '* = all columns'],
        quiz: { q: 'Which keyword filters results in SQL?', options: ['WHERE', 'FILTER', 'IF', 'HAVING'], answer: 0, explanation: 'WHERE is the primary clause for filtering rows.' }
      },
      {
        id: 'sql-2', title: 'INSERT & UPDATE', icon: '✏️',
        desc: 'Adding and changing data',
        concepts: [
          { title: 'INSERT new rows',
            text: 'INSERT INTO adds new rows to a table. VALUES specifies the data.',
            code: `INSERT INTO users (name, email, age)
VALUES ('K-VOID', 'hello@kvoid.com', 20);

INSERT INTO products (name, price)
VALUES ('Course', 0.00);`,
            classwork: 'Write an INSERT into a "posts" table with columns: title, content, author_id.' },
          { title: 'UPDATE existing rows',
            text: 'UPDATE changes existing data. Always use WHERE or you\'ll update EVERY row!',
            code: `UPDATE users
SET age = 21
WHERE name = 'K-VOID';

UPDATE products
SET price = 9.99
WHERE price = 0;`,
            classwork: 'Write an UPDATE that raises all prices by 10% in a products table (price = price * 1.10).' }
        ],
        summary: ['INSERT INTO adds new rows', 'UPDATE SET changes existing rows', 'ALWAYS use WHERE with UPDATE', 'Without WHERE = changes everything'],
        quiz: { q: 'What happens if you UPDATE without WHERE?', options: ['Nothing', 'Updates first row', 'Updates ALL rows', 'Error'], answer: 2, explanation: 'UPDATE without WHERE applies the change to every row in the table.' }
      }
    ]
  }
]
