const LESSON_CONTENT = {
    'py-b-1': {
        metaphor: '<code>print()</code> is a digital megaphone. It pushes words out of the computer\'s brain and onto your display glass.',
        story: `<p>Welcome to K-VOID! Every legendary developer started exactly where you are right now — by making a computer display a message on command.</p>
<p>In Python, we use a tool called <code>print()</code>. Think of it like a <strong>digital megaphone</strong>. Whatever text you put inside the parentheses and wrapped in quotation marks, the computer will shout right back at you on screen.</p>
<div class="inline-code">print("Hello from K-VOID")</div>
<p>This line makes <code>Hello from K-VOID</code> appear instantly on your screen.</p>`,
        mission: `<p>Complete both tasks:</p>
<ol><li>Use the <code>print()</code> tool on line 2</li>
<li>Make the computer say exactly: <code>"Welcome back, King"</code></li></ol>`,
        starterCode: '# Line 1: Use print() below to make the screen respond!\nprint("Welcome back, King")',
        validation: { type: 'contains', patterns: ['print(', 'Welcome back, King'] },
        successMsg: '🎉 Outstanding job! You just forced your computer to execute its very first instruction. Your journey to mastery has officially begun.',
        hint: 'Wrap your text in quotation marks and place it inside print() parentheses. Check your spelling and capitalization.'
    },
    'py-b-2': {
        metaphor: 'Variables are labeled cardboard boxes. You put something inside, stick a name tag on the front, and find it later by that name.',
        story: `<p>Imagine you're playing a video game. The game needs to remember your character's name, your score, and how many lives you have left. How does it remember?</p>
<p><strong>Variables.</strong> Think of a variable as a labeled box. You put data inside the box, put a name tag on the outside, and set it aside until you need it later.</p>
<p>In Python, creating a box looks like this:</p>
<div class="inline-code">player_name = "King"</div>
<p>Now, whenever the computer sees <code>player_name</code>, it remembers it holds the text "King".</p>`,
        mission: `<p>Complete both tasks:</p>
<ol><li>Create a variable called <code>score</code> and set it to <code>100</code></li>
<li>Create a variable called <code>player</code> and set it to your name</li></ol>`,
        starterCode: '# Create your variables below\nscore = 100\nplayer = "YourName"',
        validation: { type: 'contains', patterns: [['score', '=', '100'], ['player', '=', '"']] },
        successMsg: '🎉 You just gave your computer memory cells! Variables are the foundation of every program.',
        hint: 'Use the = sign to assign values: variable_name = value'
    },
    'py-b-3': {
        metaphor: 'Input is your program asking a question. Output is your program giving an answer. Together, they\'re how your program talks to people.',
        story: `<p>So far, your programs just sit there showing fixed messages. But what if you want your program to <em>talk to people</em>?</p>
<p>You need two things:</p>
<ul><li><strong>Input</strong> — asking the user something (like a form on a website)</li>
<li><strong>Output</strong> — showing a result back to them</li></ul>
<p>In Python, <code>input()</code> pauses and waits for the user to type something. <code>print()</code> shows text on screen.</p>`,
        mission: `<p>Write a program that:</p>
<ol><li>Asks the user for their name using <code>input()</code></li>
<li>Prints a greeting that includes their name</li></ol>`,
        starterCode: '# Ask for the user\'s name\nname = input("What is your name? ")\n# Print a greeting\nprint("Hello, " + name + "!")',
        validation: { type: 'contains', patterns: ['input(', 'print(', 'name'] },
        successMsg: '🎉 Your program can now have a conversation! This is how every chatbot starts.',
        hint: 'Use input("message") to ask, then print() to respond.'
    },
    'py-b-4': {
        metaphor: 'If/else is a security guard. It checks a condition — if the password is right, you get in. If it\'s wrong, you\'re turned away.',
        story: `<p>Imagine a security guard at a door. Someone walks up and the guard asks for a password.</p>
<ul><li>If the password is correct → <strong>let them in</strong></li>
<li>Otherwise → <strong>turn them away</strong></li></ul>
<p>That's exactly how <code>if/else</code> works in programming. It checks a condition and does different things based on the answer.</p>
<p>In Python, indentation (the spaces at the start of a line) tells Python which code belongs to which condition.</p>`,
        mission: `<p>Write a program that:</p>
<ol><li>Creates a variable <code>password</code> set to <code>"secret123"</code></li>
<li>If the password equals <code>"secret123"</code>, print <code>"Access granted"</code></li>
<li>Otherwise, print <code>"Access denied"</code></li></ol>`,
        starterCode: 'password = "secret123"\n\nif password == "secret123":\n    print("Access granted")\nelse:\n    print("Access denied")',
        validation: { type: 'contains', patterns: ['if ', '==', 'print(', 'else:'] },
        successMsg: '🎉 You just built a security system! If/else is used in every app to make decisions.',
        hint: 'Use == (double equals) to compare values, not = (single equals).'
    },
    'py-b-5': {
        metaphor: 'A loop is a robot that does the same task over and over until you tell it to stop. No copy-pasting needed.',
        story: `<p>Imagine you need to print "I love coding" 10,000 times. Would you type it 10,000 times? Of course not!</p>
<p>A <strong>loop</strong> tells the computer: "Do this thing again and again." You set the rules, and the robot follows them perfectly.</p>
<p>Python has two main loops:</p>
<ul><li><code>for</code> — repeats a specific number of times</li>
<li><code>while</code> — repeats as long as a condition is true</li></ul>`,
        mission: `<p>Write a <code>for</code> loop that prints "I love coding" exactly 5 times.</p>`,
        starterCode: '# Print "I love coding" 5 times\nfor i in range(5):\n    print("I love coding")',
        validation: { type: 'contains', patterns: ['for ', 'range(', 'print(', 'I love coding'] },
        successMsg: '🎉 5 messages in 3 lines! Imagine doing that by hand. Loops are your automation superpower.',
        hint: 'Use for i in range(5): to repeat 5 times.'
    },
    'py-b-6': {
        metaphor: 'A list is a shopping cart. You can add items, remove items, and look at what\'s inside — all in one place.',
        story: `<p>Imagine you're at the grocery store. You grab a cart and start putting items in it: apples, milk, bread.</p>
<p>A <strong>list</strong> in Python is exactly that — a container that holds multiple items in order.</p>
<p>You can add to it, remove from it, and check what's inside. Lists are one of the most useful tools in programming.</p>`,
        mission: `<p>Create a list of your 3 favorite foods, then print the second one.</p>`,
        starterCode: '# Create your shopping list\nfoods = ["pizza", "sushi", "tacos"]\n\n# Print the second item (remember: counting starts at 0)\nprint(foods[1])',
        validation: { type: 'contains', patterns: ['[', ']', 'print('] },
        successMsg: '🎉 Lists are everywhere — your music playlist, your contacts, your browser tabs. You just learned to manage collections of data!',
        hint: 'Put items in square brackets separated by commas.'
    },
    'py-b-7': {
        metaphor: 'A function is a recipe card. You write the steps once, then follow the same card every time you want to make that dish.',
        story: `<p>Every time you want scrambled eggs, you follow the same steps: crack eggs, stir, cook. You don't re-invent the process each time.</p>
<p>A <strong>function</strong> is a recipe card for your code. You write the steps once, give the recipe a name, and then "call" that recipe whenever you need it.</p>
<p>This saves time and keeps your code clean.</p>`,
        mission: `<p>Write a function called <code>greet</code> that takes a name and prints "Hello, [name]!"</p>`,
        starterCode: '# Define your function\ndef greet(name):\n    print("Hello, " + name + "!")\n\n# Call it 3 times\ngreet("Alice")\ngreet("Bob")\ngreet("Charlie")',
        validation: { type: 'contains', patterns: ['def greet', 'print(', 'greet('] },
        successMsg: '🎉 You just created a reusable tool! Functions are how programmers build big things from small pieces.',
        hint: 'Use def function_name(parameter): to create a function.'
    },
    'py-b-8': {
        metaphor: 'String methods are like tools in a Swiss Army knife. Each one does something different to text — capitalize, find, replace, and more.',
        story: `<p>Text in programming is called a <strong>string</strong> — think of it as a chain of characters strung together.</p>
<p>Python gives you built-in tools to manipulate strings. Want to make everything uppercase? There's a method for that. Want to find a word inside a sentence? There's a method for that too.</p>
<p>You just type <code>string.method()</code> and the tool does its job.</p>`,
        mission: `<p>Use string methods to:</p>
<ol><li>Convert "hello world" to all uppercase</li>
<li>Count how many letters are in "python"</li></ol>`,
        starterCode: 'text = "hello world"\n\n# Convert to uppercase\nprint(text.upper())\n\n# Count letters\nprint(len("python"))',
        validation: { type: 'contains', patterns: ['.upper()', 'len('] },
        successMsg: '🎉 Strings are the most common type of data you\'ll work with. These tools will save you hours of work!',
        hint: 'Use .upper() for uppercase and len() to count characters.'
    },
    'py-b-9': {
        metaphor: 'Math operators are your calculator buttons. + adds, - subtracts, * multiplies, and / divides. Python can do math way faster than any human.',
        story: `<p>You already know basic math: 2 + 2 = 4. In Python, the computer can do this instantly.</p>
<p>Python has all the math operators you need:</p>
<ul><li><code>+</code> add, <code>-</code> subtract, <code>*</code> multiply, <code>/</code> divide</li>
<li><code>%</code> remainder (modulus), <code>**</code> power</li></ul>
<p>You can use these on numbers directly or on variables that hold numbers.</p>`,
        mission: `<p>Calculate and print:</p>
<ol><li>The result of 15 + 27</li>
<li>The result of 10 to the power of 3</li>
<li>The remainder when 17 is divided by 5</li></ol>`,
        starterCode: '# Addition\nprint(15 + 27)\n\n# Power (10 to the 3rd)\nprint(10 ** 3)\n\n# Remainder\nprint(17 % 5)',
        validation: { type: 'contains', patterns: ['print(', '**', '%'] },
        successMsg: '🎉 You just did in 3 lines what would take a human several minutes. Math is the backbone of every algorithm!',
        hint: 'Use ** for power and % for remainder.'
    },
    'py-b-10': {
        metaphor: 'Comments are sticky notes for your future self. They don\'t affect the code — they just explain what it does.',
        story: `<p>Imagine writing a note on a sticky pad and sticking it next to your code: "This part calculates the total price."</p>
<p><strong>Comments</strong> are notes that the computer ignores. They're only for humans — you, your teammates, or anyone reading your code later.</p>
<p>In Python, a comment starts with <code>#</code>. Everything after it on that line is ignored by the computer.</p>`,
        mission: `<p>Add comments to explain what this code does:</p>`,
        starterCode: '# This program calculates a tip\n\nbill = 50\ntip_percent = 0.15\n\n# Calculate the tip amount\ntip = bill * tip_percent\n\n# Show the total\ntotal = bill + tip\nprint("Total: $" + str(total))',
        validation: { type: 'contains', patterns: ['#', 'print('] },
        successMsg: '🎉 Good code is self-documenting. Comments make your code readable and maintainable!',
        hint: 'Start comment lines with the # symbol.'
    },
    'py-b-11': {
        metaphor: 'Debugging is being a detective. Your code has a clue (the error message) and you follow the trail to find the bug.',
        story: `<p>Every programmer makes mistakes. Bugs are errors in your code that prevent it from working correctly.</p>
<p><strong>Debugging</strong> is the art of finding and fixing those errors. Python is actually helpful here — it tells you what went wrong and which line caused the problem.</p>
<p>The key is to read the error message carefully. It's not scolding you — it's giving you directions!</p>`,
        mission: `<p>This code has 3 bugs. Find and fix them all so it prints "Debugging is fun!"</p>`,
        starterCode: '# Fix the 3 bugs below\nmessage = "Debugging is fun"\nprint(message)',
        validation: { type: 'contains', patterns: ['print(', 'Debugging'] },
        successMsg: '🎉 You found the bugs! Debugging is one of the most important skills in programming. The more you practice, the faster you get.',
        hint: 'Look for missing quotes, typos, or wrong function names.'
    },
    'py-b-12': {
        metaphor: 'A calculator is like a chef — it takes ingredients (numbers), processes them (math operations), and serves a result (the answer).',
        story: `<p>You've learned all the building blocks: variables, input, output, conditions, and math. Now let's combine them into something real!</p>
<p>You'll build a simple calculator that:</p>
<ul><li>Asks the user for two numbers</li>
<li>Adds them together</li>
<li>Shows the result</li></ul>
<p>This is your first real program — and it works!</p>`,
        mission: `<p>Build a calculator that:</p>
<ol><li>Gets two numbers from the user</li>
<li>Adds them together</li>
<li>Prints the result</li></ol>`,
        starterCode: '# Your calculator!\nnum1 = float(input("Enter first number: "))\nnum2 = float(input("Enter second number: "))\n\nresult = num1 + num2\nprint("The answer is: " + str(result))',
        validation: { type: 'contains', patterns: ['input(', 'float(', '+', 'print('] },
        successMsg: '🎉 Congratulations! You just built your first real program. Variables, input, math, output — you used everything you learned. Welcome to the world of programming!',
        hint: 'Use float() to convert input text to numbers, then add them.'
    }
};

function getLessonContent(lessonId) {
    return LESSON_CONTENT[lessonId] || null;
}
