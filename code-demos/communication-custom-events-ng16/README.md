# communication-custom-events-ng16 code demo

- [Description](#description)
- [How to run](#how-to-run)
- [Angular inputs/outputs mapping](#angular-inputsoutputs-mapping)
- [MFE1 app](#mfe1-app)
- [Shell](#shell)
- [What about multiple micro frontends](#what-about-multiple-micro-frontends)
- [Learn more](#learn-more)

## Description

Unlike other demos in this repo, the focus of this demo is not about exploring an aspect of Webpack Module Federation. Instead, it focus on showing how communication between different micro frontend apps and the shell/host app can be implemented. 

The communication in a micro frontend app can be done using [Custom Events](https://dom.spec.whatwg.org/#customevent). See: [how to dispatch and subscribe to Custom Events](https://javascript.info/dispatch-events#custom-events). In an Angular app there are a few things that you should be aware though.

> **Note**
> 
> The setup of this code demo is the same as the `web-components-ng16`. For more information, please read the [web-components-ng16 README](../code-demos/web-component-ng16/README.md).
>

## How to run

1) Go to `/code-demos/communication-custom-events-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/code-demos/communication-custom-events-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

The shell will load the Web component from the mfe1 app on page load.

## Angular inputs/outputs mapping

When using the [createCustomElement](/code-demos/communication-custom-events-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component-bootstrap.ts) function from [@angular/elements](https://angular.io/guide/elements), Angular will convert the provided Angular component into a Web component and, in doing so, it will [map any Angular inputs and outputs to Web component attributes/properties and custom events](https://angular.io/guide/elements#mapping).

Everything seems to be great because you seem to get everything you need just by using the `createCustomElement` function, no extra code needed. However, there's a caveat. When using this function, the custom events created from Angular outputs have the `bubbles` and `composed` properties set to false. To be more accurate, the `createCustomElement` function instantiates the custom event and doesn't set these properties so they take a default value of `false`. See the source code [here](https://github.com/angular/angular/blob/fc9ba3978cc098b59c107371bbd5413044fbecda/packages/elements/src/create-custom-element.ts#L218C1-L224C6).

The [documentation for these properties](https://dom.spec.whatwg.org/#interface-event) is:

- `bubbles`: returns true or false depending on how event was initialized. True if event goes through its target’s ancestors in reverse tree order; otherwise false.
- `composed`: returns true or false depending on how event was initialized. True if event invokes listeners past a ShadowRoot node that is the root of its target; otherwise false.

Why might you care about the `bubbles` and `composed` properties? In short, because they allow you to control whether you can subscribe to the event at any level of the DOM. With these properties set to false you can only subscribe to the custom event if you have a reference to the HTML element that produces it. 

For more information see [Allow dispatch of bubbling custom events when using @angular/elements](https://github.com/angular/angular/issues/39489).

## MFE1 app

The mfe1 app exposes an Angular standalone component named [MyStandaloneComponent code](/code-demos/communication-custom-events-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts) which contains an Angular output named `messageSentEvent`.

When using the `createCustomElement` function at [my-standalone-component-bootstrap.ts](/code-demos/communication-custom-events-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component-bootstrap.ts), by default, the resulting Web component will produce a custom event with the same name, but you can control the custom event name by passing in an alias to the `@Output` decorator. So in this case, the Web component created from the `MyStandaloneComponent` Angular component will produce a custom event named `message-sent` whenever the `Send message` button is clicked.

In addition, when the `Send message` button is clicked, the Web component will also produce a `greet-message` custom event. This is being done to demonstrate the difference with relying on the output mapping that Angular does for you by default or manually dispatching a custom event. Outside of a demo app, you'd likely choose one or the other.

Use the `Go to /my-standalone-component` to load the `MyStandaloneComponent` component look for the console for the logs produced when you click the `Send message` button.

> **Note**
> 
> Even though the mfe1 app is producing messages to the console when the `Send message` button is clicked, this does not happen when the mfe1 app is integrated into the shell. This is because the subscription to the button click happens at the [app.component.ts](../communication-custom-events-ng16/mfe1-ng16/src/app/app.component.ts), which is not part of the exported webpack module, which is the [MyStandaloneComponent](../communication-custom-events-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts) Angular standalone component.
>

## Shell

The shell app is created to show the difference between subscribing to a custom event that has the `bubbles` property set to `true` and one that has it set to `false`.

The [app.component.ts](/code-demos/communication-custom-events-ng16/shell-ng16/src/app/app.component.ts) programatically subscribes to both the `message-sent` and `greet-message`. For each custom event, two subscriptions are done, one subscription is done at the Web component instance and another is done at the `document` instance.

Then, something similar is done declaritively at the [app.component.html](/code-demos/communication-custom-events-ng16/shell-ng16/src/app/app.component.html). A subscription to both the `message-sent` and `greet-message` custom events is done at the Web component instance and another at a parent `div`. 

When you click the `Send message` button, several messages appear on the page, each one indicating what subscription produced the message. What you can see with this demo is that the subscriptions made to the `message-sent` event do not bubble through the DOM and therefore the subscriptions made to this event outside of the Web component instance do not get triggered. In constrast, all the subscriptions made to the `greet-message` are triggered because the event is manually dispatched with the `bubbles` property set to `true`.

## What about multiple micro frontends

The concepts explained in this code demo should allow you to implement communication in your multiple micro frontend app. I think you will either:

1) Use the shell to orchestrate the communication between the different micro fronteds. Meaning, the shell will subscribe to the required events and pass the data to other micro frontends. 
2) Publish custom events with `bubbles` true so that micro frontends can subscribe to the event without any orchestration from the shell.

What should you do? I think it varies on a case by case and I'm not sure if there is really any pros/cons to either approach. What is more important is that you are aware of the trade-offs that you make and implement what works best for you. 

## Learn more

For more info see:

- [Event: bubbles property](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles)
- [Event: composed property](https://developer.mozilla.org/en-US/docs/Web/API/Event/composed)
- [Introduction to Events](https://javascript.info/events)
- [Dispatching custom events](https://javascript.info/dispatch-events)
- [Custom Events in JavaScript](https://www.devlane.com/blog/custom-events-in-javascript)
- [createCustomElement source code](https://github.com/angular/angular/blob/fc9ba3978cc098b59c107371bbd5413044fbecda/packages/elements/src/create-custom-element.ts#L128)
- [Allow dispatch of bubbling custom events when using @angular/elements](https://github.com/angular/angular/issues/39489)
- [Angular elements overview](https://angular.io/guide/elements)
- [Learn how Angular Elements transmits Component’s @Outputs outside Angular](https://medium.com/angular-in-depth/how-angular-elements-uses-custom-events-mechanism-to-transmit-components-outputs-outside-angular-7b469386f6e2)
- [Cross Component Communication with Custom Events](https://www.youtube.com/watch?v=hIv22aTl3-g)
- [Different Patterns in Communicating Between Web Components](https://blog.bitsrc.io/different-patterns-in-communicating-between-web-components-7ac52771aeb8)
- [Handling data with Web Components](https://itnext.io/handling-data-with-web-components-9e7e4a452e6e)
