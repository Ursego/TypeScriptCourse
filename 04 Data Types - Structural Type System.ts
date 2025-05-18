//### Structural Type System

// One of TypeScript’s core principles is that type checking focuses on the shape that values have.
// This is sometimes called “duck typing” or “structural typing”.
// If two types have the same shape, they are considered to be of the same type (compatible), regardless of their explicit names or declarations.

// There is no difference between how classes and objects conform to shapes.
// If the object or class has all the required properties, TypeScript will say they match, regardless of the implementation details.

// Key Concepts of Structural Type System:
//	Duck Typing:
//		This concept is often summarized by the phrase "If it looks like a duck and quacks like a duck, it's a duck."
//		If an object or variable has all the properties and methods required by a type, it is considered to be of that type.
//	Type Compatibility:
//		TypeScript checks the compatibility of types by comparing their members.
//		If all the required members of one type are present and correctly typed in another type, the two types are considered compatible.

// @@@ Shape

// The concept of shape in objects is similar to the concept of signature in functions.
// "The same shape" means that the types in question have "structural equivalence" - the same set of properties with the same types in the same order.
// The members names can be different in objects with the same shape - in the same ways as arguments names can be different in functions with the same signature.
// Two types are considered to have the same shape if an object of one type can be assigned to a variable of the other type without violating type constraints.

// For example, if you have a Bird and an Airplane class, and each of them has only one field currentSpeed of type number and methods fly() and land(),
// you can assign an object of one class to a variable of the other.

// Strict Definition of "The Same Shape":

// Properties:
//		Both types must have the same set of properties.
//		Each corresponding property must have the same type.

// Optional Properties:
//		If one type has an optional property (denoted with ?), the other type can either have the property as optional or required.
//		The optional property, if present, must have the same type.

// Methods:
//		If the types have methods, the signatures of these methods (parameter types and return type) must be the same.

// Index Signatures:
//		If the types have index signatures (i.e., a way to index into the type), these must be compatible.

// Subtyping:
//		TypeScript allows for excess property checks.
//    Therefore, an object can have more properties than required by the type it is being assigned to (but not fewer).

// @@@ Defining shape

// There are two main tools to declare the shape of an object: interfaces and type aliases.
// They are very similar, and for the most common cases act the same.
// That said, we recommend you use interfaces over type aliases. Specifically, because you will get better error messages.

type BirdType = {
  wings: 2;
};

interface BirdInterface {
  numOfWings: 2; // different name but the same shape
}

const bird1: BirdType = { wings: 2 };
const bird2: BirdInterface = { numOfWings: 2 };
const bird3: BirdInterface = bird1; // success because bird3 has a same shape as bird1

// Another example:

interface Point {
  x: number;
  y: number;
}
function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}
let point = { x: 12, y: 26 }; // it's NOT declared to be a Point type - it's an inline object which has no named type at all
logPoint(point); // logs "12, 26" - success because the parameter to logPoint has a same shape as the point var
 
let rect = { x: 33, y: 3, width: 30, height: 80 };
logPoint(rect); // logs "33, 3" - success because shape-matching only requires a subset of the object’s fields to match (width & height are ignored)

class VirtualPoint {
  x: number;
  y: number;
 
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
 
let newVPoint = new VirtualPoint(13, 56);
logPoint(newVPoint); // logs "13, 56" - success because shape-matching only requires a subset of the object’s fields to match (constructor is ignored)
 
let color = { hex: "#187ABF" };
logPoint(color);
// ERROR: Argument of type '{ hex: string; }' is not assignable to parameter of type 'Point'.
// Type '{ hex: string; }' is missing the following properties from type 'Point': x, y

// @@@ Strict type compatibility - no implicit type conversions of properties

// Structural typing enforces strict type compatibility for object properties.
// The automatic conversion that happens at runtime (like converting a number to a string) isn't considered during TypeScript's static type checking.
// Here's an example to illustrate:

type NumberObj = { a: number };
type StringObj = { a: string };

const numObj: NumberObj = { a: 42 };
const strObj: StringObj = numObj; // ...thinking that 42 will automatically be converted to string "42"...
// Error: Type 'NumberObj' is not assignable to type 'StringObj'.
//   Types of property 'a' are incompatible.
//     Type 'number' is not assignable to type 'string'.

// Correct way: explicitly convert the property:
const strObj: StringObj = { a: numObj.a.toString() };

// Or using a type assertion after conversion:
const strObj: StringObj = { a: String(numObj.a) };

// Or using object spread with conversion:
const strObj: StringObj = { ...numObj, a: String(numObj.a) };

// TypeScript's strict type checking is designed to catch potential issues at compile time, which is why it doesn't allow implicit type conversions
// between different object property types, even if those conversions would work at runtime.

// ------------------------------------------------------------------------------------------------------------------------------------------------------------

// The structural type system allows for flexible and intuitive type compatibility by focusing on the shape or structure of types
//    rather than their explicit names or declarations.
// This system enables easier code reuse and interoperability but requires careful consideration of type shapes to avoid unintended type mismatches.

