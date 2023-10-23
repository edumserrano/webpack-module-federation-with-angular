# basic-ng16 code demo

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app](#mfe1-app)
  - [Exposed webpack module](#exposed-webpack-module)
  - [Dev platform](#dev-platform)
- [Shell app](#shell-app)
  - [How the remote is loaded into the shell](#how-the-remote-is-loaded-into-the-shell)
- [Webpack module federation](#webpack-module-federation)
  - [Webpack configuration file](#webpack-configuration-file)
  - [Angular configuration file](#angular-configuration-file)

## Description

The most bare-bones possible example of how to setup webpack module federation where the shell lazy loads an Angular module using Angular routing. This project does NOT make use of the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package which is usually used to setup module federation for Angular projects. The main idea is to show the basics for learning purposes.

The remote webpack module exposed by the mfe1 app contains an Angular module which the shell loads using Angular routing.

The shell app is rendered in a red colored background and the remotely loaded mfe1 app is rendered in a blue colored background.

## How to run

1) Go to `/code-demos/basic-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/code-demos/basic-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

To see the mfe1 app loaded into the shell go to the shell's URL and click the `Load Angular module named MyFeatureModule from mfe1` link.

## MFE1 app

The mfe1 app is an Angular 16 app that contains an Angular feature module named [MyFeatureModule](/code-demos/basic-ng16/mfe1-ng16/src/app/my-feature/my-feature.module.ts), which was created to represent the micro frontend that we want to expose via webpack module federation.

The `MyFeatureModule` Angular module contains a route that loads the [MyComponent](/code-demos/basic-ng16/mfe1-ng16/src/app/my-feature/my-component/my-component.component.ts) Angular component on `/my-component`. You can use the `Go to my-component` link on the mfe1 app to load the `MyComponent` Angular component.

### Exposed webpack module

On the [webpack configuration file for mfe1 app](./mfe1-ng16/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
  "./my-feature-module": "./src/app/my-feature/my-feature.module.ts",
},
```

The above defines a webpack module that is named `my-feature-module` and that is mapped to the [./src/app/my-feature/my-feature.module.ts](/code-demos/basic-ng16/mfe1-ng16/src/app/my-feature/my-feature.module.ts) file, which is where the `MyFeatureModule` Angular module is defined. 

### Dev platform

When you run the mfe1 app you will see the text `MFE1 dev platform`. This is to call out the fact that the mfe1 app is not exposed in its entirety via webpack module federation, only the `MyFeatureModule` Angular feature module is. Everything else in the mfe1 app is there only with the sole purpose of supporting the local development of the mfe1 app, more specifically, the development of the `MyFeatureModule` Angular feature module.

## Shell app

The shell app is an Angular 16 app that loads the Angular module exposed by the mfe1 app. You can test this by selecting the `Load Angular module named MyFeatureModule from mfe1` link which navigates to the `/mfe1/my-component` route.

### How the remote is loaded into the shell

The shell app loads the Angular module exposed by the mfe1 app using Angular routing.

The `/mfe1` route added to the [AppRoutingModule](/code-demos/basic-ng16/shell-ng16/src/app/app-routing.module.ts) uses an `import` to [lazy load](https://angular.io/guide/lazy-loading-ngmodules) the `MyFeatureModule` Angular feature module from the mfe1 app. The lazy load is done via the [loadChildren function](https://angular.io/api/router/LoadChildren) which imports the external webpack module `mfe1/my-feature-module` at runtime and then accesses the `MyFeatureModule` Angular module from the mfe1 app. At this point, the `loadChildren` function loads the routes available from the `MyFeatureModule` Angular module which means we can access the `MyComponent` Angular component from the mfe1 app by going to `/mfe1/my-component` path.

Also note that for typescript to be ok with the `import('mfe1/my-feature-module')` we must tell it that the module `mfe1/my-feature-module` exists and we do that by declaring it in the [remote-module.d.ts](/code-demos/basic-ng16/shell-ng16/src/app/remote-modules.d.ts) file.

> **Note**
> 
> For a better understanding of how the external webpack module from mfe1 is loaded into the shell see [How the loading of an external webpack module works
](../../docs/basics-module-federation.md#how-the-loading-of-an-external-webpack-module-works).
>

## Webpack module federation

To setup webpack module federation we had to do the steps below for both the shell and mfe1 apps:

- add a `bootstrap.ts` file. The code that originally is on `main.ts` moves to this file and the code on `main.ts` just imports the `bootrap.ts` file. [This is done because](https://webpack.js.org/concepts/module-federation):
> Loading remote modules is considered an asynchronous operation. When using a remote module, these asynchronous operations will be placed in the next chunk loading operation(s) that are between the remote module and the entrypoint. It's not possible to use a remote module without a chunk loading operation.

And also because it gives webpack module federation the opportunity to [negotiate which version of shared modules to use](https://github.com/webpack/webpack.js.org/issues/3757):
> In group of federated builds all parts will agree on the highest version of a shared module.
On the other hand the version of the shared module will be checked against a version requirement based on semver (lite).
If allowed, multiple versions of a shared module might exist and will be consumed based on the required version.

- add a `webpack.config.js` and a `webpack.prof.config.js`. These are used to extend angular's webpack configuration and configure module federation for the apps.
- change the builders used by `ng build` and `ng serve` commands. For this we installed the [ngx-build-plus](https://www.npmjs.com/package/ngx-build-plus) package with `npm i -D ngx-build-plus` and then we updated the `angular.json` file. These changes allow us to tell Angular to use the `webpack.config.js` files we created when building and serving and therefore apply the module federation settings.

### Webpack configuration file

Two webpack configuration files were added, one `webpack.config.js` which contains the base of the webpack configuration and a `webpack.config.prod.js` which extends the base configuration with production settings *if needed*.

For this projects all the configuration is on the `webpack.config.js`. This file contains the minimum configuration required to get module federation to work properly with Angular.

The only difference between the shell's webpack configuration and the mfe1's webpack configuration is that:
- the shell wants to consume the mfe1 app and therefore in the `plugins.ModuleFederationPlugin.remotes` it points to the mfe1 app location.
- the mfe1 app wants to expose an Angular module and therefore in the `plugins.ModuleFederationPlugin.exposes` indicates which Angular module is exposed.

> **Note**
> 
> For a better understanding of the settings defined in the webpack configuration file see  [Basics of webpack module federation](../../docs/basics-module-federation.md). 
>

### Angular configuration file

The `angular.json` file contains Angular specific app configuration. This file needs to be adjusted so that we can tell Angular to use the webpack configuration files. To do this we change the builders used by `ng build` and `ng serve` from the default Angular builders to the `ngx-build-plus` builders which then allow us to add an extra configuration which points to the webpack configuration files.

Using the Shell's Angular configuration file as an example, what was changed was:

- The builder for `ng build` at `projects.shell-ng16.architect.build.builder` was changed to `ngx-build-plus:browser`: 
```json
"builder": "ngx-build-plus:browser",
```

- Extra default options were added for `ng build` at `projects.shell-ng16.architect.build.options`: 
```json
"extraWebpackConfig": "webpack.config.js",
"commonChunk": false
```

- Extra production options were added for `ng build` at `projects.shell-ng16.architect.build.configurations.production`: 
```json
"extraWebpackConfig": "webpack.prod.config.js"
```

- The builder for `ng serve` at `projects.shell-ng16.architect.serve.builder` was changed to `ngx-build-plus:dev-server`: 
```json
"builder": "ngx-build-plus:dev-server",
```

- Extra default options were added for `ng serve` at `projects.shell-ng16.architect.serve.options`: 
```json
"options": {
    "port": 4200,
    "publicHost": "http://localhost:4200",
    "extraWebpackConfig": "webpack.config.js"
}
```

- Extra production options were added for `ng serve` at `projects.shell-ng16.architect.serve.configurations.production`: 
```json
"extraWebpackConfig": "webpack.prod.config.js"
```
