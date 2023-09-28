# web-component-ng16

- [Description](#description)
- [How to run](#how-to-run)
- [MFE1 app](#mfe1-app)
  - [The exported webpack module](#the-exported-webpack-module)
  - [Local development](#local-development)
- [Shell app](#shell-app)
- [Webpack module federation](#webpack-module-federation)
- [Web components](#web-components)
  - [Watch out for](#watch-out-for)
  - [Learn more](#learn-more)

## Description

This shows an example of how to setup webpack module federation where the shell loads a standalone Angular component that is exposed as a web component. Both shell and remote app use Angular 16.

This project consists of two Angular 16 apps:
- shell-ng16: this app is used as the shell and is able the web component from the mfe1-ng16 app.
- mfe1-ng16: this app represents a micro frontend that contains an Angular standalone component that is exposed as a web component and consumed by the shell app.

This example uses the [@angular-architects/module-federation](#webpack-module-federation) npm package which aims to streamline the setup of webpack module federation for Angular projects.

> **Note**
>
> Although the mfe1 app is using an Angular standalone component, the same could be achieved without using a standalone component. You do NOT have to use Angular standalone components to export Angular components as web components.
>
> For more information about Angular standalone components see the [component-standalone-ng16](../component-standalone-ng16/README.md) example.
>

## How to run

1) Go to `/web-component-ng16/shell-ng16` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/web-component-ng16/mfe1-ng16` folder and run `npm i`, followed by `npm start`. This will start the mfe1 app on http://localhost:4201.

The shell will load the web component from the mfe1 app on page load. It loads it twice to show two different ways of doing it. 

Both apps are very simple and consist mainly of a bit of text inside a styled `div` which indicates if it's part of the shell or the mfe1 app. The shell renders in a red coloured `div` whilst the standalone components from the mfe1 app render in a blue coloured `div`. In addition both apps display the version of Angular being used.

## MFE1 app

The mfe1 app contains two Angular modules:
- the default [AppModule](/code-demos/web-component-ng16/mfe1-ng16/src/app/app.module.ts) created as part of doing `ng new`.
- the default [AppRoutingModule](/code-demos/web-component-ng16/mfe1-ng16/src/app/app-routing.module.ts) created as part of doing `ng new`.

It also contains one standalone Angular component named `MyStandaloneComponent`.

### The exported webpack module

The [webpack configuration](/code-demos/web-component-ng16/mfe1-ng16/webpack.config.js) file for the mfe1 app exposes a single webpack module:
- `./standalone-component-as-web-component` which maps to the `./src/app/my-standalone-component/my-standalone-component-bootstrap.ts` file.

The [my-standalone-component-bootstrap.ts](/code-demos/web-component-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component-bootstrap.ts) exports a single function named `bootstrapMyComponentAsync` that uses `@angular/elements` to convert an Angular component into a web component. The shell will use the `bootstrapMyComponentAsync` to load the web component and as long as an `my-mfe-element` element exists in the shell, the web component will be rendered on it.

### Local development

The shell only cares about the [MyStandaloneComponent](/code-demos/web-component-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts) and the [my-standalone-component-bootstrap.ts](/code-demos/web-component-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component-bootstrap.ts) which is used to bootstrap the component.

This means that everything else in the mfe1 app is only present to facilidate the local development of the `MyStandaloneComponent`.

The local development Angular module for the mfe1 app is setup to facilitate two things:
1) we can easily check the `MyStandaloneComponent` as we're developing. This is loaded via the route defined at the [AppRoutingModule](/code-demos/web-component-ng16/mfe1-ng16/src/app/app-routing.module.ts) module.
2) test that the bootstrap function that we are exporting works as expected. At the [app.component.ts](/code-demos/web-component-ng16/mfe1-ng16/src/app/app.component.ts):
   - the `ngOnInit` method is used to execute the bootstrap function which is what the shell will be consuming. This bootstrap function can only be called once as the call to add the web component to the registry, `customElements.define`, can only be done once per element name.
   - the `mountWebComponentAsync` and `unmountWebComponentAsync` methods show a way to add the `my-mfe-element` element to the DOM on which the web element will them be rendered.

> **Note**
>
> The [my-standalone-component-bootstrap.ts](../web-component-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component-bootstrap.ts) file is also added to `files` array in the [tsconfig.app.json](../web-component-ng16/mfe1-ng16/tsconfig.app.json). For this mfe1 app this actually isn't needed because we are testing the bootstrap function from the `my-standalone-component-bootstrap.ts` file as part of the mfe1 app. However, this is not necessary, which means that in the case where you don't have any reference to the file but you want to export it for the shell then you need to include it in the tsconfig `files` array. 
> 

## Shell app

The shell app is able to consume the web component exposed by the mfe1 app and display it. It consists of a single Angular module:
- the default [AppModule](/code-demos/web-component-ng16/shell-ng16/src/app/app.module.ts) created as part of doing `ng new`.

The shell app shows two ways to load the web component from a remote webpack module:
1) define a `my-mfe-element` element on the [app.component.html](/code-demos/web-component-ng16/shell-ng16/src/app/app.component.html) which means that when the web component is loaded it will be rendered on that element. The `ngOnInit` method on [app.component.ts](/code-demos/web-component-ng16/shell-ng16/src/app/app.component.ts) loads the web component from the remote and calls the bootstrap function.
2) use the [MyStandaloneComponentWrapper](/code-demos/web-component-ng16/shell-ng16/src/app/my-standalone-component-wrapper/my-standalone-component.component.ts) component to encapsulate the logic of loading the web component. Then add the `app-my-standalone-component-wrapper` selector for this wrapper component on the [app.component.html](/code-demos/web-component-ng16/shell-ng16/src/app/app.component.html).

> **Note**
>
> To use custom elements like the `my-mfe-element` and avoid Angular complaining that it doesn't know what it is, we make use of the `CUSTOM_ELEMENTS_SCHEMA` schema.
> 
> For the approach that uses the wrapper component you can see this added to the component schemas on the [MyStandaloneComponentWrapper](../web-component-ng16/shell-ng16/src/app/my-standalone-component-wrapper/my-standalone-component.component.ts).
>
> For the approach where we added the `my-mfe-element` element on the [app.component.html](../web-component-ng16/shell-ng16/src/app/app.component.html), we had to add the `CUSTOM_ELEMENTS_SCHEMA` schema to the [app module](../web-component-ng16/shell-ng16/src/app/app.module.ts) schemas.
>

> **Note**
>
> This is an example app and though you can mix the approaches to load a web component from a remote, you would either choose one of the presented approaches or implement a variation.

## Webpack module federation

The setup of webpack module federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)

## Web components 

### Watch out for

Beware of issues with styling when using web components. If styles from your Angular component that you have exposed as a Web Component using `@angular/elements` are bleeding out, then you might need to set your [ViewEncapsulation](https://angular.io/api/core/ViewEncapsulation) to `ViewEncapsulation.ShadowDom`, which uses the ShadowDOM specification, on the Angular component which is being passed to `createCustomElement`. 

In this example app, the `ViewEncapsulation` configuration would be applied to the [MyStandaloneComponent](/code-demos/web-component-ng16/mfe1-ng16/src/app/my-standalone-component/my-standalone-component.component.ts) component.

### Learn more

> **Warning**
>
> Some of the information on the links below might not be usable without a few tweaks on the latest versions of Angular. However the majority of the information and the concepts still hold true.
>

For more info on Angular elements and web components see:

- [MDN web docs on Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- [Micro Apps with Web Components using Angular Elements](https://www.angulararchitects.io/en/blog/micro-apps-with-web-components-using-angular-elements/)
- [Export Angular components as Custom Elements with Angular Elements](https://medium.com/vincent-ogloblinsky/export-angular-components-as-custom-elements-with-angular-elements-a2a0bfcd7f8a)
- [@angular-architects/module-federation-tools](https://www.npmjs.com/package/@angular-architects/module-federation-tools): this package provides helper functions and on this README page it also shows how to use the package to get web components and webpack module federation working.
- [How to use routing in Angular web components](https://medium.com/@timon.grassl/how-to-use-routing-in-angular-web-components-c6a76449cdb)
- [Getting to Know the createApplication API in Angular](https://netbasal.com/getting-to-know-the-createapplication-api-in-angular-f1c0a2685047)
- [Handling data with Web Components](https://itnext.io/handling-data-with-web-components-9e7e4a452e6e)
- [The Best Way To Lazy Load Angular Elements](https://tomastrajan.medium.com/the-best-way-to-lazy-load-angular-elements-97a51a5c2007): this talks about a library named [@angular-extensions/elements](https://angular-extensions.github.io/elements/home) to facilitate loading Angular elements. I haven't tried it and I also don't know if it works well with module federation. Still worth a reading. 
