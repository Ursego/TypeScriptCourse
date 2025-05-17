
// ######################################################################################################
// Array:
// ######################################################################################################

// A dynamically-sized (can grow or shrink as needed), ordered collection of items.

// @@@ Array declaration syntax

// TypeScript supports two syntaxes for arrays: T[] and Array<T>:
let numbers1: number[] = [1, 2, 3];
let numbers2: Array<number> = [1, 2, 3];
// These two declarations are functionally equivalent - number[] is really just a shorthand for Array<number>.
// The T[] syntax is more concise and commonly used, while the Array<T> syntax follows the generic type convention and may be preferred in some complex type scenarios.

let arrayOfNumbers: number[] = [1,2,3];
arrayOfNumbers = [3,4,5,6,7,8,9]; // we can assign any number of elements to an array as long as each element is of the correct type
console.log('arrayOfNumbers: ${arrayOfNumbers}'); // arrayOfNumbers: 3,4,5,6,7,8,9

// @@@ Array type inference

let a = [1, 2, 3]; // number[]
a = ['1', '2', '3']; // Error: Type 'string' is not assignable to type 'number'.
let b = ['a', 'b']; // string[]
let c = [1, 'a']; // (number | string)[]
let d = [1, 'a', true]; // (number | string | boolean)[]

// When the initial value is [] (an empty Array), TypeScript doesn't know what type its elements will be, and assigns it the 'any' type:
let a = [];
// That is identical to
let a: any[];

// Once the array, created as any[] and populated later, is returned from a function whose return type is not defined explicitly,
// its return type is inferred from the last state of the Array before it's returned:
function buildArray() {
	let a = []; // any[]
	a.push('x');
	a.push(1);
	return a; // the function return type is inferred as (string | number)[] - not as any[]!
}
let myArray = buildArray(); // (string | number)[]
myArray.push(true); // Error: Argument of type 'true' cannot be assigned to parameter of type 'string|number'.
// Of course, you must always define return types of functions explicitly to enjoy type safety (inferred return type can hide errors, especially if the function is complex).

// @@@ Looping over an Array

let arrayOfStrings : string[] = ["first", "second", "third"];

// The "for...of" syntax (most popular). The loop variable interates over the values of the array:
for(let val of arrayOfStrings) {
	console.log('array item = ${val}');
}

// The "for...in" syntax. The loop variable interates over the indexes of the array, not the values.
// Use it only if you need the current index within the loop:
for(let i in arrayOfStrings) {
	let val = arrayOfStrings[i];
	console.log('array item = ${val}');
}

// So, just remember: "in" iterates over indexes, "of" iterates over values.

// The "old style" for loop. Try to avoid it - use one of the previous syntaxes instead:
for (let i = 0; i < arrayOfStrings.length; i++) {
	let val = arrayOfStrings[i];
	console.log('array item = ${val}');
}

// @@@ Element existence checking

// includes(value) checks if the array contains a value. Returns true or false:
let myArr = [1, 2, 3]
let hasValue = myArr.includes(2) // hasValue = true

// indexOf(value) returns the index of the value, or -1 if not found:
let index = myArr.indexOf(2) // index = 1

// @@@ A few ways to add an element to an Array

// 1. Using index assignment:

// To append an element to the end of the Array, assign it to the next available index. You have that index ready in the length property:
let fruits = ["apple", "banana"];
fruits[fruits.length] = "orange"; // ["apple", "banana", "orange"]

// In JavaScript/TypeScript, arrays are sparse, meaning you can assign values at indexes beyond the current length.
// The intermediate positions will be filled with undefined values:
fruits[5] = "pear"; // ["apple", "banana", "orange", undefined, undefined, "pear"]
// This feature can be used in counter arrays.

// 2. Using push():
fruits.push("grapefruit"); // ["apple", "banana", "orange", undefined, undefined, "pear", "grapefruit"]
// This method is preferred over #1 even though the term is misused (in programming, the push operation is related to stack, not array)

// 3. Using unshift() - that adds the element to the beginning:
fruits.unshift("avocado"); // ["avocado", "apple", "banana", "orange", undefined, undefined, "pear", "grapefruit"]

// ######################################################################################################
// ReadonlyArray
// ######################################################################################################

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

// ######################################################################################################
// Tuple
// ######################################################################################################

// A fixed-size, ordered collection where each element has a specific, known type, not necesserily the same.
// For example, [string, number] defines a tuple with a string as the first element and a number as the second. The length and types of elements are fixed.

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
let [a, b] = t // declare two vars (string & boolean) and init them from the tuple; that compiles into this JavaScript: let a = t[0], c = t[1];
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

// ######################################################################################################
// Enumeration:
// ######################################################################################################

enum DoorState {Open, Closed, Ajar}
// In this example, the DoorState.Open enum value will be 0, the DoorState.Closed enum value will be 1, and the DoorState.Ajar enum value will be 2.
let openDoor = DoorState.Open;
console.log('openDoor is: ${openDoor}'); // openDoor is: 0
let closedDoor = DoorState["Closed"]; // same as DoorState.Closed but the enum can be built dynamically
console.log('closedDoor is : ${closedDoor}'); // openDoor is: 1
// We can set the numeric value manually:
enum DoorState {Open = 3, Closed = 7, Ajar = 10}
enum DoorStateString {Open = "open", Closed = "closed", Ajar = "ajar"}
// What happens if we access the enum using array-like syntax:
let ajarDoor = DoorState[2]; // same as DoorState["2"]
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

// ######################################################################################################
// Map
// ######################################################################################################

// A collection that holds key-value pairs where keys can be of any data type (including objects).
// Maps maintain the insertion order of elements. TypeScript provides type parameters to specify the types of keys and values (e.g., Map<string, number>).

// You cannot use dot notation or square bracket notation to directly access or set values in a Map object.
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



// ######################################################################################################
// Set
// ######################################################################################################

// A collection of unique values. It's based on the JavaScript Set object and offers methods for adding, deleting, and checking for values.

// Key features of Set:
// - Stores unique values only (duplicates are automatically removed)
// - Can contain values of any type
// - Maintains insertion order
// - Provides efficient lookup operations
// - Has built-in methods for adding, deleting, and checking values

// Here's a simple example:

// Create a new Set
const fruits = new Set<string>();

// Add values
fruits.add("apple");
fruits.add("banana");
fruits.add("orange");
fruits.add("apple"); // This won't be added as it's a duplicate

// Check if a value exists
console.log(fruits.has("banana")); // true
console.log(fruits.has("grape")); // false

// Get the size
console.log(fruits.size); // 3

// Delete a value
fruits.delete("banana");
console.log(fruits.size); // 2
// Note that delete() will not throw an error if the value doesn't exist in the Set:
fruits.delete("pear"); // no error, just returns false (if the value existed, it would return true)

// Iterate over the Set
fruits.forEach(fruit => {
  console.log(fruit);
});
// Output:
// apple
// orange

// Convert to array
const fruitArray = Array.from(fruits);
console.log(fruitArray); // ["apple", "orange"]

// Clear the Set
fruits.clear();
console.log(fruits.size); // 0

// @@@ Replacing an element

// As you see, Sets don't have a direct replacement operation - you cannot change the value of an existing element as you can in Array.
// Instead, you need to delete the old value and add the new one.
// If you do that frequently, create this function:
function replaceInSet<T>(set: Set<T>, oldValue: T, newValue: T): void {
	set.delete(oldValue);
	set.add(newValue);
}

// @@@ Ordered behavior in Set

// Set preserves the order in which elements were inserted — but you cannot access elements by index like you can with an Array.
// So while the iteration order of a Set matches the insertion order (e.g., in for...of or Set.forEach()), you cannot do something like mySet[1].
// To access elements by index, you would need to convert the Set to an Array first, for example:
Array.from(mySet)[1]
// or
[...mySet][1]

// @@@ Set vs. Array

// Set is implemented using a hash-based structure — typically a hash table or a similar optimized structure (sometimes a hybrid with linked entries for order retention).
// Access is based on value identity, not index.
// Lookup by value (has) is fast.
// Set provides more efficient and semantically clear operations for handling unique values compared to Array.

// Array is implemented as a contiguous block of memory where elements are stored by index.
// It allows fast index-based access and is optimized for sequential storage.
// Lookup by value (includes, indexOf) is slower.

// Both support iteration and ordered behavior, but:
// 		only Set guarantees uniqueness with better performance for add/has/delete operations;
// 		only Array supports random access by index.

// Here's a comparison of the key functions:

// add vs. push:
// 		Set.add(value) adds a value only if it's not already present, ensuring uniqueness.
// 		Array.push(value) simply appends the value, even if it's already in the array, so you can have duplicates.

// has vs. includes:
// 		Set.has(value) checks if a value exists in the set with constant time complexity on average.
// 		Array.includes(value) does the same but with linear time complexity since it may need to scan through the entire array.

// delete vs. splice/filter:
// 		Set.delete(value) removes the value if present, again with constant time complexity.
// 		For arrays, you typically use Array.filter() or Array.splice() to remove elements, which involves scanning the array and possibly shifting elements, making it less efficient.

// So, Set is better for operations involving uniqueness and faster lookups, while Array is more flexible for ordered collections and supports more general-purpose operations.


