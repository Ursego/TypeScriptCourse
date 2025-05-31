// @@@ Class Decorator:

// A class definition describes what properties a class has and what methods it defines.
// Decorators allow you to inject and query metadata when working with class definitions, and also provide the ability to programmatically hook into a class definition.

// The decorator's name is a function will be automatically called by the JavaScript runtime when the class is DECLARED.
// The decorator function takes one parameter, the class constructor:
function simpleDecorator(constructor: Function) { // the JavaScript runtime will automatically fill in the constructor parameter
	console.log('simpleDecorator called.');
}
@simpleDecorator
class ClassWithSimpleDecorator { }
// Running this simple decorator code will produce the following output:
simpleDecorator called.

// Notice that we haven't created an instance of the class yet.
// We just specified the class definition, added a decorator to it, and our decorator function was called automatically.
// This indicates that decorators are applied when the class is defined, not when it is instantiated.
// The decorator function is only called once, no matter how many instances of the same class are created or used.

// Multiple decorators can be applied to the same target one after another:
function secondDecorator(constructor: Function) {
	console.log('secondDecorator called.')
}
@simpleDecorator
@secondDecorator
class ClassWithMultipleDecorators { }

// Decorators are evaluated in the order they appear in the code, but are then called in reverse order. The output of this code looks like this:
secondDecorator called.
simpleDecorator called.

// In the next, example, the sealed decorator "seals" the Greeter class, making it and its prototype immutable:
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return `Hello, ${this.greeting}`;
  }
}

// Decorator Factory:
// To allow decorators to take parameters, we need to use what is called a decorator factory -
// this is just a wrapper function that returns the decorator function itself:
function decoratorFactory(name: string) {
	return function (constructor: Function) {
		console.log('decorator function called with ${name}'); // the decorator function sees the variables of the outer (factory) function!
	}
}
// This function simply returns an anonymous decorator function that takes a single argument constructor of type Function.
@decoratorFactory('testName')
class ClassWithDecoratorFactory { }
// The output of this code looks like this:
decorator function called with testName

// @@@ Method decorator:

// Takes three parameters: the target object, the property name, and the property descriptor.
// In this example, the enumerable decorator modifies the greet method descriptor to be non-enumerable:
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}

class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return `Hello, ${this.greeting}`;
  }
}

// @@@ Property Decorator

// Takes two parameters: the target object and the property name.
// In this example, the format decorator modifies the behavior of the name property by adding a prefix to its value:
function format(obj: any, prop: string) {
  let _val = obj[prop];

  const getter = () => _val;
  const setter = (newVal) => {
    _val = `Mr./Ms. ${newVal}`;
  };

  Object.defineProperty(obj, prop, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}

class Person {
  @format
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const person = new Person("John");
console.log(person.name); // Mr./Ms. John

// @@@ Parameter Decorator

// Takes three parameters: the target object, the method name, and the parameter index.
// In this example, the logParameter decorator stores the parameter index of the greet method:
function logParameter(obj: Object, prop: string, index: number) {
  const metadataKey = `log_${prop}_parameters`;

  if (Array.isArray(obj[metadataKey])) {
    obj[metadataKey].push(index);
  } else {
    obj[metadataKey] = [index];
  }
}

class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  greet(@logParameter phrase: string): string {
    return `Hello, ${phrase} ${this.greeting}`;
  }
}

const greeter = new Greeter("world");
greeter.greet("Hi"); // the parameter will be registered when called