//### Anonymous functions

// These are functions that are defined on the fly and do not specify a function name:
const addFunction = function(a: number, b: number): number {
  return a + b;
  }
let addFunctionResult = addFunction(2,3); // 5

//### Optional parameters without default values (?)

// The question mark (?) is used to denote that the parameter is optional, i.e. can be omitted when the function is called.
// It is important to understand that we are not talking about the optionality of the parameter's value - this is achieved with a "| null" or "| undefined" data type,
//    or by declaring the parameter with a default value.
// We are talking about whether the parameter exists at all (i.e. the memory is allocated for it).
// It's fine if a parameter declared with ? will not be sent.
// But if it will sent and it's defined without "| null", "| undefined" or a default value, its value is required - the caller must send it.

function funct(age?: number) {
  console.log(`Age is ${age !== undefined ? age : "not provided"}`);
}

funct(25); // Output: Age is 25
funct();   // Output: Age is not provided

// Notice this case:
class Base {
  greet() { ... }
}
 
class Derived extends Base {
  greet(name?: string) { // does it overload or override greet()? hmmmm......
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}
const d = new Derived();
d.greet();
d.greet("reader");
// You could think that greet(name?: string) in Derived doesn't override greet() in Base but overloads.
// However, since "name" in Derived is optional (i.e. could be not provided at all), that also covers the greet() signature in Base, so it's an overriding.

// IMPORTANT! Any optional parameters (be them declared with ? or with a default value) must come last - after required ones:
function concatStrings(a: string, b: string, c?: string) {
	return a + b + c;
}
let concat3strings = concatStrings("a", "b", "c"); // "abc"
let concat2strings = concatStrings("a", "b"); // "ab"
let concat1string = concatStrings("a"); // error: Expected 2-3 arguments, but got 1

//### Optional parameters with default values:

// TypeScript allows you to declare a parameter as optional by providing a default value:
function concatStringsDefault(a: string, b: string, c = "c") {
	return a + b + c;
}
let s1 = concatStringsDefault("a", "b"); // "abc"
let s2 = concatStringsDefault("a", "b", "z"); // "abz"

// Note that when we don't specify the type since it's inferred from the default value. However, you can specify it explicitly if you want:
function concatStringsDefault(a: string, b: string, c: string = "c") { ... }

//### JavaScript 'arguments' object in a function

// In JavaScript, 'arguments' is an array-like object available within all non-arrow functions. It contains all the arguments passed to the function.
// When you use 'arguments' in TypeScript, it behaves the same way as in JavaScript - lacks strong type information:
function example() {
  for (let i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
  }
}
example("Hello", 42, true);
// The 'arguments' object is of type IArguments, which is an interface provided by TypeScript.
// This interface doesn't have strong type information about the arguments, only that it's an array-like object.

//### Rest parameters:

// The rest (remaining) parameters use TypeScript's three-dot (...) syntax in the function declaration to express a variable number of function parameters.
// TypeScript encourages the use of rest parameters array (...args) instead of 'arguments' for better type safety and readability.
// The rest parameters array can have any name but the convention is to name it 'args'.
function example(...args: (string | number | boolean)[]) {
  for (let i = 0; i < args.length; i++) {
    console.log(args[i]);
  }
}
example("Hello", 42, true);

// We can also combine regular parameters with remainders in a function definition.
// A function can have at most one remainder parameter, and that parameter must be the last one:
function testNormalAndRestArguments(arg1: string, arg2: number, ...args: number[]) { ... }

// The parameter's type annotation is an object type:
function printCoord(pt: { x: number; y: number }) { // you can use , or ; to separate the properties, and the last separator is optional either way
	console.log("The coordinate's x value is " + pt.x);
	console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });

// In fact, this is the way to access args BY NAME when calling a finction!
function printName(arg: { first: string; last?: string }) {
	console.log(arg.last.toUpperCase());
	if (arg.last !== undefined) {
		console.log(arg.last.toUpperCase());
	}
	// A safe alternative for checking undefined is using modern JavaScript syntax:
	console.log(obj.last?.toUpperCase());
}
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });

//### Function declaration

// JavaScript and TypeScript offer at least five ways to declare a function:
// Named function:
function greet(name: string) {
  return 'hello ' + name
}
// Function expression:
let greet2 = function(name: string) {
  return 'hello ' + name
}
// Arrow function expression:
let greet3 = (name: string) => {
  return 'hello ' + name
}
// Shorthand arrow function expression:
let greet4 = (name: string) => 'hello ' + name
// Function constructor:
let greet5 = new Function('name', 'return "hello " + name')

// Except for the function constructor (which is deprecated), these syntaxes are supported by TypeScript in type-safe mode
//    and follow the rules about mandatory type annotations on parameters and optional annotations on return types.
// If you type the last example into the editor, you'll see the Function type.
// This is a callable object (if you put () behind it), which has all the prototype methods from Function.prototype.
// But its parameters and return type are untyped - you can call such a function with any arguments,
//    and TypeScript will not even react to such illegal actions.

//### "this" in functions

// Using this in TypeScript functions can be tricky due to how this is handled in JavaScript

// In JavaScript, the value of this is determined by how a function is called, not where it is defined. This leads to several scenarios:

// @@@ Global Context: In a non-strict mode function, this refers to the global object (e.g., window in browsers).
function globalFunction() {
  console.log(this); // Window object (in browser)
}
globalFunction();

// @@@ Object Method: When a method is called on an object, this refers to that object.
const obj = {
  value: 42,
  method() {
    console.log(this.value); // 42
  }
};
obj.method();

// @@@ Constructor: When a function is used as a constructor, this refers to the new instance created by new.
function MyClass() {
  this.value = 42;
}
const instance = new MyClass();
console.log(instance.value); // 42

// @@@ Event Handlers and Callbacks: In event handlers, this typically refers to the element that triggered the event.
// In callbacks, the value of this can vary based on how the callback is invoked.
// When passing methods as callbacks, this may not refer to the instance of the class as expected.
class Example {
  value = 42;
  logValue() {
    console.log(this.value);
  }
}
const example = new Example();
setTimeout(example.logValue, 1000); // Undefined or error, 'this' is not bound
// When you pass example.logValue to setTimeout, you're passing a reference to the method, not the method bound to the example instance.
// When setTimeout executes the function, it does so without any context, so this inside logValue will not refer to the example instance.
// When setTimeout calls example.logValue, the function is executed with this set to the global object (or undefined in strict mode), not the example instance.
// Thus, this.value inside logValue does not refer to example.value.

// @@@ Ways to make 'this' behave as expected

// There are two ways to guarante 'this' value to be correct at runtime, even for code not checked with TypeScript:

// @@@ Using bind
// You can explicitly bind the method to the instance using bind():
class Example {
  value = 42;
  logValue() { console.log(this.value); } // 'this' is expected to refer to the instance of 'Example' but it won't always
}
const example = new Example();
setTimeout(example.logValue.bind(example), 1000); // works as expected (outputs 42) since you binded the logValue method to the "example" object's context

// @@@ Using Arrow Functions
// Arrow functions do not have their own this context; they inherit this from the enclosing scope:
class Example {
  value = 42;
  logValue = () => { console.log(this.value); } // 'this' correctly refers to the instance of 'Example'
}
const example = new Example();
setTimeout(example.logValue, 1000); // works as expected since the arrow function (pointed by the logValue property) automatically has the "example" object's context
// However, you can’t use super.logValue in a derived class, because there’s no entry in the prototype chain to fetch the base class method from.

//### Arrow function

// Provides a way to write anonymous functions (functions without a name) in a more concise and readable manner.
// Has several advantages, such as a shorter syntax, no binding of this, and more predictable behavior in certain contexts.
// In TypeScript, arrow functions serve the same purpose as lambda expressions in languages like C# or Java. 
// Commonly used for callbacks and array operations due to their concise syntax, and within classes to maintain the correct this context.
// The basic syntax of an arrow function is:
(param1, param2, ..., paramN) => expression
// Example:
const add = (a: number, b: number): number => a + b;
console.log(add(5, 3)); // Output: 8
// That created an anonymous function and placed a pointer to it in the 'add' constants.

// For functions with multiple statements, use curly braces:
(param1, param2, ..., paramN) => {
  // statements
}
// Example:
const multiply = (a: number, b: number): number => {
  const result = a * b;
  return result;
};
console.log(multiply(5, 3)); // Output: 15

// @@@ No Arguments Object
// Arrow functions do not have their own arguments object.
// If you need to access arguments, you must use a regular function or rest parameters.

// @@@ Usage arrow functions as a callbacks
const numbers = [1, 2, 3, 4, 5];
const squares = numbers.map(n => n * n);
console.log(squares); // Output: [1, 4, 9, 16, 25]
// Let's create an example function that accepts a callback function as an argument and uses it within the function:
const processItem: (item: string) => string = (item: string) => {
  return item.toUpperCase();
};
function processItems(items: string[], callback: (item: string) => string) {
  for (const item of items) {
    const result = callback(item);
    console.log(result);
  }
}
const items = ['apple', 'banana', 'cherry'];
processItems(items, processItem); // use a pointer to an arrow function as the callback
processItems(items, item => item.toUpperCase()); // use an inline arrow function as the callback (the same result)

// We see that the arrow function's signature is described twice (in processItem and in processItems).
// If the same arrow function's signature is used in more than one piece of code, refactor it outside using a type alias:
type ItemProcessorFuncType = (item: string) => string;
const processItem: ItemProcessorFuncType = (item: string) => { // create a constant of that type (and the function object for the constant to poin to)
  return item.toUpperCase();
};
function processItems(items: string[], callback: ItemProcessorFuncType) { ... }
// That approach brings the next advantages:
//	1. We avoid code duplication.
//	2. We enforce type safety: changing the ItemProcessorFuncType type in the future will enforce the developer to fix all the fragments where it's used.
//	3. A powerful feature of self-documented code: if the signature is more complex, it immediately tells the developer that it's the same signature.

// Notice that a type alias which defines an arrow function can be used for regular (non-arrow) functions too:
function processItemRegular(item: string): string { // matches the ItemProcessorFuncType type
  return item.toUpperCase();
}
processItems(items, processItemRegular); // use a regular function as the callback (the same result)
// This demonstrates the flexibility of TypeScript in handling both arrow functions and traditional function declarations.

// @@@ Lexical this
// One of the significant advantages of arrow functions is their lexical scoping of this.
// Unlike traditional functions, arrow functions do not have their own this context; instead, they inherit this from the enclosing scope.
// This behavior is useful when working with methods in classes or callbacks.
// The arrow function inside setInterval captures this from the start method's scope, ensuring this.seconds refers to the seconds property of the Timer instance:
class Timer {
  seconds: number = 0;

  start() {
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }
}
const timer = new Timer();
timer.start();

// @@@ Destructuring in Parameters
//Arrow functions can use destructuring for parameters, which is useful for handling objects and arrays:
const person = { name: "Alice", age: 25 };

const displayPerson = ({ name, age }: { name: string; age: number }) => {
  console.log('Name: ${name}, Age: ${age}');
};

displayPerson(person); // Output: Name: Alice, Age: 25

//### Generator Functions
// Generator functions (or just generators) are a convenient way to generate a set of values.
// They give the user fine-grained control over the pace at which values ​​are produced.
// Lazy generators compute the next value only when the user asks them to.
// Generators can do things that are otherwise difficult to do, such as generating infinite lists.
// The * before a function name makes the function a generator.

// Generators use the yield keyword to yield values.
// When the user asks the generator for the next value (e.g. by calling next), yield will send the result back to the user
//    and pause until the next value is requested.
// We called createFibonacciGenerator, and it returned an IterableIterator.
// Each time next is called, the iterator computes the next Fibonacci number and yield returns it to us:
function* createFibonacciGenerator() {
	let a = 0
	let b = 1
	while (true) {
		yield a;
		[a, b] = [b, a + b]
	}
}
let fibonacciGenerator = createFibonacciGenerator() // IterableIterator<number>
fibonacciGenerator.next() // is calculated as {value: 0, done: false}
fibonacciGenerator.next() // is calculated as {value: 1, done: false}
fibonacciGenerator.next() // is calculated as {value: 1, done: false}
fibonacciGenerator.next() // is calculated as {value: 2, done: false}
fibonacciGenerator.next() // is calculated as {value: 3, done: false}
fibonacciGenerator.next() // is calculated as {value: 5, done: false}

// Note that TypeScript is able to infer the type of the iterator based on the type of the value we requested.
// We can also explicitly annotate the generator by wrapping the type it requests in an IterableIterator:
function* createNumbers(): IterableIterator<number> {
	let n = 0
	while (1) {
		yield n++
	}
}
let numbers = createNumbers()
numbers.next() // is calculated as {value: 0, done: false}
numbers.next() // is calculated as {value: 1, done: false}
numbers.next() // is calculated as {value: 2, done: false}

// Iterators
// If generators are a way to produce a stream of values, iterators are responsible for consuming those values.
// ITERABLE: Any object that contains a Symbol.iterable property whose value is a function that returns an iterator.

// ITERATOR: Any object that defines a next method that returns an object with value and done properties.

// In addition to defining your own iterators, you can also use JavaScript's built-in iterators for the common collection types —
// Array, Map, Set, String, etc. (Object and Number are not iterators) — to do things like:
// Iterate over an iterator with for-of:
for (let a of numbers) {
  // 1, 2, 3, etc.
  }
// Spread the iterator:
let allNumbers = [...numbers] // number[]
// Destructure the iterator:
let [one, two, ...rest] = numbers // [number, number, number[]]

// Just as object describes all objects, Function is a general type for all functions that says nothing about a particular function.
function sum(a: number, b: number): number {
	return a + b
}
// What is the type of sum? Well, sum is a function, so its type is Function. How else can you type sum? sum is a function that takes two values ​​and returns a number. Let's express its type like this:
(a: number, b: number) => number
// In TypeScript, this syntax is used to indicate the type of a function. Otherwise known as a call (or type) signature. It's similar to an arrow function, and that's intended. You'll use this syntax to type functions when passing them as arguments or when returning them from other functions. The parameter names a and b are just for documentation and don't affect the compatibility of the function with the type. Let's look at a few functions and extract their types as individual call signatures, which we bind to type aliases:
// function greet(name: string):
type GreetFuncType = (name: string) => string
// function log(message: string, userId?: string):
type LogFuncType = (message: string, userId?: string) => void
// function sumVariadicSafe(...numbers: number[]): number:
type SumVariadicSafeFuncType = (...numbers: number[]) => number

// Now let's flesh out the relationships between call signatures and their implementations. Once you have a call signature, how can you declare a function that implements it? Simply by combining that signature with the function expression that implements it. As an example, let's rewrite Log to use its freshly baked signature:
type LogFuncType = (message: string, userId?: string) => void
let log: LogFuncType = ( // Объявляем выражение функции log и явно присваиваем ему тип LogFuncType
	message, // message уже аннотирован как string в определении LogFuncType, позволяем TypeScript сделать вывод его типа на основе LogFuncType
	userId = 'Not signed in' // We add a default value because we removed the userId type from the LogFuncType signature, which is a type and cannot contain default values.
) => { // There is no need to re-annotate the return type - we already declared it as void in LogFuncType
	let time = new Date().toISOString()
	console.log(time, message, userId)
}
// The function typing syntax used in the previous section — type Fn = (…) => … — is a shorthand for the call signature:
// Shorthand call signature:
type LogFuncType = (message: string, userId?: string) => void
// It can be written more explicitly. The full call signature is:
type LogFuncType = {
	(message: string, userId?: string): void
}

function times(
	f: (index: number) => void,
	n: number
) {
	for (let i = 0; i < n; i++) {
		f(i)
	}
}
// When calling times, you don't need to explicitly annotate the function passed to times if it's declared inline:
times(n => console.log(n), 4)
// TypeScript will infer from the context that n is a number, because we declared in the signature of times that the index argument of f is a number.

// TypeScript understands that n is that argument, so it must be a number.