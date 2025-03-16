// This file discusses the object created in the code by describing it's structure.
// Not to be confused with objects as instances of classes discussed in "10 OOP - Class.ts" file.

//### Inline Objects

// In TypeScript, objects created inline refer to object literals that are defined directly in the code, without being instances of a class.
// These object literals are a common way to define and use data structures on the fly.

// An inline object in TypeScript is defined using curly braces {} and consists of key-value pairs.
// The keys are typically strings (but can also be symbols), and the values can be of any type, including other objects, arrays, functions, etc.

// Here's a basic example of an inline object with various types of values:
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
    console.log("Hello!");
  }
};

console.log(person.name); // Output: Alice
console.log(person.hobbies[1]); // Output: traveling
person.greet(); // Output: Hello!

// Type Annotations for Inline Objects
// You can provide type annotations to ensure that the inline objects conform to a specific structure.
// Interfaces or type aliases can be used to define the structure of inline objects, ensuring type safety.

// Using an Interface:
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
  address: Address;
  greet: () => void;
}

let person: Person = {
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
    console.log("Hello!");
  }
};

// Using a Type Alias:
type Address = {
  street: string;
  city: string;
  zipCode: number;
};

type Person = {
  name: string;
  age: number;
  isStudent: boolean;
  hobbies: string[];
  address: Address;
  greet: () => void;
};

let person: Person = {
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
    console.log("Hello!");
  }
};

//### Optional properties
// Much of the time, we’ll find ourselves dealing with objects that might have a property set.
// In those cases, we can mark those properties as optional by adding a question mark (?) to the end of their names.
interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}
function paintShape(opts: PaintOptions) { ... }
const shape = getShape();
paintShape({ shape });
paintShape({ shape, xPos: 100 });
paintShape({ shape, yPos: 100 });
paintShape({ shape, xPos: 100, yPos: 100 });

//### readonly properties
// Properties can also be marked as readonly for TypeScript.
// While it won’t change any behavior at runtime, a property marked as readonly can’t be written to during type-checking.
interface SomeType {
  readonly prop: string = "Hi!";
}
 
function doSomething(obj: SomeType) {
  console.log(`prop has the value '${obj.prop}'.`);
  obj.prop = "hello"; // error: Cannot assign to 'prop' because it is a read-only property.
}
// Using the readonly modifier doesn’t necessarily imply that a value is totally immutable - or in other words, that its internal contents can’t be changed.
// It just means the property itself can’t be re-written to:
interface Home {
  readonly resident: { name: string; age: number };
}
function visitForBirthday(home: Home) {
  // We can read and update properties from 'home.resident'.
  console.log(`Happy birthday ${home.resident.name}!`);
  home.resident.age++; // success - we don't change resident, we chage its property
}

//### Accessing properties:
// При работе с объектами JavaScript довольно часто их определяют с помощью имен свойств, которые являются строками, как видно из приведенного ниже кода:
let normalObject = { // the normal way
	id : 1,
	name : "test" }
let stringObject = { // properties names are strings!
	"testProperty": 1,
	"anotherProperty": "this is a string"
}
 // Мы можем обращаться к этим строковым свойствам двумя способами:
let testProperty = stringObject.testProperty; // the normal way
let testStringProperty = stringObject["testProperty"]; // the assotiative array / hashtable syntax

//### Extending Types

interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
 
interface AddressWithUnit extends BasicAddress {
  unit: string;
}

// interfaces can also extend from multiple types:

interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}
interface ColorfulCircle extends Colorful, Circle {}
const cc: ColorfulCircle = {
  color: "red",
  radius: 42,
};

// Intersection Types (for type aliases)
// interfaces allowed us to build up new types from other types by extending them.
// TypeScript provides another construct called intersection types that is mainly used to combine existing object types.
// An intersection type is defined using the & operator.

interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}
type ColorfulCircle = Colorful & Circle;

//### Object rest and Object spread (the ... operator)

// In TypeScript (and JavaScript), the object rest and spread operators (...) are powerful features that allow for concise and flexible manipulation of objects.
// These operators are used to extract properties from objects (rest) and combine properties from multiple objects (spread).

// @@@ Object Rest
// The object rest operator allows you to extract remaining properties from an object into a new object.
// This is useful when you want to separate some properties from the rest of the properties in an object.

const person = {
  name: "Alice",
  age: 25,
  occupation: "Engineer",
  country: "USA",
};

// Extract name and age properties, and the rest goes into theRestOfTheProperties object
const { name, age, ...theRestOfTheProperties } = person;

console.log(name); // Outputs: Alice
console.log(age); // Outputs: 25
console.log(theRestOfTheProperties); // Outputs: { occupation: 'Engineer', country: 'USA' }

// Copy all the properties of firstObj to another object called secondObj using the rest operator syntax:
let firstObj = { id: 1, name: "firstObj" };
let secondObj = { ...firstObj };
console.log('secondObj : ${JSON.stringify(secondObj)}'); // secondObj : {"id":1,"name":"firstObj"}

// Using the rest operator with arrays (in fact, in this example we extract ALL the properties, not the REST):
let firstArray = [1, 2, 3, 4, 5];
console.log('firstArray=${firstArray}'); // firstArray=1,2,3,4,5
firstArray = [...firstArray, 6, 7, 8]; // use the rest operator syntax to add values ​​to an existing array
console.log('firstArray=${firstArray}'); // firstArray=1,2,3,4,5,6,7,8

// @@@ Object Spread
// The object spread operator allows you to create a new object by combining the properties of existing objects.
// This is useful for cloning objects or merging multiple objects into one.

const person = {
  name: "Alice",
  age: 25,
};

const job = {
  occupation: "Engineer",
  company: "TechCorp",
};

// Combine properties of `person` and `job` into a new object
const personWithJob = {
  ...person,
  ...job,
};

console.log(personWithJob); // Outputs: { name: 'Alice', age: 25, occupation: 'Engineer', company: 'TechCorp' }

// Adding new properties and overriding existing ones
const updatedPerson = {
  ...person,
  age: 26, // overrides the existing age property
  country: "USA", // adds a new property
};

console.log(updatedPerson); // Outputs: { name: 'Alice', age: 26, country: 'USA' }

// We can use this syntax to combine multiple objects. This is called object spread:
let nameObj = { name: "nameObj" };
let idObj = { id: 2 };
let obj3 = { ...nameObj, ...idObj }; // copy all properties from nameObj and all properties from idObj to new object obj3
console.log('obj3 : ${JSON.stringify(obj3)}'); // obj3 : {"name":"nameObj","id":2} - the properties of both objects were combined into one

// When using object spread, properties will be copied incrementally.
// In other words, if two objects have a property with the same name, the property of the object specified last will take precedence:
let objPrec1 = { id: 1, name: "object prec 1" };
let objPrec2 = { id: 1001, description: "object prec 2 descripton" } // overwrites 1 in id
let obj4 = { ...objPrec1, ...objPrec2 };
console.log('obj4 : ${JSON.stringify(obj4)}'); // obj4 : {"id":1001,"name":"object prec 1","description":"object prec 2 descripton"}

// @@@ Combining Rest and Spread
// You can also combine object rest and spread operators for more advanced object manipulations.
const person = {
  name: "Alice",
  age: 25,
  occupation: "Engineer",
  country: "USA",
};

// Extract name and age, and create a new object with remaining properties
const { name, age, ...theRestOfTheProperties } = person; // theRestOfTheProperties contains { occupation: 'Engineer', country: 'USA'}

// Create a new object with some properties from theRestOfTheProperties and additional properties
const updatedPerson = {
  ...theRestOfTheProperties,
  country: "Canada", // overrides the country property
  city: "Toronto", // adds a new property
};
console.log(updatedPerson);
// Outputs: { occupation: 'Engineer', country: 'Canada', city: 'Toronto' }