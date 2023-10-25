# multi-version-ng code demo

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app - Angular 16](#mfe1-app---angular-16)
  - [Exposed webpack module](#exposed-webpack-module)
  - [Dev platform](#dev-platform)
- [MFE2 app - Angular 14](#mfe2-app---angular-14)
  - [Exposed webpack module](#exposed-webpack-module-1)
  - [Dev platform](#dev-platform-1)
- [MFE3 app - Angular 12](#mfe3-app---angular-12)
  - [Exposed webpack module](#exposed-webpack-module-2)
  - [Dev platform and MFE platform](#dev-platform-and-mfe-platform)
- [MFE4 app - Angular 12](#mfe4-app---angular-12)
  - [Exposed webpack module](#exposed-webpack-module-3)
  - [Dev platform](#dev-platform-2)
- [Shell app - Angular 16](#shell-app---angular-16)
  - [How the remotes are loaded into the shell](#how-the-remotes-are-loaded-into-the-shell)
  - [What makes multi-version work](#what-makes-multi-version-work)
  - [Last word on multi-version mfe apps](#last-word-on-multi-version-mfe-apps)
- [Webpack Module Federation](#webpack-module-federation)
- [Learn more](#learn-more)

## Description

This example shows how to setup Webpack Module Federation where the shell loads several Angular apps of varying Angular versions. The shell loads remote webpack module that contain:

- from mfe1-ng16: an Angular 16 standalone component.
- from mfe2-ng14: a function that mounts an Angular 14 component into an `ElementRef`.
- from mfe3-ng12: a function that executes an Angular 12 Module which provides an Angular 12 component as a Web Component.
- from mfe4-ng12: an Angular 12 component.

The shell app is rendered in a red colored background and the remotely loaded mfe apps are rendered in a blue colored background.

> **Note**
>
> Although the mfe1 app is using an Angular standalone component, the module federation setup shown in this example could also be used with a non-standalone Angular component. You do NOT have to use Angular standalone components to export Angular components as Web components.
>

## How to run

1) Go to `/code-demos/multi-version-ng/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/code-demos/multi-version-ng/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.
3) Go to `/code-demos/multi-version-ng/mfe2-ng14` folder and run `npm i`, followed by `npm start`. This will start the mfe2 app on http://localhost:4202.
4) Go to `/code-demos/multi-version-ng/mfe3-ng12` folder and run `npm i`, followed by `npm start`. This will start the mfe3 app on http://localhost:4203.
5) Go to `/code-demos/multi-version-ng/mfe4-ng12` folder and run `npm i`, followed by `npm start`. This will start the mfe4 app on http://localhost:4204.

The shell will load the mfe apps on page load.

> **Warning**
> 
> When running the Angular 12 apps, if you get an error like:
> `Error: error:0308010C:digital envelope routines::unsupported`
>
> Then you should set the environment variable `NODE_OPTIONS` to `--openssl-legacy-provider` which let's you bypass this error. For instance, if you're using powershell then you can do `$env:NODE_OPTIONS = "--openssl-legacy-provider"` and then the command `npm start` should be able to start the app.
>
> The reason for this error is:
> 
> `In Node.js v17, the Node.js developers closed a security hole in the SSL provider. This fix was a breaking change that corresponded with similar breaking changes in the SSL packages in NPM. When you attempt to use SSL in Node.js v17 or later without also upgrading those SSL packages in your package.json, then you will see this error.`
>
> Read [this stackoverflow question](https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported) for more details. 
>

## MFE1 app - Angular 16

The mfe1 app is an Angular 16 app that contains an Angular standalone component named [MyStandaloneComponent](/code-demos/multi-version-ng/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts), which represents the micro frontend that we want to expose via Webpack Module Federation.

The [AppRoutingModule](/code-demos/multi-version-ng/mfe1-ng16/src/app/app-routing.module.ts) Angular module contains a route that loads the `MyStandaloneComponent` on `/my-standalone-component`. 

Use the `Go to /my-standalone-component` link to load the component.

### Exposed webpack module

On the [webpack configuration file for mfe1 app](/code-demos/multi-version-ng/mfe1-ng16/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
  "./my-standalone-component": "./src/app/my-standalone-component/my-standalone-component.component.ts",
},
```

The above defines a webpack module that is named `my-standalone-component` and that is mapped to the [./src/app/my-standalone-component/my-standalone-component.component.ts](/code-demos/multi-version-ng/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts) file, which is where the `MyStandaloneComponent` Angular standalone component is defined. 

### Dev platform

When you run the mfe1 app you will see the text `MFE1 dev platform`. This is to call out the fact that the mfe1 app is not exposed in its entirety via Webpack Module Federation, only the `MyStandaloneComponent` Angular standalone component is. Everything else in the mfe1 app is there only with the sole purpose of supporting the local development of the mfe1 app, more specifically, the development of the `MyStandaloneComponent` Angular component.

## MFE2 app - Angular 14

The mfe2 app is an Angular 14 app that contains an Angular feature module named [MyFeatureModule](/code-demos/multi-version-ng/mfe2-ng14/src/app/my-feature/my-feature.module.ts), where the [MyComponent](/code-demos/multi-version-ng/mfe2-ng14/src/app/my-feature/my-component/my-component.component.ts) Angular component is declared. This component represents the micro frontend that we want to expose via Webpack Module Federation.

The `MyFeatureModule` Angular module also contains a route that loads the `MyComponent` on `/my-component`. 

Use the `Go to /my-component` link to load the component.

### Exposed webpack module

On the [webpack configuration file for mfe2 app](/code-demos/multi-version-ng/mfe2-ng14/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
  "./remote-bootstrap": "./src/app/my-feature/remote-bootstrap.ts",
},
```

The above defines a webpack module that is named `remote-bootstrap` and that is mapped to the [./src/app/my-feature/remote-bootstrap.ts](/code-demos/multi-version-ng/mfe2-ng14/src/app/my-feature/remote-bootstrap.ts) file, which exposes a `bootstrapMyComponentAsync` function that will mount the `MyComponent` Angular component into the provided `ElementRef`. 

> **Note**
>
> In the [tsconfig.app.json](./mfe2-ng14/tsconfig.app.json) config file we added the `src/app/my-feature/remote-bootstrap.ts` entry to the `files` array to avoid a Typescript compilation error saying `<filename> is missing from the TypeScript compilation. Please make sure it is in your tsconfig via the 'files' or 'include' property`.
>

### Dev platform

When you run the mfe2 app you will see the text `MFE2 dev platform`. This is to call out the fact that the mfe2 app is not exposed in its entirety via Webpack Module Federation, only the `bootstrapMyComponentAsync` function from `remote-bootstrap.ts` is. Everything else in the mfe2 app is there only with the sole purpose of supporting the local development of the mfe2 app, more specifically, the development of the `MyComponent` Angular component.

## MFE3 app - Angular 12

The mfe3 app is an Angular 12 app where the [MyComponent](/code-demos/multi-version-ng/mfe3-ng12/src/app/my-component/my-component.component.ts) Angular component is declared. This component represents the micro frontend that we want to expose via Webpack Module Federation.

Use the `Go to /my-component` link to load the component.

### Exposed webpack module

On the [webpack configuration file for mfe3 app](/code-demos/multi-version-ng/mfe3-ng12/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
  "./remote-bootstrap": "./src/mfe-platform/remote-bootstrap.ts",
},
```

The above defines a webpack module that is named `remote-bootstrap` and that is mapped to the [./src/mfe-platform/remote-bootstrap.ts](/code-demos/multi-version-ng/mfe3-ng12/src/mfe-platform/remote-bootstrap.ts) file, which exposes a `bootstrapMyComponentAsync` function that will use the `MfePlatformModule` Angular module to bootstrap the `MyComponent` Angular component and provide it as a Web component. 

> **Note**
>
> In the [tsconfig.app.json](./mfe3-ng12/tsconfig.app.json) config file we added the `src/mfe-platform/remote-bootstrap.ts` entry to the `files` array to avoid a Typescript compilation error saying `<filename> is missing from the TypeScript compilation. Please make sure it is in your tsconfig via the 'files' or 'include' property`.
>

### Dev platform and MFE platform

The [./src/bootstrap.ts](/code-demos/multi-version-ng/mfe3-ng12/src/bootstrap.ts) decides which Angular module should be executed. It will either be the [DevPlatformModule](/code-demos/multi-version-ng/mfe3-ng12/src/dev-platform/dev-platform.module.ts) or the [MfePlatformModule](/code-demos/multi-version-ng/mfe3-ng12/src/mfe-platform/mfe-platform.module.ts). The decision on which Angular module depends on the `environment.runMfePlatform` variable. The environment files are defined at [/mfe3-ng12/src/environments](/code-demos/multi-version-ng/mfe3-ng12/src/environments/).

When you run the mfe3 app via `npm start`, the `DevPlatformModule` is executed and you will see the text `MFE3 dev platform`, whilst when you run via `npm run start:mfe`, the `MfePlatformModule` is executed and you only see the `MyComponent` Angular component. 

Note that each module bootstraps an entry Angular component differently:

- the `DevPlatformModule` bootstraps the `DevPlatformEntryComponent` whose selector is `app-root`.
- the `MfePlatformModule` bootstraps a custom element named `mfe3-element`.

And to support the execution of both modules, the [index.html](/code-demos/multi-version-ng/mfe3-ng12/src/index.html) file contains both the `app-root` and the `mfe3-element` tags.

The separation in code into a `DevPlatformModule` and `MfePlatformModule` is done because:

1) unlike with newer versions of Angular, I couldn't find a way to mount the Angular component without executing an Angular Module. 
2) I want to have a dev platform, meaning an app that I can run for development purposes only. A place where I can add code that doesn't get exposed by the micro frontend but helps me develop it locally.

Having a dev platform is not mandatory but it's useful since it can help you test a lot of things with your mfe, things like inputs, outputs, navigations, etc. For instance, if the mfe has inputs or outputs, the dev platform can provide a way for you to test them and that code will not be exported together with your mfe. 

Running the app with `start:mfe` is not particularly useful, this npm script is available just for demo purposes. At least it let's you do a quick manual test to see if your mfe is starting up correctly. Not sure if it's useful for much more than that.

> **Note**
>
> Regardless of how the mfe3 app is executed, via `npm start` or `npm run start:mfe`, the webpack config file will always expose the `MfePlatformModule` Angular module, which represents the mfe app to expose.
>

## MFE4 app - Angular 12

The mfe4 app is an Angular 12 app that contains an Angular feature module named [MyFeatureModule](/code-demos/multi-version-ng/mfe4-ng12/src/app/my-feature/my-feature.module.ts), where the [MyComponent](/code-demos/multi-version-ng/mfe4-ng12/src/app/my-feature/my-component/my-component.component.ts) Angular component is declared. This component represents the micro frontend that we want to expose via Webpack Module Federation. The `MyFeatureModule` also contains a route that loads the `MyComponent` on `/my-component`. 

Use the `Go to /my-component` link to load the component.

### Exposed webpack module

On the [webpack configuration file for mfe4 app](/code-demos/multi-version-ng/mfe4-ng12/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
  "./my-component": "./src/app/my-feature/my-component/my-component.component.ts",
},
```

The above defines a webpack module that is named `my-component` and that is mapped to the [./src/app/my-feature/my-component/my-component.component.ts](/code-demos/multi-version-ng/mfe4-ng12/src/app/my-feature/my-component/my-component.component.ts) file, which is where the `MyComponent` Angular standalone component is defined. 

### Dev platform

When you run the mfe4 app you will see the text `MFE4 dev platform`. This is to call out the fact that the mfe4 app is not exposed in its entirety via Webpack Module Federation, only the `MyComponent` Angular component is. Everything else in the mfe4 app is there only with the sole purpose of supporting the local development of the mfe4 app, more specifically, the development of the `MyComponent` Angular component.

## Shell app - Angular 16

The shell app is an Angular 16 app that programatically loads the 4 mfe apps on page load. This is done on the `ngOnInit` method at [app.component.ts](/code-demos/multi-version-ng/shell-ng16/src/app/app.component.ts). 

### How the remotes are loaded into the shell

The shell app uses the `loadRemoteModule` function to load the webpack modules from each of the mfe apps and then uses the `ViewContainerRef` variables to mount the mfe apps into the Shell's DOM.

Both the mfe1 and mf4 app expose an Angular component and so it can be mounted into the Shell's DOM by executing the `ViewContainerRef.createComponent` function and passing in the exposed Angular component. 

The mfe2 app exposes a bootstrapping function named `bootstrapMyComponentAsync`, which is responsible for mounting the mfe into the Shell's DOM. This function takes in the `ElementRef` which represents the HTML element where the mfe2 app will be mounted to. 

The mfe3 app exposes a bootstrapping function named `bootstrapMyComponentAsync`, which is responsible for providing a Web component. This function registers a custom element in the `CustomElementRegistry` with the provided `mfe3-element` name, which means that now wherever the custom element `<mfe3-element></mfe3-element>` is defined it will render the Web component from the mfe3 app. See [app.component.html](/code-demos/multi-version-ng/shell-ng16/src/app/app.component.html).

Note that when loading the remote webpack modules via the `loadRemoteModule` function, the Angular 12 webpack modules are loaded using different `LoadRemoteModuleOptions`. The `type` is set to `script` and an extra `remoteName` property is provided. This is due to the fact that until Angular 12, the Angular CLI emits plain old JavaScript files but, starting with Angular 13 the Angular CLI emits EcmaScript modules.

### What makes multi-version work

To get different versions of Angular loaded you must allow it by telling webpack module federation that those dependencies aren't singletons. If you look at `webpack.config.ts` files of the mfe2 and mfe3 apps, you will see that the required Angular dependencies are defined in the `shared` array with the `singleton` and `strict` properties set to `false`. Otherwise, webpack module federation would only load one instance of the Angular dependencies. See the [Shared document](/docs/shared.md) to better understand how this mechanism works.

Setting the `singleton` and `strict` properties to `false` will tell module federation to load the version of the Angular dependencies defined in the mfe app but these settings by themselfs aren't enough to get different Angular versions to work together without any problem.

You might have to do extra code to allow your multi-version mfe apps to work properly when loaded into the shell app. What you need to do will depend on both the versions of Angular and the Angular features you use. For instance, you must do extra code to allow multiple versions of Angular platform to co-exist in the browser. [By default, each page should only have one](https://angular.io/api/core/PlatformRef).

> **Note**
>
> For a better description of the issues with running multiple versions of Angular together and how to tackle them see [Multi-Framework and -Version Micro Frontends with Module Federation: The Good, the Bad, the Ugly](https://www.angulararchitects.io/en/blog/multi-framework-and-version-micro-frontends-with-module-federation-the-good-the-bad-the-ugly/).
>

For the apps in this code demo, the extra code required to get the different versions of Angular to work together is related with allowing multiple Angular platform versions to co-exist. See:

- [bootstrap.ts from the shell app](/code-demos/multi-version-ng/shell-ng16/src/bootstrap.ts)
- [remote-bootstrap.ts from the mfe3 app](/code-demos/multi-version-ng/mfe3-ng12/src/mfe-platform/remote-bootstrap.ts)

The `getAngularPlatform` function in the above files makes sure that only a version of Angular platform is instantiated per major version of Angular. Otherwise, Angular would throw an exception. Check the console when the Shell app is loading and you will see this two logs:

1) `creating angular platform with version ^16.1.0`: generated by the shell app.
2) `creating angular platform with version ~12.2.0`: generated by the mfe3 app.

Lastly, note the following:

- The `getAngularPlatform` function is not present in the mfe1 app (an Angular 16 app) or the mfe2 app (an Angular 14 app) because the code exposed by these apps does NOT require an Angular platform to execute.
- The `getAngularPlatform` function is not added to the mfe4 app (an Angular 12 app) because this app sets the `singleton` property of the Angular dependencies in its  `webpack.config.ts` to `true`. This means that when webpack module federation is loading the mfe4 app, it doesn't need to load the Angular 12 modules if an equal or higher version is already present. Since the shell app loaded Angular 16, then the mfe4 will run using Angular 16. That's why the `MyComponent` Angular component shows the message `Remote component 4 running Angular 12.2.17` when you run the mfe4 app, but shows the message `Remote component 4 running Angular 16.2.5`. This is also the cause for the warning in the console that says: `Unsatisfied version 16.1.0 of shared singleton module @angular/core (required ~12.2.0)`. The wording is a bit weird but it means that a module required version `~12.0.0` of `@angular/core` but version `16.1.0` was used.
- If there were more mfe apps that instantiated an Angular platform, we would have to add the `getAngularPlatform` function to them as well.

> **Note**
>
> The `getAngularPlatform` function could be replaced by the `bootstrap` helper function from the [@angular-architects/module-federation-tools](https://www.npmjs.com/package/@angular-architects/module-federation-tools) npm package which does the same and more. See the [Helper for Angular](https://www.npmjs.com/package/@angular-architects/module-federation-tools#helper-for-angular) and [Some Additional Details](https://www.npmjs.com/package/@angular-architects/module-federation-tools#some-additional-details) sections of the `@angular-architects/module-federation-tools` README for more info.
>

### Last word on multi-version mfe apps

Any frontend framework will have its problems to solve when you try to run different versions of the framework together. After all, the majority of front end frameworks wasn't created with a micro frontend architecture in mind.

What you should take into consideration is if you really need to have the specific version of the framework running or not. Your app might run just fine in a different version of the framework for which it was developed, higher or lower. In fact, this code demo prooves that with the mfe4 Angular 12 app, which runs in the shell using Angular 16.

Whether or not you can successfully run an app with a different version of shared dependencies depends on the code you are using from those dependencies and if there were any breaking changes between the version of the dependency that you are using and the version of the dependency loaded at runtime by the shell.  

**If you have an app that works with different versions of a shared dependency then I don't see why you would go through the trouble of adding extra code to make sure you use the exact version of the dependency used to develop the app.**

## Webpack Module Federation

The setup of Webpack Module Federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package, which aims to streamline the setup of Webpack Module Federation for Angular apps. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)

> **Note**
> 
> Older versions of Angular might require slightly different commands to setup when using the `@angular-architects/module-federation` package. To find out what you should use for each Angular version, check the README page for the appropriate version of the package. For instance, for Angular 12, you should check the [REAME for version 12.5.3 of the package](https://www.npmjs.com/package/@angular-architects/module-federation/v/12.5.3).
>
> Furthermore, different version of the `@angular-architects/module-federation` package will setup the `webpack.config.js` differently. Later versions of this package have simplified the webpack configuration. Compare the `webpack.config.js` from one the mfe1 app, which is an Angular 16 app, to the mfe3 app, which is an Angular 12 app.
>

## Learn more

For more info see:

- [Multi-Framework and -Version Micro Frontends with Module Federation: The Good, the Bad, the Ugly](https://www.angulararchitects.io/en/blog/multi-framework-and-version-micro-frontends-with-module-federation-the-good-the-bad-the-ugly/)
- [Multi-Framework and -Version Micro Frontends with Module Federation: Your 4 Steps Guide](https://www.angulararchitects.io/en/blog/multi-framework-and-version-micro-frontends-with-module-federation-your-4-steps-guide/)
- [Pitfalls with Module Federation and Angular](https://www.angulararchitects.io/en/blog/pitfalls-with-module-federation-and-angular/)
- [README for the @angular-architects/module-federation-tools npm package](https://www.npmjs.com/package/@angular-architects/module-federation-tools)
- [Angular Platforms in depth. Part 1. What are Angular Platforms?](https://angularindepth.com/posts/1027/angular-platforms-in-depth-part-1-what-are-angular-platforms)
- [Angular Platforms in depth. Part 2. Application bootstrap process](https://angularindepth.com/posts/1144/angular-platforms-in-depth-part-2-application-bootstrap-process)