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



// Generic (параметр обобщенного типа):
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

// Мы объявили <T> как часть сигнатуры вызова (перед скобками), и TypeScript привяжет конкретный тип к T, когда мы вызовем функцию типа FilterFuncType. Если бы мы вместо этого ограничили диапазон T псевдонимом типа FilterFuncType, TypeScript потребовал бы от нас при использовании FilterFuncType привязать тип явно:
// T объявлен как часть типа FilterFuncType (а не часть конкретной сигнатуры типа), и TypeScript привяжет T, когда вы объявите функцию типа FilterFuncType:
type FilterFuncType<T> = {
	(array: T[], f: (item: T) => boolean): T[]
}
let filter: FilterFuncType = (array, f) => // ... // Ошибка: обобщенный тип 'Filter' требует 1 аргумент типа.
type OtherFilter = FilterFuncType // Ошибка: условный тип 'FilterFuncType' требует 1 аргумент типа.
let filter: FilterFuncType<number> = (array, f) => // ...
type StringFilterFuncType = FilterFuncType<string>
let stringFilter: StringFilterFuncType = (array, f) => // ...

// Единственное допустимое место для объявления обобщенного типа в псевдониме типа находится сразу после имени псевдонима типа и перед его присваиванием (=). Определим тип MyEvent, описывающий событие DOM вроде click или mousedown:
type MyEvent<T> = {
	target: T
	type: string
}
type ButtonEvent = MyEvent<HTMLButtonElement>
let myEvent: MyEvent<HTMLButtonElement | null> = {
	target: document.querySelector('#myButton'),
	type: 'click'
}
// Также можете использовать псевдоним обобщенного типа в сигнатуре функции. Когда TypeScript привяжет тип к T, он также привяжет его и к MyEvent:
function triggerEvent<T>(event: MyEvent<T>): void {
	// ...
}
triggerEvent({ // T является Element | null
	target: document.querySelector('#myButton'),
	type: 'mouseover'
})

// Подобно тому как вы задаете параметрам функции значения по умолчанию, вы можете задавать предустановки обобщенным типам:
type MyEvent<T = HTMLElement> = {
	target: T
	type: string
}
// Или добавить ограничение для T, чтобы убедиться, что T является HTML-элементом:
type MyEvent<T extends HTMLElement = HTMLElement> = {
	target: T
	type: string
}
// Подобно опциональным параметрам в функции, обобщенные типы с предустановками должны идти после обобщенных типов без предустановок:
// Хорошо:
type MyEvent2<Type extends string, Target extends HTMLElement = HTMLElement> = {
	target: Target
	type: Type
}
// Плохо:
type MyEvent3<Target extends HTMLElement = HTMLElement, Type extends string> = { // Ошибка: необходимые параметры типов не могут следовать за опциональными
	target: Target
	type: Type
}
