# component-standalone-ng16

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app](#mfe1-app)
- [Shell app](#shell-app)
- [Webpack module federation](#webpack-module-federation)

## Description

This shows an example of how to setup webpack module federation where the shell loads standalone angular components from a remote using angular routing or by dynamically loading the component. This also shows how a remote can expose angular routes and how to consume them in the shell app. Both shell and remote app use angular 16.

In this example, the shell app either uses angular routing or dynamically component loading to load the remote standalone component. Furthermore, this example also shows how a remote can expose angular routes and how the shell can consume them.

This project consists of two angular 16 apps:
- shell-ng16: this app is used as the shell and is able to load the standalone components from the mfe1-ng16 app.
- mfe1-ng16: this app represents a micro frontend that contains two angular standalone components that are consumed by the shell app.

This example uses the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package which aims to streamline the setup of webpack module federation for angular projects. For more information read:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)


> **Note**
>
> For more information about angular standalone components see:
> - [Getting started with standalone components](https://angular.io/guide/standalone-components)
> - [Migrate an existing Angular project to standalone](https://angular.io/guide/standalone-migration)
> - [Why Migrate to Angular Standalone Components](https://medium.com/angular-gems/angular-standalone-components-590b3076d48a)
>
## How to run

1) Go to `/component-standalone-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/component-standalone-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

To see the standalone components from the mfe1 app loaded into the shell go to the shell's URL and click on any of the load links or buttons. 

Both apps are very simple and mainly consist of a bit of text inside a styled `div` which indicates if it's part of the shell or the mfe1 app. The shell renders in a red coloured `div` whilst the standalone components from the mfe1 app render in a blue or green coloured `div`. In addition both apps display the version of angular being used.

## MFE1 app

The mfe1 app contains two angular modules:
- the default [AppModule](/component-standalone-ng16/mfe1-ng16/src/app/app.module.ts) created as part of doing `ng new`.
- the default [AppRoutingModule](/component-standalone-ng16/mfe1-ng16/src/app/app-routing.module.ts) created as part of doing `ng new`.

It also contains two standalone angular components, one named `MyStandaloneComponent` and the other named `AnotherStandaloneComponent`, and a set of routes defined at [/component-standalone-ng16/mfe1-ng16/src/app/standalone-component.route.ts](/component-standalone-ng16/mfe1-ng16/src/app/standalone-component.route.ts).

The `MyFeatureModule` angular module contains a set of routes that load the two standalone components:
- `/my-standalone-component`: loads the `MyStandaloneComponent`.
- `/another-standalone-component`: loads the `AnotherStandaloneComponent`.
- `/standalone`: loads the routes defined at [standalone-component.route.ts](/component-standalone-ng16/mfe1-ng16/src/app/standalone-component.route.ts). So:
  - `/standalone/my`: loads the `MyStandaloneComponent`.
  - `/standalone/another`: loads the `AnotherStandaloneComponent`.

The angular modules defined by the mfe1 app are only used for development purposes when running the mfe1 app locally. The shell does not use any of the modules. Look at the [webpack configuration](/component-standalone-ng16/mfe1-ng16/webpack.config.js) file for the mfe1 app and notice that it exposes 3 webpack modules:
- `./my-standalone-component` which maps to the `MyStandaloneComponent` angular standalone component.
- `./another-standalone-component` which maps to the `AnotherStandaloneComponent` angular standalone component.
- `./standalone-routes` which maps to an array of angular routes defined at [standalone-component.route.ts](/component-standalone-ng16/mfe1-ng16/src/app/standalone-component.route.ts). These routes are able to load both the `MyStandaloneComponent` and the `AnotherStandaloneComponent` angular standalone components.

## Shell app

The shell app is able to consume the angular standalone components exposed by the mfe1 app and display them. It consists of a single angular module:
- the default [AppModule](/component-standalone-ng16/shell-ng16/src/app/app.module.ts) created as part of doing `ng new`.

The shell app shows several ways to load a standalone angular component from a remote webpack module:
- The "load X from mfe1..." links use angular routing to load either the `MyStandaloneComponent` or the `AnotherStandaloneComponent`. The v1 load links load the components by accessing the remotely exposed webpack module that contains the desired component. The v2 load links load the components by accessing the remotely exposed webpack module that contains a set of angular routes that them load the components.
- The "dynamically load X" buttons load the standalone components in similar way as the v1 load links but instead of using angular routing to do it, it uses angular dynamic component loading.

The shell is implemented to mimic the same routes as the mfe1 app but that is NOT necessary. The shell can decide to display the standalone components in different routes, except when importing from the exposed angular routes. In this case, the root shell route can be chosen but the imported child routes cannot be changed.

Lastly, note that the approach used to load the components using angular dynamic component loading is the same as the one used by the `loadV4` method shown in the [component-ng16](/component-ng16/README.md) example. For more information inspect that example, and all the comments on the `loadV4` method at [/component-ng16/shell-ng16/src/app/app.component.ts](/component-ng16/shell-ng16/src/app/app.component.ts).

> **Note**
>
> The approaches shown here are NOT limited to angular standalone components. The same would work for non-standalone components.
>
> Furthermore, you can also use the angular directive aproach shown in the [component-directive-ng16](../component-directive-ng16/README.md) example to load angular standalone components.
>

> **Note**
>
> This is an example app and though you can mix the approaches to load an angular standalone component from a remote, you would either choose one of the presented approaches or implement a variation.

## Webpack module federation

The setup of webpack module federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).
