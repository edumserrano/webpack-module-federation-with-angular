# component-standalone-ng16 code demo

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app](#mfe1-app)
  - [Exposed webpack module](#exposed-webpack-module)
  - [Dev platform](#dev-platform)
- [Shell app](#shell-app)
  - [How the remote is loaded into the shell](#how-the-remote-is-loaded-into-the-shell)
    - [Using Angular routing](#using-angular-routing)
    - [Using Angular dynamic component loading](#using-angular-dynamic-component-loading)
- [Webpack module federation](#webpack-module-federation)
- [Learn more](#learn-more)

## Description

This example shows how to setup webpack module federation where the shell loads an Angular standalone component by using Angular routing and by dynamically instantiates an Angular standalone component and adding it to the DOM.

This example also shows how to pass inputs to the Angular component and subscribe to its outputs.

The remote webpack module contains an Angular standalone component.

## How to run

1) Go to `/code-demos/component-standalone-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/code-demos/component-standalone-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

To see the Angular standalone component from the mfe1 app loaded into the shell go to the shell's URL and click the `Load Angular standalone component named MyStandaloneComponent from mfe1` link to load the component using routing or use the `Dynamically load Angular standalone component named MyStandaloneComponent from mfe1` button to load the component by dynamically instantiating it.

Both apps are very simple and consist mainly of a bit of text inside a styled `div` which indicates if it's part of the shell or the mfe1 app. The shell renders in a red coloured `div` whilst the mfe1 app renders in a blue coloured `div`. In addition both apps display the version of Angular being used.

## MFE1 app

The mfe1 app is an Angular 16 app that contains an Angular standalone component named [MyStandaloneComponent](/code-demos/component-standalone-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts), which represents the micro frontend that we want to expose via webpack module federation.

The [AppRoutingModule](/code-demos/component-standalone-ng16/mfe1-ng16/src/app/app-routing.module.ts) Angular module contains a route that loads the `MyStandaloneComponent` on `/my-standalone-component`. You can use the `Go to my-standalone-component` link on the mfe1 app to load the `MyStandaloneComponent` Angular component.

### Exposed webpack module

On the [webpack configuration file for mfe1 app](./mfe1-ng16/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
  "./my-standalone-component": "./src/app/my-standalone-component/my-standalone-component.component.ts",
},
```

The above defines a webpack module that is named `my-standalone-component` and that is mapped to the [./src/app/my-standalone-component/my-standalone-component.component.ts](/code-demos/component-standalone-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts) file, which is where the `MyStandaloneComponent` Angular standalone component is defined. 

### Dev platform

When you run the mfe1 app you will see the text `MFE1 dev platform`. This is to call out the fact that the mfe1 app is not exposed in its entirety via webpack module federation, only the `MyStandaloneComponent` Angular standalone component is. Everything else in the mfe1 app is there only with the sole purpose of supporting the local development of the mfe1 app, more specifically, the development of the `MyStandaloneComponent` Angular component.

> **Note**
>
> The `MyStandaloneComponent` Angular component has some inputs and outputs which aren't used on the mfe1 app. Only the shell is setting the input and consuming the output events.
>
> We could have added more code to the mfe1 app that would exercise the inputs and outputs and without causing any side effect to the `MyStandaloneComponent` when exported. However, this wasn't done with the sole reason of keeping the mfe1 app as simple as possible.
>

## Shell app

The shell app is an Angular 16 app that dynamically instantiates an Angular standalone component exposed by the mfe1 app. You can test this in two ways:

- via the `Load Angular standalone component named MyStandaloneComponent from mfe1` link which will load the component using Angular routing.
- via the `Dynamically load Angular standalone component named MyStandaloneComponent from mfe1` button which will dinamically instantiate the component and add it to the DOM.

> **Note**
>
> There are many ways to dinamically instantiate an Angular component, this example just shows one possible way. 
> 
> Also note that the approach using Angular dynamic component loading is the same as the one used by the `loadV4` method shown in the [component-ng16](../component-ng16/README.md) example. For more information inspect that example, and all the comments on the `loadV4` method at [/code-demos/component-ng16/shell-ng16/src/app/app.component.ts](../component-ng16/shell-ng16/src/app/app.component.ts).
> 

### How the remote is loaded into the shell

> **Note**
>
> The approaches shown here are NOT limited to Angular standalone components. The same would work for non-standalone components.
>
> Furthermore, you can also use the Angular directive aproach shown in the [component-directive-ng16](../component-directive-ng16/README.md) example to load Angular standalone components.
>

#### Using Angular routing

The `/my-standalone-component` route added to the [AppRoutingModule](/code-demos/component-standalone-ng16/shell-ng16/src/app/app-routing.module.ts) [lazy loads](https://angular.io/guide/lazy-loading-ngmodules) the `MyStandaloneComponent` Angular standalone component from the mfe1 app. This route uses the `loadRemoteModule` function to load the webpack module. 

Once the webpack module is loaded from the remote we return the exposed Angular standalone component from the mfe1 app named `MyStandaloneComponent` to the `loadComponent` function, which then loads the Angular component into the DOM.

This way also sets the component input. See the line with `inputText: 'Hello!'` at [app-routing.module.ts](/code-demos/component-standalone-ng16/mfe1-ng16/src/app/app-routing.module.ts).

#### Using Angular dynamic component loading

The `loadMyStandalone` at [app.component.ts](/code-demos/component-standalone-ng16/shell-ng16/src/app/app.component.ts):

1) loads the remote webpack module from the mfe1 app using the `loadRemoteModule` function from the `@angular-architects/module-federation` npm package. 
2) create an instance of the component and attach it to the DOM using the `ViewContainerRef.createComponent` method.
3) use the `ComponentRef.setInput` method to set the inputs of the component.
4) use the `ComponentRef.instance` object to subscribe to the outputs of the component.

## Webpack module federation

The setup of webpack module federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package, which aims to streamline the setup of webpack module federation for Angular apps. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)

## Learn more

For more information about Angular standalone components and dynamic component loading see:

- [Getting started with standalone components](https://angular.io/guide/standalone-components)
- [Migrate an existing Angular project to standalone](https://angular.io/guide/standalone-migration)
- [Dynamic component loader](https://angular.io/guide/dynamic-component-loader)
- [Why Migrate to Angular Standalone Components](https://medium.com/angular-gems/angular-standalone-components-590b3076d48a)
