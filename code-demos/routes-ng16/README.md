# routes-ng16 code demo

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app](#mfe1-app)
  - [Exposed webpack module](#exposed-webpack-module)
  - [Dev platform](#dev-platform)
- [Shell app](#shell-app)
  - [How the remote is loaded into the shell](#how-the-remote-is-loaded-into-the-shell)
- [Webpack Module Federation](#webpack-module-federation)

## Description

This example shows how to setup Webpack Module Federation where the shell uses Angular routing to load a couple of remote Angular standalone components from the routes that are exposed from the mfe1 app.

The remote webpack module contains a variable that represents an array of Angular routes.

The shell app is rendered in a red colored background and the remotely loaded mfe1 app is rendered in a blue or green colored background.

## How to run

1) Go to `/code-demos/routes-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/code-demos/routes-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

To see the Angular standalone components from the mfe1 app loaded into the shell go to the shell's URL and click either the `Load Angular standalone component named MyStandaloneComponent from mfe1` link or the `Load Angular standalone component named AnotherStandaloneComponent from mfe1` link.

## MFE1 app

The mfe1 app is an Angular 16 app that contains:
- a standalone Angular component named [MyStandaloneComponent](/code-demos/routes-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts).
- a standalone Angular component named [AnotherStandaloneComponent](/code-demos/routes-ng16/mfe1-ng16/src/app/another-standalone-component/another-standalone-component.component.ts).
- a set of routes defined at [standalone-component.route.ts](/code-demos/routes-ng16/mfe1-ng16/src/app/standalone-component.route.ts) that load the Angular standalone components.

The [AppRoutingModule](/code-demos/routes-ng16/mfe1-ng16/src/app/app-routing.module.ts) Angular module contains a route that uses the [loadChildren function](https://angular.io/api/router/LoadChildren) to load the routes defined at `standalone-component.route.ts`. With this you can access the Angular standalone components at:

- `/standalone/my`: loads the `MyStandaloneComponent`.
- `/standalone/another`: loads the `AnotherStandaloneComponent`.

### Exposed webpack module

On the [webpack configuration file for mfe1 app](/code-demos/routes-ng16/mfe1-ng16/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
  "./standalone-routes": "./src/app/standalone-component.route.ts",
},
```

The above defines a webpack module that is named `standalone-routes` and that is mapped to the [./src/app/standalone-component.route.ts](/code-demos/routes-ng16/mfe1-ng16/src/app/standalone-component.route.ts) file, which is where the routes to the Angular standalone components are defined. 

> **Note**
>
> Although the mfe1 app is using Angular standalone components, the approach to expose Angular routes would also if the components were not standalone.
>

### Dev platform

When you run the mfe1 app you will see the text `MFE1 dev platform`. This is to call out the fact that the mfe1 app is not exposed in its entirety via Webpack Module Federation. What is exported are the routes that load the two Angular standalone components. Everything else in the mfe1 app is there only with the sole purpose of supporting the local development of the mfe1 app, more specifically, the development of the `MyStandaloneComponent` and `AnotherStandaloneComponent` Angular components.

## Shell app

The shell app is an Angular 16 app that loads the Angular routes exposed by the mfe1 app. You can test this by selecting the `Load Angular standalone component named MyStandaloneComponent from mfe1` link which navigates to the `/mfe1/my` route or the `Load Angular standalone component named MyStandaloneComponent from mfe1` link which navigates to the `mfe1/another` route.

### How the remote is loaded into the shell

The shell app loads the Angular routes exposed by the mfe1 app using the [loadChildren function](https://angular.io/api/router/LoadChildren) from Angular routing.

The `/mfe1` route added to the [AppRoutingModule](/code-demos/routes-ng16/shell-ng16/src/app/app-routing.module.ts) uses the `loadRemoteModule` function to load the remote webpack module. Once the webpack module is loaded from the remote we return the exposed Angular routes from the mfe1 app named `STANDALONE_COMPONENTS_ROUTES` to the [loadChildren function](https://angular.io/api/router/LoadChildren), which means we get the following routes on the shell:

- `/mfe1/my`: loads the `MyStandaloneComponent`.
- `/mfe1/another`: loads the `AnotherStandaloneComponent`.

> **Note**
> 
> Since the shell is loading a set of routes, the shell cannot change the path for the loaded routes which means that the children routes `/my` and `/another` are the same in both the shell and on the mfe1 app. However, we can choose the parent route for remotely loaded routes and on the shell this is `/mfe1` whilst on the mfe1 app it's `/standalone`.
> 

## Webpack Module Federation

The setup of Webpack Module Federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package, which aims to streamline the setup of Webpack Module Federation for Angular apps. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)
