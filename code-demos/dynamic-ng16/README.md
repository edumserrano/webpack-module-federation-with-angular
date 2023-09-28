# dynamic-ng16

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app](#mfe1-app)
- [Shell app](#shell-app)
- [Webpack module federation](#webpack-module-federation)
  - [How to use a manifest file](#how-to-use-a-manifest-file)

## Description

This shows an example of how to setup webpack module federation using Angular 16 where the remote webpack module is loaded dynamically instead of being declared in the shell's webpack configuration. 

This project consists of two Angular 16 apps:
- shell-ng16: this app is used as the shell and uses Angular routing to lazy load an Angular module from the mfe1-ng16 app. 
- mfe1-ng16: this app represents a micro frontend that is consumed by the shell-ng16 app.

This example uses the [@angular-architects/module-federation](#webpack-module-federation) npm package which aims to streamline the setup of webpack module federation for Angular projects.

## How to run

1) Go to `/dynamic-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/dynamic-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

To see the mfe1 app loaded into the shell go to the shell's URL and click the `load my-feature Angular module from mfe1` link. 

Both apps are very simple and consist mainly of a bit of text inside a styled `div` which indicates if it's part of the shell or the mfe1 app. The shell renders in a red coloured `div` whilst the mfe1 app renders in a blue coloured `div`. In addition both apps display the version of Angular being used.

## MFE1 app

The mfe1 app contains three Angular modules:
- the default [AppModule](/code-demos/dynamic-ng16/mfe1-ng16/src/app/app.module.ts) created as part of doing `ng new`.
- the default [AppRoutingModule](/code-demos/dynamic-ng16/mfe1-ng16/src/app/app-routing.module.ts) created as part of doing `ng new`.
- a feature module named [MyFeatureModule](/code-demos/dynamic-ng16/mfe1-ng16/src/app/my-feature/my-feature.module.ts) which was created to represent the micro front that we want to expose via module federation.

The `MyFeatureModule` Angular module contains a route that loads the [MyComponent](/code-demos/dynamic-ng16/mfe1-ng16/src/app/my-feature/my-component/my-component.component.ts) Angular component on `/my-component`. You can use the `Go to my-component` link on the mfe1 app to load the `MyComponent`.

## Shell app

The shell app is able to consume the Angular module exposed by the mfe1 app and display it. It consists of a two Angular modules:
- the default [AppModule](/code-demos/dynamic-ng16/shell-ng16/src/app/app.module.ts) created as part of doing `ng new`.
- the default [AppRoutingModule](/code-demos/dynamic-ng16/shell-ng16/src/app/app-routing.module.ts) created as part of doing `ng new`.

Two routes were added to the `AppRoutingModule` and both of them dynamically load the same `MyFeatureModule` from the mfe1 app. Dynamically meaning that the remote location does not need to be specified in the shell's webpack configuration file. The difference between the routes is that one uses a manifest file and one does not. but one of them dynamically uses a using the information provided inline.

Both routes use the `loadRemoteModule` from the `@angular-architects/module-federation` package to dynamically load the external webpack module.

> **Note**
>
> This is an example app and though you can mix the approaches to dynamically load a webpack module you would usually choose to either use a manifest file or not.

Lastly, note that for the manifest option to work you need:

1) a manifest file which can be found at [dynamic-ng16/shell-ng16/src/assets/mf.manifest.json](/code-demos/dynamic-ng16/shell-ng16/src/assets/mf.manifest.json). 
2) load the manifest file data so that the `loadRemoteModule` from the `@angular-architects/module-federation` can access it. This is done at the [main.ts](/code-demos/dynamic-ng16/shell-ng16/src/main.ts) file.

> **Warning**
>
> Both links on the home page of the shell app dynamically load the SAME mfe1 app. If you alternate clicking between those links it might seem that nothing is happening but notice that the path on the URL changes between `/mfe1-dynamic` and `/mfe1-manifest`.
>

## Webpack module federation

The setup of webpack module federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)

### How to use a manifest file

If you want to use a manifest file, you can configure your shell as shown in [webpack module federation setup](/docs/basics-angular-architects.md#webpack-module-federation-setup) but use `--type dynamic-host` instead of `--type host`:

```
ng g @angular-architects/module-federation:init --project shell-ng16 --port 4200 --type dynamic-host
```

This will create a manifest file and update the `main.ts` to load the manifest when the app is starting.

