//### Array:

var arrayOfNumbers: number[] = [1,2,3];
arrayOfNumbers = [3,4,5,6,7,8,9]; // we can assign any number of elements to an array as long as each element is of the correct type
console.log('arrayOfNumbers: ${arrayOfNumbers}'); // arrayOfNumbers: 3,4,5,6,7,8,9
arrayOfNumbers = ["1", "2", "3"]; // Error: Type 'string[]' is not assignable to type 'number[]'

var arrayOfStrings : string[] = ["first", "second", "third"];
for (var i = 0; i < arrayOfStrings.length; i++) {
	console.log('arrayOfStrings[${i}] = ${arrayOfStrings[i]}');
}
// We access an array element using the arrayOfStrings[i] syntax. The output of this code looks like this:
arrayOfStrings[0] = first
arrayOfStrings[1] = second
arrayOfStrings[2] = third

// ES6 syntax. Note that the value of the itemKey variable will iterate over the keys of the array, not the array elements themselves:
for(var itemKey in arrayOfStrings) {
	var itemValue = arrayOfStrings[itemKey];
	console.log('arrayOfStrings[${itemKey}] = ${itemValue}');
}

// To iterate over the values ​​contained in the array, use the "for ... of ..."" syntax:
for(var value of arrayOfStrings) {
	console.log('arrayItem = ${value}');
}

// TypeScript supports two syntaxes for arrays: T[] and Array<T>. They are identical in meaning and effect.

let a = [1, 2, 3] // number[]
var b = ['a', 'b'] // string[]
let c: string[] = ['a'] // string[]
let d = [1, 'a'] // (number | string)[]
const e = [2, 'b'] // (number | string)[]

let f = ['red']
f.push('blue')
f.push(true) // Error: argument of type 'true' cannot be assigned to parameter of type 'string'.

let g = [] // any[]
g.push(1) // number[]
g.push('red') // (string | number)[]

let h: number[] = [] // number[]
h.push(1) // number[]
h.push('red') // Error: Argument of type '"red"' cannot be assigned to parameter of type 'number'

d.map(_ => {
	if (typeof _ === 'number') {
		return _ * 3
	}
	return _.toUpperCase()
	}
)

// When you initialize an empty array, TypeScript doesn't know what type its elements will be, and assigns it the any type.
// As you add new values ​​to the array, TypeScript incrementally infers its type based on them.
// Once the array goes beyond a certain range (for example, if you declared it in a function and then returned it), then TypeScript assigns it the final type, which can't be extended any further:
function buildArray() {
	let a = [] // any[]
	a.push(1) // number[]
	a.push('x') // (string | number)[]
	return a
}
let myArray = buildArray() // (string | number)[]
myArray.push(true) // Error: Argument of type 'true' cannot be assigned to parameter of type 'string|number'.

// Array is a generic type. Whenever we write out types like number[] or string[], that’s really just a shorthand for Array<number> and Array<string>.
interface Array<Type> {
  /**
   * Gets or sets the length of the array.
   */
  length: number;
 
  /**
   * Removes the last element from an array and returns it.
   */
  pop(): Type | undefined;
 
  /**
   * Appends new elements to an array, and returns the new length of the array.
   */
  push(...items: Type[]): number;
 
  // ...
}

//### ReadonlyArray
// The ReadonlyArray is a special type that describes arrays that shouldn’t be changed.
function doStuff(values: ReadonlyArray<string>) {
  // We can read from 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);
  // ...but we can't mutate 'values'.
  values.push("hello!"); // error: Property 'push' does not exist on type 'readonly string[]'.
}
// Much like the readonly modifier for properties, it’s mainly a tool we can use for intent.
// When we see a function that returns a ReadonlyArray, it tells us we’re not meant to change the contents at all, and when we see a function
// 		that consumes aReadonlyArray, it tells us that we can pass any array into that function without worrying that it will change its contents.

// Unlike Array, there isn’t a ReadonlyArray constructor that we can use:
new ReadonlyArray("red", "green", "blue"); // error: 'ReadonlyArray' only refers to a type, but is being used as a value here.
// Instead, we can assign regular Arrays to ReadonlyArrays:
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];

// Just as TypeScript provides a shorthand syntax for Array<Type> with Type[], it also provides a shorthand syntax for ReadonlyArray<Type> with readonly Type[]:
function doStuff(values: readonly string[]) { ... }

// One last thing to note is that unlike the readonly property modifier, assignability isn’t bidirectional between regular Arrays and ReadonlyArrays.
let readOnlyArr: readonly string[] = [];
let mutableArr: string[] = [];
readOnlyArr = mutableArr; // ok
mutableArr = readOnlyArr; // error: The type 'readonly string[]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.

//### Tuple

// Tuple is a subtype of Array.
// It allows fixed-length arrays to be typed, where the values at each index have specific known types, not necesserily the same.
// So, it's a sort of Array that knows exactly how many elements it contains, and exactly which types it contains at specific indexes.
// In contast to objects, fields don't have names (only positions). If you need to access the fields by name, use an object instead of a Tuple.
// Tuples are typically used when we need to pass normally unrelated values together.

// Like in Array, square brackets are used in the declaration, and to access elements by index:

// Declaration without initialization:
let myTuple [number, string];
myTuple = [10, "Hello"];

// Declaration with initialization:
let myTuple [number, string] = [10, "Hello"]; 

// Accessing elements:
console.log(mytuple[0]) // 10
console.log(mytuple[1]) // "Hello"
myTuple[0] = 30;
myTuple[1] = "Hi";

// To declare a Tuple, you MUST explicitly describe its shape.
// Unlike most other types, the properties' types cannot be inferred from the default value.
// You can think the next example declares a tuple of type [number, string], but it decalares an Array of type (number | string)[]:
let myTuple = [10, "Hello"];

// You can also declare an empty tuple and choose to initialize it later:
let mytuple = [];
mytuple[0] = 120
mytuple[1] = 234

// Extract valueas from a tuple into standalone vars:
let t = [10, "hello"]
let [a, b] = t // declare two vars (string & boolean) and init them from the tuple; that compiles in this JavaScript: var a = t[0], c = t[1];
console.log(a); // 10
console.log(b); // "hello"

// There can also be optional tuple elements. This is achieved using the ? symbol in the tuple definition:
let optionalTuple: [string, boolean?];
optionalTuple = ["test2", true];
console.log(optionalTuple); // test2,true
optionalTuple = ["test"];
console.log(optionalTuple); // test

// The last property of a tuple can be declared with the rest operator. Note the square brackets after the property name:
type RestTupleType = [number, ...string[]]; // a tuple with the first property being a number and then a variable number of strings
let restTuple: RestTupleType = [1];
let restTuple: RestTupleType = [1, "string1"];
let restTuple: RestTupleType = [1, "string1", "string2"];
let restTuple: RestTupleType = [1, "string1", "string2", "string3"];

// When populating a tuple, each of the properties (except those declared with ? or ...) must be specified:
myTuple = [20]; // Error: Type '[number]' is not assignable to type ['number, string]'
myTuple = ["Hi", 30]; // Error: The values ​​passed do not match the types by position

// Function, returning a tuple:
function GetFullName(empId: number): [string, string] {
	// ...populate fName & lName...
	return [fName, lName];
}
let fullName = GetFullName(12345); // the type of fullName is inferred as [string, string]
console.log(fullName[0] + " " + fullName[1]);
// However, it's better to return multiple values using an inline object where the fields are accessed by name rather than by index:
function GetFullName(empId: number): {firstName: string, lastName: string} {
	// ...populate fName & lName...
	return {firstName: fName, lastName: lName};
}
let fullName = GetFullName(12345); // the type of fullName is inferred as {firstName: string, lastName: string}
console.log(fullName.firstName + " " + fullName.lastName);

// @@@ readonly Tuple Types
// Tuple types have readonly variants, and can be specified by sticking a readonly modifier in front of them - just like with array shorthand syntax.
function doSomething(pair: readonly [string, number]) {
  pair[0] = "hello!"; // error: Cannot assign to '0' because it is a read-only property.
}
// Tuples tend to be created and left un-modified in most code, so annotating types as readonly tuples when possible is a good default.

// Read-only arrays and tuples:
// Regular arrays are mutable - you can add to them (.push), remove from them, insert into them (.splice), and update them in place.
// The readonly array type can be used to create immutable arrays.
// To create such an array, use immutable methods like .concat and .slice instead of mutating ones like .push or .splice:
let as: readonly number[] = [1, 2, 3] // readonly number[]
let bs: readonly number[] = as.concat(4) // readonly number[]
let three = bs[2] // number
as[4] = 5 // Error: index signature on type 'readonly number[]' is read-only.
as.push(6) // Error: property 'push' does not exist on type 'readonly number[]'

// Like Array, TypeScript has a couple longer forms for declaring read-only arrays and tuples:
type A = readonly string[] // readonly string[]
type B = ReadonlyArray<string> // readonly string[]
type C = Readonly<string[]> // readonly string[]
type D = readonly [number, string] // readonly [number, string]
type E = Readonly<[number, string]> // readonly [number, string]

//### Enumeration:

enum DoorState {Open, Closed, Ajar}
// In this example, the DoorState.Open enum value will be 0, the DoorState.Closed enum value will be 1, and the DoorState.Ajar enum value will be 2.
var openDoor = DoorState.Open;
console.log('openDoor is: ${openDoor}'); // openDoor is: 0
var closedDoor = DoorState["Closed"]; // same as DoorState.Closed but the enum can be built dynamically
console.log('closedDoor is : ${closedDoor}'); // openDoor is: 1
// We can set the numeric value manually:
enum DoorState {Open = 3, Closed = 7, Ajar = 10}
enum DoorStateString {Open = "open", Closed = "closed", Ajar = "ajar"}
// What happens if we access the enum using array-like syntax:
var ajarDoor = DoorState[2]; // same as DoorState["2"]
console.log('ajarDoor is : ${ajarDoor}'); // ajarDoor is : Ajar
// You might have expected the result to be just 2, but here we get the string Ajar, which is a string representation of our original enum value.
// This is actually a neat little trick that allows us to access the string representation instead of a simple number.

enum Language {
	English,
	Spanish,
	French
}
let myFirstLanguage = Language.French // Language; same as Language[2]
let mySecondLanguage = Language['English'] // Language
let a = Language.Tagalog // Error: Property 'Tagalog' does not exist on type 'typeof Language'
let b = Language[3] // Language. Success!!! :-( To prevent reading of unexisting entry, use const - it prohibits reading by index at all:

const enum Language {
	English,
	Spanish,
	French
}
let c = Language[0] // Error: A constant enum member can only be accessed with a string literal

// The presence of a single numeric value is enough to make the entire enumeration unsafe. The most secure is const enum with hardcoded string (!) values:
const enum Language {
	English = 'en',
	Spanish = 'sp',
	French = 'fr'
}

//### Map

// In TypeScript (and JavaScript), you cannot use dot notation or square bracket notation to directly access or set values in a Map object.
// Instead, you must use the set and get methods provided by the Map class.

let map: Map<string, number> = new Map();

map.set('one', 1);
map.set('two', 2);
map.set('three', 3);

console.log(map.get('one')); // Output: 1 - Accessing values by keys
console.log(map.has('two')); // Output: true - Checking if a key exists
map.delete('two'); // removing a key-value pair
console.log(map.size); // Output: 2 - Checking the size of the Map

// Iterating over a Map:
map.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});
// Output:
// one: 1
// three: 3

// A Map with string keys and any values:
let userProfiles: Map<string, { age: number; city: string }> = new Map();

userProfiles.set('Alice', { age: 30, city: 'New York' });
userProfiles.set('Bob', { age: 25, city: 'Los Angeles' });
userProfiles.set('Charlie', { age: 35, city: 'Chicago' });

console.log(userProfiles.get('Alice')); // Output: { age: 30, city: 'New York' }

if (userProfiles.has('Bob')) {
  console.log('Bob is in the map.');
}

userProfiles.set('Alice', { age: 31, city: 'New York' }); // updating a value
userProfiles.delete('Charlie'); // deleting an entry

for (let [key, value] of userProfiles) {
  console.log(`${key}: Age - ${value.age}, City - ${value.city}`);
}
// Output:
// Alice: Age - 31, City - New York
// Bob: Age - 25, City - Los Angeles

// Clearing the Map
userProfiles.clear();
console.log(userProfiles.size); // Output: 0
