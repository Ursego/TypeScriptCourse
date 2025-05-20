// @@@ Acess modifiers

// public - Accessible from anywhere.
// private - Accessible only from instances of a specific class.
// protected - Accessible only from instances of a specific class and its subclasses.

// If you do not specify an access modifier for properties or functions, their default access level will be public.

// @@@ readonly property

// You cannot directly declare a class property as a constant in the same way you would with a const variable.
// However, you can achieve a similar effect by using the readonly modifier to ensure that the property is assigned once and cannot be changed afterward.
// The 'readonly' modifier makes a property immutable after its initial assignment, which can be done at one of two the points:
//    1. On declaration.
//    2. Within the constructor - in the constructor's code itself, not in a function called from the constructor.
//            TypeScript does not analyze methods you invoke from the constructor to detect initializations, because a derived class
//            might override those methods and fail to initialize the members.
// This effectively creates a constant property within the class.

// You can use readonly in combination with other visibility modifiers like public, private, and protected.
// The readonly modifier must be placed before the visibility modifier.

// An iteresting moment is that constructor can still override the value, assigned on the declaration (so, technically, it's populated twice):
class Greeter {
  readonly name: string = "Paul";

  constructor(otherName?: string) {
    if (otherName) {
      this.name = otherName;
    }
  }
  
  rename(otherName: string) { this.name = otherName; }// error: Cannot assign to 'name' because it is a read-only property.
}

const paul = new Greeter();
const john = new Greeter("John");
john.name = "George"; // error: Cannot assign to 'name' because it is a read-only property.

// @@@ strictPropertyInitialization

// Requires that all instance properties be initialized (on declarion or in the constructor) or have a definite assignment assertion (will be explained soon). 
// You need to set strictPropertyInitialization to true in your tsconfig.json file.
// It is often enabled as part of the strict option, which turns on several strict type-checking options at once.
{
  "compilerOptions": {
    "strict": true,
    "strictPropertyInitialization": true
  }
}

class Person {
  name: string; // error: Property 'name' has no initializer and is not assigned in the constructor.
  age: number; // ok - it will be initialized in the constructor

  constructor(age: number) {
    this.age = age;
  }
}
// As with the readonly modifier, the field needs to be initialized in the constructor itself.

// We have considered two ways of initializing fields with strictPropertyInitialization set to true - in the declaration and in the constructor.
// However, if this was not done, there are 3 methods to satisfy strictPropertyInitialization and suppress the compilation error:

// 1. Use Definite Assignment Assertion (!):
//		Use it if you intend to definitely initialize a field through means other than the constructor (for example, maybe in a function called from the constructor):
name!: string; // when declaring the field, or
console.log('name : ${name!}'); // when the field is actually used
// For more details, see https://github.com/Ursego/TypeScriptCourse/blob/main/07%20Variables.ts >>> "### Definite Assignment Assertion (!)"

// 2. Optional value (declare the property with a union type that includes undefined):
// 		By adding a union of types here, we make a conscious decision that the id property may be undefined:
name: string | undefined;

// 3. Optional property (?):
//    The question mark (?) is used to denote that the property (field) is optional. This means that the property can be provided or it can be omitted.
//    It is important to understand that we are not talking about the optionality of the property's value - that would be achieved with a "| null" or "| undefined" data type.
//    We are talking about whether the property exists at all (i.e. the memory is allocated for it).
//    It's fine if a field declared with ? will not exist. But if it exists and is defined without "| null" or "| undefined", its value is required.

class Person {
  name: string; // always exists and must be provided 
  age?: number; // optional

  setName(name: string) {
    this.name = name;
  }

  setAge(age: number) {
    if (this.age) { // if the property is optional, it must be checked for existence before being used
      this.age = age;
    }
  }
}

const alice: Person = { name: "Alice", age: 30 };
const bob: Person = { name: "Bob" }; // no compilation error thanks to ? in "age"

console.log(alice); // Output: { name: 'Alice', age: 30 }
console.log(bob); // Output: { name: 'Bob' } - it doesn't print "age: undefined" since the age property doesn't exist at all

// @@@ 'private' keyword vs. using the # syntax for private fields

// >>> The # syntax for private fields:
#secretVar: string;
// It's a feature of the JavaScript language, introduced in ECMAScript 2019 (ES10).
// Is truly private and is enforced at runtime by JavaScript.
// The property is not accessible outside the class under any circumstances, even by TypeScript.

// >>> 'private' keyword:
private secretVar: string;
// The private keyword is a TypeScript-specific feature, so the encapsulation is inforced only at compile time.
// It's not enforced at runtime, as it gets transpiled to regular JavaScript.
// At runtime, the property is still accessible via standard JavaScript means (e.g., using bracket notation).

// An example demonstrating both the approaches:

class MySafe {
  #declaredWitPound = 123;
  private declaredWitPrivateKeyword = 456;
}
const s = new MySafe();
console.log(s.#declaredWitPound); // error: Property '#declaredWitPound' is not accessible outside class 'MySafe' because it has a private identifier.
console.log(s["declaredWitPound"]); // error: Property '#declaredWitPound' is not accessible outside class 'Example' because it has a private identifier.
console.log(s.declaredWitPrivateKeyword); // error: Property 'declaredWitPrivateKeyword' is private and only accessible within class 'MySafe'.
console.log(s["declaredWitPrivateKeyword"]); // ooops... that is allowed! :-(

// @@@ Cross-instance private access
// Different OOP languages disagree about whether different instances of the same class may access each others’ private members.
// While languages like Java, C#, C++, Swift, and PHP allow this, Ruby does not.
// TypeScript does allow cross-instance private access:
class A {
  private x = 10;
 
  public sameAs(other: A) {
    return other.x === this.x; // no error
  }
}
// That is completely wrong since an object accesses a private property of ANOTHER object. That breaks the main principle of incapsulation!

// @@@ Property shadowing

// When a derived class declares a property with the same name as a property in the base class, it does not override the base class's property.
// Instead, it shadows ("hides") it, creating a new field in the derived class.
// Both properties coexist, and memory is allocated for each separately.
// In the derived class, you can still access the base class's property using super:
class Base {
  protected x: number = 1;
}
class Derived extends Base {
  protected x: number = 5;
  getDerivedX() { return this.x; }
  getBaseX() { return super.x; }
}
const derivedInstance = new Derived();
console.log(derivedInstance.getDerivedX()); // output: 5
console.log(derivedInstance.getBaseX()); // output: 1

// @@@ Cross-hierarchy protected access

// Different OOP languages disagree about whether it’s legal to access a protected member through a base class reference:
class Base {
  protected x: number = 1;
}
class Derived1 extends Base {
  protected x: number = 5;
}
class Derived2 extends Base {
  f1(other: Derived2) {
    other.x = 10;
  }
  f2(other: Derived1) {
    other.x = 10; // error: Property 'x' is protected and only accessible within class 'Derived1' and its subclasses.
  }
}
// Java, for example, considers this to be legal. On the other hand, C# and C++ chose that this code should be illegal.
// TypeScript sides with C# and C++ here, because accessing x in Derived2 should only be legal from Derived2’s subclasses, and Derived1 isn’t one of them.

// @@@ Parameter Properties

// TypeScript offers special syntax for turning a constructor parameter into a class property with the same name and value.
// Parameter properties are created by prefixing a constructor parameter with one of the visibility modifiers public, private, protected, or readonly.
//      and automatically populated with the values passed.

// Parameter properties allow you to define and initialize properties directly in the constructor parameters.
// This feature helps reduce boilerplate code when you need to initialize class properties with values passed to the constructor.

// Firstly, let's see the classic pattern: properties are declared in the regular way and initialized in the constructor:

class Person {
  public name: string;
  private age: number;
  protected address: string;

  constructor(name: string, age: number, address: string) {
    this.name = name;
    this.age = age;
    this.address = address;
  }
  
  // ...
}

// Sample usage:
let phil = new Person("Phil", 38, "99 Main St");

// Now, let's convert the regular properties into parameter properties:

class Person {
  constructor(public name: string, private age: number, protected address: string) {}
  // ...
}

// Sample usage is the same.

// Look how radically the code length has decreased!

// BTW, you cannot use # with parameter properties. Instead, you need to declare these fields and initialize them in the constructor manually:
class Person {
  #age: number; // a truly private field with #

  // Note that the age parameter doesn't have an access modifier since it's a regular parameter, not a parameter property:
  constructor(public name: string, age: number, protected address: string) {
    this.#age = age; // initialize it in the constructor manually
  }

  // ...
}

// A parameter property can be declared readonly in combination with public, private, or protected.
// For that, add 'readonly' AFTER the access modifier. Let's add a readonly id parameter property:
class Person {
  constructor(public readonly id: number, public name: string, private age: number, protected address: string) {}
  // ...
}

// @@@ Getters / setters

// Those are methods which are called using "variable-like" syntax.

class GetterSetterDemo {
  // Getter defines a method to retrieve a property value. Must have no parameters and return a value:
  get age(): number { ... }

  // Setter defines a method to set a property value. Must have exactly one parameter (of the same type the Getter returns) and return void:
  set age(val: number) { ... }
  // The setter parameter is traditionally named 'val' or 'value' to avoid using the same name as the setter like: set age(age: ...
}

// They are methods, but you work with them as if they would be fields (instance variables):
let gsd = new GetterSetterDemo();
let oldAge = gsd.age; // looks like reading from a variable but it's calling a function (the getter)
gsd.age = 18; // looks like populating a variable but it's calling a function (the setter)

// Public getter and setter with a private backing variable is a classic pattern:

class ClassWithAccessors {
  #id?: number;

  get id(): number | undefined {
    return this.#id;
  }

  set id(val: number | undefined) {
    this.#id = val;
  }
}

var cwa = new ClassWithAccessors();
cwa.id = 2;
console.log('id property is set to ${cwa.id}');

// Getter and setter are connected by name - they must have the exact same name to form a single logical property.
// They also must have the same type and visibility (public/protected/private).
// If the type of the setter parameter is not specified, it is inferred from the return type of the getter.

// But note that the getter and the setter are only logically related to their backing field (#id), via your code.
// The compiler does not associate them in any way.
// The variable has the same name as the getter and the setter, but this is just a useful naming convention to demonstrate the relation.

// You can even define getters and setters without a backing field.
// For example, if the logic is computed, derived, or uses an external storage for the value.
// In the next class, name is stored in the DB rather than in a backing field of the same object:
class NameController {
  #webApi = new NameWebApi();

  get name(): string {
    return this.#webApi.getName(); // retrieve name from a DB through a web service
  }

  set name(val: string) {
    this.#webApi.saveName(val); // save name in the DB through a web service
  }
}

let nc = new RemoteValue();
console.log(nc.name);
nc.name = "Steve";

// You can define a getter without a setter (read-only), or a setter without a getter (write-only, rarely used).

// @@@ Fake final classes

// Although TypeScript does not support the final keyword for classes and methods, the functionality can be easily faked.
// To fake final classes in TypeScript, create a class which has:
//    1. A private constructor. When a constructor is marked as private, you cannot use 'new' in the class or extend it.
//    2. A factory function to enable creation of instances.
class MessageQueue {
	private constructor(private messages: string[]) {}
	static getInstance(messages: string[]) {
		return new MessageQueue(messages)
	}
}

class BadQueue extends MessageQueue {} // Error: Cannot extend class 'MessageQueue'. The class constructor is marked as private.
let mq = new MessageQueue(["a", "b"]); // Error: The constructor of class 'MessageQueue' is private and accessible only within the class declaration.
let mq =  MessageQueue.getInstance(["a", "b"]); // success

// @@@ Abstract classes and abstract methods

// An abstract class is a class that cannot be instantiated on its own.
// It serves as a blueprint for other classes.
// Abstract classes can contain implementation for some methods, but at least one method must be declared as abstract.

// Abstract methods are methods that are declared in an abstract class but do not have an implementation.
// These methods must be implemented in any non-abstract class that extends the abstract class.

abstract class Animal {
  abstract makeSound(): void; // abstract method - has no implementation (must be implemented by derived classes)
  move(): void { console.log("Roaming the earth..."); } // non-abstract method (can be used directly or overridden by derived classes)
}

// Derived class that extends the abstract class and implements the abstract method:
class Dog extends Animal {
  makeSound(): void { console.log("Woof!"); } // implementation of the abstract method
}

class Cat extends Animal {
  makeSound(): void { console.log("Meow!"); } // implementation of the abstract method
}

const animal = new Animal(); // Error: Cannot create an instance of an abstract class.

const dog = new Dog();
dog.makeSound(); // Output: Woof!
dog.move();      // Output: Roaming the earth...

const cat = new Cat();
cat.makeSound(); // Output: Meow!
cat.move();      // Output: Roaming the earth...

// @@@ Inheritance

// Function in descendand overrides the function with the same sugnature in the ancestor.
// The "super" keyword can be used in the descentant to call the overridden version.

// @@@ Polymorphism

// In TypeScript (as well as in JavaScript), if an overridden method in a derived class instance is called through a base class reference,
//    the version of the method defined in the derived class will be called.
// This is due to the way JavaScript handles method dispatch at runtime, which is based on the actual type of the object, not the type of the reference.
// So, the method that gets executed depends on the actual type of the object (the runtime type), not the type of the reference (the compile-time type):
class Animal {
  move() { console.log('Animal is moving'); }
}

class Tiger extends Animal {
  move() { console.log('Tiger is moving'); }
}

let tiger: Animal = new Tiger();
tiger.move(); // prints "Tiger is moving"

// @@@ Available methods and properties are defined by the variable type, not by the actual object type

// It's impossible to directly call a method or access a property that exists only in the derived class (Tiger) if the variable is of the base class type (Animal). 
// This is because TypeScript uses static typing, which means that the type of the variable determines what methods and properties can be accessed.

class Animal {
  move() { console.log('Animal is moving'); }
}

class Tiger extends Animal {
  move() { console.log('Tiger is moving'); }
  roar() { console.log('Tiger is roaring'); }
  stripes: number = 100;
}

let tiger: Animal = new Tiger();
tiger.move(); // this works because `move` is defined in `Animal` (`Animal` knows about them)
tiger.roar(); // error: Property 'roar' does not exist on type 'Animal'.
let stripes = tiger.stripes; // error: Property 'stripes' does not exist on type 'Animal'.
// Once again: even though move() is accessible since `Animal` knows about it, the version of the actual object's type (Tiger) is executed.

// However, it's possible to access methods and properties specific to derived class using a type assertion.
// This tells TypeScript that you know the actual runtime type of the object, allowing you to access members that are not part of the base class type:
let tiger: Animal = new Tiger();
(tiger as Tiger).roar(); // this works because `roar` is defined in `Tiger`
let stripes = (tiger as Tiger).stripes; // this works because `stripes` is defined in `Tiger`

// While type assertions are useful, they bypass TypeScript's type checking.
// A safer approach is to use the instanceof operator to check the actual type at runtime before accessing the derived class members:
if (tiger instanceof Tiger) {
  tiger.roar();
  let stripes = tiger.stripes;
}

// @@@ Static

// >>> Static vars & methods
class Counter {
  static count: number = 0;
  constructor() { Counter.count++; }
  static getCount(): number { return Counter.count; }
}
const counter1 = new Counter();
const counter2 = new Counter();
console.log(Counter.getCount()); // output: 2; static methods can be called on the class itself, rather than on instances of the class

// >>> static block in class (static initializer)
// It's a feature introduced in ECMAScript 2022 (ES13) and supported by TypeScript.
// The static initializer executes immediately when the class is loaded (i.e. accessesed for the first time).
// Static blocks are useful for performing setup tasks, initializing static properties, or executing code
//    that needs to run before any instances of the class are created.
class MyClass {
  static count: number;
  static description: string;

  // Static block to initialize static properties:
  static {
    MyClass.count = 0;
    MyClass.description = 'This is a static block example';
  }

  constructor() { MyClass.count++; }
  static getCount() { return MyClass.count; }
  static getDescription() { return MyClass.description; }
}
console.log(MyClass.getCount()); // Output: 0 (that executes the static initializer)
console.log(MyClass.getDescription()); // Output: This is a static block example
const instance1 = new MyClass();
const instance2 = new MyClass();
console.log(MyClass.getCount()); // Output: 2

// >>> No static classes
// Unlike some other programming languages (like C#), TypeScript does not have the concept of static classes.
// A static class is a class that cannot be instantiated and is used to group related static methods and properties.
// To mimic it in TypeScript, just create a regular class with all vars & methods static, with a private constructor, and with no factory method.