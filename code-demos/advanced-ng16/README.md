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

The main goal of using an Angular wrapper component is to brige the gap between an externally loaded JavaScript module and your Angular app. The wrapper component contains all the necessary logic to load the mfe and expose any inputs and outputs required. From there on, you can reuse the wrapper component throughout your Angular app without worrying with the fact that it's actually an mfe app.

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

These are the core of the mfe tooling.

explain that you could augment the data on the events to include more helpful stuff like source and target elements, anything that you feel would help provide a better debug experience. The only "extra" field we added was id to be able to filter events for
specific components. The id should be unique.

### RemoteModuleDirective

explain the directive:
- this is a simple yet flexible version, you could customize it as you see fit
note that the directive on the component-directive is made specifically to load angular components and even allow for passing the component input/outputs via the directive. This one you would use the loadRemoteModuleCallback to set them 
- The callback is the only way to have a directive that works well no matter how you
export the remote, as a web component/ng component/module. However the callback is not really necessary if using the events from the remote module service because we could subscribe to the loaded event and filter by the id we want.


Still wondering if this callback should exist. The callback provides a quick way to
access the loaded webpack module in case you need to do further operations with it.
However, you can get access to the webpack module by subscribing to the
RemoteModuleEvents and filter by the id and RemoteModuleLoaded event. 
See subscribeToEvents method at advanced-ng16\shell\src\micro-frontends\checkout\checkout.loaded-via-directive.component.ts for an example.

Note that the callback can return Promise<void> or void and here we use the void return type
 
This directive can be used to load standalone, non-standalone/module, web component etc because the loadRemoteModuleCallback let's you do whatever code you want

### remoteModuleGuard

### remoteModuleResolver

### withRemoteModuleEventsHandler

the fact that this has multi true means you can use several instances of it. One can process the event for logging purposes, another can process the fail to load event and display an error popup.

// TODO use inject and call some service

### withNavigationErrorHandler

the fact that this has multi true means you can use several instances of it. One can process the event for logging purposes, another can process the error and navigate to an error page.

// TODO use inject and call some service

## Webpack Module Federation

The setup of Webpack Module Federation was done using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package, which aims to streamline the setup of Webpack Module Federation for Angular apps. For more info see [Basics of @angular-architects/module-federation npm package](/docs/basics-angular-architects.md).

Also, read the official docs at:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)

## Learn more

For more info see:

- [Web Component-based Micro Frontends with Angular](https://www.youtube.com/watch?v=ee17YczpCpU): great video showing how to structure your micro-frontend apps. This is where I first came across the idea of creating a wrapper component for mfe apps. In the video they don't use Webpack Module Federation but all the concepts shown are great and applicable when you're using Webpack Module Federation. The code for the video can be found at [fboeller/microfrontends-with-angular](https://github.com/fboeller/microfrontends-with-angular/tree/recording) on the `recording` branch.
- []()