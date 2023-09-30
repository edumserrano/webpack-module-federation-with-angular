# dynamic-ng16 code demo

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app](#mfe1-app)
  - [Exposed webpack module](#exposed-webpack-module)
  - [Dev platform](#dev-platform)
- [Shell app](#shell-app)
  - [How the remote is loaded into the shell](#how-the-remote-is-loaded-into-the-shell)
- [Webpack module federation](#webpack-module-federation)

## Description

This example shows how to setup webpack module federation without having to declare a remote in the shell's webpack configuration file. This code demo is called dynamic because it does NOT require the remote to be declared in the shell's webpack configuration. 

Despite not being part of this example, it would be simple to extend it and have the remote webpack module location fetched at runtime via an HTTP call.

The remote webpack module contains an Angular module which the shell loads using Angular routing.

## How to run

1) Go to `/code-demos/dynamic-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/code-demos/dynamic-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

To see the mfe1 app loaded into the shell go to the shell's URL and click the `Load Angular module named MyFeatureModule from mfe1` link.

Both apps are very simple and consist mainly of a bit of text inside a styled `div` which indicates if it's part of the shell or the mfe1 app. The shell renders in a red coloured `div` whilst the mfe1 app renders in a blue coloured `div`. In addition both apps display the version of Angular being used.

## MFE1 app

The mfe1 app is an Angular 16 app that contains an Angular feature module named [MyFeatureModule](/code-demos/dynamic-ng16/mfe1-ng16/src/app/my-feature/my-feature.module.ts), which was created to represent the micro frontend that we want to expose via webpack module federation.

The `MyFeatureModule` Angular module contains a route that loads the [MyComponent](/code-demos/dynamic-ng16/mfe1-ng16/src/app/my-feature/my-component/my-component.component.ts) Angular component on `/my-component`. You can use the `Go to my-component` link on the mfe1 app to load the `MyComponent` Angular component.
e mfe1 app to load the `MyComponent` Angular component.

### Exposed webpack module

On the [webpack configuration file for mfe1 app](./mfe1-ng16/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
  "./my-feature-module": "./src/app/my-feature/my-feature.module.ts",
},
```

The above defines a webpack module that is named `my-feature-module` and that is mapped to the [./src/app/my-feature/my-feature.module.ts](/code-demos/dynamic-ng16/mfe1-ng16/src/app/my-feature/my-feature.module.ts) file, which is where the `MyFeatureModule` Angular module is defined. 

### Dev platform

When you run the mfe1 app you will see the text `MFE1 dev platform`. This is to call out the fact that the mfe1 app is not exposed in its entirety via webpack module federation, only the `MyFeatureModule` Angular feature module is. Everything else in the mfe1 app is there only with the sole purpose of supporting the local development of the mfe1 app, more specifically, the development of the `MyFeatureModule` Angular feature module.

## Shell app

The shell app is an Angular 16 app that loads the Angular module exposed by the mfe1 app. You can test this by selecting the `Load Angular module named MyFeatureModule from mfe1` link which navigates to the `/mfe1/my-component` route.

### How the remote is loaded into the shell

The shell app loads the Angular module exposed by the mfe1 app using Angular routing.

The `/mfe1` route added to the [AppRoutingModule](/code-demos/dynamic-ng16/shell-ng16/src/app/app-routing.module.ts) [lazy loads](https://angular.io/guide/lazy-loading-ngmodules) the `MyFeatureModule` Angular feature module from the mfe1 app. This route uses the `loadRemoteModule` function to dynamically load the webpack module. In this context, dynamically means that the remote location does not need to be specified in the shell's webpack configuration file.

Once the webpack module is loaded from the remote we return the exposed Angular module from the mfe1 app named `MyFeatureModule` to the [loadChildren function](https://angular.io/api/router/LoadChildren). At this point, the `loadChildren` function will lazy load the routes available from the `MyFeatureModule` Angular module which means we can access the `MyComponent` Angular component from the mfe1 app by going to `/mfe1/my-component` path.

## Webpack module federation

The setup of webpack module federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package, which aims to streamline the setup of webpack module federation for Angular apps. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)
