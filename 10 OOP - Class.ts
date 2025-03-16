// ### Acess modifiers

// public - Accessible from anywhere. This is the default access level.
// private - Accessible only from instances of a specific class.
// protected - Accessible only from instances of a specific class and its subclasses.

// If you do not specify an access modifier for properties or functions, their default access level will be public.

// ### readonly property

// You cannot directly declare a class property as a constant in the same way you would with a const variable.
// However, you can achieve a similar effect by using the readonly modifier to ensure that the property is assigned once and cannot be changed afterward.
// The 'readonly' modifier makes a property immutable after its initial assignment, which can be done either at the point of declaration or within the constructor. 
// This effectively creates a constant property within the class.
// You can use readonly in combination with other visibility modifiers like public, private, and protected.
// The readonly modifier must be placed before the visibility modifier.
// An iteresting moment is that constructor can still override the value, assigned on the declaration (so, technically, it's populated twice):
class Greeter {
  readonly public name: string = "Mary";
  constructor(otherName: string) { this.name = otherName; } // ok
  rename(otherName: string) { this.name = otherName; }// error: Cannot assign to 'name' because it is a read-only property.
}
const g = new Greeter();
g.name = "John"; // error: Cannot assign to 'name' because it is a read-only property.

//### strictPropertyInitialization

// Requires that all instance properties be initialized (on declarion or in the constructor) or have a definite assignment assertion. 
// You need to set it to true in your tsconfig.json file.
// It is often enabled as part of the strict option, which turns on several strict type-checking options at once.
{
  "compilerOptions": {
    "strict": true,
    "strictPropertyInitialization": true
  }
}

class Person {
  name: string; // error: Property 'name' has no initializer and is not definitely assigned in the constructor.
  age: number;

  constructor(age: number) {
    this.age = age;
  }
}
// Note that the field needs to be initialized in the constructor itself.
// TypeScript does not analyze methods you invoke from the constructor to detect initializations, because a derived class
// might override those methods and fail to initialize the members.

// Solutions to satisfy strictPropertyInitialization:
// 1. Initialize the Property Directly:
name: string = "Default Name";
// 2. Initialize the property in the constructor:
  constructor(name: string, age: number) {
    this.name = name; // <<<<<<<<<<<<<<
    this.age = age;
  }
// 3. Use Definite Assignment Assertion:
//		Use it if you intend to definitely initialize a field through means other than the constructor (for example, maybe in a function called from the constructor):
name!: string;
// 4. Optional value (declare the property with a union type that includes undefined):
// 		By adding a union of types here, we make a conscious decision that the id property may be undefined:
name: string | undefined;
// 5. Optional property:
name?: string;

// Notice that in #4 the property always exists (and is allowed to be empty) while in #5 the property can exist or not.
// So, if ther property is optional (#5), it must be checked for existence before being used:
  setName(name: string) {
    if (this.name) { // make sure it exists
      this.name = name;
    }
  }
// Practical Usage:
// 	Use name: string | undefined when you want to ensure that the property is always present on the object, even if it might not have a meaningful value initially.
// 	Use name?: string when defining properties in interfaces or classes where the property may not always be provided or initialized.

//### 'private' keyword vs. using the # syntax for private fields

// @@@ 'private' keyword
// The private keyword is a TypeScript-specific feature that enforces encapsulation at the TypeScript type level.
// It means that the property or method is accessible only within the class it is declared in.
// However, this encapsulation is inforced only at compile time by TypeScript.
// It's not enforced at runtime, as it gets transpiled to regular JavaScript.
// At runtime, the property is still accessible via standard JavaScript means (e.g., using bracket notation):
class MySafe {
  private secretKey = 12345;
}
const s = new MySafe();
console.log(s.secretKey); // error: Property 'secretKey' is private and only accessible within class 'MySafe'.
console.log(s["secretKey"]); // ooops... that is allowed! :-(

// @@@ The # syntax for private fields
// It's a feature of the JavaScript language itself, introduced in ECMAScript 2019 (ES10).
// Is truly private and is enforced at runtime by JavaScript.
// The property is not accessible outside the class under any circumstances, even by TypeScript.
class Example {
  #x: number;
  constructor(x: number) { this.#x = x; }
  getX(): number { return this.#x; }
}
const example = new Example(10);
console.log(example.getX()); // 10
console.log(example.#x); // Error: Private field '#x' must be declared in an enclosing class

//### Cross-instance private access
// Different OOP languages disagree about whether different instances of the same class may access each others’ private members.
// While languages like Java, C#, C++, Swift, and PHP allow this, Ruby does not.
// TypeScript does allow cross-instance private access (which is stupid since it breaks the main principle of incapsulation):
class A {
  private x = 10;
 
  public sameAs(other: A) {
    return other.x === this.x; // no error
  }
}

//### Property shadowing

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

//### Cross-hierarchy protected access

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

//### Parameter Properties

// TypeScript offers special syntax for turning a constructor parameter into a class property with the same name and value.
// Parameter properties are created by prefixing a constructor argument with one of the visibility modifiers public, private, protected, or readonly.
// The resulting field gets those modifier(s):

// A TypeScript specific extension to classes which automatically set an instance field to the input parameter.
// Parameter properties allow you to define and initialize properties directly in the constructor parameters.
// They are declared as the constructor's parameters, so they are automatically populated with the values passed.
// This feature helps reduce boilerplate code when you need to initialize class properties with values passed to the constructor.

class Person {
  constructor(
    public name: string, // Public property
    private age: number, // Private property
    protected address: string, // Protected property
  ) {}
}

const person = new Person('Alice', 30, '123 Main St');
console.log(person.name); // Alice
console.log(person.age); // Error: Property 'age' is private and only accessible within class 'Person'.
console.log(person.address); // Error: Property 'address' is protected and only accessible within class 'Person' and its subclasses.

// You cannot use # with parameter properties directly. Instead, you need to declare these fields and initialize them within the constructor:
class Person {
  #age: number; // a truly private field with #

  constructor(
    public name: string,
    age: number, // regular parameter, not a parameter property
    protected address: string,
  ) {
    this.#age = age; // initialize it inside the constructor
  }

  getAge() { return this.#age; }
}

//### Getters / setters:

// Methods which are called using "variable-like" syntax:
class ClassWithAccessors {
	#id: number | undefined;
	get id() {
		return <number>this.#id;
	}
	set id(value: number) {
		this.#id = value;
	}
}
var classWithAccessors = new ClassWithAccessors();
classWithAccessors.id = 2; // the setter is called
console.log('id property is set to ${classWithAccessors.id}'); // the getter is called
// TypeScript has some special inference rules for accessors:
//		If get exists but no set, the property is automatically readonly
//		If the type of the setter parameter is not specified, it is inferred from the return type of the getter
//		Getters and setters must have the same Member Visibility (both public/protected/private).


//### Fake final classes

// Although TypeScript does not support the final keyword for classes and methods, it can be easily faked.
// To fake final classes in TypeScript, you can use private constructors:
class MessageQueue {
	private constructor(private messages: string[]) {}
}
// When a constructor is marked as private, you cannot use new in the class or extend it:
class BadQueue extends MessageQueue {} // Error: Cannot extend class 'MessageQueue'. The class constructor is marked as private.
new MessageQueue([]) // Error: The constructor of class 'MessageQueue' is private and accessible only within the class declaration.
// In addition to preventing the class from being extended (which is what we want), private constructors also prevent the class from being instantiated directly (which is not what we want).
// How can we keep the first restriction and get rid of the second? Easy:
class MessageQueue {
	private constructor(private messages: string[]) {}
	static getInstance(messages: string[]) {
		return new MessageQueue(messages)
	}
}
// To prohibit creation on instances of the class, make its construnctor:
//		private (so, the class must provide a factory method which returns an instance of it), or
//		protected (so, only instances of its descendants can be instantiated, which have public constructors).

//### Abstract classes and abstract methods

// An abstract class is a class that cannot be instantiated on its own.
// It serves as a blueprint for other classes.
// Abstract classes can contain implementation for some methods, but at least one method must be declared as abstract.

// Abstract methods are methods that are declared in an abstract class but do not have an implementation.
// These methods must be implemented in any non-abstract class that extends the abstract class.

abstract class Animal {
  abstract makeSound(): void; // abstract method - has no implementation (must be implemented by derived classes)
  move(): void { console.log("Roaming the earth..."); } // non-abstract method (can be used directly or overridden by derived classes)
}

// Derived class that extends the abstract class and implements the abstract method
class Dog extends Animal {
  makeSound(): void { console.log("Woof! Woof!"); } // implementation of the abstract method
}

class Cat extends Animal {
  makeSound(): void { console.log("Meow! Meow!"); } // implementation of the abstract method
}

const animal = new Animal(); // Error: Cannot create an instance of an abstract class.

const dog = new Dog();
dog.makeSound(); // Output: Woof! Woof!
dog.move();      // Output: Roaming the earth...

const cat = new Cat();
cat.makeSound(); // Output: Meow! Meow!
cat.move();      // Output: Roaming the earth...

//### Inheritance:

// Function in descendand overrides the function with the same sugnature in the ancestor - in the same way as in PB.
// The "super" keyword can be used in the descentant to call the overridden version.

//### Polymorphism

// In TypeScript (as well as in JavaScript), if an overridden method in a derived class instance is called through a base class reference,
// the version of the method defined in the derived class will be called.
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

//### Available methods and properties are defined by the variable type, not by the actual object type

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

//### Static

// @@@ Static vars & methods
class Counter {
  static count: number = 0;
  constructor() { Counter.count++; }
  static getCount(): number { return Counter.count; }
}
const counter1 = new Counter();
const counter2 = new Counter();
console.log(Counter.getCount()); // Output: 2; static methods can be called on the class itself, rather than on instances of the class

// @@@ static block in class (static initializer)
// It's a feature introduced in ECMAScript 2022 (ES13) and supported by TypeScript.
// The static initializer executes immediately when the class is loaded (i.e. accessesed for the first time)
// Static blocks are useful for performing setup tasks, initializing static properties, or executing code
// that needs to run before any instances of the class are created.
class MyClass {
  static count: number;
  static description: string;

  // Static block to initialize static properties
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

// @@@ No static classes
// Unlike some other programming languages (like C#), TypeScript does not have the concept of static classes.
// A static class is a class that cannot be instantiated and is used to group related static methods and properties.
// To mimic it in TypeScript, just create a regular class with all vars & methods static, and a private constructor with no factory method.

