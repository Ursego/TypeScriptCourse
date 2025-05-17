////////////////////////////////////////////////
// Type		Subtype
////////////////////////////////////////////////
// boolean	Boolean literal
// bigint	BigInt literal
// number	Number literal
// string	String literal
// symbol	unique symbol
// object	Object literal
// Array	Tuple
// enum	const enum
////////////////////////////////////////////////

// To learn the type of a variable, use typeof:

////////////////////////////////////////////////
// Type			Predicate
////////////////////////////////////////////////
// string		typeof s === "string"
// number		typeof n === "number"
// boolean		typeof b === "boolean"
// undefined	typeof undefined === "undefined"
// function		typeof f === "function"
// array		Array.isArray(a)	Remark: applying typeof to an array returns "object" since, in TS, arrays are objects (in contrast to JS)
////////////////////////////////////////////////

// @@@ Any
// Whatever can be assigned to the var:
let item1 : any = { id: 1, name: "item 1" };
item1 = { id: 2 }; // compiles successfully

// @@@ Type inference
// When you declare a var without an initial value and without specifying a type, TypeScript infers the type as any, allowing the var to hold values of any type.
// This means that the following code is valid, and no type errors will be raised ("the JavaScript behavior"):
let anyType; // TypeScript infers `any`
anyType = "String";
anyType = 42;
anyType = true;

// However, if you declare a variable and immediately assign it a value, TypeScript will infer the type of the variable based on that initial assignment:
let inferredString = "Hello, TypeScript!"; // TypeScript infers `string`
inferredString = 42; // Error: Type 'number' is not assignable to type 'string'

// noImplicitAny flag in TypeScript's tsconfig.json file:
// When set to true, TypeScript will raise an error if a variable is declared without an explicit type and without an initial value that allows to infer the type:
let greeting; // error: Variable 'greeting' implicitly has an 'any' type.
greeting = "Hello";
// This helps catch potential issues early by making sure that all types are explicitly declared or can be inferred by the TypeScript compiler.
// noImplicitAny is active only when strict mode is enabled in tsconfig.json.

// @@@ Null и undefined:

// By default, values like null and undefined are assignable to any other type.
// Forgetting to handle null and undefined is the cause of countless bugs in the world.
// The strictNullChecks flag makes handling null and undefined more explicit, and spares us from worrying about whether we forgot to handle null and undefined.

// In JavaScript, if a variable has been declared but not assigned a value, asking for its value will return undefined.
// JavaScript also includes the null keyword to distinguish between cases where a variable is known but has no value:
function testUndef(test) {
	console.log('test parameter :' + test);
}
testUndef(); // test parameter :undefined
testUndef(null); // test parameter :null
// TypeScript includes two keywords we can use in this case, null and undefined. Let's rewrite this function in TypeScript:
function testUndef(test: null | number) {
	console.log('test parameter :' + test);
}
testUndef(); // Error: Expected 1 arguments, but got 0

let x : number | undefined;
x = 1;
x = undefined; // ok
x = null; // Error: Type 'null' is not assignable to type 'number | undefined'

// Null operands:
// TypeScript also checks for null or undefined values ​​when we use basic operands,
// such as addition, multiplication, less than, modulo, and power.
// TypeScript will detect where we use operands and make sure both sides of the operands are real numbers:
function testNullOperands(arg1: number, arg2: number | null | undefined) {
	let a = arg1 + arg2; // Error: Object is possibly 'null' or 'undefined'
	let b = arg1 * arg2; // Error: Object is possibly 'null' or 'undefined'
	let c = arg1 < arg2; // Error: Object is possibly 'null' or 'undefined'
}

// @@@ Never:
// TypeScript introduces a type to specify cases where something should never happen.
// never is the type of a function that never returns anything (throws an exception or runs forever):
function d() {
	throw TypeError('I always error')
}
function e() {
	while (true) {
		doSomething()
	}
}
// Both of these will never return anything, so their return type is inferred as never.

// @@@ Unknown:
// It can be considered as a safe equivalent of the any type. In other words, before using a variable marked as unknown, we must explicitly cast it to a known type.
// Let's look at the similarities between unknown and any:
let unknownType: unknown = "an unknown string";
console.log('unknownType : ${unknownType}'); // unknownType : an unknown string
unknownType = 1;
console.log('unknownType : ${unknownType}'); // unknownType : 1
// However, if we try to assign the unknownType variable to a known type, we see the difference between any and unknown:
let numberType: number;
numberType = unknownType; // Error: Type 'unknown' is not assignable to type 'number'
// To fix the Error, we need to explicitly cast the unknownType variable to type number:
numberType = <number>unknownType;
// The unknown type is treated as a safe version of the any type, since we are forced to explicitly cast from the unknown type to the known type before using the variable.

// @@@ Explicit casting (aka Type Assertion):
// An object can be cast to the type of another object using the < > syntax.
// This is not a cast in the strictest sense of the word; it is more of an assertion that is used at compile time by the TypeScript compiler.
let item1 = <any>{ id: 1, name: "item 1" }; // the type of item1 is inferred as any, not hardcoded
item1 = { id: 2 };
// If you're using document.getElementById, TypeScript only knows that this will return some kind of HTMLElement, but you might know that your page will always have an HTMLCanvasElement with a given ID:
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement
// You can also use the angle-bracket syntax (except if the code is in a .tsx file), which is equivalent:
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas")
// TypeScript only allows type assertions which convert to a more specific or less specific version of a type (both the types must be in the same inheritance chain):
const x = "hello" as number;
// Compilation-time error:
//		Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other.
//		If this was intentional, convert the expression to 'unknown' first.
// Because type assertions are removed at compile-time, there is no runtime checking associated with a type assertion.
// There won't be an exception or null generated if the type assertion is wrong.

//### Union:

// A union type is a type formed from two or more other types, representing values that may be any one of those types. 
// A union type allows you to specify that a variable or function parameter can hold one of several types.
// This is useful for defining variables that can have multiple types of values.

let value: string | number; // a variable that can be a string or a number
value = "Hello";
console.log(value); // Outputs: Hello
value = 42;
console.log(value); // Outputs: 42
let values = (string | number)[] // an array each element of which can be either a string or a number
let a = string | number[] // a var the value of which can be either a string or an array of numbers

// Function with union type parameter
function printId(id: string | number): void {
  console.log(`ID: ${id}`);
}
printId("abc123"); // Outputs: ID: abc123
printId(789); // Outputs: ID: 789

// TypeScript will only allow you to do things with the union if that thing is valid for every member of the union.
// For example, if you have the union string | number , you can't use methods that are only available on string:
function printId(id: number | string) {
	console.log(id.toUpperCase()); // Error: Property 'toUpperCase' does not exist on type 'string | number'.
}
// The solution is to narrow the union with code, the same as you would in JavaScript without type annotations.

//### Type alias:

type Age = number;
type ID = number | string;
type Person = {
	id: ID;
	name: string;
	age: Age;
}
// When you use the alias, it’s exactly as if you had written the aliased type:
type StringOrNumber = string | number;
type NullableString = string | null;
function someFunc(someArg: StringOrNumber): NullableString { ... }
function someFunc(someArg: string | number): string | null { ... } // the same

type CallbackWithString = (string) => void; // alias of type "function which gets string and returns void"
function usingCallbackWithString(callback: CallbackWithString ) {
	callback("this is a string");
}

//### Literal Types

let x: "hello" = "hello";
x = "hello"; // OK
x = "howdy"; // Error: Type '"howdy"' is not assignable to type '"hello"'.
// It's not much use to have a variable that can only have one value!
// But by combining literals into unions, you can express a much more useful concept - for example, functions that only accept or returns a certain set of known values:
function printText(s: string, alignment: "left" | "right" | "center") { ... }
printText("G'day, mate", "centre"); // Error: Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"
function compare(a: string, b: string): -1 | 0 | 1 {
	return a === b ? 0 : a > b ? 1 : -1;
}
// You can combine these with non-literal types:
interface IOptions { width: number; }
function configure(x: IOptions | "auto") { ... }
configure({ width: 100 });
configure("auto");
configure("automatic"); // Error: Argument of type '"automatic"' is not assignable to parameter of type 'IOptions | "auto"'.

// A popular use-case for union types is to describe the set of string or number literals that a value is allowed to be (i.e. it acts like enum):
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type PositiveOddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;

//### Union and intersection types:

// The union of A and B is their sum (everything that is in A, or B, or both), while the intersection is what they have in common (everything that is in both A and B).
type Cat = {name: string, purrs: boolean};
type Dog = {name: string, barks: boolean, wags: boolean};
type CatOrDogOrBoth = Cat | Dog; // has 4 fields
type CatAndDog = Cat & Dog; // only name: string

//### Declaring variables with "typeof"

// The typeof operator can be used to infer the type of a variable or the return type of a function.

// @@@ Declaring a variable with the type of an existing variable
// You can use the typeof operator to declare a variable that has the same type as an existing variable.
// This helps maintain type consistency and reduces the need to duplicate type definitions.
let originalVar = { name: "Alice", age: 30 };
let newVar: typeof originalVar;
newVar = { name: "Bob", age: 25 }; // correct
newVar = { name: "Charlie" }; // error: Property 'age' is missing in type '{ name: string; }' but required in type '{ name: string; age: number; }'.

// @@@ Declaring a variable with the return type of an existing function
function getPerson() {
  return { name: "Alice", age: 30 };
}
let person: typeof getPerson();
person = { name: "Bob", age: 25 }; // correct
person = { name: "Charlie" }; // error: Property 'age' is missing in type '{ name: string; }' but required in type '{ name: string; age: number; }'.
// That is exceptionally useful if you declare a variable to accomodate a value returned by a function:
let alice: typeof getPerson();
alice = getPerson();
// Of course, the type can be simply inferred if the var is populated when declared:
let alice = getPerson();
// But sometimes variables are populated not in the scope where they are declared.

// @@@ Declaring a parameter with the type of an existing variable
let user = { name: "Alice", age: 30 };
function printUserInfo(userInfo: typeof user) {
  console.log(`Name: ${userInfo.name}, Age: ${userInfo.age}`);
}
printUserInfo({ name: "Bob", age: 25 }); // correct
printUserInfo({ name: "Charlie" }); // error: Property 'age' is missing in type '{ name: string; }' but required in type '{ name: string; age: number; }'.

// @@@ Declaring a function return type with the type of an existing variable
function getPerson() {
  return { name: "Alice", age: 30 };
}
function getAnotherPerson(): typeof getPerson { // returns the same type as getPerson's return type
  return { name: "Bob", age: 25 };
}
let person = getPerson();
person = getAnotherPerson(); // ok - the types fit