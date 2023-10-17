# advanced-ng16 code demo

- [Description](#description)
- [TODO](#todo)

## Description

## TODO

The mfe1 app will set the input of the `CheckoutComponent` to `555` and subscribe to the output of the component which logs to the console when the `Checkout` button is clicked. See [app.component.html](/code-demos/advanced-ng16/checkout/src/app/app.component.html). 


This means the subscription done by the dev platform of the component's output that logs to the console when the `Send message` is clicked, is not part of the exported component.


When clicking on the `Checkout` button on the checkout component loaded using angular routing we get two alerts because code-demos\advanced-ng16\shell\src\app\app.component.ts has 2 subscriptions, one to the output on the HTML, one using the checkout events on the app.component.ts. This is only happening because this code demo is trying to show several things in one.