// Narrowing refers to the process of refining the type of a variable from a broader type to a more specific type.
// Narrowing occurs when TypeScript can deduce a more specific type for a value based on the structure of the code.
// This can be achieved using different techniques like typeof for primitive types, instanceof for objects, and type guard functions like Array.isArray.
// These techniques help TypeScript to better understand the types at runtime, enabling more precise type checking and reducing the risk of runtime errors.

// @@@ Narrowing with 'typeof' for primitives

function printId(id: number | string) {
	if (typeof id === "string") { // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
		console.log(id.toUpperCase());
	} else {
		console.log(id);
	}
}

// @@@ Narrowing with 'instanceof' for Objects

// instanceof reports if the object is of a particular class or its descendant (directly or through inheritance chain).

class Dog {
  bark() { console.log("Woof!"); }
}
class Cat {
  meow() { console.log("Meow!"); }
}
function makeNoise(animal: Dog | Cat) {
  if (animal instanceof Dog) { // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    animal.bark();
  } else {
    animal.meow();
  }
}

// Note that instanceof only works with classes, but not with interfaces.
// The instanceof operator is a JavaScript runtime operator that checks if an object is an instance of a particular class or constructor function.
// instanceof cannot be used with interfaces since they are compile-time constructs that don't exist at runtime - they are completely erased during compilation to JavaScript.

// @@@ Narrowing with 'in' for interfaces and plain objects

// Before accessing a memeber property (function or field) of the checked object, simply make sure that the property exists in it by using the 'in' operator:

interface Dog {
  bark(): void;
}

interface Cat {
  meow(): void;
}

function makeSound(animal: Dog | Cat) {
  if ("bark" in animal) { // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    animal.bark();
  } else {
    animal.meow();
  }
}

// Note that the property is passed as a string. If it's a function, the function name is passed without ().

// In plain object, the usage is same:
function printVal(val: { a: number } | { b: string }) {
  if ("a" in val) { // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    console.log(val.a); // x is { a: number }
  } else {
    console.log(val.b); // x is { b: string }
}

// @@@ Narrowing with Array.isArray

// To check if an object is an Array, use Array.isArray:
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    console.log("Hello, " + x.join(" and "));
  } else {
    console.log("Welcome lone traveler " + x);
  }
}

// Sometimes you’ll have a union where all the members have something in common.
// For example, both arrays and strings have a slice method
//  If every member in a union has a property in common, you can use that property without narrowing:
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3); // return type is inferred as number[] | string
}

// @@@ Assertion Functions

// Assertion functions in TypeScript are special functions used to assert certain conditions in your code.
// When you use an assertion function, TypeScript narrows the type based on the asserted condition.
// These functions are particularly useful for custom type guards, ensuring that a variable conforms to a specific type at runtime.

// Instead of returning boolean as regular type guard functions, they:
//		throw an error if a condition is not met, and
//		inform TypeScript about the type of a variable if the condition is met.
// They help ensure that variables conform to expected types and can be used to provide more precise type information.

// Let's create an assertion function to check if a given value is a string:

function assertIsString(value: any): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value is not a string");
  }
}

function printLength(value: any) {
  assertIsString(value);
  console.log(value.length); // TypeScript knows `value` is a string here
}

printLength("Hello"); // Output: 5
printLength(123);     // Throws an error: Value is not a string

// @@@ Functions overloading as a type-guard:

// Since JavaScript is a dynamic language, we can often call the same function with different types of arguments. Consider the following code:
function add(x, y) {
	return x + y;
}
let result1 = add(1, 1); // 2
let result2 = add("1", "1"); // "11"
// In TypeScript, you can add strong typing using an overload-like syntax.
// The first two definitions just check the types of the parameters and, if they are good, call the function itself (with the body).
function add(a: string, b: string) : string; // no body!
function add(a: number, b: number) : number; // no body!
function add(a: any, b: any): any {return a + b;} // the final signature (which includes the function body) MUST use the any type!
let result1 = add(1, 1); // 2
let result2 = add("1", "1"); // "11"
let result3 = add(1, false); // error: Argument of type 'true' is not assignable to parameter of type 'number'