/*
Online compiler: https://www.typescriptlang.org/play/
Convert to JavaScript: https://www.tutorialspoint.com/online_typescript_compiler.php

Courses on youtube:
https://www.youtube.com/watch?v=7NU6K4170As
https://www.youtube.com/playlist?list=PLzBCKSyQEHOV7-0B7LqjAR-KWiNHw0Utd
https://www.youtube.com/playlist?list=PLu6MFGxDdilhKzUePH96oqhedQXROTNmg
https://www.youtube.com/watch?v=nyIpDs2DJ_c
https://www.youtube.com/playlist?list=PLNkWIWHIRwMFQBDhZ6HfwO9NL09X3N3Gq (TypeScript & React)

TypeScript Documentation: https://www.typescriptlang.org/docs/

10 Best Typescript Courses, Training, Classes & Tutorials Online: https://www.douglashollis.com/best-typescript-course-training-class-tutorial-certification-online/
*/

//### Naming convention:

// camelCase: variables, functions, methods:
let userName = "Alice";
function calculateTotal() { ... }
class MyClass {
  myMethod() { ... }
}

// PascalCase: types (classes, interfaces, type aliases, enums):
class Car { ... }
interface Product { ... } // optionally, starting with "I" - like IProduct
type UserId = number;
type UserName = string;

// UPPERCASE_WITH_UNDERSCORES: constants, enum fields (which are also constants, in fact):
const API_URL = "https://api.example.com";
enum Status {
  ACTIVE,
  INACTIVE,
  PENDING
}

// cebab-case (lowercase words separated by hyphens): file names:
user-manager.ts

//### Comparison operators

// Equals Operator ( == ):
// While comparing both values, JavaScript runtime will perform type conversions to make both values of same type:
"10" == 10      
// becomes
ToNumber("10") === 10

// Strict Equals Operator ( === ):
// The comparison x === y produces true or false only when the TYPES of x and y ARE SAME, and the values of x and y are equal:
let a = 10;
a === 10 // true
a === '10' // false
// It is advised to use strict equals operator, always.

// Checking whether something == null actually not only checks whether it is specifically the value null - it also checks whether it's potentially undefined.
// The same applies to == undefined: it checks whether a value is either null or undefined:
interface Container {
	value: number | null | undefined;
}
function multiplyValue(container: Container, factor: number) {
	if (container.value != null /* remove both 'null' and 'undefined' from the type */) {
		console.log(container.value);
		//                      ^ = (property) Container.value: number
		// Now we can safely multiply 'container.value' - it's number for sure:
		container.value *= factor;
	}
}

// ### Namespaces:
// A namespace declaration is similar to a class declaration in that it is delimited by an opening and closing curly brace.
// When using namespaces, the class definition will not be visible outside the namespace,
// unless we specifically allow it with the export keyword:
namespace FirstNameSpace {
	export class Exported { id: number | undefined; }
	class NotExported { }
}
let exported = new FirstNameSpace.Exported();
let notExported = new FirstNameSpace.NotExported(); //  Error: Property 'NotExported' does not exist on type 'typeof FirstNameSpace'

// ### Declaration Files and Strict Compiler Options

// A declaration file is a special type of file used by the TypeScript compiler.
// It is marked with a .d.ts extension and then used by the TypeScript compiler in the compilation step.
// Declaration files do not actually generate any JavaScript code.
// They exist to ensure compatibility between TypeScript and external libraries, or to fill in gaps in JavaScript code that TypeScript does not know about.

// ### Promise

// A Promise in TypeScript (and JavaScript) is an object representing the eventual completion or failure of an asynchronous operation.
// It's a proxy for a value not necessarily known when the Promise is created.

// A Promise can be in one of three states:
// * Pending: Initial state, neither fulfilled nor rejected.
// * Fulfilled: The operation completed successfully.
// * Rejected: The operation failed.

// Methods:
// * then(): Handles the fulfillment and/or rejection of a Promise.
// * catch(): Handles any rejection that occurs.
// * finally(): Executes after the Promise is settled, regardless of outcome.

// Basic syntax:
const promise = new Promise<T>((resolve, reject) => {
  // Asynchronous operation
});
// Here, T is the type of the value the Promise will resolve with.

// The Promise constructor takes a single parameter, which is called the executor function:
new Promise<T>(executor: (resolve: (value: T | PromiseLike<T>) => void, 
                          reject: (reason?: any) => void) => void): Promise<T>

// The executor function contains the asynchronous operation. It's called immediately by the Promise implementation. Parameters:

resolve
// Type: (value: T | PromiseLike<T>) => void
// Purpose: A function to be called when the Promise is fulfilled.
// Syntax: resolve(value)
// The value passed to resolve() becomes the fulfillment value of the Promise.
// It accepts either:
// * A value of type T
// * Another Promise-like object (allowing for Promise chaining)

reject
// Type: (reason?: any) => void
// Purpose: A function to be called when the Promise is rejected.
// Syntax: reject(reason)
// The reason passed to reject() becomes the rejection reason of the Promise.
// It typically accepts an Error object or any other value representing the reason for rejection.

// Example:
function delay(ms: number): Promise<void> {
	return new Promise((resolve, reject) => {
	  if (ms < 0) {
		reject(new Error("Delay must be non-negative"));
	  } else {
		setTimeout(() => {
		  resolve();
		}, ms);
	  }
	});
  }
  
  // Usage
  delay(1000)
	.then(() => console.log("Delayed operation completed."))
	.catch((error) => console.error("Error:", error))
	.finally(() => console.log("Operation finished."));

// Key points:
// * The executor function is called synchronously when the Promise is constructed.
// * It should initiate some asynchronous operation.
// * When the operation completes, it should call resolve (for success) or reject (for failure).
// * Any errors thrown synchronously within the executor will cause the Promise to be rejected.

// Where are the resolve & reject function variables declared (which are passed to the Promise constructor)?
// They are not variables that you declare yourself.
// resolve and reject are actually provided by the JavaScript engine when it executes the Promise constructor.
// They are implicitly declared by the Promise implementation and automatically passed into the executor function by the JavaScript runtime.
// The types of resolve and reject are inferred from the Promise constructor's type definition.