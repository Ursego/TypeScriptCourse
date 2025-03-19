// Interfaces:

// The variable must have the same properties as those described in the interface:
interface IComplexType {id: number; name: string;}
let complexType: IComplexType; // declare a var
complexType = {id: 1, name : "test"}; // create an instance of the object and assign values ​​to the object's properties
incompleteType = {id : 1}; // Error: Type '{ id: number; }' is not assignable to type 'IComplexType'. Property 'name' is missing in type '{ id: number; }'
// Interface definitions can also include optional properties:
interface IOptionalProp {id: number; name?: string;}
let idAndName: IOptionalProp = {id: 2, name: "idAndName"};
let idOnly: IOptionalProp = {id: 1}; // no error
idAndName = idOnly;

// Type inference with the in operator:
// TypeScript allows you to check if an object has a property using the in operator. Imagine we have the following interfaces:
interface IHasIdAndNameProperty {id: number; name: string;}
interface IHasDescAndValueProperty {description: string; value: number;}
// Now we can write a function that can work with both interfaces:
function printNameOrDescription(value: IHasIdAndNameProperty | IHasDescAndValueProperty /* value must implement one OR another */) {
	if ('id' in value /* value implements IHasIdAndNameProperty */) {
		console.log('found id ! | name : ${value.name}');
	}
	if ('value' in value /* value implements IHasDescAndValueProperty */) {
		console.log('found value ! : description : ${value.description}');
	}
}

// Type Alias:
type Food = {
	calories: number;
	tasty: boolean;
}
type Sushi = Food & {
	salty: boolean;
}
type Cake = Food & {
	sweet: boolean
}
// Almost identically, you can do the same with interfaces:
interface Food {
	calories: number;
	tasty: boolean;
}
interface Sushi extends Food {
	salty: boolean;
}
interface Cake extends Food {
	sweet: boolean
}
// Interfaces don't have to extend other interfaces. In fact, an interface can extend any form: an object type, a class, or another interface.

// If you declare two interfaces with the same name User, TypeScript will automatically merge them into a single interface:
// User has one field, name:
interface User {
	name: string;
}
// Now User has two fields, name and age:
interface User {
	age: number;
}
let vasya: User = {
	name: 'Vasya',
	age: 30
}

// @@@ Differences Between Type Aliases and Interfaces
// Type aliases and interfaces are very similar, and in many cases you can choose between them freely.
// Almost all features of an interface are available in type, the key distinction is that a type cannot be re-opened to add new properties
// 		vs an interface which is always extendable.

// Extending an interface (using inheritance):

interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}

const bear = getBear();
bear.name;
bear.honey;

// Extending a type (using intersection):

type Animal = {
  name: string;
}

type Bear = Animal & { 
  honey: boolean;
}

const bear = getBear();
bear.name;
bear.honey;

// An interface can be changed after being created:

interface Window {
  title: string;
}

interface Window {
  ts: TypeScriptAPI;
}
// Now Window contains 2 fields.

// A type cannot be changed after being created:

type Window = {
  title: string;
}

type Window = {
  ts: TypeScriptAPI;
}
// Error: Duplicate identifier 'Window'.

//### Interfaces must be implemented EXACTLY!

// It’s important to understand that an implements clause is only a check that the class can be treated as the interface type.
// It doesn’t change the type of the class or its methods at all.
// A common source of error is to assume that an implements clause will change the class type - it doesn’t!
interface Checkable {
  check(name: string): boolean;
}
class NameChecker implements Checkable {
  check(theName): boolean { // parameter 'theName' implicitly has an 'any' type.
    // ...implementation code...
  }
}
// We perhaps expected that theName’s type would be influenced by the name: string parameter of check.
// It is not - implements clauses don’t change how the class body is checked or its type inferred.

// Similarly, implementing an interface with an optional property doesn’t create that property:
interface A {
  x: number;
  y?: number;
}
class C implements A {
  x = 0;
}
const c = new C();
c.y = 10; // error: Property 'y' does not exist on type 'C'.