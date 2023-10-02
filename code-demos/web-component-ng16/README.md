# web-component-ng16 code demo

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app](#mfe1-app)
  - [Exposed webpack module](#exposed-webpack-module)
  - [Dev platform](#dev-platform)
- [Shell app](#shell-app)
  - [How the remote is loaded into the shell](#how-the-remote-is-loaded-into-the-shell)
- [Webpack module federation](#webpack-module-federation)
- [Web components and Angular styling](#web-components-and-angular-styling)
- [Learn more](#learn-more)

## Description

This example shows how to setup webpack module federation where the shell loads an Angular standalone component that is exposed as a [Web component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components). This example also shows how to pass inputs to the Web component and subscribe to its events.

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

The mfe1 app is an Angular 16 app that contains an Angular standalone component named [MyStandaloneComponent](/code-demos/web-component-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts), which represents the micro frontend that we want to expose via webpack module federation.

The [AppRoutingModule](/code-demos/web-component-ng16/mfe1-ng16/src/app/app-routing.module.ts) Angular module contains a route that loads the `MyStandaloneComponent` on `/my-standalone-component`. You can use the `Go to /my-standalone-component` link on the mfe1 app to load the `MyStandaloneComponent` Angular component.

### Exposed webpack module

On the [webpack configuration file for mfe1 app](./mfe1-ng16/webpack.config.js) you will find the declaration of the webpack modules to expose:

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

When you run the mfe1 app you will see the text `MFE1 dev platform`. This is to call out the fact that the mfe1 app is not exposed in its entirety via webpack module federation, only the function `bootstrapMyComponentAsync` from the [my-standalone-component-bootstrap.ts](/code-demos/web-component-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component-bootstrap.ts) file is. Everything else in the mfe1 app is there only with the sole purpose of supporting the local development of the mfe1 app, more specifically, the development of the `MyStandaloneComponent` Angular component.

> **Note**
>
> The `MyStandaloneComponent` Angular component an input and an output which aren't used on the mfe1 app. Only the shell is setting the input and consuming the output event.
>
> We could have added more code to the mfe1 app that would exercise the inputs and outputs and without causing any side effect to the `MyStandaloneComponent` when exported. However, this wasn't done with the sole reason of keeping the mfe1 app as simple as possible.
>

## Shell app

The shell app is an Angular 16 app that programatically loads a Web component exposed by the mfe1 app on page load. This is done on the `ngOnInit` method at [app.component.ts](/code-demos/web-component-ng16/shell-ng16/src/app/app.component.ts). Furthermore, at the [app.component.html](/code-demos/web-component-ng16/shell-ng16/src/app/app.component.html) you can see how the input to the Web component is being set, as well as the subscription to its custom event.

Click on the `Send message` button from the remotely loaded component and see the message produced by the Web component be displayed on the shell.

### How the remote is loaded into the shell

The shell app uses the `loadRemoteModule` function to load the webpack module from the mfe1 app and, once the remote webpack module is loaded, the shell uses the exposed `bootstrapMyComponentAsync` to load the Web component from the mfe1 app. See the `ngOnInit` method at [app.component.ts](/code-demos/web-component-ng16/shell-ng16/src/app/app.component.ts). 

The `bootstrapMyComponentAsync` registers a custom element in the `CustomElementRegistry` with the name `my-mfe-element`, which means that now wherever the custom element `<my-mfe-element></my-mfe-element>` is defined it will render the Web component from the mfe1 app. See [app.component.html](/code-demos/web-component-ng16/shell-ng16/src/app/app.component.html).

> **Note**
>
> To use custom elements like the `my-mfe-element` and avoid Angular complaining that it doesn't know what it is, we make use of the `CUSTOM_ELEMENTS_SCHEMA` schema, which is added to the schema array at [app module](../web-component-ng16/shell-ng16/src/app/app.module.ts) schemas.
>

## Webpack module federation

The setup of webpack module federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package, which aims to streamline the setup of webpack module federation for Angular apps. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)

## Web components and Angular styling

Beware of issues with styling when using web components. If styles from your Angular component that you have exposed as a Web component using `@angular/elements` are bleeding out, then you might need to set your [ViewEncapsulation](https://angular.io/api/core/ViewEncapsulation) to `ViewEncapsulation.ShadowDom`, which uses the ShadowDOM specification, on the Angular component which is being passed to `createCustomElement`. 

In this example app, the `ViewEncapsulation` configuration would be applied to the [MyStandaloneComponent](/code-demos/web-component-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts) component.

## Learn more

> **Warning**
>
> Some of the information on the links below might not be fully usable without a few tweaks on the latest versions of Angular. However, the majority of the information and concepts still hold true.
>

For more info see:

- [Angular elements overview](https://angular.io/guide/elements): everything in here is important to read but note that the section `Mapping` explains how the Angular Inputs and Outputs are mapped to custom element properties and custom events.
- [MDN web docs on Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- [Micro Apps with Web Components using Angular Elements](https://www.angulararchitects.io/en/blog/micro-apps-with-web-components-using-angular-elements/)
- [Export Angular components as Custom Elements with Angular Elements](https://medium.com/vincent-ogloblinsky/export-angular-components-as-custom-elements-with-angular-elements-a2a0bfcd7f8a)
- [@angular-architects/module-federation-tools](https://www.npmjs.com/package/@angular-architects/module-federation-tools): this package provides helper functions and on this README page it also shows how to use the package to get web components and webpack module federation working.
- [How to use routing in Angular web components](https://medium.com/@timon.grassl/how-to-use-routing-in-angular-web-components-c6a76449cdb)
- [Getting to Know the createApplication API in Angular](https://netbasal.com/getting-to-know-the-createapplication-api-in-angular-f1c0a2685047)
- [Handling data with Web Components](https://itnext.io/handling-data-with-web-components-9e7e4a452e6e)
- [The Best Way To Lazy Load Angular Elements](https://tomastrajan.medium.com/the-best-way-to-lazy-load-angular-elements-97a51a5c2007): this talks about a library named [@angular-extensions/elements](https://angular-extensions.github.io/elements/home) to facilitate loading Angular elements. I haven't tried it and I also don't know if it works well with module federation. Still worth a reading. 
