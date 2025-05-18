//### Generics

// Generics provide variables to types. A common example is an array. An array without generics could contain anything.
// An array with generics can describe the values that the array contains.
type StringArray = Array<string>;
type NumberArray = Array<number>;
type NameArray = Array<{ name: string }>;

// You can declare your own types that use generics:
interface Backpack<T> {
  add: (obj: T) => void;
  get: () => T;
}
declare const backpack: Backpack<string>; // a shortcut to tell TypeScript there is a constant called `backpack`, and to not worry about where it came from
const b = backpack.get(); // b is a string, because get() of Backpack<string> returns string
backpack.add(23); // ERROR: Argument of type 'number' is not assignable to parameter of type 'string'

// Generics in TypeScript provide a way to create reusable components that can work with a variety of data types.
// They enable developers to define functions, classes, interfaces, and methods that can operate on different types without sacrificing type safety.

// @@@ Generic Function

// A generic function can operate on different types while retaining the type information.

function identity<T>(arg: T): T {
  return arg;
}

let num = identity<number>(42); // using the generic function with a number
console.log(num); // outputs: 42

let str = identity<string>("Hello");// using the generic function with a string
console.log(str); // outputs: Hello

let inferredNum = identity(123); // type inference allows us to omit the type argument
console.log(inferredNum); // outputs: 123

let inferredStr = identity("World");
console.log(inferredStr); // outputs: World

// @@@ Generic Class

// A generic class can operate on different types specified when the class is instantiated.

class Box<T> {
  content: T;

  constructor(content: T) {
    this.content = content;
  }

  getContent(): T {
    return this.content;
  }
}

let stringBox = new Box<string>("A string"); // creating an instance of the generic class with a string
console.log(stringBox.getContent()); // outputs: A string

let numberBox = new Box<number>(123); // creating an instance of the generic class with a number
console.log(numberBox.getContent()); // outputs: 123

// @@@ Generic Interface

// A generic interface can be used to define the shape of objects with various types.

// A generic interface that defines a pair of values of different types:
interface Pair<F, S> {
  first: F;
  second: S;
}

let numberStringPair: Pair<number, string> = {
  first: 1,
  second: "one"
};

let stringBooleanPair: Pair<string, boolean> = {
  first: "true",
  second: true
};

// @@@ Generic Constraints

// Generic constraints allow you to restrict the types that can be used with generics.

interface Lengthwise {
  length: number;
}

// A generic function with a constraint that ensures the argument has a length property.
// The T type doesn't really have to implement the Lengthwise interface - it only has to have a length property.
// In other words, if it has a length property, it is considered to be of Lengthwise type (“duck typing”).
function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// This works because string has a length property:
logLength("Hello"); // outputs: 5

// This works because array has a length property:
logLength([1, 2, 3]); // outputs: 3

// This would cause an error because number does not have a length property:
// logLength(123); // Error: Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.

// @@@ Generic type parameter

type FilterFuncType = {
	<T>(arr: T[], callbackFunc: (item: T) => boolean): T[] // TypeScript will INFER the type from the actually passed values
}
let filter: FilterFuncType = (arr, callbackFunc) => {
	let resultArr = []
	for(let item of arr) {
		if (callbackFunc(item)) {
			resultArr.push(item)
		}
	}
	return resultArr
}
// TypeScript INFERS the type as number:
filter([1, 2, 3], _ => _ > 1) // returns [2, 3]
// TypeScript INFERS the type as string:
filter(['a', 'b', 'c'], _ => _ !== 'b') // returns ['a', 'c']
// TypeScript INFERS the type as {firstName: string}:
let namesArray = [
	{firstName: 'beth'},
	{firstName: 'buba'},
	{firstName: 'xin'}
]
filter(namesArray, _ => _.firstName.startsWith('b')) // returns [{firstName: 'beth'}, {firstName: 'buba'}]

// @@@ Generic type parameter with a default value

// Just as you give function parameters default values, you can give generic types presets:
type MyEvent<T = HTMLElement> = {
	target: T
	type: string
}
// Or add a constraint on T to ensure that T is an HTML element:
type MyEvent<T extends HTMLElement = HTMLElement> = {
	target: T
	type: string
}
// Like optional parameters in a function, generic types with presets should come after generic types without default values:

type MyEvent2<Type extends string, Target extends HTMLElement = HTMLElement> = { // good!
	target: Target
	type: Type
}

type MyEvent3<Target extends HTMLElement = HTMLElement, Type extends string> = { // Error: Required type parameters may not follow optional type parameters
	target: Target
	type: Type
}