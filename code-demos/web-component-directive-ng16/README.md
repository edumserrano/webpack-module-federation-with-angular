# web-component-directive-ng16 code demo

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app](#mfe1-app)
  - [Exposed webpack module](#exposed-webpack-module)
  - [Dev platform](#dev-platform)
- [Shell app](#shell-app)
  - [How the remote is loaded into the shell](#how-the-remote-is-loaded-into-the-shell)
- [Webpack Module Federation](#webpack-module-federation)
- [Web components and Angular styling](#web-components-and-angular-styling)
- [Learn more](#learn-more)

## Description

This example shows how to setup Webpack Module Federation where the shell loads an Angular standalone component that is exposed as a [Web component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) by using an Angular directive. This example also shows how to set properties and listen to events from the Web component.

The remote webpack module executes a function that converts an Angular standalone component to a Web component.

The shell app is rendered in a red colored background and the remotely loaded mfe1 app is rendered in a blue colored background.

> **Note**
>
> Although the mfe1 app is using an Angular standalone component, the module federation setup shown in this example could also be used with a non-standalone Angular component. You do NOT have to use Angular standalone components to export Angular components as Web components.
>

## How to run

1) Go to `/code-demos/web-component-directive-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/code-demos/web-component-directive-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

The shell will load the Web component from the mfe1 app on page load.

## MFE1 app

The mfe1 app is an Angular 16 app that contains an Angular standalone component named [MyStandaloneComponent](/code-demos/web-component-directive-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts), which represents the micro frontend that we want to expose via Webpack Module Federation.

The [AppRoutingModule](/code-demos/web-component-directive-ng16/mfe1-ng16/src/app/app-routing.module.ts) Angular module contains a route that loads the `MyStandaloneComponent` on `/my-standalone-component`. You can use the `Go to /my-standalone-component` link on the mfe1 app to load the `MyStandaloneComponent` Angular component.

The mfe1 app will [set the input](/code-demos/web-component-directive-ng16/mfe1-ng16/src/app/app-routing.module.ts) of the `MyStandaloneComponent` to `test input value from dev platform` and [subscribe to the output of the component](/code-demos/web-component-directive-ng16/mfe1-ng16/src/app/app.component.ts) which logs to the console when the `Send message` button is clicked.

### Exposed webpack module

On the [webpack configuration file for mfe1 app](./mfe1-ng16/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
  "./standalone-component-as-web-component": "./src/app/my-standalone-component/remote-bootstrap.ts",
},
```

The above defines a webpack module that is named `standalone-component-as-web-component` and that is mapped to the [./src/app/my-standalone-component/remote-bootstrap.ts](/code-demos/web-component-directive-ng16/mfe1-ng16/src/app/my-standalone-component/remote-bootstrap.ts) file, which executes the `bootstrapMyComponentAsync` function that converts the `MyStandaloneComponent` Angular standalone component to a Web component. 

> **Note**
>
> The Angular component is converted to a Web component using the `createCustomElement` function from `@angular/elements`. For more info see [Angular elements overview](https://angular.io/guide/elements).
>

> **Note**
>
> In the [tsconfig.app.json](../web-component-directive-ng16/mfe1-ng16/tsconfig.app.json) config file we added the `src/app/my-standalone-component/remote-bootstrap.ts` entry to the `files` array to avoid a Typescript compilation error saying `<filename> is missing from the TypeScript compilation. Please make sure it is in your tsconfig via the 'files' or 'include' property`.
>

### Dev platform

When you run the mfe1 app you will see the text `MFE1 dev platform`. This is to call out the fact that the mfe1 app is not exposed in its entirety via Webpack Module Federation, only the [remote-bootstrap.ts](/code-demos/web-component-directive-ng16/mfe1-ng16/src/app/my-standalone-component/remote-bootstrap.ts) file that executes the [bootstrapMyComponentAsync](/code-demos/web-component-directive-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component-bootstrap.ts) function is. Everything else in the mfe1 app is there only with the sole purpose of supporting the local development of the mfe1 app, more specifically, the development of the `MyStandaloneComponent` Angular component.

This means that the input value `test input value from dev platform` set by the dev platform is not part of the exported component, neither is the subscription of the component's output that logs to the console when the `Send message` is clicked.

## Shell app

The shell app is an Angular 16 app that programatically loads a Web component exposed by the mfe1 app on page load by using an Angular directive. When the page is loading, the [LoadRemoteWebComponentDirective](/code-demos/component-directive-ng16/shell-ng16/src/app/load-remote-component.directive.ts) Angular directive simulates a two second load time and then loads the remote webpack module.

In addition to bootstraping the Web component, the `LoadRemoteWebComponentDirective` Angular directive will also trigger an event/output when the component has been loaded into the shell. You could extend this example and also add an output for when the component fails to load for any reason. With these kind of outputs you could then add loading indicators to the shell as well as information messages if the components fail to load.

See the [app.component.html](/code-demos/web-component-directive-ng16/shell-ng16/src/app/app.component.html) which is where the [LoadRemoteWebComponentDirective](/code-demos/web-component-directive-ng16/shell-ng16/src/app/load-remote-web-component.directive.ts) Angular directive is used. In the `app.component.html` file you can also see how the Web component properties are being set and how its events are being consumed.

Click on the `Send message` button from the remotely loaded component and see the message produced by the Web component be displayed on the shell.

### How the remote is loaded into the shell

The [LoadRemoteWebComponentDirective](/code-demos/web-component-directive-ng16/shell-ng16/src/app/load-remote-web-component.directive.ts) directive uses the `loadRemoteModule` function to load the webpack module from the mfe1 app which in turn executes the `bootstrapMyComponentAsync` function from the mfe1 app. 

The `bootstrapMyComponentAsync` registers a custom element in the `CustomElementRegistry` with the name `my-mfe-element`, which means that now wherever the custom element `<my-mfe-element></my-mfe-element>` is defined it will render the Web component from the mfe1 app. See [app.component.html](/code-demos/web-component-directive-ng16/shell-ng16/src/app/app.component.html).

> **Note**
>
> To use custom elements like the `my-mfe-element` and avoid Angular complaining that it doesn't know what it is, we make use of the `CUSTOM_ELEMENTS_SCHEMA` schema, which is added to the schema array at [app module](../web-component-directive-ng16/shell-ng16/src/app/app.module.ts) schemas.
>

## Webpack Module Federation

The setup of Webpack Module Federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package, which aims to streamline the setup of Webpack Module Federation for Angular apps. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)

## Web components and Angular styling

Beware of issues with styling when using web components. If styles from your Angular component that you have exposed as a Web component using `@angular/elements` are bleeding out, then you might need to set your [ViewEncapsulation](https://angular.io/api/core/ViewEncapsulation) to `ViewEncapsulation.ShadowDom`, which uses the ShadowDOM specification, on the Angular component which is being passed to `createCustomElement`. 

In this example app, the `ViewEncapsulation` configuration would be applied to the [MyStandaloneComponent](/code-demos/web-component-directive-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts) component.

## Learn more

See the the [Learn more](/code-demos/web-component-ng16/README.md#learn-more) section from the `web-component-ng16` code demo.