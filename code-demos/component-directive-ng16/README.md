# component-directive-ng16 code demo

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app](#mfe1-app)
  - [Exposed webpack module](#exposed-webpack-module)
  - [Dev platform](#dev-platform)
- [Shell app](#shell-app)
  - [How the remote is loaded into the shell](#how-the-remote-is-loaded-into-the-shell)
- [Webpack Module Federation](#webpack-module-federation)
- [Learn more](#learn-more)

## Description

This example shows how to setup Webpack Module Federation where the shell dynamically instantiates an Angular component and adds it to the DOM by using an Angular directive. It also shows how to pass inputs and outputs to the Angular component.

The remote webpack module contains an Angular component.

The shell app is rendered in a red colored background and the remotely loaded mfe1 app is rendered in a blue colored background.

## How to run

1) Go to `/code-demos/component-directive-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/code-demos/component-directive-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

The Angular directive will load the Angular component from the mfe1 app on page load.

## MFE1 app

The mfe1 app is an Angular 16 app that contains an Angular feature module named [MyFeatureModule](/code-demos/component-directive-ng16/mfe1-ng16/src/app/my-feature/my-feature.module.ts), where the [MyComponent](/code-demos/component-directive-ng16/mfe1-ng16/src/app/my-feature/my-component/my-component.component.ts) Angular component is declared. This component represents the micro frontend that we want to expose via Webpack Module Federation.

The `MyFeatureModule` Angular module contains a route that loads the [MyComponent](/code-demos/component-directive-ng16/mfe1-ng16/src/app/my-feature/my-component/my-component.component.ts) Angular component on `/my-component`. You can use the `Go to my-component` link on the mfe1 app to load the `MyComponent` Angular component.

The mfe1 app will [set the input](/code-demos/component-directive-ng16/mfe1-ng16/src/app/app-routing.module.ts) of the `MyComponent` to `test input value from dev platform` and [subscribe to the output of the component](/code-demos/component-directive-ng16/mfe1-ng16/src/app/app.component.ts) which logs to the console when the `Send message` button is clicked.

### Exposed webpack module

On the [webpack configuration file for mfe1 app](./mfe1-ng16/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
    "./my-component": "./src/app/my-feature/my-component/my-component.component.ts",
},
```

The above defines a webpack module that is named `my-component` and that is mapped to the [./src/app/my-feature/my-component/my-component.component.ts](/code-demos/component-directive-ng16/mfe1-ng16/src/app/my-feature/my-component/my-component.component.ts) file, which is where the `MyComponent` Angular component is defined. 

### Dev platform

When you run the mfe1 app you will see the text `MFE1 dev platform`. This is to call out the fact that the mfe1 app is not exposed in its entirety via Webpack Module Federation, only the `MyComponent` Angular component is. Everything else in the mfe1 app is there only with the sole purpose of supporting the local development of the mfe1 app, more specifically, the development of the `MyComponent` Angular component.

This means that the input value `test input value from dev platform` set by the dev platform is not part of the exported component, neither is the subscription of the component's output that logs to the console when the `Send message` is clicked.

## Shell app

The shell app is an Angular 16 app that dynamically instantiates an Angular component exposed by the mfe1 app on page load. When the page is loading, the [LoadRemoteComponentDirective](/code-demos/component-directive-ng16/shell-ng16/src/app/load-remote-component.directive.ts) Angular directive simulates a two second load time and then dynamically instantiates the component and adds it to the DOM.

In addition to remotely loading the Angular component, the `LoadRemoteComponentDirective` Angular directive will also trigger an event/output when the component has been loaded into the shell. You could extend this example and also add an output for when the component fails to load for any reason. With these kind of outputs you could then add loading indicators to the shell as well as information messages if the components fail to load.

Lastly, at [app.component.ts](/code-demos/component-directive-ng16/shell-ng16/src/app/app.component.ts), the shell app declares the inputs and outputs to use with the remotely loaded component. Click on the `Send message` button from the remotely loaded component and see the message produced by that component be displayed on the shell.

> **Note**
>
> There are many ways to dynamically instantiate an Angular component, this example just shows one possible way. It is similar to the `loadV4` method at [/code-demos/component-ng16/shell-ng16/src/app/app.component.ts](../component-ng16/shell-ng16/src/app/app.component.ts) from the [component-ng16](../component-ng16/README.md) example, as well as the approach shown in the [component-standalone-ng16](../component-standalone-ng16/README.md).
> 
> The Angular directive from example also works for loading remotely exposed Angular standalone components.
> 

### How the remote is loaded into the shell

The shell app loads the Angular component exposed by the mfe1 app using an Angular directive that dynamically instantiates and adds the component to the DOM.

The [LoadRemoteComponentDirective](/code-demos/component-directive-ng16/shell-ng16/src/app/load-remote-component.directive.ts):

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

- [Dynamic component loading](https://angular.io/guide/dynamic-component-loader#dynamic-component-loading)
- [Angular Directive to load a federated remote module](https://itnext.io/angular-directive-to-load-a-federated-remote-module-512dbc214405): the directive in this code demo was based on the idea from this article.
- [Module Federation with Angular’s Standalone Components](https://www.angulararchitects.io/blog/module-federation-with-angulars-standalone-components/): specifically the section named `Bonus: Programmatic Loading` which also shows code for how to load a component. The code from this article is similar to the code implemented by the directive in this code demo.