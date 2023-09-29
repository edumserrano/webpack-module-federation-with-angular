# angular-architects-ng16 code demo

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app](#mfe1-app)
- [Shell app](#shell-app)
- [Webpack module federation](#webpack-module-federation)

## Description

This shows an example of how to setup webpack module federation using Angular 16. This project consists of two Angular 16 apps:
- shell-ng16: this app is used as the shell and uses Angular routing to lazy load an Angular module from the mfe1-ng16 app. 
- mfe1-ng16: this app represents a micro frontend that is consumed by the shell-ng16 app.

This example uses the `@angular-architects/module-federation` npm package which aims to streamline the setup of webpack module federation for Angular projects.

## How to run

1) Go to `/angular-architects-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/angular-architects-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

To see the mfe1 app loaded into the shell go to the shell's URL and click the `load my-feature Angular module from mfe1` link. 

Both apps are very simple and consist mainly of a bit of text inside a styled `div` which indicates if it's part of the shell or the mfe1 app. The shell renders in a red coloured `div` whilst the mfe1 app renders in a blue coloured `div`. In addition both apps display the version of Angular being used.

## MFE1 app

The mfe1 app contains three Angular modules:
- the default [AppModule](/code-demos/angular-architects-ng16/mfe1-ng16/src/app/app.module.ts) created as part of doing `ng new`.
- the default [AppRoutingModule](/code-demos/angular-architects-ng16/mfe1-ng16/src/app/app-routing.module.ts) created as part of doing `ng new`.
- a feature module named [MyFeatureModule](/code-demos/angular-architects-ng16/mfe1-ng16/src/app/my-feature/my-feature.module.ts) which was created to represent the micro front that we want to expose via module federation.

The `MyFeatureModule` Angular module contains a route that loads the [MyComponent](/code-demos/angular-architects-ng16/mfe1-ng16/src/app/my-feature/my-component/my-component.component.ts) Angular component on `/my-component`. You can use the `Go to my-component` link on the mfe1 app to load the `MyComponent`.

## Shell app

The shell app is able to consume the Angular module exposed by the mfe1 app and display it. It consists of a two Angular modules:
- the default [AppModule](/code-demos/angular-architects-ng16/shell-ng16/src/app/app.module.ts) created as part of doing `ng new`.
- the default [AppRoutingModule](/code-demos/angular-architects-ng16/shell-ng16/src/app/app-routing.module.ts) created as part of doing `ng new`.

A route was added to the `AppRoutingModule` that lazy loads the mfe1 app on the `/mfe1` path. You can load the mfe1 app by selecting the `load my-feature Angular module from mfe1` link.

The `/mfe1` route added to the `AppRoutingModule` uses an import to lazy load the `MyFeatureModule` from the mfe1 app. The lazy load is done via the `loadChildren` function which imports the external webpack module `mfe1/my-feature-module` at runtime and then accesses the `MyFeatureModule` Angular module from the mfe1 app. Also note that for typescript to be ok with the import we must tell it that the module `mfe1/my-feature-module` exists and we do that by declaring it in the [remote-module.d.ts](/code-demos/angular-architects-ng16/shell-ng16/src/app/remote-modules.d.ts) file.

> **Note**
> 
> For a better understanding of how the external webpack module from mfe1 is loaded into the shell see [How the loading of an external webpack module works
](../docs/basics-module-federation.md#how-the-loading-of-an-external-webpack-module-works).
>

## Webpack module federation

The setup of webpack module federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)