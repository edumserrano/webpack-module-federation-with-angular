# advanced-ng16 code demo

- [Description](#description)
- [How to run](#how-to-run)
- [Payment app](#payment-app)
  - [Exposed webpack module](#exposed-webpack-module)
  - [Dev platform](#dev-platform)
- [Checkout app](#checkout-app)
  - [Exposed webpack module](#exposed-webpack-module-1)
  - [Dev platform](#dev-platform-1)
- [Shell app](#shell-app)
  - [How to structure your micro frontends](#how-to-structure-your-micro-frontends)
- [Micro frontends tooling used by the shell](#micro-frontends-tooling-used-by-the-shell)
  - [RemoteModuleService and RemoteModuleEvent](#remotemoduleservice-and-remotemoduleevent)
  - [RemoteModuleDirective](#remotemoduledirective)
  - [remoteModuleGuard](#remotemoduleguard)
  - [remoteModuleResolver](#remotemoduleresolver)
  - [withRemoteModuleEventsHandler](#withremotemoduleeventshandler)
  - [withNavigationErrorHandler](#withnavigationerrorhandler)
- [Webpack Module Federation](#webpack-module-federation)
- [Learn more](#learn-more)

## Description

Unlike other demos in this repo, the focus of this demo is not about exploring an aspect of Webpack Module Federation. Instead, it focuses on showing how you can structure your shell app code in regards to loading micro frontend apps. Furthermore, this code demo provides an implementation of tooling that helps standardize how you load micro frontend apps in Angular as well as handle related errors. 

This code demo is named `advanced-ng16` because it requires some knowledge of Angular to properly understand the code. However, fear not because there are several explanations and references scattered throughout the code to help you out.

## How to run

1) Go to `/code-demos/advanced-ng16/shell` folder and run `npm i`, followed by `npm start`. This will start the shell app on http://localhost:4200.
2) Go to `/code-demos/advanced-ng16/checkout` folder and run `npm i`, followed by `npm start`. This will start the checkout app on http://localhost:4201.
3) Go to `/code-demos/advanced-ng16/payment` folder and run `npm i`, followed by `npm start`. This will start the payment app on http://localhost:4202.

## Payment app

The payment app is an Angular 16 app that contains an Angular standalone component named [PaymentComponent](/code-demos/advanced-ng16/payment/src/app/payment/payment.component.ts), which represents the micro frontend that we want to expose via Webpack Module Federation.

The payment app loads the `PaymentComponent` on page load.

### Exposed webpack module

On the [webpack configuration file for the payment app](/code-demos/advanced-ng16/payment/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
  "./payment": "./src/app/payment/payment.component.ts",
},
```

The above defines a webpack module that is named `payment` and that is mapped to the [./src/app/payment/payment.component.ts](/code-demos/advanced-ng16/payment/src/app/payment/payment.component.ts) Angular standalone component. 

### Dev platform

When you run the payment app you will see the text `mfe-payment dev platform`. This is to call out the fact that the payment app is not exposed in its entirety via Webpack Module Federation, only the `PaymentComponent` Angular standalone component is. Everything else in the payment app is there only with the sole purpose of supporting the local development of the payment app, more specifically, the development of the `PaymentComponent` Angular standalone component.

## Checkout app

The checkout app is an Angular 16 app that contains an Angular standalone component named [CheckoutComponent](/code-demos/advanced-ng16/checkout/src/app/checkout/checkout.component.ts), which represents the micro frontend that we want to expose via Webpack Module Federation.

The checkout app loads the `CheckoutComponent` on page load and sets the `basketValue` input to `555` as well as subscribes to the `checkout-requested` output which logs to the console when the `Checkout` button is clicked. See [app.component.html](/code-demos/advanced-ng16/checkout/src/app/app.component.html) and [app.component.ts](/code-demos/advanced-ng16/checkout/src/app/app.component.ts).

### Exposed webpack module

On the [webpack configuration file for the checkout app](/code-demos/advanced-ng16/checkout/webpack.config.js) you will find the declaration of the webpack modules to expose:

```
exposes: {
  "./checkout": "./src/app/checkout/remote-bootstrap.ts",
  "./checkout-auto": "./src/app/checkout/remote-bootstrap-auto.ts",
},
```

The above defines two webpack modules:

- one named `checkout` that is mapped to the [./src/app/checkout/remote-bootstrap.ts](/code-demos/advanced-ng16/checkout/src/app/checkout/remote-bootstrap.ts) file, which exposes a `mountAsync` function that converts the `CheckoutComponent` Angular standalone component to a Web component with the provided name.
- one named `checkout-auto` that is mapped to the [./src/app/checkout/remote-bootstrap-auto.ts](/code-demos/advanced-ng16/checkout/src/app/checkout/remote-bootstrap-auto.ts) file, which when loaded will automatically convert the `CheckoutComponent` Angular standalone component to a Web component named `mfe-checkout`.

> **Note**
>
> The checkout app exposes the same `CheckoutComponent` as a Web component in two sliglty different ways because each one enables a slightly different load scenario for the shell.
>

### Dev platform

When you run the checkout app you will see the text `mfe-checkout dev platform`. This is to call out the fact that the checkout app is not exposed in its entirety via Webpack Module Federation, only the code for the `CheckoutComponent` Angular standalone component and the function that converts the component to a Web component are. Everything else in the checkout app is there only with the sole purpose of supporting the local development of the checkout app, more specifically, the development of the `CheckoutComponent` Angular standalone component.

This means that the input value `555` for the `basketValue` set by the dev platform is not part of the exported component, neither is the subscription of the component's output that logs to the console when the `Checkout` button is clicked.

## Shell app

The shell app is an Angular 16 app that loads the components exposed by the payment and checkout apps in different ways:

- using the `OnInit` Angular lifecycle hook.
- using an Angular directive.
- using an Angular functional guard.
- using an Angular functional resolver.
- via HTML declaration.

The shell app consists of a couple of pages:

- one that uses Angular routing to load the mfe apps: see [app-routing.module.ts](/code-demos/advanced-ng16/shell/src/app/app-routing.module.ts) and [load-via-routing.component.html](/code-demos/advanced-ng16/shell/src/app/load-via-routing/load-via-routing.component.html). 
- one that loads the mfe apps via HTML declaration: see [app-routing.module.ts](/code-demos/advanced-ng16/shell/src/app/app-routing.module.ts) and [load-via-html.component.html](/code-demos/advanced-ng16/shell/src/app/load-via-html/load-via-html.component.html).

Use the `Go to MFEs loaded via routing page` and `Go to MFEs loaded via HTML page` buttons to explore the different ways the shell is loading the micro frontend apps.

> **Note** 
> 
> The shell app contains one [RouterOutlet](https://angular.io/api/router/RouterOutlet) at [app.component.html](./shell/src/app/app.component.html) and another at [load-via-routing.component.html](./shell/src/app/load-via-routing/load-via-routing.component.html). To understand how nested routers work see [The Art of Nested Router Outlets in Angular](https://blog.devgenius.io/the-art-of-nested-router-outlets-in-angular-dafb38245a30).
> 

### How to structure your micro frontends

This code demo creates a wrapper Angular standalone component for each micro frontend app. See the [/advanced-ng16/shell/src/micro-frontends folder](/code-demos/advanced-ng16/shell/src/micro-frontends/). Because this is a demo app, each micro frontend app has several wrapper components where each one shows a different way to load the mfe into the wrapper Angular component.

The payment component has the following wrappers:

- [payment.loaded-via-ng-on-init.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/payment/payment.loaded-via-ng-on-init.component.ts)
- [payment.loaded-via-directive.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/payment/payment.loaded-via-directive.component.ts)
- [payment.loaded-via-route-resolver.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/payment/payment.loaded-via-route-resolver.component.ts)

The checkout component has the following wrappers:

- [checkout.loaded-via-ng-on-init.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/checkout/checkout.loaded-via-ng-on-init.component.ts)
- [checkout.loaded-via-directive.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/checkout/checkout.loaded-via-directive.component.ts)
- [checkout.loaded-via-route-resolver.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/checkout/checkout.loaded-via-route-resolver.component.ts)
- [checkout.loaded-via-route-guard.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/checkout/checkout.loaded-via-route-guard.component.ts)

The main goal of using an Angular wrapper component is to bridge the gap between an externally loaded JavaScript module and your Angular app. The wrapper component contains all the necessary logic to load the mfe and expose any inputs and outputs required. From there on, you can reuse the wrapper component throughout your Angular app without worrying with the fact that it's actually an mfe app.

Let's also talk about a few points regarding the implementation of the wrapper components:

- all the wrapper components were placed in the same `/shell/src/micro-frontends` folder but you can organize them however you want.
- even though the wrapper components are all Angular standalone components, you could do the same with non-standalone components, it just requires a bit more code because you need to create an Angular feature module for each wrapper component as well. Here's an example of how an Angular module could look like for the `checkout.loaded-via-ng-on-init.component.ts` if it wasn't a standalone component:

```ts
@NgModule({
  declarations: [
    CheckoutComponent
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '**',
        component: CheckoutComponent,
      },
    ]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CheckoutHostModule {}
```

- the html for the wrapper components is so simple that it's declared inline. This is also just a choice, you can have a separate `.html` file for the wrapper components just as you normally do for any Angular component.
- the naming of the wrapper components includes a description of how the wrapper component is loading the remote mfe. This is done just for demo purposes and because we're loading the same mfe in different ways. Usually you'd only do it in one way and therefore you'd name the wrapper component something like `checkout.component.ts` instead of `checkout.<loaded via>.component.ts`.
- the wrapper components implemented in this code demo might look a bit complex because they are using the tooling from the [micro-frontends-tooling folder](/code-demos/advanced-ng16/shell/src/micro-frontends-tooling) but you can create one very easily just by using the functions from the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package. Take this example of a wrapper for the checkout mfe:

```ts
import { LoadRemoteModuleOptions, loadRemoteModule } from '@angular-architects/module-federation';

export class CheckoutComponent implements OnInit {

  public async ngOnInit(): Promise<void> {
    // provide the correct remote module options for your mfe
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'module',
      exposedModule: './checkout',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
    };
    // load the remote webpack module
    const webpackModule: any = await loadRemoteModule(loadRemoteWebpackModuleOptions);
    // if required do further operations to mount your webpack module
    // into the DOM and pass in any inputs or subscribe to any outputs
    const elementName = "mfe-checkout";
    await webpackModule.mountAsync(elementName);
  }
}
```

> **Note**
> 
> There isn't an example of loading the `payment` component using a functional guard because that requires an exposed module that when imported will register a Web component and, although we could mimic what was done on the checkout app, the payment app does not expose a module like that.
>

> **Note**
> 
> You can ignore the following console warning:
> 
> `Component ID generation collision detected. Components '<component name>' and '<component name>' with selector '<selector>' generated the same component ID. To fix this, you can change the selector of one of those components or add an extra host attribute to force a different ID. Find more at https://angular.io/errors/NG0912`
>
> This happens because this code demo is using the same selector for all the checkout and payment wrapper components.
>

## Micro frontends tooling used by the shell

The shell contains a set of utilities that can be reused to load remote JavaScript modules exposed via Webpack Module Federation. See the [advanced-ng16/shell/src/micro-frontends-tooling folder](/code-demos/advanced-ng16/shell/src/micro-frontends-tooling). 

The following sections provide a detailed description for each of the utilities.

### RemoteModuleService and RemoteModuleEvent

These are the core of the mfe tooling. The [RemoteModuleService](/code-demos/advanced-ng16/shell/src/micro-frontends-tooling/remote-module.service.ts) builds on top of the `loadRemoteModule` from the `@angular-architects/module-federation` npm package and besides loading a remote JS module it triggers events for when the remote is loading, for when it has loaded and for when it fails to load. See [RemoteModuleEvent](/code-demos/advanced-ng16/shell/src/micro-frontends-tooling/remote-module-events.ts).

When using the `RemoteModuleService`, you can subscribe to the `RemoteModuleEvent` events by using the `REMOTE_MODULE_EVENTS` injection token. See example at [checkout.loaded-via-directive.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/checkout/checkout.loaded-via-directive.component.ts). You can use these events for things like:

- show a loading indicator whilst the remote is being fetched.
- hide a loading indicator when the remote has been loaded.
- show an error message to the user if the remote has failed to load.
- implement some retry logic if the remote has failed to load.
- logging about the remotes when in development mode.
- etc.

The `RemoteModuleEvent` events contains an `id` property which is provided when invoking the `RemoteModuleService.loadAsync` method. This `id` should be unique among the entire application because it's a way to easily filter on the `RemoteModuleEvent` events for a specific remote JS module. Note the `filter((event: RemoteModuleEvent) => event.id === CheckoutComponent.name)` in the example usage at [checkout.loaded-via-directive.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/checkout/checkout.loaded-via-directive.component.ts).

### RemoteModuleDirective

The [RemoteModuleDirective](/code-demos/advanced-ng16/shell/src/micro-frontends-tooling/remote-module.directive.ts) provides a way to load remote JS modules using an Angular directive. See example usages at:

- [checkout.loaded-via-directive.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/checkout/checkout.loaded-via-directive.component.ts)
- [payment.loaded-via-directive.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/payment/payment.loaded-via-directive.component.ts)

The directive takes two inputs:

- `remoteModuleoptions`: required input with the data needed to load a remote JS module.
- `loadRemoteModuleCallback`: optional input where you can define a function that takes in the loaded JS module so that you can do further operations with it if required.

The `RemoteModuleDirective` also produces `RemoteModuleEvent` events because it uses the `RemoteModuleService`.

> **Note**
>
> The `loadRemoteModuleCallback` input could be deleted from the Angular directive as one can use the `RemoteModuleEvent` events to get the same functionality by subscribing to them and then filtering by the `RemoteModuleLoaded` event with the `id` used in the `remoteModuleoptions` input.
>
> The `loadRemoteModuleCallback` is really just a shortcut for this.
> 

### remoteModuleGuard

The [remoteModuleGuard](/code-demos/advanced-ng16/shell/src/micro-frontends-tooling/remote-module.guard.ts) provides a way to load remote JS modules using an Angular functional guard. See example usage at [checkout.loaded-via-route-guard.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/checkout/checkout.loaded-via-route-guard.component.ts).

This guard is meant to be used with the [canActivate](https://angular.io/api/router/CanActivateFn) property of an Angular route and it will only let the navigation proceed to the route if the remote JS module is loaded successfully. Otherwise, if the remote JS module fails to load then the route is not activated.

This guard is only useful if the remote JS module that you are loading doesn't need any extra processing to get the mfe mounted into the DOM. For instance, when the remote module is a piece of code that registers a Web component when loaded. In this case, there's no further processing required on top of the loaded remote JS module, you'd only need to use the Web component tag on the HTML and the mfe will be mounted there. An example of this is the remote exposed by [remote-bootstrap-auto.ts](/code-demos/advanced-ng16/checkout/src/app/checkout/remote-bootstrap-auto.ts) and the shell consuming it at [checkout.loaded-via-route-guard.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/checkout/checkout.loaded-via-route-guard.component.ts).

The `remoteModuleGuard` guard also produces `RemoteModuleEvent` events because it uses the `RemoteModuleService`.

### remoteModuleResolver

The [remoteModuleResolver](/code-demos/advanced-ng16/shell/src/micro-frontends-tooling/remote-module.resolver.ts) provides a way to load remote JS modules using an Angular functional resolver. See example usages at:

- [checkout.loaded-via-route-guard.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/checkout/checkout.loaded-via-route-resolver.component.ts).
- [payment.loaded-via-route-resolver.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/payment/payment.loaded-via-route-resolver.component.ts).

This resolver is meant to be used with the [resolve](https://angular.io/api/router/ResolveFn) property of an Angular route and it will only let the navigation proceed to the route if the remote JS module is loaded successfully. Otherwise, if the remote JS module fails to load then a [RemoteModuleResolverError](/code-demos/advanced-ng16/shell/src/micro-frontends-tooling/remote-module.resolver.ts) error is thrown and the navigation is aborted.

Furthermore, and this is the main difference between the `remoteModuleGuard` and the `remoteModuleResolver`, when the resolver is able to load the remote JS module it makes the module available in the route data via the `remoteModule` key. This allows you to do further operations using the remote module in order to initialize it and mount it to the DOM. Note the `const webpackModule: any = this._route.snapshot.data["remoteModule"];` line and follow up lines in the [payment.loaded-via-route-resolver.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/payment/payment.loaded-via-route-resolver.component.ts). 

The `remoteModuleResolver` resolver also produces `RemoteModuleEvent` events because it uses the `RemoteModuleService`.

### withRemoteModuleEventsHandler

The [withRemoteModuleEventsHandler](/code-demos/advanced-ng16/shell/src/micro-frontends-tooling/with-remote-module-events-handler.ts) provides a way to setup global handlers for the `RemoteModuleEvent` events. See usage at [app.module.ts](/code-demos/advanced-ng16/shell/src/app/app.module.ts) where this handler is used to log the events to the console when the shell is running in development mode.

You can provide multiple instances of the `withRemoteModuleEventsHandler` provider in the `providers` array of an Angular [module](https://angular.io/guide/architecture-modules)/[bootstrapApplication](https://angular.io/api/platform-browser/bootstrapApplication) and separate the behavior each instance is responsible for. 

You can use this to centralize app behaviors for:

- showing loading indications whilst the remote is being fetched.
- hiding loading indications when the remote has been loaded.
- showing errors if the remote has failed to load.
- retries if the remote has failed to load.
- logging about the remotes when in development mode.
- etc

### withNavigationErrorHandler

The [withNavigationErrorHandler](/code-demos/advanced-ng16/shell/src/micro-frontends-tooling/with-navigation-error-handler.ts) provides a way to setup global handlers for when Angular navigation fails and the Angular router emits a `NavigationError` event. See usage at [app.module.ts](/code-demos/advanced-ng16/shell/src/app/app.module.ts) where this handler is used to log the errors to the console when the shell is running in development mode.

You can provide multiple instances of the `withNavigationErrorHandler` provider in the `providers` array of an Angular [module](https://angular.io/guide/architecture-modules)/[bootstrapApplication](https://angular.io/api/platform-browser/bootstrapApplication) and separate the behavior each instance is responsible for. 

You can use this to centralize app behaviors, like showing an error message, when a navigation fails.

> **Note**
> 
> To simulate a navigation error and trigger the `withNavigationErrorHandler` function go to [payment.loaded-via-route-resolver.component.ts](/code-demos/advanced-ng16/shell/src/micro-frontends/payment/payment.loaded-via-route-resolver.component.ts) and change the `exposedModule: "./payment"` to `exposedModule: "./i-dont-exist"`. Then try to load this component:
>
> - click the `Go to MFEs loaded via routing page` link.
> - click the `Load payment mfe via a route resolver` link.
> - see the `navigation error handler` log in the console. 
>

> **Note**
> 
> This implementation is essentially a copy of the [withNavigationErrorHandler](https://github.com/angular/angular/blob/c2b1a242e8db0ef8e03f7ee85ffa1f82562fd735/packages/router/src/provide_router.ts#L637-L652) router feature that can be used when using Angular standalone components. See [Simplifying Navigation Error Handling with Angular’s Upcoming Feature](https://medium.com/@artur.fedotiew/%EF%B8%8F-simplifying-navigation-error-handling-with-angulars-upcoming-feature-%EF%B8%8F-b55ee04d246a).
>

## Webpack Module Federation

The setup of Webpack Module Federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package, which aims to streamline the setup of Webpack Module Federation for Angular apps. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)

## Learn more

For more info see:

- :star: [Web Component-based Micro Frontends with Angular](https://www.youtube.com/watch?v=ee17YczpCpU): great video showing how to structure your micro-frontend apps. This is where I first came across the idea of creating a wrapper component for mfe apps. In the video they don't use Webpack Module Federation but all the concepts shown are great and applicable when you're using Webpack Module Federation. The code for the video can be found at [fboeller/microfrontends-with-angular](https://github.com/fboeller/microfrontends-with-angular/tree/recording) on the `recording` branch.
- [InjectionToken Angular docs](https://angular.io/api/core/InjectionToken)
- [The Hidden Power of InjectionToken Factory Functions in Angular](https://netbasal.com/the-hidden-power-of-injectiontoken-factory-functions-in-angular-d42d5575859b)
- [Provide function with InjectionToken in Angular](https://gist.github.com/eneajaho/28c4ef1d75bf1d8733cec23e54068c0a)
- [Functional Route Guards in Angular](https://medium.com/ngconf/functional-route-guards-in-angular-8829f0e4ca5c)
- [Understanding Angular Resolvers](https://itnext.io/understanding-angular-resolvers-b49f6c227278)
- [How To Use Route Resolvers with Angular Router](https://www.digitalocean.com/community/tutorials/angular-route-resolvers)
- [Tutorial on how to implement the Resolver in Angular](https://medium.com/@sandakova.varvara/https-indepth-dev-tutorials-angular-indepth-guide-how-to-implement-resolver-in-angular-13b8005e93b9#:~:text=Resolver%20is%20just%20a%20simple,per%20route%20as%20you%20want.)
- [Angular Router Standalone APIs](https://angularexperts.io/blog/angular-router-standalone-apis)
- [Working with providers in Angular](https://sergeygultyayev.medium.com/working-with-providers-in-angular-eeb493151446) 