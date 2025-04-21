// Data binding in Angular is a powerful feature that allows you to synchronize data between the component class and the template.
// It's the mechanism that connects the application's data (stored in the component class) to the user interface (the HTML template) and vice versa.
// Changes in the data model are immediately reflected in the UI, and user interactions with the UI are immediately reflected in the data model.

// Angular provides several types of data binding (to jump to a section, copy it with the asterisk, like "* @Output() - Event binding" -> Ctrl+F -> Ctrl+V):

// Binding within the same component:

// * {{ }} - Interpolation (component class ---> HTML template)
// * [] - Property binding (component class ---> HTML template)
// * () - Event binding (HTML template ---> component class)
// * [(ngModel)] - Two-way data binding (component class ---> HTML template ---> component class)

// Binding between parent and child components:

// * @Input() - Property binding (parent HTML template ---> child component class)
// * @Output() - Event binding (child component class ---> parent HTML template)

// ######################################################################################################
// ######################################################################################################
// Binding within the same component:
// ######################################################################################################
// ######################################################################################################

// ######################################################################################################
// * {{ }} - Interpolation (component class ---> HTML template)
// ######################################################################################################

// You can embed expressions (dynamic text) into HTML templates with double curly braces, which tells Angular that
//    it is responsible for the expression inside and ensuring it is updated correctly.
// Interpolation is named so because it inserts (interpolates) dynamic values into static HTML, "filling the gaps" within the template.
// Interpolation automatically converts the expression into a string. Objects and arrays are converted using their toString method.
// In addition to evaluating the expression at first render, Angular also updates the rendered content when the expression's value changes.

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  // 1. The data source - a scalar property of the component:
  firstName: string = 'John';
  lastName: string = 'Doe';

  // 2. The data source - an object property of the component:
  user: { email: string } = {
    email: 'john.doe@example.com'
  };

  // 3. The data source - a function of the component:
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

// component.html:
<div>
  <p>1. Scalar property: {{ firstName }}</p>
  <p>2. Object property: {{ user.email }}</p>
  <p>3. Function: {{ getFullName() }}</p>
  <p>4. Expression: {{ firstName + ' ' + lastName + ' (' + firstName.charAt(0) + lastName.charAt(0) + ')' }}</p>
</div>

// The fourth line demonstrates a more complex expression within the interpolation brackets. It will output: John Doe (JD).
// The expression within double curly braces can be any valid TypeScript expression that returns a value that can be converted to string.
// This includes a wide range of possibilities. Here are some examples to illustrate the breadth of what's possible:

// Simple arithmetic:
<p>{{ 2 + 2 }}</p>

// String manipulation:
<p>{{ firstName.toUpperCase() + ' ' + lastName.toLowerCase() }}</p>

// Boolean expressions:
<p>{{ age >= 18 ? 'Adult' : 'Minor' }}</p>

// Array operations:
<p>{{ ['apple', 'banana', 'cherry'].join(', ') }}</p>

// Object property access:
<p>{{ user?.address?.city || 'No city provided' }}</p>

// Function calls with arguments:
<p>{{ Math.max(score1, score2, score3) }}</p>

// Complex expressions:
<p>{{ isLoggedIn && user.roles.includes('admin') ? 'Welcome, Admin!' : 'Welcome, Guest!' }}</p>

// Template literal-style expressions (note: actual template literals are not supported, but you can achieve similar results):
<p>{{ `${firstName} ${lastName} is ${new Date().getFullYear() - birthYear} years old` }}</p>

// While these expressions can be quite complex, they should ideally be kept simple for readability and maintainability.
// If an expression grows too much, it's often better to compute the result in the component's TypeScript code and
//		then use a simple property or method call in the template.
// Or you can use data cache after the initial calculation or retrieval of the value.

// These expressions are evaluated in the context of the component, so they have access to the component's properties and methods,
//		as well as to global objects like `Math`.

// These expressions should be pure and should not cause side effects, as Angular may re-evaluate them multiple times during change detection.

// @@@ When Are The Binding Mehods Called?

// Angular's change detection mechanism plays a key role in determining when to call the method and update the associated DOM property.
// It's responsible for ensuring the UI stays up-to-date with the underlying model state. Here's how it handles method calls in property bindings:

// * Change Detection Cycle:
//		Angular runs a change detection cycle at strategic points to check if any data bound properties have changed.
// * Method Binding:
//		If you bind a property of an HTML tag to a method in your component class, Angular will call this method during every change detection cycle
//		    to determine if the return value of the method has changed. If the return value changes, Angular updates the property in the HTML.

// Frequent Calls:
// Since Angular cannot know in advance when the return value of a method might change, it calls the method during each change detection cycle.
// If the method performs complex calculations or triggers other side effects, this can lead to performance issues.

// Optimization:
// It's generally better to store dynamic values as component properties and update these properties only when necessary.
// This way, during change detection, Angular only has to check the property value rather than execute a method.

// Best Practices

// Use Pure Pipes:
// If the transformation is purely data-driven and does not have side effects, consider using pipes, especially pure pipes,
// 		which Angular only calls when it detects a change in the input value.

// Avoid Complex Methods in Bindings:
// Keep methods used in bindings simple and quick to execute.
// Complex computations should be handled in the component's logic and stored in properties, not directly in the template expressions.

// Leverage OnPush Change Detection:
// For components with predictable data changes (e.g., data only changes via inputs), consider using the ChangeDetectionStrategy.OnPush 
//    to run change detection on these components only when their inputs change or when events originate from the component or its children.

// ######################################################################################################
// * [] - Property binding (component class ---> HTML template)
// ######################################################################################################

// Sets an HTML element's property value based on a component variable or a method. The syntax:
[html_property]="component_variable_or_method"
// Examples:
<!-- example.component.html -->
<img [src]="image1Url" />
<img [src]="getImage2Url()" />

// The square brackets around an HTML property indicate that this is a property binding,
//		so the string inside the quotes is treated not as a hardcoded value but as an expression which returns that value.

// During the rendering process, Angular will:
//		* remove the square brackets from the property name;
//		* evaluate the expression inside the quotes and use the result as the property value, substituting the expression.
// The rendered HTML (supposing imageUrl CONTAINS "https://example.com/image1.png" and getImage2Url() RETURNS "https://example.com/image2.png"):
<img src="https://example.com/image1.png" />
<img src="https://example.com/image2.png" />

// A method used in property binding:
// * cannot accept parameters;
// * can return any type that is appropriate for the property being bound to.

// Property binding is not limited to strings; you can bind properties of various types such as numbers, booleans, objects, and arrays.
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  getPrice(): number {
    return 42;
  }
  
  calculationIsProhibited(): boolean {
    return true;
  }
  
  getStyles(): { [key: string]: any } {
    return {
      'font-size': '20px',
      'color': 'red'
    };
  }
  
  getClasses(): string[] {
    return ['class1', 'class2'];
  }
  
  getFontSize(): number {
    return 20;
  }

  getColor(): string {
    return 'red';
  }
}

<!-- example.component.html -->
<input id="price" [value]="getPrice()" />
<button id="calculate" [disabled]="calculationIsProhibited()">Calculate!</button>
<div [style.font-size.px]="getFontSize()" [style.color]="getColor()">Styled Text</div>
<div [ngStyle]="getStyles()">Another Styled Text</div>
<div [class]="getClasses().join(' ')">Class-bound Text</div>

// The final rendered HTML:
<input id="price" value="42">
<button id="calculate" disabled>Calculate!</button>
<div style="font-size: 20px; color: red;">Styled Text</div>
<div style="font-size: 20px; color: red;">Another Styled Text</div>
<div class="class1 class2">Class-bound Text</div>

// The [style.XXX] directive is used to bind a single CSS style property. So, it appears twice - for two the CSS style properties.
// The [ngStyle] directive is used to set multiple CSS styles at once by binding to an object, returned by the method.
// In that object, the keys are the CSS properties and the values are the styles you want to apply.
// Angular interprets [ngStyle] and applies all the styles contained in the object to the element.

// Also, notice how getStyles() is defined:
  getStyles(): { [key: string]: any } {
// The type
{ [key: string]: any }
// is a TypeScript index signature.
// It indicates that the function returns an object where the keys are strings and the values can be of any type.
// We could declare the function to return any:
  getStyles(): any {
// But this would be less specific and provides less type safety.
// "key" is not actually used in the code but serves as a placeholder name for the key in the index signature.
// You can use any name for the placeholder in the index signature, not just "key". For example:
{ [property: string]: any }
{ [prop: string]: any }

// Property Binding can bind any data type to an element property, making it more versatile for setting properties that require non-string values.

// ######################################################################################################
// * () - Event binding (HTML template ---> component class)
// ######################################################################################################

// Components handle user interactions and respond to events such as button clicks, form submissions, and more.
// They can define event handlers in the component's class to execute specific actions or trigger changes in the application.

// The () syntax binds an HTML element's event (not a property!) to a method of the component class:

(html_event)="componentMethod()"

// The method is not executed on rendering - it will be executed only when the HTML event occurs.
// That is different from Property Binding where the method is executed on rendering in order to get it's returned value to build the HTML.

// Example:
<button (click)="onClick()">Click Me</button>

// That is rendered to this HTML:
<button>Click Me</button>
// As you see, any mention of event binding has gone.
// But how does Angular know which method of the component should be called when the button is clicked?
// When you write templates with event binding, Angular sets up event listeners for these events during the compilation and rendering phases.
// So, the component is constantly listening to the button's click event.
// When the user clicks the button, the event is propagated to that listener.
// This listener then calls the onClick() method on the component instance.

// The method used in event binding usually returns void but it can return any type (however, the returned value will be ignored).
// In contrast to Property Binding, Event Binding methods can accept parameters.
// They often use the special $event object to get information about the event that triggered the method:

export class ExampleComponent {
  onClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    const id = clickedElement.id;
    const text = clickedElement.innerText;
    console.log('Button clicked!', { id, text });
  }
}

// example.component.html
<button id="btn1" (click)="onClick($event)">Click Me</button>

// The event's argument can be just string. The following example demonstrates calling an event when an input control's value is changed by the user:

@Component({
  selector: 'app-user-name',
  templateUrl: './user-name.component.html',
  styleUrls: ['./user-name.component.css']
})
export class cstNmComponent {
  cstNm: string = '';

  onKeyUp(newCstNm: string): void {
    this.cstNm = newCstNm;
  }
}

// user-name.component.html
<h1>{{ cstNm }}</h1>
<input
  id="cstNmInput" 
  [value]="cstNm"
  (keyup)="onKeyUp($event.target.value)"
  placeholder="Enter user name">

// We use event binding (keyup)="onKeyUp($event.target.value)" to call the onKeyUp method whenever a key is released in the input field.
// $event.target.value gives us the current value of the input field, which we pass to the onKeyUp method.

// This setup creates a two-way binding between the input field and the cstNm property.
// As the user types in the input field, the onKeyUp method is called, updating the cstNm property,
// 		which in turn updates the displayed name in the <h1> tag.

// Note: It's often preferable to use the [(ngModel)] directive (described later in this file) for two-way binding if you're working with forms. 
// However, the approach shown here demonstrates how to handle events and update properties manually,
// 		which can be useful in certain scenarios or when you need more control over the binding process.

// It's also possible to use a template reference variable (a "pound variable") instead of $event.target.
// This approach is often clearer and more Angular-idiomatic since you can give the pound variable a self-documenting name.
// Here's how you would modify the <input> element in the template:

<input
  id="cstNmInput" 
  [value]="cstNm"
  (keyup)="onKeyUp(enteredCstNm.value)"
  #enteredCstNm
  placeholder="Enter user name">

// The #enteredCstNm declaration creates a reference to the input element, and then that reference is used in the (keyup) event binding.

// ######################################################################################################
// * [(ngModel)] - Two-way data binding (component class ---> HTML template ---> component class)
// ######################################################################################################

// Allows changes in the GUI to update the component's data, and vice versa, automatically and simultaneously.
// It's a powerful tool for creating interactive forms, providing an easy way to keep your component's data in sync with your template's form controls.

// Uses the [(ngModel)] directive and is denoted by [()].
// The suare brackets mean the one-way part of the binding - from component class to HTML template.
// The round brackets mean the opposite one-way part of the binding - from HTML template to component class (like in event binding).

// In fact, the direction from component class to HTML is Interpolation.
// Since this is a value drawing on the screen, and not a property binding, it's very strange that the creators of Angular used square brackets, and not curly ones.
// {(ngModel)} or ({ngModel}) would reflect the essence of two-way binding much more correctly, but we have what we have, so just remember.

// In a typical scenario, the value of the bound property is initially displayed in the HTML.
// If the user changes it in the browser, the bound property is automatically updated with the new value.
// Obviously, any changes of the bound property made by other parts of the program are reflected in the HTML right away.

// To use [(ngModel)], you need to import the FormsModule in your application root module (app.module.ts):
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
import { ParentComponent } from './app.component';
import { ExampleComponent } from './example/example.component';

@NgModule({
  declarations: [
    ParentComponent,
    ExampleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  ],
  providers: [],
  bootstrap: [ParentComponent]
})
export class AppModule { }

// Example:

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  email: string = 'fake@gmail.com';
}

// HTML Template (example.component.html):

<form>
  <div>
    <label for="email">Email:</label>
    <input id="email" name="email" type="email" [(ngModel)]="email">
  </div>
  <p>Your email is: {{ email }}</p>
</form>

// Rendered HTML:

<form>
    <label for="email">Email:</label>
    <input id="email" name="email" type="email" ng-reflect-model="">
  </div>
  <p>Your email is: fake@gmail.com</p>
</form>

// [(ngModel)]="email" binds the input field to the email property of the component.

// Notice that the bound variables can be used elsewhere in the template using Interpolation.
// For example, {{ email }} displays the current value of the email property.

// When the form is rendered, the email input control is populated with the value of the email field in the component object (similar to Interpolation).
// And when the user types into the input field, that immediately changes the email field in the component object.
// And that, respectively, is immediately reflected in the {{ email }} piece of HTML (which uses Interpolation).

// The id, name and type attributes are part of standard HTML and are not related to [(ngModel)].

// @@@ Two-ay binding with getter/setter:

// [(ngModel)] can bind not only with an instance variable but also with a getter / a setter:
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  private _age: number = 0;
  get age(): number { return this._age; }
  set age(value: number) { this._age = value < 0 ? 0 : value; }
}
// A fragment of HTML Template (example.component.html):
<input [(ngModel)]="age" name="age" type="number">

// ######################################################################################################
// ######################################################################################################
// Binding between parent and child components:
// ######################################################################################################
// ######################################################################################################

// ######################################################################################################
// * @Input() - Property binding (parent HTML template ---> child component class)
// ######################################################################################################

// @Input() decorator denotes a component's property as an input property.
// Allows you to bind data properties of a parent component to properties in a child component or directive.
// I.e. data is passed into the component or directive from its parent component in the application's component tree.
// When you decorate a component's property with @Input(), you enable that property to receive values from its parent component. 
// This is typically done through attribute binding in the Angular template syntax (whith square brackets).

// Consider a simple Angular component that displays a user's name.
// The user's name is a property that the parent component can pass to this child component.

// Child Component:
import { Component, Input } from '@angular/core';
@Component({
  selector: "app-user",
  template: `<h1>Welcome, {{ userName }}!</h1>`
})
export class ChildComponent {
  // Thanks to the @Input() decorator, the "name" property is designed to accept data from the component where it will be used:
  @Input() name: string;
}

// Parent Component:
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class ParentComponent {
  userName = 'John Doe'; // holds the value intended for the child
}

// The assignment of the value from ParentComponent.userName to ChildComponent.name is specified in the template file of the ParentComponent.
// Parent Component Template file (app.component.html):
<div>
  <h2>Parent Component</h2>
  <!-- Data binding from parent to child happens here - where ChildComponent.name is being used. -->
  <!-- The value of ParentComponent.userName ('John Doe') is assigned to ChildComponent.name. -->
  <!-- This transfer of data happens automatically because of the Angular change detection mechanism that observes changes -->
  <!-- in input properties and updates the child component accordingly. -->
  <app-user [name]="userName"></app-user>
</div>

// You see that the input property of the child component class ("name") is used as a property of the custom HTML tag specified in the child's selector.
// You will do that in your real applications frequently!
// The HTML tag's property must be in square brackets since its value is not hardcoded - it's a property of the child component class.


// @@@ Parent/Child relationship

// Angular creates a hierarchy of components that follows the structure defined in the templates.
// This hierarchical structure determines the data flow from parent components to child components.
// Each time a component selector (like "app-user") is used in a template, it corresponds to an instance of that component (like ParentComponent)
// 		being created when Angular processes the template.
// For example, when this line is rendered in the Parent Component's template
  <app-user [name]="userName"></app-user>
// that automatically creates an instance of the class which has "app-user" selector, i.e. ChildComponent.

// Angular does not expose or manage individual named instances	like traditional object-oriented programming might suggest -
// 	 no pointer to the created object is available to the coder.

// A child component in Angular does not need to "know" from which parent to pick the value —
// 		it is implicitly determined by its placement within the parent’s template.
// The direct container relationship ensures the child component only accesses properties from its immediate parent component.

// Execution Flow:
// * Initialization:
//		  When Angular initializes the components, it processes the template of each component.
// * Component Interaction:
//		  As Angular processes the template of the ParentComponent, it recognizes the property binding syntax
//		    and looks up the value of userName in the ParentComponent.
// * Data Transfer:
//		  Angular then assigns the value of userName to the name property of the ChildComponent. This transfer is handled by Angular's
//		    change detection mechanism, which ensures that the child component receives the current value of the property from the parent component.
// * Rendering:
//		  The ChildComponent then uses this value in its template (<h1>Welcome, {{ name }}!</h1>), rendering the name passed from the parent.

// @@@ Required input

// To make an input property required, pass the
{ required: true }
// plain object to the @Input() decorator as a parameter.

// Example:
@Component({
  selector: 'app-child',
  template: `Name: {{name}}`
})
class ChildComponent {
  @Input({ required: true }) name: string;
}

// Then, you forget to provide a value for the name property from the parent template:
<app-child></app-child>
// That will throw an error: Required input 'name' from component ChildComponent must be specified.

// Notice that "required" means that it must appear in the parent component's template.
// It doesn't mean that the value of the property cannot be null or undefined - for example, the parent template can legally sent null.

// @@@ Aliasing - @Input() decorator can accept a parameter:

// Alias allows you to specify a different name for the input property as it should appear in the template binding.
// This is useful when you want to use an internal property name within your component but expose a different name externally.
// In the next example, the child component uses "cstNm" internally, but the parent populates it through the HTML attribute "customerName".

import { Component, Input } from '@angular/core';

@Component({
  selector: 'customer-profile',
  template: '<p>Customer Name: {{ cstNm }}</p>'
})
export class CustomerProfileComponent {
  @Input('customerName') cstNm: string;
}

// The field name is cstNm, that's how it will be referenced in TypeScript.
// But the customerName alias becomes the property of the <customer-profile> custom HTML tag, not "cstNm":
<customer-profile [customerName]="user.fullName"></customer-profile>

// This approach offers several benefits:
// * Allows you to have a more descriptive public API (HTML tag's property name) when the internal names are restricted by a naming convention
//		(for example, repeat abbreviated DB field names).
// * Can help avoid naming conflicts if the parent component already uses a property named cstNm.
// * Provides flexibility in refactoring: you can change the internal property name without affecting how other components use your component.

// ######################################################################################################
// * @Output() - Event binding (child component class ---> parent HTML template)
// ######################################################################################################

// The @Output decorator allows child components to send data to their parent components - as the opposite of @Input().
// The bound property is typically of type EventEmitter<T> where <T> is the type of the data emitted to the parent component.

// Basic syntax:

// In the child component class:
@Output() customEvent = new EventEmitter<T>();

// Use the emit() method of the EventEmitter to send data:
this.customEvent.emit(data);

// In the parent's template, use event binding to listen for the custom event:
<child-component (customEvent)="parentMethod($event)"></child-component>

// Example:

// Child component:
import { Component, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-child',
  template: '<button (click)="sendMessage()">Send Message</button>'
})
export class ChildComponent {
  @Output() messageEvent = new EventEmitter<string>();

  sendMessage() {
	  this.messageEvent.emit('Hello from child');
  }
}

// Parent component:
@Component({
  selector: 'app-parent',
  template: '<app-child (messageEvent)="reactToChildMessage($event)"></app-child>'
})
export class ParentComponent {
  reactToChildMessage(message: string) { console.log(message); }
}

// @@@ $event

// Review this line:
  template: '<app-child (messageEvent)="reactToChildMessage($event)"></app-child>'
// $event is a special variable in Angular template syntax which represents the data emitted by the event.
// In our example, $event contains the string emitted by messageEvent in the child component.
// The parent's reactToChildMessage() method receives this string as its argument.

// The data type of $event is dictated by the data type passed to EventEmitter<T> as T, which is string in our example:
  @Output() messageEvent = new EventEmitter<string>();

// However, it could be any type. In the next example, it's an object:

interface IUser {
  firstName: string;
  lastName: string;
}

// The child component:
import { Component, Output, EventEmitter } from '@angular/core';

// Remark: ngSubmit (in "template") is a directive which fires when the form is submitted; described later in the file.
@Component({
  selector: 'app-user-form',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="userData.firstName" name="firstName" placeholder="First Name">
      <input [(ngModel)]="userData.lastName" name="lastName" placeholder="Last Name">
      <button type="submit">Submit</button>
    </form>
  `
})
export class UserFormComponent {
  @Output() userSubmitted = new EventEmitter<IUser>();

  user: IUser = {
    firstName: '',
    lastName: ''
  };

  onSubmit() {
    this.userSubmitted.emit(this.user);
  }
}

// The parent component:

@Component({
  selector: 'app-parent',
  template: `
    <app-user-form (userSubmitted)="handleUserSubmission($event)"></app-user-form>
    <div *ngIf="submittedUser">
      Submitted User: {{submittedUser.firstName}} {{submittedUser.lastName}}
    </div>
  `
})
export class ParentComponent {
  submittedUser: IUser | null = null;

  handleUserSubmission(user: IUser) {
    this.submittedUser = user;
    console.log('Received user data:', user);
  }
}

// @@@ ngSubmit

// Review this line:
    <form (ngSubmit)="onSubmit()">
// ngSubmit is a special event directive in Angular that is used in <form> elements with the event binding syntax.
// It fires when the form is submitted, either by clicking a submit button or by pressing Enter in a form input field.
// In this example, when the form is submitted, the onSubmit() method in that component is called, allowing you to handle the form data as needed.
// Advantages of (ngSubmit) over the standard DOM (submit):
// 		- prevents the default form submission behavior (which would cause a page reload);
// 		- works more reliably across different browsers;
// 		- integrates better with Angular's form handling mechanisms.