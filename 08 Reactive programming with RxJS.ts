// CONTENTS (to jump to a section, copy it with the asterisk, like "* Observable" -> Ctrl+F -> Ctrl+V):

// * Introduction: Reactive vs. Imperative programming
// * What is RxJS?
// * Observable
// * The async Pipe to subscribe in an HTML template
// * Manipulating an Observable's value in the imperative way (as a regular variable)
// * More about Subscription
// * RxJS operators
// * pipe()

// ######################################################################################################
// * Introduction: Reactive vs. Imperative programming
// ######################################################################################################

// Imperative Programming:

// Focuses on describing how a program operates through a sequence of statements that change the program state.
// It uses statements that explicitly describe the steps a computer must take to complete a task ("Do this, then do that").

// 1. Sequential Execution: Code typically executes in a linear, step-by-step fashion.
// 2. Synchronous by Default: Asynchronous operations often require special handling.
// 3. State-Centric: Focuses on changing and maintaining state.
// 4. Pull-based: Data is typically pulled when needed.
// 5. Imperative: You specify the exact sequence of steps to perform a task.
// 6. Request-Driven: Often centered around handling specific requests or inputs.

// Reactive Programming:

// A paradigm that focuses on working with asynchronous data streams and the propagation of changes.
// It's an approach to building software that emphasizes responsiveness to data changes and events ("When this happens, respond by doing that").

// 1. Data Streams: Everything is considered a stream of data that can be observed and reacted to.
// 2. Asynchronous by Default: It's designed to handle asynchronous operations elegantly.
// 3. Data Flow: Focuses on the flow of data through the application.
// 4. Push-based: Data is pushed to the consumers as it becomes available.
// 5. Declarative: You declare the relationships between streams and how to react to changes.
// 6. Event-Driven: Heavily relies on events and their propagation.

// Key Differences:

// 1. Handling Asynchronous Operations:
//    - Imperative: Requires additional constructs like callbacks, promises, or async/await.
//    - Reactive: Built-in support for async operations, making them easier to manage.

// 2. Scalability:
//    - Imperative: Can struggle with high-concurrency scenarios.
//    - Reactive: Better suited for handling large volumes of data and events.

// 3. Complexity Management:
//    - Imperative: Simpler for basic tasks, but can become complex with async operations.
//    - Reactive: Can simplify complex async workflows, but has a learning curve.

// 4. Error Handling:
//    - Imperative: Typically relies on try-catch blocks or promise rejections.
//    - Reactive: Often provides built-in error handling for streams of data.

// 5. Resource Efficiency:
//    - Imperative: May not be as efficient when dealing with real-time data or many concurrent operations.
//    - Reactive: Can be more efficient with resources, especially in high-load scenarios.

// 6. Learning Curve:
//    - Imperative: More intuitive for beginners and widely understood.
//    - Reactive: Steeper learning curve, can be challenging for beginners due to its functional and reactive nature.
//        Requires a shift in thinking if you used to work with imperative programming.

// At first glance, Reactive Programming seems complicated because you must work with more abstract flows of program logic and
//    get acquainted with new kinds of programming objects which support that flow.
// But with experience, you understand that this is a well-organized and well-thought-out system that makes development easier.
// The effort spent on learning more than pays off during work.

// ######################################################################################################
// * What is RxJS?
// ######################################################################################################

// https://rxjs.dev/

// RxJS (Reactive Extensions for JavaScript) is a powerful library for reactive programming using Observables.

// Purpose: RxJS helps manage asynchronous data streams and events in a more organized and efficient manner.

// Key Concepts:
// 1. Observables: Represent a stream of data or events over time.
// 2. Observers: Consume the values emitted by Observables.
// 3. Operators: Functions that transform, filter, or combine Observables.
// 4. Subscriptions: Connect Observers to Observables.

// Main Features:
// - Composability: Easily combine and transform data streams.
// - Lazy evaluation: Computations only run when subscribed to.
// - Error handling: Built-in mechanisms for dealing with errors in asynchronous operations.
// - Cancellation: Ability to stop ongoing operations.

// Use Cases:
// - Handling user input events.
// - Making and managing HTTP requests.
// - Real-time data updates.
// - State management in applications.

// Integration:
// - Widely used in Angular framework.
// - Can be used with other frameworks or vanilla JavaScript.

// Benefits:
// - Simplifies complex asynchronous code.
// - Improves performance in handling data streams.
// - Provides a consistent way to work with various types of events and data.

// RxJS is particularly valuable in scenarios involving complex data flows, real-time updates,
//    or when dealing with multiple interdependent asynchronous operations.
// It's a cornerstone of reactive programming in the JavaScript ecosystem.

// You can manually implement Reactive Programming in a traditional environment (such as .Net) but that requires a lot of additional boilerplate code
//    to manage events, delegates, publishers and subscriptions.
// NgRx is doing most of the work automatically behind the scenes, so you can concentrate on the business logic.

// ######################################################################################################
// * Observable
// ######################################################################################################

// An Observable is an object that can emit one or more values over time.
// It represents a stream of data that can be observed by subscribers.
// Instead of getting a single value, you can subscribe to an Observable to receive multiple values over time.
// Observables are a way to handle asynchronous data streams like HTTP requests, user input, and more.
// This is the foundation and core tool of RxJS, so it is important to understand and "feel" it.
// Observable variables' names must end with $. That is not enforced by compiler but it's an accepted naming convention.

// The next example uses of() - a utility function that creates an Observable which emits the values provided as arguments, one after the other.
// Calling subscribe() for the first subscriber "activates" the Observable and it starts emitting values.
// After emitting the last value, the Observable completes (i.e., it doesn't emit any more values).

import { of } from 'rxjs';
// Create an object that emits the values 1, 2, and 3:
const threeNumbers$: Observable<number> = of(1, 2, 3);
// Or:
const threeNumbers$ = of(1, 2, 3); // the type Observable<number> is inferred
// Subscribe to the observable and log each emitted value:
threeNumbers$.subscribe((val: String) => console.log(val)); // outputs: 1, 2, 3

// You could ask: What exactly does subscribe to the Observable?
// !!! ==>> The function passed to .subscribe() is the subscriber (observer).
// In this case, the subscriber is:
(val: String) => console.log(val)
// !!! ==>> Each time the Observable emits a value, that function is called, getting the emitted value as the parameter.
// !!! ==>> This pattern is the cornerstone of reactive programming!

// The name of the subscribe() method is misleading - calling it looks like the Observable is subscribing to something, when in fact it is being subscribed to.
// It would be more correct to name this method getSubscribedBy().

// The flow steps:

// * Value 1 is emitted: The subscriber function is called with 1, so console.log(1) runs.
// * Value 2 is emitted: The subscriber function is called with 2, so console.log(2) runs.
// * Value 3 is emitted: The subscriber function is called with 3, so console.log(3) runs.
// * The Observable completes, and no further emissions occur.

// @@@ A real life use case:

// In the previous example, the Observable "knew" in advance which values and how many times it will emit.
// In real applications, this happens rarely.
// Most often, the Observable itself expects that its value will be changed. When this happens, it emits that new value.
// Typical scenario:
// * The component class has a variable of type Observable.
// * A text element in the HTML template is subscribed to it.
// * The Observable is empty, so the text element doesn't display anything.
// * Then the application retrieves a value from the database and places it in the Observable.
// * This is where the magic happens - the value is immediately shown to the user, without you having to copy it manually.

// ######################################################################################################
// * The async Pipe to read from an Observable in an HTML template
// ######################################################################################################

// subscribe() is a TypeScript method. In HTML, you use the async Pipe instead - it's even simpler.
// Let's say, your component class has this:
screenTitle$: Observable<string>
// In the template, it could be subscribed this way:
<h2>{{ screenTitle$ | async }}</h2>
// The Observable must be public in the component class to be accessible from the template.

// Another classical example - building an HTML list (<ul>) with items (<li>) rendered dynamically from an Observable which emits an array.
// In the next example, the component class has the customerList$ Observable.
// In the real life, it would be populated from the DB (e.g., via an HTTP call), but let's hardcode the values to keep the example simple:

import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ICustomer } from 'src/models/customer.model';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
})
export class CustomerListComponent {
  customerList$: Observable<ICustomer[]> = of([
    { customerId: 1, firstName: 'John', lastName: 'Doe' },
    { customerId: 2, firstName: 'Jane', lastName: 'Smith' },
    { customerId: 3, firstName: 'Alice', lastName: 'Brown' },
  ]);
}

// The HTML template (customer-list.component.html):
<ul>
  @for (let c of customerList$ | async) {
    <li>{{ c.firstName }} {{ c.lastName }} - {{ c.customerId }}</li>
  }
</ul>

// The async Pipe in the template automatically subscribes to the customerList$ observable and retrieves its emitted value (the customer array).

// The @for iterates over the emitted customer array and renders a <li> for each customer:
<ul>
  <li>John Doe - 1</li>
  <li>Jane Smith - 2</li>
  <li>Alice Brown - 3</li>
</ul>

// Pay attention that the Observable emits the array at one stroke, i.e. only one emission occurs (not three emission for each element).
// That's why the Observable's type is ICustomer[] and not ICustomer.
// If the "real" customerList$ is later re-populated from the DB (for example, refreshed after an item is added, edited or removed),
//    the HTML will be automatically re-rendered as the new array is emitted.

// ######################################################################################################
// * Manipulating an Observable's value in the imperative way (as a regular variable)
// ######################################################################################################

// An Observable can do only three things:
//  * Emit its value to the subscriber.
//  * Be subscribed (the first emission occurs when subscribe() is called).
//  * Be changed (each change will immediately emit the new value).
// The value of an Observable cannot be accessed (read) directly. You cannot write "if (amount$ > 0)..." in the reactive programming world.
// If you need to work with the value of an Observable in the imperative way, that value must firstly be emitted into a regular variable.
// The assignment of the Observable's value to the non-Observable variable must be manually coded inside the subscribing functiond, for example:

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { IProduct } from 'src/models/customer.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit, OnDestroy {
  contextProduct$: Observable<IProduct>; // an Observable
  private _contextProduct: IProduct; // a regular variable
  private _s: Subscription; // Subscription will be described soon, ignore it now

  constructor(private _store: Store<any>) { }

  ngOnInit(): void {
    // STEP 1: Populate the Observable from the Store:
    this.contextProduct$ = this._store.select('contextProduct');
    // STEP 2: Populate the regular var from the Observable
    //         (that will run the subscribing function right away - in addition to subsequent listening for future changes):
    this._s = this.contextProduct$.subscribe(
      // The assignment of the Observable's value to the non-Observable variable occurs inside the function you pass to the subscribe() method:
      (p: IProduct) => this._contextProduct = p
    );
  }

  isTooExpensive(): boolean {
    // return (this.contextProduct$.price > 100); // compilation error - the Observable<IProduct> type has no "price" property
    return (this._contextProduct.price > 100); // success - the IProduct type does have the "price" property
  }

  ngOnDestroy = () => this._s.unsubscribe;
}

// The above example is a very popular pattern.

// ######################################################################################################
// * More about Subscription
// ######################################################################################################

// While JavaScript's garbage collector (GC) does handle the automatic deallocation of memory for objects that are no longer referenced, 
//    subscriptions to Observables can prevent proper garbage collection if they aren't manually cleaned up.

// If an Observable remains active after a component has been destroyed or if the user navigates away from the page, the component may
//    never be fully garbage-collected because the Observable is still holding a reference to it.

// Some Observables involve active processes (e.g., WebSockets or timers).
// These processes may continue running even if the component or context they are part of has been destroyed:
interval(1000).subscribe(value => {
  console.log(value); // will log a value every second indefinitely
});

// To stop the emitting, you need to unsubscribe. To unsubscribe, you need a reference to the subscription.
// This is where the Subscription object comes to our aid.

// Subscription is an RxJS object that represents the execution of an Observable.
// It allows you to manage and control the lifecycle of the Observable stream.

// When you subscribe to an Observable, the subscribe() function returns a Subscription object:
private _s: Subscription = interval(1000).subscribe(value => {
  console.log(value);
});
 
// When a component is destroyed (typically in the ngOnDestroy() hook), you should unsubscribe from any active subscriptions to avoid memory leaks:
this._s.unsubscribe();

// It's especially important to unsubscribe from long-lived Observables (like those tied to user input).
// Here's an example of how you use a Subscription in a component to subscribe to an Observable (e.g., valueChanges from a form control):

import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-example',
  template: `<input [formControl]="searchControl">`
})
export class ExampleComponent implements OnDestroy {
  searchControl = new FormControl('');
  private _s: Subscription;

  constructor() {
    // Subscribing to form control value changes:
    this._s = this.searchControl.valueChanges.subscribe(
      (val: String) => console.log('Search input:', val)
    );
  }

  // Unsubscribing when the component is destroyed:
  ngOnDestroy = () => this._s.unsubscribe;
}

// @@@ One Subscription object per component

// It's important to understand that Subscription is a subscriptions manager rather than a single subscription as its name suggests.
// In the component, you create only once instance of it, and add multiple subscriptions using the add() method.
// Then, when you unsubscribe, all these subscriptions will be canceled at one stroke. Example:
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-example',
  template: '<p>Example Component</p>',
})
export class ExampleComponent implements OnInit, OnDestroy {
  private _s = new Subscription();

  ngOnInit(): void {
    this._s.add(
      interval(1000).subscribe(() => console.log('Subscription 1 tick'))
    );

    this._s.add(
      interval(2000).subscribe(() => console.log('Subscription 2 tick'))
    );
  }

  ngOnDestroy = () => this._s.unsubscribe; // that cancels both the subscriptions
}

// Scenarios When Unsubscribing Is Necessary:

// * Component Destruction:
//     When a component is destroyed (e.g., during route navigation or page closure),
//        any active subscriptions tied to that component should be cleaned up to avoid keeping the component in memory.
// * Event Streams:
//     Observables like those created by fromEvent() for DOM events will continue to listen for events unless explicitly unsubscribed.
// * Long-lived Observables:
//     Streams like interval(), timer(), or WebSocket-based Observables may never complete on their own and require explicit unsubscription.

// Scenarios When Unsubscription Is Not Needed:

// * Finite Observables:
//    Observables that complete on their own (like HTTP requests in Angular's HttpClient) automatically clean themselves up after completion:
      httpClient.get('/api/data').subscribe(data => {
        console.log(data);
      });
// * In HTML templates. The 'async' pipe manages automatic unsubscribing when the component is destroyed.
// * Using RxJS Operators like take(), takeUntil(), and first(), which will be introduced in a few seconds.
//    They automatically unsubscribe once a certain condition is met or a specified number of emissions has occurred.

// ######################################################################################################
// * RxJS operators
// ######################################################################################################

// RxJS operators are functions that allow you to transform, filter, and manipulate the data emitted by Observables.
// They reduce data streams that take an Observable as input and return another Observable.
// Typically used within the Observable's pipe() method (will be described soon), allowing you to chain multiple operations together.
// They're fundamental to working with Observables and are frequently used in Angular applications for handling asynchronous data flows and events.

// Here's a brief description of some popular operator functions:

// map()

// Purpose: Transforms each emitted value by applying a provided function.
// Usage: map(value => transformedValue)
// Example:
of(1, 2, 3).pipe(map(x => x * 2)) // emits 2, 4, 6

// filter()

// Purpose: Emits only values that pass a specified condition.
// Usage: filter(value => boolean)
// Example:
of(1, 2, 3, 4, 5).pipe(filter(x => x % 2 === 0)) // emits 2, 4

// take()

// Purpose: Emits only the first n values and completes
// Usage: take(n)
// Example:
of(1, 2, 3, 4, 5).pipe(take(3)) // emits 1, 2, 3 and completes

// takeUntil()

// Purpose: Emits values until another Observable emits a value and completes.
// Usage: takeUntil(notifier$)
// Example:
interval(1000).pipe(takeUntil(timer(5000))) // emits every second for 5 seconds and completes

// first()

// Purpose: Emits only the first value (or first value that meets a condition) and completes.
// Usage: first() or first(predicate)
// Examples:
of(1, 2, 3, 4, 5).pipe(first()); // emits 1 and completes
of(1, 2, 3, 4, 5).pipe(first(x => x > 2)) // emits 3 and completes

// last()

// Purpose: Emits only the last value (or last value that meets a condition) and completes.
// Usage: last() or last(predicate)
// Exampls:
of(1, 2, 3, 4, 5).pipe(last()); // emits 5 and completes
of(1, 2, 3, 4, 5).pipe(last(x => x < 4)) // emits 3 and completes

// ######################################################################################################
// * pipe()
// ######################################################################################################

// REMARK: Not to be confused with the Angular Pipes used for data transformations in templates!

// pipe() is an RxJS function that combines and chains multiple RxJS operators together to transform or manipulate streams of data (Observables).
// Typically, it accepts a series of RxJS operators to process or modify the data emitted by an Observable, such as map(), filter() and take().
// pipe() takes those operators as arguments and applies them sequentially (!) to the Observable for which it's called.
// This chaining makes it easier to manage complex data transformations and handle asynchronous operations in a clean and readable manner.

// Key Point: pipe() is reactive. It automatically subscribes to the Observable and updates the view whenever a new value is emitted.
// This makes it efficient for handling dynamic data that changes over time (a very common use - capturing user input).

import { of } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';

const tenNumbers$ = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10); // an observable that emits numbers from 1 to 10

// Use pipe() to chain multiple RxJS operators together:
tenNumbers$.pipe(
  filter(value => value > 5), // its output stream is the values from the input stream greater than 5, i.e. 6, 7, 8, 9, 10
  map(value => value * 2),    // its output stream is the values from the input stream multiplied by 2, i.e 12, 14, 16, 18, 20
  take(3)                     // its output stream is the first 3 values from the input stream: 12, 14, 16
).subscribe(result => {
  console.log(result);        // 12, 14, 16
});

// The input stream of the first RxJS operator - filter() - is the stream emitted by tenNumbers$.
// The input stream of each subsequent operator is the output stream of the operator prior to it.

// In an RxJS-based codebase, using pipe() is a consistent and standardized way to apply operators, regardless of how many you use.
// We use pipe() even if only one RxJS operator exists and, so, there is nothing to chain, for example:
tenNumbers$.pipe(
  map(value => value * 2)
);
// This keeps the codebase uniform and easier to maintain as other developers expect operators to always be applied via pipe().
// If more operators must be added to the chain in the future, the pipe() function is already there, making it easy to extend the Observable's behavior without refactoring.
// This is the current standard. The older "dot chaining" style, like
tenNumbers$.map(value => value * 2)
// has been deprecated.