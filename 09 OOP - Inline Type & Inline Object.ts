// This file discusses the object created in the code by describing its structure.
// Not to be confused with objects as instances of classes discussed in "10 OOP - Class.ts" file.

// @@@ Object Literal (Inline Object, aka Plain Object)

// An object literal is an expression that creates a new object by specifying its properties and values as key-value pairs within curly braces {} "on the fly" -
//    directly at the point of use (an object literal is usually assigned to a variable, passed as an actual parameter or returned from a function).
// Unlike instances of classes or predefined types, an object literal does not rely on any existing named interface, type alias or class —
//    the structure and type of the inline object are implicitly defined at the point of creation.
// In other words, with an object literal, the act of creating the object also defines its shape (type). TypeScript infers the type from the structure provided.

// So, an object literal is both:
//    1. A runtime instance (object in memory), and
//    2. A structural type definition, implicitly declared through its shape.

// Here's an example of an inline object with various types of values:
let person = {
  name: "Alice",         // string
  age: 30,               // number
  isStudent: false,      // boolean
  hobbies: ["reading", "traveling"], // array of strings
  address: {             // nested inline object
    street: "123 Main St",
    city: "Wonderland",
    zipCode: 12345
  },
  greet: function() {    // function
    console.log(`Hello, ${this.name}!`);
  }
};
// Here, person is an object created via a literal. Its type is automatically inferred as
{
  name: string;
  age: number;
  isStudent: boolean;
  hobbies: string[];
  address: {
    street: string;
    city: string;
    zipCode: number;
  };
  greet: () => void;
}

// Usage example:
console.log(person.name); // output: Alice
console.log(person.hobbies[1]); // output: traveling
person.greet(); // output: Hello, Alice!

// Inline objects can be useful sometimes, especially if they are very small. However, they are considered a bad practice in many situations.
// Despite appearing fully typed at first glance, inline objects compromises type safety:
//    1. When describing an object, you can make a mistake, and the compiler will not correct you.
//    2. When passing the created object to a function, you will eather pass it as 'any' (a lack of strongly typing),
//            or describe its shape in the function signature (code duplication).

// To resolve all the listed issues, you can provide type annotations to ensure that the objects conform to a specific structure.
// So, the object will not be "inline" anymore.
// Interfaces, type aliases and classes (they all will be decribed later) can be used to define the structure of inline objects, ensuring type safety.
// These data structures will be decribed later; for now, think of them as something that enforces the shape of the object you are creating.

// The next example demonstrates a solution with type annotations using interfaces:
interface Address {
  street: string;
  city: string;
  zipCode: number;
}

interface Person {
  name: string;
  age: number;
  isStudent: boolean;
  hobbies: string[];
  address: Address; // <<<<<<< must be of type Address
  greet: () => void;
}

let person: Person = { // <<<<<<< must be of type Person
  name: "Alice",
  age: 30,
  isStudent: false,
  hobbies: ["reading", "traveling"],
  address: {
    street: "123 Main St",
    city: "Wonderland",
    zipCode: 12345
  },
  greet: function() {
    console.log(`Hello, ${this.name}!`);
  }
};

// @@@ Inline Type (or Anonymous Interface)

// An inline type is a type declaration defined directly within an expression without being named or assigned separately.

// In the next example
function greet(person: { name: string; age: number }) {
  console.log(`Hello, ${person.name}!`);
}
// { name: string; age: number } is an inline type/anonymous interface - it's not defined somewhere else with a name.

// Usage example:
greet({ name: "Alice", age: 30 });

// As with Inline Objects, try to use named types instead of Inline Types for the benefits of type safety, for example:

interface Person {
  name: string;
  age: number;
}

function greet(person: Person) { // not an inline type anymore!
  console.log(`Hello, ${person.name}!`);
}

// Usage example:
const alice: Person = { name: "Alice", age: 30 };
greet(alice);

// You can still use object literals that match the shape:
greet({ name: "Bob", age: 25 });

// Again, Inline Types are considered a bad practice - like Inline Objects. The reasons are detailed below:

// #1
// Loss of Semantic Meaning:
// With inline types - what exactly is this object?
function process(data: { id: string; values: number[] }) { /* ... */ }
// With named types - clear meaning (named types serve as documentation and make your code's intent more apparent):
function process(data: AnalyticsReport) { /* ... */ }

// #2:
// Confusing structurally identical entities:
// TypeScript uses structural typing, which means objects are compatible if they have the same structure, regardless of their declared type name.
// With inline object types, you lose the nominal type information that helps distinguish between structurally identical but semantically different objects:
function processUser({ id: string, name: string }) { /* ... */ }
function processProduct({ id: string, name: string }) { /* ... */ }

// #3:
// Refactoring:
// When you need to refactor, inline types require changes across many files, with a high risk of forgetting to change all the spots and getting runtime errors.
// Named types let you change the definition in one place and get compilation errors if you forogot to update some spots.

// #4:
// Hidden Type Duplication:
// Inline types can introduce unnoticed type duplication across your codebase, making it harder to maintain a single source of truth for your domain models.
// When types evolve in different places independently, they can diverge subtly, causing runtime errors that are hard to trace.

// #5:
// TypeScript generates less helpful error messages with inline types:
//    With inline types:
//        Error: Type '{ id: string; name: string; active: boolean; }' is not assignable to type '{ id: string; name: string; }'.
//        Property 'active' does not exist in type '{ id: string; name: string; }'
//    With named types, thee error is clearer about which conceptual types are incompatible.:
//        Error: Type 'AdminUser' is not assignable to type 'BasicUser'.
//        Property 'active' does not exist in type 'BasicUser'.

// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// The following concepts use inline objects as examples.
// But they apply to regular objects, created from named types, as well.
// ------------------------------------------------------------------------------------------------------------------------------------------------------------

// @@@ Accessing properties using the bracket notation

// Let's consider this simple object:
let worker = { //
	id: 1,
	name: "test"
}

// Usually, we access its properties with the dot notation:
let id = worker.id;
let name = worker.name;

// However, we can also use the bracket notation, or the Map-like syntax:
let id = worker["id"];
let name = worker["name"];
// The bracket notation allows to built the property name dynamically, which can improve your code in some situations.

// @@@ Three dots (...) as the SPREAD operator

// The ... operator allows you to extract ALL the properties from one object and copy to another:
let origSheep = { id: 1, name: "Dolly" };
let clonedSheep = { ...origSheep };
console.log('clonedSheep : ${JSON.stringify(clonedSheep)}'); // clonedSheep : {"id":1,"name":"Dolly"}

// Adding new properties and overriding existing ones:
const updatedPerson = {
  ...person, // extract all the properties from person,
  age: 26, // then override one of them,
  country: "USA", // and then add a new property
};
console.log(updatedPerson); // Outputs: { name: 'Alice', age: 26, country: 'USA' }

// The object spread operator allows you to merge multiple objects into one, i.e. create a new object by combining the properties of existing objects:
const person = {
  name: "Alice",
  age: 25,
};

const job = {
  occupation: "Engineer",
  company: "TechCorp",
};

// Combine properties of `person` and `job` into a new object:
const worker = {
  ...person,
  ...job,
};
console.log(worker); // Outputs: { name: 'Alice', age: 25, occupation: 'Engineer', company: 'TechCorp' }

// When using object spread, properties will be copied incrementally.
// In other words, if two objects have a property with the same name, the property of the object specified last will take precedence:
let objPrec1 = { id: 1, name: "object prec 1" };
let objPrec2 = { id: 1001, description: "object prec 2 descripton" }
let obj4 = { ...objPrec1, ...objPrec2 }; // that takes id of the last listed object, i.e. 1001
console.log('obj4 : ${JSON.stringify(obj4)}'); // obj4 : {"id":1001,"name":"object prec 1","description":"object prec 2 descripton"}

// This is not on the topic of this file, but we will still note: the spread operator can be used to add values ​​to an existing array:
let arr = [1, 2, 3, 4, 5];
console.log('arr=${arr}'); // arr=1,2,3,4,5
arr = [...arr, 6, 7, 8];
console.log('arr=${arr}'); // arr=1,2,3,4,5,6,7,8

// @@@ Three dots (...) as the REST operator

// The ... operator allows you to extract the REMAINING properties from one object and copy to another:

// That happens when the ... operator follows at least one explicitly named property or element.
// It collects all remaining properties that weren't explicitly named in the destructuring pattern.

// The destructuring assignment must follow this pattern:
// * Specific properties extracted individually are listed first.
// * The rest operator is the last element, as it captures "everything else" after specific items have been extracted.
// In the previous examples (where ... is used as the SPREAD operator), this pattern was not followed, so ALL properties were extracted.

const person = {
  name: "Alice",
  age: 25,
  occupation: "Engineer",
  country: "USA",
};

// Extract name and age individually, and create a new object with the REST of the properties:
const { name, age, ...theRestOfTheProperties } = person; // that declares three constants: name, age and theRestOfTheProperties
console.log(name); // Outputs: Alice
console.log(age); // Outputs: 25
console.log(theRestOfTheProperties); // Outputs: { occupation: 'Engineer', country: 'USA' }

// TypeScript will check if name & age properties exist in person.
// If they don't, and if you have strict type checking enabled, TypeScript will show a compilation error.
// TypeScript will infer the types of name & age based on the type of person.
// If name & age properties don't exist in person and strict type checking is disabled, name & age constants will be created as undefined.

// Using the REST operator as vararg in functions

// When used in function parameters, it collects multiple actual parameters into a single array:
function myFunc(arg1: string, arg2: string, ...args: number[]) {
  ...
}
// Sample calls:
myFunc("aaa", "bbb");
myFunc("aaa", "bbb", 1);
myFunc("aaa", "bbb", 1, 2);
myFunc("aaa", "bbb", 1, 2, 3);