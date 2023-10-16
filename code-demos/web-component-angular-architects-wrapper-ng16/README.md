# web-component-angular-architects-wrapper-ng16 code demo

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app](#mfe1-app)
  - [Exposed webpack module](#exposed-webpack-module)
  - [Dev platform](#dev-platform)
- [Shell app](#shell-app)
  - [How the remote is loaded into the shell](#how-the-remote-is-loaded-into-the-shell)
- [Webpack module federation](#webpack-module-federation)
- [Web components and Angular styling](#web-components-and-angular-styling)
- [Learn more](#learn-more)

## Description

This example shows how to setup webpack module federation where the shell uses a generic Angular component that acts as a wrapper for the remotely loaded [Web component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components). The wrapper Angular component is provided by the [@angular-architects/module-federation-tools](https://www.npmjs.com/package/@angular-architects/module-federation-tools) npm package and can be used directly on the HTML or via Angular routing. This code demo also shows how to set the properties and consume the events from the Web component.

The remote webpack module executes a function that converts an Angular standalone component to a Web component.

The shell app is rendered in a red colored background and the remotely loaded mfe1 app is rendered in a blue colored background.

> **Note**
>
> Although the mfe1 app is using an Angular standalone component, the module federation setup shown in this example could also be used with a non-standalone Angular component. You do NOT have to use Angular standalone components to export Angular components as Web components.
>

## How to run

1) Go to `/code-demos/web-component-angular-architects-wrapper-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/code-demos/web-component-angular-architects-wrapper-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

The shell will load the Web component from the mfe1 in two ways:

- using the wrapper Angular component directly on HTML: the web component will load on the shell's page load.
- using the wrapper Angular component with Angular routing: the web component will load when navigating to `/mfe1`. 

## MFE1 app

The mfe1 app is an Angular 16 app that contains an Angular standalone component named [MyStandaloneComponent](/code-demos/web-component-angular-architects-wrapper-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts), which represents the micro frontend that we want to expose via webpack module federation.

The [AppRoutingModule](/code-demos/web-component-angular-architects-wrapper-ng16/mfe1-ng16/src/app/app-routing.module.ts) Angular module contains a route that loads the `MyStandaloneComponent` on `/my-standalone-component`. You can use the `Go to /my-standalone-component` link on the mfe1 app to load the `MyStandaloneComponent` Angular component.

The mfe1 app will [set the input](/code-demos/web-component-ng16/mfe1-ng16/src/app/app-routing.module.ts) of the `MyStandaloneComponent` to `test input value from dev platform` and [subscribe to the output of the component](/code-demos/web-component-ng16/mfe1-ng16/src/app/app.component.ts) which logs to the console when the `Send message` button is clicked.

### Exposed webpack module

On the [webpack configuration file for mfe1 app](./mfe1-ng16/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
  "./standalone-component-as-web-component": "./src/app/my-standalone-component/remote-bootstrap.ts",
},
```

The above defines a webpack module that is named `standalone-component-as-web-component` and that is mapped to the [./src/app/my-standalone-component/remote-bootstrap.ts](/code-demos/web-component-angular-architects-wrapper-ng16/mfe1-ng16/src/app/my-standalone-component/remote-bootstrap.ts) file, which executes the `bootstrapMyComponentAsync` function that converts the `MyStandaloneComponent` Angular standalone component to a Web component. 

> **Note**
>
> The Angular component is converted to a Web component using the `createCustomElement` function from `@angular/elements`. For more info see [Angular elements overview](https://angular.io/guide/elements).
>

> **Note**
>
> In the [tsconfig.app.json](../web-component-angular-architects-wrapper-ng16/mfe1-ng16/tsconfig.app.json) config file we added the `src/app/my-standalone-component/remote-bootstrap.ts` entry to the `files` array to avoid a Typescript compilation error saying `<filename> is missing from the TypeScript compilation. Please make sure it is in your tsconfig via the 'files' or 'include' property`.
>

### Dev platform

When you run the mfe1 app you will see the text `MFE1 dev platform`. This is to call out the fact that the mfe1 app is not exposed in its entirety via webpack module federation, only the [remote-bootstrap.ts](/code-demos/web-component-angular-architects-wrapper-ng16/mfe1-ng16/src/app/my-standalone-component/remote-bootstrap.ts) file that executes the [bootstrapMyComponentAsync](/code-demos/web-component-angular-architects-wrapper-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component-bootstrap.ts) function is. Everything else in the mfe1 app is there only with the sole purpose of supporting the local development of the mfe1 app, more specifically, the development of the `MyStandaloneComponent` Angular component.

This means that the input value `test input value from dev platform` set by the dev platform is not part of the exported component, neither is the subscription of the component's output that logs to the console when the `Send message` is clicked.

## Shell app

The shell app is an Angular 16 app that loads a Web component exposed by the mfe1 app by using a generic Angular component that acts as a wrapper. The wrapper component is named [WebComponentWrapper ](https://github.com/angular-architects/module-federation-plugin/blob/53a9aa740475b87f689a5781847d418e66b44226/libs/mf-tools/src/lib/web-components/web-component-wrapper.ts) and is provided by the [@angular-architects/module-federation-tools](https://www.npmjs.com/package/@angular-architects/module-federation-tools) npm package.

The shell uses the `WebComponentWrapper` in two ways:
- `directly on HTML`: the web component is loaded on the shell's page load. This way also allows easily setting the inputs and outputs.
- `with Angular routing`: the web component will load when navigating to `/mfe1`. You can also set inputs and outputs using the `WebComponentWrapper` in this way but it's more limited, not so straightforward.

### How the remote is loaded into the shell

The [WebComponentWrapper](https://github.com/angular-architects/module-federation-plugin/blob/53a9aa740475b87f689a5781847d418e66b44226/libs/mf-tools/src/lib/web-components/web-component-wrapper.ts) Angular component uses the `loadRemoteModule` function to load the webpack module from the mfe1 app. Upon loading the webpack module, the `bootstrapMyComponentAsync` is executed and registers a custom element in the `CustomElementRegistry` with the name `my-mfe-element`, which means that wherever the custom element `<my-mfe-element></my-mfe-element>` is defined it will render the Web component from the mfe1 app. 

Then, the `WebComponentWrapper` creates a custom element in the DOM with the name from `WebComponentWrapperOptions.elementName`, which in this example is set to `my-mfe-element`. Once this is done the Web component gets rendered in this custom element.

## Webpack module federation

The setup of webpack module federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package, which aims to streamline the setup of webpack module federation for Angular apps. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)

## Web components and Angular styling

Beware of issues with styling when using web components. If styles from your Angular component that you have exposed as a Web component using `@angular/elements` are bleeding out, then you might need to set your [ViewEncapsulation](https://angular.io/api/core/ViewEncapsulation) to `ViewEncapsulation.ShadowDom`, which uses the ShadowDOM specification, on the Angular component which is being passed to `createCustomElement`. 

In this example app, the `ViewEncapsulation` configuration would be applied to the [MyStandaloneComponent](/code-demos/web-component-angular-architects-wrapper-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts) component.

## Learn more

See the the [Learn more](/code-demos/web-component-ng16/README.md#learn-more) section from the `web-component-ng16` code demo.

In addition see:

- [the readme page for the @angular-architects/module-federation-tools npm package](https://www.npmjs.com/package/@angular-architects/module-federation-tools?activeTab=readme)
- [the @angular-architects/module-federation-tools tutorial](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf-tools/tutorial/index.md)
