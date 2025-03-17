// TypeScript can use var to declare variables, just like JavaScript.
// However, it's generally recommended to use let or const instead due to the scoping issues associated with var.

// var, let, and const Comparison:
// var
// 		Function Scoped: The scope of a var variable is its current execution context, which is either the enclosing function or,
//							for variables declared outside any function, the global context.
// 		Hoisting: var variables are hoisted to the top of their scope and initialized with undefined.
// 		Re-declaration: You can re-declare a var variable within the same scope without an error.
// let
// 		Block Scoped: The scope of a let variable is the block (enclosed in {}) where it is defined.
// 		No Hoisting Issues: Although let variables are hoisted, they are not initialized. Accessing them before their declaration results in a ReferenceError.
// 		Re-declaration: Re-declaring a let variable in the same scope results in a syntax error.
// const
// 		Block Scoped: The scope of a const variable is the block where it is defined.
// 		No Hoisting Issues: Similar to let, accessing a const variable before its declaration results in a ReferenceError.
// 		Immutable Binding: A const variable cannot be reassigned. However, if the const variable is an object or array, its properties or elements can be modified.
// 		Its value can only be set after the variable is defined and cannot be changed subsequently.

// var:
// We can use a variable before it is defined.
// If the runtime encounters a variable that has not been defined or assigned a value before, then the value of that variable will be undefined:
console.log('anyValue = ${anyValue}'); // anyValue = undefined; since anyValue doesn't exist, this line creates it
var anyValue = 2; // redefine anyValue (create another var with the same name which replaces the existing one)
// When using the var keyword, there is no check to see if the variable itself has been defined before we actually use it.
// This can lead to undesirable behavior.

// let:
// One of the advantages of using the let keyword is that we cannot use the variable name before it is defined:
console.log('letValue = ${lValue}'); // Error: Block-scoped variable 'lValue' used before its declaration
let lValue = 2;
// Variables defined with let have block-level scope:
let lValue = 2;
console.log('lValue = ${lValue}'); // "lValue = 2"
if (lValue == 2) {
	let lValue = 2001;
	console.log('block scoped lValue : ${lValue}'); // "block scoped lValue : 2001"
}
console.log('lValue = ${lValue}'); // "lValue = 2"

// However, in some cases we would like to declare a variable with the let keyword and use it before TypeScript decides that it is defined:
let globalString: string;
setGlobalString();
console.log('globalString : ${globalString}'); // Error: Variable 'globalString' is used before being assigned
function setGlobalString() {
	globalString = "this has been set";
}

// We can use the assert assignment syntax, which is to add an exclamation mark (!) after a variable that has already been assigned.
// There are two places we can do this to make our code compile. First, when declaring the variable:
let globalString!: string;
// This tells the compiler that we are asserting that the variable has been assigned, and that it should not raise an error if it thinks it was used before the assignment.

// The second place we can use an assert assignment is where the variable is actually used:
console.log('globalString : ${globalString!}');

// ### Reading from unititialized variables generates an error

// Standalone Variables:
let myVar: number; // no default value
let anotherVar = myVar; // compile-time error: Variable 'myVar' is used before being assigned.

// Class Properties:
class Person {
  name: string; // no default value
  constructor() { } // this.name is not assigned a value here
  greet() {
    console.log('Hello, my name is ${this.name}'); // compile-time error: Property 'name' has no initializer and is not definitely assigned in the constructor.
  }
}

// ### The definite assignment assertion (! in a variable or property declaration)

// Indicates that a variable or property will definitely be assigned a value, even if TypeScript can't infer it from the code - you, as the developer, guarantee that.

// Standalone Variables:
let myVar!: number; // still no default value, but with definite assignment assertion
let anotherVar = myVar; // no compile-time error

// Class Properties:
class Person {
  name!: string; // still no default value, but with definite assignment assertion
  constructor() { this.initialize(); }
  initialize() { this.name = "Alice"; }  // now, name is assigned a value
  greet() {
    console.log('Hello, my name is ${this.name}'); // no compile-time error
  }
}

// ### The non-null assertion operator (! when reading from a variable)

// If a variable or property is declared WITHOUT definite assignment assertion, you can use the non-null assertion (!)
// when READING FROM it if you are confident that it will be assigned a value before use:

// Standalone Variables:
let myVar: number; // no default value, no !
let anotherVar = myVar!; // accessed with ! - no compile-time error, but a run-rime error

// Class Properties:
class Person {
  name: string; // no default value, no !
  constructor() { } // this.name is not assigned a value here
  greet() {
    console.log('Hello, my name is ${this.name!}'); // accessed with ! - no compile-time error, but a run-rime error
  }
}

// Another example:
function liveDangerously(x?: number | undefined) {
	console.log(x!.toFixed()); // no error
}

// However, all these appoaches are dangerous since they can hide bugs.
// They can lead to runtime errors if the variable is indeed uninitialized, but may not be caught on testing in some specific branches of logic.
// You do want this error if the var is supposed to be populated when read from, so do you best NOT to use ! (in both declaring and reading from the var).
// The only case when you have no choise it's when the var is populated not in the scope where it is declared and read from.

//### Optional parameters and variables (?)

// The question mark (?) is used to denote that a variable, parameter, or property is optional.
// This means that the variable, parameter, or property can be provided or it can be omitted.

// @@@ Optional Function Parameters
// When a function parameter is declared with a question mark, it means that the parameter is optional and can be omitted when the function is called:
function funct(age?: number) {
  if (age !== undefined) {
    console.log(`Age is ${age}`);
  } else {
    console.log("Age is not provided");
  }
}

funct(25); // Output: Age is 25
funct();   // Output: Age is not provided

// Notice this case:
class Base {
  greet() { ... }
}
 
class Derived extends Base {
  greet(name?: string) {
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

// @@@ Optional Properties in Interfaces

interface Person {
  name: string;
  age?: number;
}

const alice: Person = {
  name: "Alice",
  age: 30
};

const bob: Person = {
  name: "Bob"
};

console.log(alice); // Output: { name: 'Alice', age: 30 }
console.log(bob); // Output: { name: 'Bob' } - the age property doesn't exist at all

// @@@ Optional Variables
// The question mark is not used for standalone variable declarations.
// Instead, you might use a union type with undefined to achieve a similar effect:
let age: number | undefined;

age = 25;
console.log(age); // Output: 25

age = undefined;
console.log(age); // Output: undefined
