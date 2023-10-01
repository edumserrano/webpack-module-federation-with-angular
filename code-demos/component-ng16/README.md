# component-ng16 code demo

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app](#mfe1-app)
  - [Exposed webpack module](#exposed-webpack-module)
  - [Dev platform](#dev-platform)
- [Shell app](#shell-app)
  - [How the remote is loaded into the shell](#how-the-remote-is-loaded-into-the-shell)
- [Webpack module federation](#webpack-module-federation)

## Description

This example shows how to setup webpack module federation where the shell dynamically instantiates an Angular component and adds it to the DOM. It also shows how to pass inputs to the Angular component.

The remote webpack module contains an Angular component which the shell dynamically loads without using Angular routing. It shows 4 different ways to load the component.

The shell app is rendered in a red colored background and the remotely loaded mfe1 app is rendered in a blue colored background.

## How to run

1) Go to `/code-demos/component-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/code-demos/component-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

To see the Angular component from the mfe1 app loaded into the shell go to the shell's URL and click on any of the `Load MyComponent ...` buttons.

## MFE1 app

The mfe1 app is an Angular 16 app that contains an Angular feature module named [MyFeatureModule](/code-demos/component-ng16/mfe1-ng16/src/app/my-feature/my-feature.module.ts), where the [MyComponent](/code-demos/component-ng16/mfe1-ng16/src/app/my-feature/my-component/my-component.component.ts) Angular component is declared. This component represents the micro frontend that we want to expose via webpack module federation.

The `MyFeatureModule` Angular module contains a route that loads the [MyComponent](/code-demos/component-ng16/mfe1-ng16/src/app/my-feature/my-component/my-component.component.ts) Angular component on `/my-component`. You can use the `Go to my-component` link on the mfe1 app to load the `MyComponent` Angular component.

### Exposed webpack module

On the [webpack configuration file for mfe1 app](./mfe1-ng16/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
  "./my-feature-module": "./src/app/my-feature/my-feature.module.ts",
  "./my-component": "./src/app/my-feature/my-component/my-component.component.ts",
},
```

The above defines two webpack modules:
1) one named `my-feature-module` and that is mapped to the [./src/app/my-feature/my-feature.module.ts](/code-demos/component-ng16/mfe1-ng16/src/app/my-feature/my-feature.module.ts) file, which is where the `MyFeatureModule` Angular module is defined. 
2) one named `my-component` and that is mapped to the [./src/app/my-feature/my-component/my-component.component.ts](/code-demos/component-ng16/mfe1-ng16/src/app/my-feature/my-component/my-component.component.ts) file, which is where the `MyFeatureModule` Angular module is defined. 

This example is exposing two webpack modules to show different ways of loading the `MyComponent` Angular component on the shell.

### Dev platform

When you run the mfe1 app you will see the text `MFE1 dev platform`. This is to call out the fact that the mfe1 app is not exposed in its entirety via webpack module federation, only the `MyFeatureModule` Angular feature module or the `MyComponent` Angular component are. Everything else in the mfe1 app is there only with the sole purpose of supporting the local development of the mfe1 app, more specifically, the development of the `MyComponent` Angular component.

## Shell app

The shell app is an Angular 16 app that dynamically instantiates an Angular component exposed by the mfe1 app and adds it to the DOM. You can test this by clicking on any of the `Load MyComponent ...` buttons. All of the load buttons produce the same end result through slighlty different code.

> **Note**
>
> The different versions are just to show some of the possible ways to dynamically load an Angular component without using Angular routing. None of them is significantly better than the other, you should choose the one that works best for you or implement your own variation.
> 

### How the remote is loaded into the shell

The load buttons will:

1) load the remote webpack module from the mfe1 app using the `loadRemoteModule` function from the `@angular-architects/module-federation` npm package. Version 1, Version 2 and Version 3 will load the exposed Angular module whilst Version 4 will load the exposed Angular component.
2) the versions that load the exposed Angular module use different ways to instantiate the Angular module and then instantiate and attach to the DOM the `MyComponent` Angular component.
3) the version that loads the exposed Angular component instantiates and attach to the DOM the `MyComponent` Angular component without having to create an Angular Module.

The code contains detailed comments to explain each step on all four versions.

## Webpack module federation

The setup of webpack module federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package, which aims to streamline the setup of webpack module federation for Angular apps. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)