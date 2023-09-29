# dynamic-manifest-ng16 code demo

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app](#mfe1-app)
  - [Exposed webpack module](#exposed-webpack-module)
  - [Dev platform](#dev-platform)
- [Shell app](#shell-app)
  - [How the remote is loaded into the shell](#how-the-remote-is-loaded-into-the-shell)
  - [Why use a manifest file?](#why-use-a-manifest-file)
- [Webpack module federation](#webpack-module-federation)

## Description

This example shows how to setup webpack module federation without having to declare a remote in the shell's webpack configuration file. This code demo is called dynamic because it does NOT require the remote to be declared in the shell's webpack configuration. 

The remote webpack module contains an Angular module which the shell loads using Angular routing and a manifest file.

## How to run

1) Go to `/code-demos/dynamic-manifest-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/code-demos/dynamic-manifest-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

To see the mfe1 app loaded into the shell go to the shell's URL and click the `Load Angular module named MyFeatureModule from mfe1` link.

Both apps are very simple and consist mainly of a bit of text inside a styled `div` which indicates if it's part of the shell or the mfe1 app. The shell renders in a red coloured `div` whilst the mfe1 app renders in a blue coloured `div`. In addition both apps display the version of Angular being used.

## MFE1 app

The mfe1 app is an Angular 16 app that contains an Angular feature module named [MyFeatureModule](/code-demos/dynamic-manifest-ng16/mfe1-ng16/src/app/my-feature/my-feature.module.ts), which was created to represent the micro front that we want to expose via webpack module federation.

The `MyFeatureModule` Angular module contains a route that loads the [MyComponent](/code-demos/dynamic-manifest-ng16/mfe1-ng16/src/app/my-feature/my-component/my-component.component.ts) Angular component on `/my-component`. You can use the `Go to my-component` link on the mfe1 app to load the `MyComponent` Angular component.
e mfe1 app to load the `MyComponent` Angular component.

### Exposed webpack module

On the [webpack configuration file for mfe1 app](./mfe1-ng16/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
  "./my-feature-module": "./src/app/my-feature/my-feature.module.ts",
},
```

The above defines a webpack module that is named `my-feature-module` and that is mapped to the [./src/app/my-feature/my-feature.module.ts](/code-demos/dynamic-manifest-ng16/mfe1-ng16/src/app/my-feature/my-feature.module.ts) file, which is where the `MyFeatureModule` Angular module is defined. 

### Dev platform

When you run the mfe1 app you will see the text `MFE1 dev platform`. This is to call out the fact that the mfe1 app is not exposed in its entirety via webpack module federation, only the `MyFeatureModule` Angular feature module is. Everything else in the mfe1 app is there only with the sole purpose of supporting the local development of the mfe1 app, more specifically, the development of the `MyFeatureModule` Angular feature module.

## Shell app

The shell app is an Angular 16 app that loads the Angular module exposed by the mfe1 app. You can test this by selecting the `Load Angular module named MyFeatureModule from mfe1` link which navigates to the `/mfe1/my-component` route.

### How the remote is loaded into the shell

The shell app loads the Angular module exposed by the mfe1 app using Angular routing.

The `/mfe1` route added to the [AppRoutingModule](/code-demos/dynamic-manifest-ng16/shell-ng16/src/app/app-routing.module.ts) [lazy loads](https://angular.io/guide/lazy-loading-ngmodules) the `MyFeatureModule` Angular feature module from the mfe1 app. This route uses the `loadRemoteModule` function to dynamically load the webpack module. In this context, dynamically means that the remote location does not need to be specified in the shell's webpack configuration file.

Once the webpack module is loaded from the remote we return the exposed Angular module from the mfe1 app named `MyFeatureModule` to the [loadChildren function](https://angular.io/api/router/LoadChildren). At this point, the `loadChildren` function will lazy load the routes available from the `MyFeatureModule` Angular module which means we can access the `MyComponent` Angular component from the mfe1 app by going to `/mfe1/my-component` path.

Lastly, note that the `loadRemoteModule` function will get the location of the remote named `mfe1` from the manifest file [mf.manifest.json](/code-demos/dynamic-manifest-ng16/shell-ng16/src/assets/mf.manifest.json). The manifest file maps the remote named `mfe1` to the remote at `http://localhost:4201/remoteEntry.js`. The manifest file is loaded at app startup via the [main.ts](/code-demos/dynamic-manifest-ng16/shell-ng16/src/main.ts) file. 

### Why use a manifest file?

You can use the manifest file approach simply because you prefer it as a way to organize your remotes, however one of advantages you can get by using it is to have a manifest file per environment. 

You can do this by using Angular [fileReplacements](https://angular.io/guide/build#configure-target-specific-file-replacements) which allow you to tell Angular which manifest file to use when building for a given Angular configuration.

More details on how an example like this could work:
1) You could have a manifest file for local development, one for a non-production environment and one for a production environment.
2) Then you would have an Angular configuration for development, one for non-production and one for production.
3) The app would load the local development manifest file on the `main.ts`.
4) Lastly, the non-production and production Angular configurations would use a `fileReplacement` to select the appropriate manifest to replace the local development manifest file.

This way:
- when running locally the remotes defined on the local manifest file are used;
- when building and deploying to the non-production environment the remotes defined on the non-production manifest file are used;
- when building and deploying to the production environment, the remotes defined on the production manifest file are used.

## Webpack module federation

The setup of webpack module federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package, which aims to streamline the setup of webpack module federation for Angular apps. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

To use a manifest file, you need to configure your shell as shown in [webpack module federation setup](/docs/basics-angular-architects.md#webpack-module-federation-setup) but use `--type dynamic-host` instead of `--type host`:

```
ng g @angular-architects/module-federation:init --project shell-ng16 --port 4200 --type dynamic-host
```

This will create a manifest file and update the `main.ts` to load the manifest when the app is starting.

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)


