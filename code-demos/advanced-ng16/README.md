# advanced-ng16 code demo

- [Description](#description)
- [TODO](#todo)

## Description

## TODO

The mfe1 app will set the input of the `CheckoutComponent` to `555` and subscribe to the output of the component which logs to the console when the `Checkout` button is clicked. See [app.component.html](/code-demos/advanced-ng16/checkout/src/app/app.component.html). 


This means the subscription done by the dev platform of the component's output that logs to the console when the `Send message` is clicked, is not part of the exported component.

Explain the path ** https://angular.io/guide/router#setting-up-wildcard-routes:
> A well-functioning application should gracefully handle when users attempt to navigate to a part of your application that does not exist. To add this functionality to your application, you set up a wildcard route. The Angular router selects this route any time the requested URL doesn't match any router paths.
>


explain the directive:
- this is a simple yet flexible version, you could customize it as you see fit
note that the directive on the component-directive is made specifically to load angular components and even allow for passing the component input/outputs via the directive. This one you would use the loadRemoteModuleCallback to set them 
- The callback is the only way to have a directive that works well no matter how you
export the remote, as a web component/ng component/module. However the callback is not really necessary if using the events from the remote module service because we could subscribe to the loaded event and filter by the id we want.

explain the files in /src/micro-frontends-tooling


Explain the routing module and load-via-x components
- https://stackoverflow.com/questions/42094152/targeting-named-outlet-via-routerlink-adds-extraneous
- https://lukeliutingchun.medium.com/angular-introduction-to-named-router-outlet-and-a-hack-for-custom-url-6ca1cd11fd2a
- https://blog.devgenius.io/the-art-of-nested-router-outlets-in-angular-dafb38245a30
- https://angular.io/api/router/RouterLink#relative-link-paths


TALK ABOUT the fact that the same pattern about using wrappers/host components can be done using ng module or non-standalone component instead of standalone components exposed by the checkout and payment mfe. See other code demos.
Also the wrappers/hosts don't need to be standalone components:
```
Link/do code example of how a module for a component wrapper/host can be

// const getMicrofrontendBundleUrl = (frontendName: 'bookings') =>
//   `/frontends/${frontendName}/main.js`;

@NgModule({
  declarations: [
    MfeComponent
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '**',
        component: MfeComponent,
        // ADD ANY guard or resolver if needed
      },
    ]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Mfe1HostModule {}

```

talk about this warning
> checkout.loaded-via-route-resolver.component.ts:11  NG0912: Component ID generation collision detected. Components 'CheckoutComponent' and 'CheckoutComponent' with selector 'app-checkout-mfe' generated the same component ID. To fix this, you can change the selector of one of those components or add an extra host attribute to force a different ID. Find more at https://angular.io/errors/NG0912


Note about tsconfig.app.json:
```
Error: C:\dev\repos\edumserrano\webpack-module-federation-with-angular\code-demos\web-component-ng16\mfe1-ng16\src\app\my-standalone-component\my-standalone-component-bootstrap.ts is missing from the TypeScript compilation. Please make sure it is in your tsconfig via the 'files' or 'include' property.
``` 