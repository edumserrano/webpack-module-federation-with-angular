# web-component-ng16 code demo

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app](#mfe1-app)
  - [Exposed webpack module](#exposed-webpack-module)
  - [Dev platform](#dev-platform)
- [Shell app](#shell-app)
  - [How the remote is loaded into the shell](#how-the-remote-is-loaded-into-the-shell)
- [Webpack Module Federation](#webpack-module-federation)
- [Web components and routing](#web-components-and-routing)
- [Web components and styling](#web-components-and-styling)
- [Bonus](#bonus)
  - [Add strict type information to remotely imported web components](#add-strict-type-information-to-remotely-imported-web-components)
  - [Add IDE auto-completion on HTML for web components](#add-ide-auto-completion-on-html-for-web-components)
- [Learn more](#learn-more)

## Description

This example shows how to setup Webpack Module Federation where the shell loads an Angular standalone component that is exposed as a [Web component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components). This example also shows how to set properties on the Web component and listen to its events.

The remote webpack module contains a function that converts an Angular standalone component to a Web component.

The shell app is rendered in a red colored background and the remotely loaded mfe1 app is rendered in a blue colored background.

> **Note**
>
> Although the mfe1 app is using an Angular standalone component, the module federation setup shown in this example could also be used with a non-standalone Angular component. You do NOT have to use Angular standalone components to export Angular components as Web components.
>

## How to run

1) Go to `/code-demos/web-component-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/code-demos/web-component-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

The shell will load the Web component from the mfe1 app on page load.

## MFE1 app

The mfe1 app is an Angular 16 app that contains an Angular standalone component named [MyStandaloneComponent](/code-demos/web-component-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts), which represents the micro frontend that we want to expose via Webpack Module Federation.

The [AppRoutingModule](/code-demos/web-component-ng16/mfe1-ng16/src/app/app-routing.module.ts) Angular module contains a route that loads the `MyStandaloneComponent` on `/my-standalone-component`. You can use the `Go to /my-standalone-component` link on the mfe1 app to load the `MyStandaloneComponent` Angular component.

The mfe1 app will [set the input](/code-demos/web-component-ng16/mfe1-ng16/src/app/app-routing.module.ts) of the `MyStandaloneComponent` to `test input value from dev platform` and [subscribe to the output of the component](/code-demos/web-component-ng16/mfe1-ng16/src/app/app.component.ts) which logs to the console when the `Send message` button is clicked.

### Exposed webpack module

On the [webpack configuration file for mfe1 app](/code-demos/web-component-ng16/mfe1-ng16/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
  "./standalone-component-as-web-component": "./src/app/my-standalone-component/my-standalone-component-bootstrap.ts",
},
```

The above defines a webpack module that is named `standalone-component-as-web-component` and that is mapped to the [./src/app/my-standalone-component/my-standalone-component-bootstrap.ts](/code-demos/web-component-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component-bootstrap.ts) file, which is where the `bootstrapMyComponentAsync` function that converts the `MyStandaloneComponent` Angular standalone component to a Web component is defined. 

> **Note**
>
> The Angular component is converted to a Web component using the `createCustomElement` function from `@angular/elements`. For more info see [Angular elements overview](https://angular.io/guide/elements).
>

### Dev platform

When you run the mfe1 app you will see the text `MFE1 dev platform`. This is to call out the fact that the mfe1 app is not exposed in its entirety via Webpack Module Federation, only the function `bootstrapMyComponentAsync` from the [my-standalone-component-bootstrap.ts](/code-demos/web-component-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component-bootstrap.ts) file is. Everything else in the mfe1 app is there only with the sole purpose of supporting the local development of the mfe1 app, more specifically, the development of the `MyStandaloneComponent` Angular component.

This means that the input value `test input value from dev platform` set by the dev platform is not part of the exported component, neither is the subscription of the component's output that logs to the console when the `Send message` is clicked.

## Shell app

The shell app is an Angular 16 app that programatically loads a Web component exposed by the mfe1 app on page load. This is done on the `ngOnInit` method at [app.component.ts](/code-demos/web-component-ng16/shell-ng16/src/app/app.component.ts). Furthermore, at the [app.component.html](/code-demos/web-component-ng16/shell-ng16/src/app/app.component.html) you can see how the Web component properties are being set and how its events are being consumed.

Click on the `Send message` button from the remotely loaded component and see the message produced by the Web component be displayed on the shell.

### How the remote is loaded into the shell

The shell app uses the `loadRemoteModule` function to load the webpack module from the mfe1 app and, once the remote webpack module is loaded, the shell uses the exposed `bootstrapMyComponentAsync` to load the Web component from the mfe1 app. See the `ngOnInit` method at [app.component.ts](/code-demos/web-component-ng16/shell-ng16/src/app/app.component.ts). 

The `bootstrapMyComponentAsync` registers a custom element in the `CustomElementRegistry` with the name `my-mfe-element`, which means that now wherever the custom element `<my-mfe-element></my-mfe-element>` is defined it will render the Web component from the mfe1 app. See [app.component.html](/code-demos/web-component-ng16/shell-ng16/src/app/app.component.html).

> **Note**
>
> To use custom elements like the `my-mfe-element` and avoid Angular complaining that it doesn't know what it is, we make use of the `CUSTOM_ELEMENTS_SCHEMA` schema, which is added to the schema array at [app module](../web-component-ng16/shell-ng16/src/app/app.module.ts) schemas.
>

## Webpack Module Federation

The setup of Webpack Module Federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package, which aims to streamline the setup of Webpack Module Federation for Angular apps. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)

## Web components and routing

> If a web component has it's own router, you can use our UrlMatchers startsWith and endsWith to define, which part of the URL is intended for the shell and for the micro frontend

To cope with this scenario see the [UrlMatchers](https://www.npmjs.com/package/@angular-architects/module-federation-tools#sub-routes) from the `@angular-architects/module-federation-tools` npm package.

## Web components and styling

Beware of issues with styling when using web components. If styles from your Angular component that you have exposed as a Web component using `@angular/elements` are bleeding out, then you might need to set your [ViewEncapsulation](https://angular.io/api/core/ViewEncapsulation) to `ViewEncapsulation.ShadowDom`, which uses the ShadowDOM specification, on the Angular component which is being passed to `createCustomElement`. 

In this example app, the `ViewEncapsulation` configuration would be applied to the [MyStandaloneComponent](/code-demos/web-component-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts) component.

## Bonus

This section is not directly related with working with Webpack Module Federation and  it's not needed to get this code demo running nor to understand its concepts. Feel free to skip this `Bonus` section if you're not interested in knowing how to provide type information or improving the IDE support for externally imported Web components.

### Add strict type information to remotely imported web components

When using the remotely imported web component from the mfe1 app you do not have any type information. However, you can create a [type declaration file `.d.ts`](https://medium.com/@ohansemmanuel/what-is-a-d-ts-file-in-typescript-2e2d90d58eca#:~:text=TLDR-,.,information%20used%20for%20type%20checking), whose purpose is to describe the shape of the mfe1 module and only contains type information used for type checking. The [mfe1.d.ts](/code-demos/web-component-ng16/shell-ng16/src/app/mfe1.d.ts) shows how you can do that. 

With the `mfe1.d.ts` type declaration file you can programmatically instantiate the web component from the mfe1 app and add it to the DOM and get strict type checking whilst doing it:

```ts
// Import the MyMfeElement interface declaration for the 
import { MyMfeElement } from './mfe1'; 

// Create an instance of the MyMfeElement web component programmatically
const myMfeElement: MyMfeElement = document.createElement("my-mfe-element");

// Set web component inputs
myMfeElement.inputText = "some input text"; // set input using a property
// Alternatively you could set the same input using the attribute 'input-text'.
// However, I don't think there is strict type support for attributes:
myMfeElement.setAttribute("input-text","some input text"); // set input using an attribute
myMfeElement.setAttribute("input-text2","some input text 2"); // no error but wouldn't have any effect

// Trying to set an non-existing property would give an error
myMfeElement.inputText2 = "some input text"; // error, property does not exist

// Subscribe to web component events
myMfeElement.addEventListener("message-sent", (ev: CustomEvent<string>) => console.log(ev.detail));

// Trying to subscribe to an non-existing event would give an error
myMfeElement.addEventListener("message-sent-2", (ev: Event) => console.log(ev.detail)); // error, event does not exist

// Lastly, add the web component to the DOM
const root: HTMLElement | null = document.getElementById(...);
root?.appendChild(myMfeElement);
```

Notice how the above code snippet:

1) knows that when you create a custom HTML element named `my-mfe-element` it will be of type `MyMfeElement`
2) knows which properties and events are valid for the type `MyMfeElement`.
3) knows the right type for the `message-sent` custom event. Without the type declaration file, if you tried to subscribe to the `message-sent` event and the subscription handler had an input of type `CustomEvent<string>` you would get an error saying `Argument of type 'Event' is not assignable to parameter of type 'CustomEvent<string>'.`. This is because by default all events from HTML elements generate an object of type `Event` and, without further information, Typescript cannot deviate from that. You would have to declare the subscription handler with an input of type `Event` and then you cast it to `CustomEvent<string>`.

### Add IDE auto-completion on HTML for web components

The declaration file explained in the previous section only affects type checking for Typescript files, which means it only helps when working with remote web components programmatically. When you declare a web component directly on HTML you don't have any type checking or code-completion aid.

As of writing this, I don't think there is a standard way to provide this information that all code editors accept. There is an effort to create a standard from the web components org named [custom-elements-manifest](https://github.com/webcomponents/custom-elements-manifest) but it hasn't been adopted by code editors yet. There is an open issue on the WICG[^1] repo where ths is being discussed. See [Editor support for WebComponents](https://github.com/WICG/webcomponents/issues/776). 

[^1]: The Web Incubator Community Group (WICG) is a community group of the World Wide Web Consortium (W3C) that incubates new web platform features.

For `VS Code`, this is being supported via [VS Code Custom Data](https://github.com/microsoft/vscode-custom-data). Custom data enhances VS Code's understanding of HTML/CSS. For example, with these HTML/CSS JSON contributions, VS Code could provide completion and hover for the custom HTML tag/attribute and CSS property/pseudoClass. For more info see:

- [Web Components support in HTML files](https://github.com/Microsoft/vscode/issues/62976)
- [Custom Data for HTML Language Service](https://github.com/Microsoft/vscode-html-languageservice/blob/main/docs/customData.md)

For `JetBrains'` editors see [web-types](https://github.com/JetBrains/web-types).

Also note that there is some tooling comming up from the community to let you automate the creation of the custom elements manifest and also convert it to IDE specific formats. See:

- [Custom Elements Manifest](https://custom-elements-manifest.open-wc.org/): Codegen for Web Components.
- [Introducing: Custom Elements Manifest](https://dev.to/open-wc/introducing-custom-elements-manifest-gkk).
- [Custom Element (Web Component) VS Code Integration](https://www.npmjs.com/package/custom-element-vs-code-integration): This package generates custom data config files for VS Code using the Custom Element Manifest.
- [Custom Element (Web Component) JetBrains Integration](https://www.npmjs.com/package/custom-element-jet-brains-integration)
- [CEM Tools](https://github.com/break-stuff/cem-tools): This is a collection of tools based off the Custom Elements Manifest. Each tool is designed to provide a better development experience when working with custom elements. This repo has a [demo app](https://github.com/break-stuff/cem-tools/tree/main/demo/lit-app) which shows a [custom element manifest file](https://github.com/break-stuff/cem-tools/blob/main/demo/lit-app/custom-elements.json) for a custom element named `radio-group` and its conversation to [VS Code custom data file](https://github.com/break-stuff/cem-tools/blob/main/demo/lit-app/vscode.html-custom-data.json) and [JetBrains web-type file](https://github.com/break-stuff/cem-tools/blob/main/demo/lit-app/web-types.json).

## Learn more

> **Warning**
>
> Some of the information on the links below might not be fully usable without a few tweaks on the latest versions of Angular. However, the majority of the information and concepts still hold true.
>

For more info see:

- [Angular elements overview](https://angular.io/guide/elements): everything in here is important to read but note that the section `Mapping` explains how the Angular Inputs and Outputs are mapped to custom element properties and custom events.
- [Export Angular components as Custom Elements with Angular Elements](https://medium.com/vincent-ogloblinsky/export-angular-components-as-custom-elements-with-angular-elements-a2a0bfcd7f8a)
- [Learn how Angular Elements transmits Component’s @Outputs outside Angular](https://medium.com/angular-in-depth/how-angular-elements-uses-custom-events-mechanism-to-transmit-components-outputs-outside-angular-7b469386f6e2)
- [Handling data with Web Components](https://itnext.io/handling-data-with-web-components-9e7e4a452e6e)   
- [How to use routing in Angular web components](https://medium.com/@timon.grassl/how-to-use-routing-in-angular-web-components-c6a76449cdb)
- [Getting to Know the createApplication API in Angular](https://netbasal.com/getting-to-know-the-createapplication-api-in-angular-f1c0a2685047)
- [MDN web docs on Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- [Micro Apps with Web Components using Angular Elements](https://www.angulararchitects.io/en/blog/micro-apps-with-web-components-using-angular-elements/)
- [The Best Way To Lazy Load Angular Elements](https://tomastrajan.medium.com/the-best-way-to-lazy-load-angular-elements-97a51a5c2007): this talks about a library named [@angular-extensions/elements](https://angular-extensions.github.io/elements/home) to facilitate loading Angular elements. I haven't tried it and I also don't know if it works well with module federation. Still worth a reading. 
