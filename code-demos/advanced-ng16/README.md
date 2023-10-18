# advanced-ng16 code demo

- [Description](#description)
- [TODO](#todo)

## Description

## TODO

The mfe1 app will set the input of the `CheckoutComponent` to `555` and subscribe to the output of the component which logs to the console when the `Checkout` button is clicked. See [app.component.html](/code-demos/advanced-ng16/checkout/src/app/app.component.html). 


This means the subscription done by the dev platform of the component's output that logs to the console when the `Send message` is clicked, is not part of the exported component.


- https://stackoverflow.com/questions/42094152/targeting-named-outlet-via-routerlink-adds-extraneous
- https://lukeliutingchun.medium.com/angular-introduction-to-named-router-outlet-and-a-hack-for-custom-url-6ca1cd11fd2a
- https://blog.devgenius.io/the-art-of-nested-router-outlets-in-angular-dafb38245a30
- https://angular.io/api/router/RouterLink#relative-link-paths