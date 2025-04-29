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

// ### Using a variable before it is declared

// var:
// We can use the variable before it is declared.
// If the runtime encounters a variable that has not been defined or assigned a value before, then the value of that variable will be undefined:
console.log('lValue = ${lValue}'); // lValue = undefined; since lValue doesn't exist, this line creates it
var lValue = 2; // redefine lValue (create another var with the same name which replaces the existing one)
// When using the var keyword, there is no check to see if the variable itself has been defined before we actually use it.
// This can lead to heavy errors.

// let:
// We cannot use the variable before it is declared. That is a huge advantages of the let keyword!
console.log('letValue = ${lValue}'); // Error: Block-scoped variable 'lValue' used before its declaration
let lValue = 2;

// ### Scope:

// Variables defined with let have block-level scope:
let lValue = 2;
console.log('lValue = ${lValue}'); // "lValue = 2"
if (lValue == 2) {
  // Create a new, independent variable with the same name which shadows (makes unavailable) the oreviously declared variable.
  // If lValue had been declared with var, the next line would have modified the previously declared variable rather than creating a new one:
	let lValue = 333;
	console.log('block scoped lValue: ${lValue}'); // "within a block: lValue = 333"
}
console.log('lValue = ${lValue}'); // "lValue = 2"; if lValue was declared with var, the output would be "lValue = 333"

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

// ### Definite Assignment Assertion (!)

// In some cases we would like to declare a variable with the let keyword, populate it in another scope and use without TypeScript deciding that it's not populated.
// For that, we can use the assert assignment syntax, which is to add an exclamation mark (!) after a variable.
// ! indicates that the variable will definitely be assigned a value before it's read in the current scope first time, even if TypeScript can't infer it from the code.
// You, as the developer, guarantee that, so the compiler should not raise an error if it thinks the variable is used unassigned.

// There are two places we can do this to make our code compile:
let myVar!: string; // when declaring the variable
console.log('myVar : ${myVar!}'); // when the variable is actually used

// @@@ ! when declaring the variable:

// Standalone Variable:
let myVar!: string; // no default value, but with definite assignment assertion
setMyVar(); // it populates myVar in another scope but the current scope doesn't know that
console.log('myVar : ${myVar}'); // no compile-time error; without ! you would get "Variable 'myVar' is used before being assigned"

// Class Properties:
// As you will read in https://github.com/Ursego/TypeScriptCourse/blob/main/10%20OOP%20-%20Class.ts, a property must be populated either on initialization
//    or within the constructor (but not in a function called from the constructor). The definite assignment assertion allows to overcome that:
class Person {
  name!: string; // no default value and not initialized within the constructor, but with definite assignment assertion
  constructor() { this.initialize(); }
  initialize() { this.name = "Alice"; } // now, name is assigned a value
  greet() {
    console.log('Hello, my name is ${this.name}'); // no compile-time error
  }
}

// @@@ ! when the variable is actually used

// If a variable or property is declared WITHOUT definite assignment assertion, you can use the non-null assertion operator
//    when READING FROM it if you are confident that it will be assigned a value before use:

let myVar: string; // neither default value nor !
setMyVar(); // it populates myVar in another scope but the current scope doesn't know that
console.log('myVar : ${myVar!}'); // no compile-time error; without ! you would get "Variable 'myVar' is used before being assigned"

// The same method would work in class Person if you move the ! from the declaration of "name" to its consuming by console.log.

// However, all these appoaches are dangerous since they can hide bugs.
// They can cause runtime errors if the variable is indeed uninitialized, but may not be caught on testing in some specific branches of logic.
// You do want this error if the var is supposed to be populated when read from, so try NOT to use ! (in both declaring and reading from the var).
// The only case when you have no choise it's when the var is populated not in the scope where it is declared and read from.

// ### Optional Properties in Objects and Interfaces (?)

// The question mark (?) is used to denote that the property (field) is optional. This means that the property can be provided or it can be omitted.

// It is important to understand that we are not talking about the optionality of the property's value - this is achieved with a "| null" data type.
// We are talking about whether the property exists at all (i.e. the memory is allocated for it).
// It's fine if a field declared with ? will not exist. But if it will exist and it's defined without "| null", a value is not optional - it must be assigned.

interface Person { // it's an "interface" but the example would be the same for "class"
  name: string;
  age?: number;
}

const alice: Person = {
  name: "Alice",
  age: 30
};

const bob: Person = { // no compilation error thanks to ? in "age"
  name: "Bob"
};

console.log(alice); // Output: { name: 'Alice', age: 30 }
console.log(bob); // Output: { name: 'Bob' } - the age property doesn't exist at all

// ### Optional Function Parameters (?)

// When a function parameter is declared with a question mark, that means that the parameter is optional and can be omitted when the function is called:
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
// This contradicts the strict definitions of overriding and overloading since these two functions have different signatures, which corresponds to overloading.
// But such a solution makes practical sense.

// ### Optional Variables

// The question mark is not used for standalone variable declarations.
// Instead, you might use a union type with undefined to achieve a similar effect:
let age: number | undefined;

age = 25;
console.log(age); // Output: 25

age = undefined;
console.log(age); // Output: undefined