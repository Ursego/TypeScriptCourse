//### string

// Here are the most commonly used string manipulation techniques and functions in TypeScript.

// @@@ Check if One String Contains Another
const str = "Hello, world!";
const contains = str.includes("world"); // true

// @@@ Check if One String Starts or Ends with Another
const startsWithHello = str.startsWith("Hello"); // true
const endsWithWorld = str.endsWith("world!"); // true

// @@@ Replace All Occurrences of a String in Another String
// You can use the replace method with a global regular expression:
const str = "Hello, world! Hello, universe!";
const newStr = str.replace(/Hello/g, "Hi");
console.log(newStr); // "Hi, world! Hi, universe!"

// @@@ Trim the First or the Last N Characters from a String
const str = "Hello, world!";
const trimmedFirstN = str.substring(2); // trim the first 2 characters
console.log(trimmedFirstN); // "llo, world!"
const trimmedLastN = str.substring(0, str.length - 3); // trim the last 3 characters
console.log(trimmedLastN); // "Hello, wor"

// @@@ Pad String (with Space or a Given Character) Up to a Given Length
const str = "Hello";
const paddedStr = str.padStart(10); // pad with spaces up to length 10
console.log(paddedStr); // "     Hello"
const paddedStrWithZeros = str.padEnd(10, '0'); // pad with zeros up to length 10
console.log(paddedStrWithZeros); // "Hello00000"

// @@@ Ways of String Concatenation
const str1 = "Hello";
const str2 = "world";
// Using the + Operator:
const concatenated = str1 + ", " + str2 + "!"; // "Hello, world!"
// Using the concat method (try to avoid):
const concatenated = str1.concat(", ", str2, "!"); // "Hello, world!"
// Using template literals (template strings), which will be described next:
const concatenated = `${str1}, ${str2}!`; // "Hello, world!"

//### Template Literals

// Template literals are enclosed by backticks (`) instead of single quotes (') or double quotes (") and allow embedding expressions using the ${expression} syntax.
// They allow for more advanced string formatting and embedding of expressions directly within strings.

// @@@ Multi-line strings
// Template literals allow you to create multi-line strings easily, without needing to concatenate strings or use escape sequences for new lines:
const multiLineString = `This is a string
that spans multiple
lines.`;

console.log(multiLineString);
// Output:
// This is a string
// that spans multiple
// lines.

// @@@ Expression interpolation
// Template literals support embedding expressions within strings.
// You can include variables/constants, expressions, and function calls directly inside the template literal.
// Example with single vars and an expression:
let a = 5;
let b = 10;
let result = `The sum of ${a} and ${b} is ${a + b}.`;
console.log(result); // "The sum of 5 and 10 is 15."
// Example with object fields:
const user = { name: "Alice", age: 30, role: "Admin" };
console.log(`User Info: Name=${user.name}, Age=${user.age}, Role=${user.role}`);
// Example with a function call:
function getUserName(pUserId: number): string { ... }
const greeting = `Hello, ${getUserName(userId)}!`;
console.log(greeting); // Output: Hello, ALICE!

// Template literals are especially useful for generating HTML in TypeScript:
const name = "Alice";
const items = ["apple", "banana", "cherry"];
const html = `
  <div>
    <h1>Hello, ${name}!</h1>
    <ul>
      ${items.map(item => `<li>${item}</li>`).join('')}
    </ul>
  </div>
`;
