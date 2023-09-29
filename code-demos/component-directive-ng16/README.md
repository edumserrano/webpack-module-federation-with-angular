# component-directive-ng16 code demo

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app](#mfe1-app)
- [Shell app](#shell-app)
- [Webpack module federation](#webpack-module-federation)

## Description

This shows an example of how to setup webpack module federation using Angular 16 where the remote webpack module is loaded dynamically instead of being declared in the shell's webpack configuration. 

Furthermore, this example does NOT use Angular routing to remotely load the exposed Angular module. In this example, the shell app loads an Angular component from a remote webpack module using an Angular directive and it also shows how to pass inputs to the component.

This project consists of two Angular 16 apps:
- shell-ng16: this app is used as the shell and is able to load a component from the mfe1-ng16 app.
- mfe1-ng16: this app represents a micro frontend that contains an Angular component that is consumed by the shell app.

> **Note**
>
> The implementation of the directive to load Angular components is an extension/variation of the guidance provided by the Angular docs for [Dynamic component loading](https://angular.io/guide/dynamic-component-loader#dynamic-component-loading).
>

## How to run

1) Go to `/component-directive-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/component-directive-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

To see the Angular component from the mfe1 app loaded into the shell go to the shell's URL and click on any of the `load MyComponent` buttons. 

Both apps are very simple and consist mainly of a bit of text inside a styled `div` which indicates if it's part of the shell or the mfe1 app. The shell renders in a red coloured `div` whilst the mfe1 app renders in a blue coloured `div`. In addition both apps display the version of Angular being used.

## MFE1 app

The mfe1 app contains three Angular modules:
- the default [AppModule](/code-demos/component-directive-ng16/mfe1-ng16/src/app/app.module.ts) created as part of doing `ng new`.
- the default [AppRoutingModule](/code-demos/component-directive-ng16/mfe1-ng16/src/app/app-routing.module.ts) created as part of doing `ng new`.
- a feature module named [MyFeatureModule](/code-demos/component-directive-ng16/mfe1-ng16/src/app/my-feature/my-feature.module.ts) where the Angular component we want to remotely instantiate is declared.

The `MyFeatureModule` Angular module contains a route that loads the [MyComponent](/code-demos/component-directive-ng16/mfe1-ng16/src/app/my-feature/my-component/my-component.component.ts) Angular component on `/my-component`. However, note that this is only used for local development of the mfe1 app. When integrating into the shell app, the shell will dynamically load the component and does NOT rely on any routes from the remote.

## Shell app

The shell app is able to consume the Angular module exposed by the mfe1 app and display it. It consists of a single Angular module:
- the default [AppModule](/code-demos/component-directive-ng16/shell-ng16/src/app/app.module.ts) created as part of doing `ng new`.

The shell app shows how to load an Angular component that is declared in an Angular module exposed by a remote using an Angular directive. This directive is just an example and can be modified/extended to fit your needs.

> **Warning**
>
> This approach, using an Angular directive, can be very useful because the directive can be easily reused to import multiple remotes. However, it might not work for every scenario.
> 
>  For instance, if you need to access outputs from the Angular component then you would have to figure out how to extend the directive in a way that would allow ouputs to be consumed without tying the directive to a specific component. Otherwise the directive would cease being a reusable piece of code for loading remotes.

> **Note**
>
> The implementation of the directive is based on the `loadV4` method shown in the [component-ng16](../component-ng16/README.md) example. For more information inspect that example, and all the comments on the `loadV4` method at [/component-ng16/shell-ng16/src/app/app.component.ts](../component-ng16/shell-ng16/src/app/app.component.ts).

## Webpack module federation

The setup of webpack module federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)