//### Generics

// Generics provide variables to types. A common example is an array. An array without generics could contain anything.
// An array with generics can describe the values that the array contains.
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;

// You can declare your own types that use generics:
interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}
declare const backpack: Backpack<string>; // a shortcut to tell TypeScript there is a constant called `backpack`, and to not worry about where it came from
const b = backpack.get(); // object is a string, because we declared it above as the variable part of Backpack
backpack.add(23); // ERROR: Argument of type 'number' is not assignable to parameter of type 'string'.

// Generics in TypeScript provide a way to create reusable components that can work with a variety of data types.
// They enable developers to define functions, classes, interfaces, and methods that can operate on different types without sacrificing type safety.

// Generic Function
// A generic function can operate on different types while retaining the type information.

function identity<T>(arg: T): T {
  return arg;
}
let num = identity<number>(42); // Using the generic function with a number
console.log(num); // Outputs: 42
let str = identity<string>("Hello");// Using the generic function with a string
console.log(str); // Outputs: Hello
let inferredNum = identity(123); // Type inference allows us to omit the type argument
console.log(inferredNum); // Outputs: 123
let inferredStr = identity("World");
console.log(inferredStr); // Outputs: World

// Generic Class
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
let stringBox = new Box<string>("A string"); // Creating an instance of the generic class with a string
console.log(stringBox.getContent()); // Outputs: A string
let numberBox = new Box<number>(123); // Creating an instance of the generic class with a number
console.log(numberBox.getContent()); // Outputs: 123

// Generic Interface
// A generic interface can be used to define the shape of objects with various types.

// A generic interface that defines a pair of values of different types:
interface Pair<T, U> {
  first: T;
  second: U;
}

let numberStringPair: Pair<number, string> = {
  first: 1,
  second: "one"
};

let stringBooleanPair: Pair<string, boolean> = {
  first: "true",
  second: true
};

// Generic Constraints
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

// This works because string has a length property
logLength("Hello"); // Outputs: 5

// This works because array has a length property
logLength([1, 2, 3]); // Outputs: 3

// This would cause an error because number does not have a length property
// logLength(123); // Error: Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.



// Generic (generic type parameter):
type FilterFuncType = {
	<T>(array: T[], callbackFunc: (item: T) => boolean): T[] // TypeScript will INFER the type from the actually passed values
}
let filter: FilterFuncType = (array, callbackFunc) => {
	let result = []
	for (let i = 0; i < array.length; i++) {
		let item = array[i]
		if (callbackFunc(item)) {
			result.push(item)
		}
	}
	return result
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

// We declared <T> as part of the call signature (before the parentheses), and TypeScript will bind a concrete type to T when we call a function of type FilterFuncType. If we had instead limited the range of T to the type alias FilterFuncType, TypeScript would require us to explicitly bind the type when using FilterFuncType:
// T is declared as part of the type FilterFuncType (not part of the concrete type signature), and TypeScript will bind T when you declare a function of type FilterFuncType:
type FilterFuncType<T> = {
	(array: T[], f: (item: T) => boolean): T[]
}
let filter: FilterFuncType = (array, f) => // ... // Error: Generic type 'Filter' requires 1 type argument.
type OtherFilter = FilterFuncType // Error: Conditional type 'FilterFuncType' requires 1 type argument.
let filter: FilterFuncType<number> = (array, f) => // ...
type StringFilterFuncType = FilterFuncType<string>
let stringFilter: StringFilterFuncType = (array, f) => // ...

// The only valid place to declare a generic type in a type alias is immediately after the type alias name and before its assignment (=).
// Let's define a type MyEvent that describes a DOM event like click or mousedown:
type MyEvent<T> = {
	target: T
	type: string
}
type ButtonEvent = MyEvent<HTMLButtonElement>
let myEvent: MyEvent<HTMLButtonElement | null> = {
	target: document.querySelector('#myButton'),
	type: 'click'
}
// You can also use a generic type alias in the function signature. When TypeScript binds the type to T, it will also bind it to MyEvent:
function triggerEvent<T>(event: MyEvent<T>): void {
	// ...
}
triggerEvent({ // T is Element | null
	target: document.querySelector('#myButton'),
	type: 'mouseover'
})

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
// Like optional parameters in a function, generic types with presets should come after generic types without presets:
// Good:
type MyEvent2<Type extends string, Target extends HTMLElement = HTMLElement> = {
	target: Target
	type: Type
}
// Bad:
type MyEvent3<Target extends HTMLElement = HTMLElement, Type extends string> = { // Error: Required type parameters cannot follow optional ones
	target: Target
	type: Type
}
