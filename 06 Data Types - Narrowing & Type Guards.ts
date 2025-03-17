//### Narrowing

// Narrowing refers to the process of refining the type of a variable from a broader type to a more specific type.
// Narrowing occurs when TypeScript can deduce a more specific type for a value based on the structure of the code.
// This can be achieved using different techniques like typeof for primitive types, instanceof for objects, and type guard functions like Array.isArray.
// These techniques help TypeScript to better understand the types at runtime, enabling more precise type checking and reducing the risk of runtime errors.

// Narrowing with typeof for primitives:
function printId(id: number | string) {
	if (typeof id === "string") {
		console.log(id.toUpperCase());
	} else {
		console.log(id);
	}
}

// Narrowing with instanceof for Objects:
class Dog {
  bark() { console.log("Woof! Woof!"); }
}
class Cat {
  meow() { console.log("Meow! Meow!"); }
}
function makeNoise(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}
// Stightly re-written version of makeNoise - using a pointer to a function (a function var):
function makeNoise(animal: Dog | Cat) {
  const makeSound = (animal instanceof Dog) ? animal.bark.bind(animal) : animal.meow.bind(animal);
  makeSound();
}
// instanceof reports of one object is inherited from another (directly or through inheritance chain)
murka instanceof cat // true
murka instanceof mammal // true
murka instanceof animal // true

// @@@ Type guard function with "is"

// Type guards in TypeScript are functions or constructs that allow you to narrow down the type of a variable within a conditional block.
// One powerful feature of TypeScript is the ability to create custom type guards using the is keyword.

// A type guard function is a function that returns a type predicate.
// A type predicate takes the form "paramName is Type", where paramName is the name of the parameter, and Type is the type you're checking for.
// This allows TypeScript to infer the type of a variable within the scope of a conditional block.

// They return boolean even though the return type is not marked with the "boolean" keyword. 
// But they also inform TypeScript about the type of a variable if the condition is met (and true is returned).

// The next examples use the Dog and Cat classes created earlier.
function isDog(animal: Dog | Cat): animal is Dog {
  return (animal as Dog).bark !== undefined;
}
function isCat(animal: Dog | Cat): animal is Cat {
  return (animal as Cat).meow !== undefined;
}
function makeNoise(animal: Dog | Cat) {
  if (isDog(animal)) {
    animal.bark(); // if isDog would return "boolean" rather than "animal is Dog", this line would produce a compile error
  } else if (isCat(animal)) {
    animal.meow();
  }
}
// Using "instanceof" can be simpler and more straightforward for many common cases, and would work in our example:
function isDog(animal: Dog | Cat): animal is Dog {
  return animal instanceof Dog;
}
function isCat(animal: Dog | Cat): animal is Cat {
  return animal instanceof Cat;
}
// The reason for sometimes using the (animal as Dog).bark !== undefined pattern is to demonstrate a more general approach that can handle cases
//    where instanceof might not work as expected, such as with interfaces or plain objects.

// @@@ 'this'-based type guard function

// You can use 'this is Type' in the return position for methods in classes and interfaces.
// When mixed with a type narrowing (e.g. if statements) the type of the target object would be narrowed to the specified Type:
class Cat extends Animal {
  public function meaw(): string { return "Meaw!" }
}

class Dog extends Animal {
  public function woof(): string { return "Woof!" }
}

class Animal {
  isCat(): this is Cat { // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    return this instanceof Cat;
  }
  isDog(): this is Dog { // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    return this instanceof Dog;
  }
}

function makeSound(animal: Animal): string {
	if (animal.isCat()) {
		return animal.meaw();
	} else if (animal.isDog()) {
		return animal.woof();
	} else {
		return "Uuuuuuu!!!";
	}
}

// @@@ Truthiness narrowing:
// We can use any expression in conditionals, && s, || s, if statements, and Boolean negations ( ! ), and more.
// As an example, if statements don't expect their condition to always have the type boolean:
function getUsersOnlineMessage(numUsersOnline: number) {
	if (numUsersOnline) {
		return 'There are ${numUsersOnline} online now!';
	}
		return "Nobody's here. :(";
	}
}

// Another example is to use a function like Array.isArray:
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

//### Assertion Functions

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

//### Functions overloading as a type-guard:

// Since JavaScript is a dynamic language, we can often call the same function with different types of arguments. Consider the following code:
function add(x,y) {
	return x + y;
}
let result1 = add(1,1); // 2
let result2 = add("1","1"); // "11"
// In TypeScript, you can add strong typing using an overload-like syntax.
// The first two definitions just check the types of the parameters and, if they are good, call the function itself (with the body).
function add(a: string, b: string) : string; // no body!
function add(a: number, b: number) : number; // no body!
function add(a: any, b: any): any {return a + b;} // the final signature (which includes the function body) MUST use the any type!
let result1 = add(1,1); // 2
let result2 = add("1","1"); // "11"
let result3 = add(1,false); // error: Argument of type 'true' is not assignable to parameter of type 'number'