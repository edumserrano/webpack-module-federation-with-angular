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
- [Webpack Module Federation](#webpack-module-federation)
- [Learn more](#learn-more)

## Description

This example shows how to setup Webpack Module Federation where the shell loads an Angular standalone component by using Angular routing and by dynamically instantiates an Angular standalone component and adding it to the DOM.

This example also shows how to pass inputs to the Angular component and subscribe to its outputs.

The remote webpack module contains an Angular standalone component.

The shell app is rendered in a red colored background and the remotely loaded mfe1 app is rendered in a blue colored background.

## How to run

1) Go to `/code-demos/component-standalone-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/code-demos/component-standalone-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

To see the Angular standalone component from the mfe1 app loaded into the shell go to the shell's URL and click the `Load Angular standalone component named MyStandaloneComponent from mfe1` link to load the component using routing or use the `Dynamically load Angular standalone component named MyStandaloneComponent from mfe1` button to load the component by dynamically instantiating it.

## MFE1 app

The mfe1 app is an Angular 16 app that contains an Angular standalone component named [MyStandaloneComponent](/code-demos/component-standalone-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts), which represents the micro frontend that we want to expose via Webpack Module Federation.

The [AppRoutingModule](/code-demos/component-standalone-ng16/mfe1-ng16/src/app/app-routing.module.ts) Angular module contains a route that loads the `MyStandaloneComponent` on `/my-standalone-component`.

The mfe1 app will [set the input](/code-demos/component-standalone-ng16/mfe1-ng16/src/app/app-routing.module.ts) of the `MyStandaloneComponent` to `test input value from dev platform` and subscribe to the outputs of the component which log messages to the console when the [component is loaded or destroyed](/code-demos/component-standalone-ng16/mfe1-ng16/src/app/app.component.ts). Use the `Go to my-standalone-component` link to load the component and use the `Go to home page` link to destroy it.

### Exposed webpack module

On the [webpack configuration file for mfe1 app](/code-demos/component-standalone-ng16//mfe1-ng16/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
  "./my-standalone-component": "./src/app/my-standalone-component/my-standalone-component.component.ts",
},
```

The above defines a webpack module that is named `my-standalone-component` and that is mapped to the [./src/app/my-standalone-component/my-standalone-component.component.ts](/code-demos/component-standalone-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts) file, which is where the `MyStandaloneComponent` Angular standalone component is defined.

### Dev platform

When you run the mfe1 app you will see the text `MFE1 dev platform`. This is to call out the fact that the mfe1 app is not exposed in its entirety via Webpack Module Federation, only the `MyStandaloneComponent` Angular standalone component is. Everything else in the mfe1 app is there only with the sole purpose of supporting the local development of the mfe1 app, more specifically, the development of the `MyStandaloneComponent` Angular component.

This means that the input value `test input value from dev platform` set by the dev platform is not part of the exported component, neither is the subscription of the component's outputs that log to the console when the component is loaded or destroyed.

## Shell app

The shell app is an Angular 16 app that dynamically instantiates an Angular standalone component exposed by the mfe1 app. You can test this in two ways:

- via the `Load Angular standalone component named MyStandaloneComponent from mfe1` link which will load the component using Angular routing.
- via the `Dynamically load Angular standalone component named MyStandaloneComponent from mfe1` button which will dynamically instantiate the component and add it to the DOM.

> [!NOTE]
>
> There are many ways to dynamically instantiate an Angular component, this example just shows one possible way.
>
> Also note that the approach using Angular dynamic component loading is the same as the one used by the `loadV4` method shown in the [component-ng16](../component-ng16/README.md) example. For more information inspect that example, and all the comments on the `loadV4` method at [/code-demos/component-ng16/shell-ng16/src/app/app.component.ts](../component-ng16/shell-ng16/src/app/app.component.ts).
>

### How the remote is loaded into the shell

> [!NOTE]
>
> The approaches shown here are NOT limited to Angular standalone components. The same would work for non-standalone components.
>
> Furthermore, you can also use the Angular directive approach shown in the [component-directive-ng16](../component-directive-ng16/README.md) example to load Angular standalone components.
>

#### Using Angular routing

The `/my-standalone-component` route added to the [AppRoutingModule](/code-demos/component-standalone-ng16/shell-ng16/src/app/app-routing.module.ts) [lazy loads](https://angular.io/guide/lazy-loading-ngmodules) the `MyStandaloneComponent` Angular standalone component from the mfe1 app. This route uses the `loadRemoteModule` function to load the webpack module.

Once the webpack module is loaded from the remote we return the exposed Angular standalone component from the mfe1 app named `MyStandaloneComponent` to the `loadComponent` function, which then loads the Angular component into the DOM.

This way also sets the component input. See the line with `inputText: 'Hello from the shell!'` at [app-routing.module.ts](/code-demos/component-standalone-ng16/mfe1-ng16/src/app/app-routing.module.ts).

> [!NOTE]
>
> This approach is not subscribing to the component's outputs because it would require a bit of extra code to do it. You could do it like it's done in the mfe1 app dev platform which subscribes to the `activate` event from the `router-outlet` or a better approach would be to create a wrapper component and then create an Angular service to share the data. You can take a look at the [advanced-ng16](../advanced-ng16/README.md) code demo to see how to create a wrapper component.
>

#### Using Angular dynamic component loading

The `loadMyStandalone` at [app.component.ts](/code-demos/component-standalone-ng16/shell-ng16/src/app/app.component.ts):

1) loads the remote webpack module from the mfe1 app using the `loadRemoteModule` function from the `@angular-architects/module-federation` npm package.
2) creates an instance of the component and attach it to the DOM using the `ViewContainerRef.createComponent` method.
3) uses the `ComponentRef.setInput` method to set the inputs of the component.
4) uses the `ComponentRef.instance` object to subscribe to the outputs of the component.

## Webpack Module Federation

The setup of Webpack Module Federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package, which aims to streamline the setup of Webpack Module Federation for Angular apps. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)

## Learn more

For more information see:

- [Getting started with standalone components](https://angular.io/guide/standalone-components)
- [Migrate an existing Angular project to standalone](https://angular.io/guide/standalone-migration)
- [Dynamic component loading](https://angular.io/guide/dynamic-component-loader#dynamic-component-loading)
- [Why Migrate to Angular Standalone Components](https://medium.com/angular-gems/angular-standalone-components-590b3076d48a)
- [Angular's Future with Standalone Components](https://www.angulararchitects.io/en/blog/angulars-future-without-ngmodules-lightweight-solutions-on-top-of-standalone-components/)
- [Standalone components and APIs 1st edition](/docs/standalone-components-and-APIs-1st-edition.pdf): This repo contains a copy of this free book which you can get from the [angular architects](https://www.angulararchitects.io/en/ebooks/anguar-standalone-components-and-apis/) website.
- [Sharing data between child and parent directives and components](https://angular.io/guide/inputs-outputs): this is useful to understand Angular inputs and outputs.
- [Module Federation with Angular’s Standalone Components](https://www.angulararchitects.io/blog/module-federation-with-angulars-standalone-components/): specifically the section named `Alternative: Dynamic Shell` which also shows a code example similar to this one.
