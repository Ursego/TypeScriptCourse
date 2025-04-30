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

//### readonly properties

// You cannot directly declare a class property as a constant in the same way you would with a const variable.
// However, you can achieve a similar effect by using the readonly modifier to ensure that the property is assigned once and cannot be changed afterward.
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
  home.resident.name = "John"; // success - we don't change resident, we chage its property
  home.resident.age = 49; // success - we don't change resident, we chage its property
  home.resident = { name: "John"; age: 49 } // error: Cannot assign to 'prop' because it is a read-only property.
}

//### Inheritance

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

// Interfaces can also extend multiple types:

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

//### Type inference with the "in" operator

// TypeScript allows you to check if an object has a property using the in operator. Imagine we have the following interfaces:
interface IHasIdAndNameProperty { id: number; name: string; }
interface IHasDescAndValueProperty { description: string; value: number; }

// Now we can write a function that can work with both interfaces:
function printNameOrDescription(value: IHasIdAndNameProperty | IHasDescAndValueProperty /* value must implement one OR another */) {
	if ('id' in value /* value implements IHasIdAndNameProperty */) {
		console.log('found id ! | name : ${value.name}');
	}
	if ('value' in value /* value implements IHasDescAndValueProperty */) {
		console.log('found value ! : description : ${value.description}');
	}
}

//### Type Alias

// Type aliases and interfaces are very similar, and in many cases you can choose between them freely.

// See this interface:
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

// Type aliases don't use the "extends" keyword. Instead, they combine multiple types using the intersection operator (&) which gives the same result in most situations:

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

// Both interface and type alias can extend (using different syntax) any form: an interface, a type and the public part of a class. Example:

interface Colorful {
	color: string;
}
interface Circle {
	radius: number;
}
type ColorfulCircle = Colorful & Circle;

//### Implementing by a class

// Both interface and type alias can be implemented by a class using the `implements` keyword, providing flexibility in how you define your type contracts.
// When implementing an interface or a type alias, the class must include all the required properties and methods specified.
// The key difference is that type aliases are more versatile overall — they can represent unions, intersections, primitives, and tuples,
// 		while interfaces are limited to describing object shapes.
// However, when used specifically for class implementation, there is functionally no difference between implementing an interface versus implementing an object type alias -
// 		the compiler enforces the same constraints in both cases.