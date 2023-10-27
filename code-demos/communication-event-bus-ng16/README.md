# communication-event-bus-ng16 code demo

- [Description](#description)
- [How to run](#how-to-run)
- [The event bus](#the-event-bus)
- [MFE1 app](#mfe1-app)
- [Shell app](#shell-app)

## Description

Unlike other demos in this repo, the focus of this demo is not about exploring an aspect of Webpack Module Federation. Instead, it focuses on showing how you can create an abstraction on top of the browser Custom Events to act as an [Event Bus/Aggregator](https://martinfowler.com/eaaDev/EventAggregator.html) which you can use throughout the app to subscribe to strongly typed events.

> **Note**
> 
> The setup of this code demo is the same as the `web-components-ng16`. For more information, please read the [web-components-ng16 README](../web-component-ng16/README.md).
>

## How to run

1) Go to `/code-demos/communication-event-bus-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/code-demos/communication-event-bus-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

The shell will load the Web component from the mfe1 app on page load.

## The event bus

The event bus is implemented by the [EventBus class](/code-demos/communication-event-bus-ng16/shell-ng16/src/app/event-bus.ts) whose purpose is to allow communicating events between the view components in a strongly typed fashion. 

The implementation shown in this code demo makes use of [RxJS](https://rxjs.dev/) but you could implement something similar without it. The choice to use `RxJS` is so that when subscribing to events you can have access to [all the operators](https://rxjs.dev/guide/operators) that `RxJS` offers, which allow you to manipulate, transform, and combine streams of data in a declarative manner. **In many cases, `RxJS` will allow you to easily express complex event subscription conditions that would otherwise be much harder.**

## MFE1 app

The mfe1 app exposes the [MyStandaloneComponent](/code-demos/communication-event-bus-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts) as a Web component. This Web component produces a `message-sent` custom event when the button `Send message` is clicked.

Use the `Go to /my-standalone-component` to load the `MyStandaloneComponent` component and look at the console for the logs produced when you click the `Send message` button.

> **Note**
> 
> Even though the mfe1 app is producing messages to the console when the `Send message` button is clicked, this does not happen when the mfe1 app is integrated into the shell. This is because the subscription to the button click happens at the [app.component.ts](../communication-event-bus-ng16/mfe1-ng16/src/app/app.component.ts) and that is not part of the exported webpack module, which is the [MyStandaloneComponent](../communication-event-bus-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts) Angular standalone component.
>

## Shell app

The shell loads the Web component from the mfe1 app by using a wrapper Angular component named [Mfe1Component](/code-demos/communication-event-bus-ng16/shell-ng16/src/app/mfe1-component/mfe1.component.ts). This component also subscribes to the `message-sent` custom event and republishes it to the Event Bus using the [MessageSentEvent](/code-demos/communication-event-bus-ng16/shell-ng16/src/app/mfe1-component/message-sent-event.ts) class.

From here on now, any part of the shell can subscribe in a strongly typed fashion to the `MessageSentEvent` through the Event Bus. For an example see the [OtherComponent](/code-demos/communication-event-bus-ng16/shell-ng16/src/app/other-component/other.component.ts) Angular component.
