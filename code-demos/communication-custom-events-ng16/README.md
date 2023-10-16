# communication-custom-events-ng16 code demo

- [Description](#description)
- [TODO](#todo)

## Description

## TODO


explain that this is based on the web-components-ng16 example. Check those docs to understand more about the solution setup. This readme will focus on the custom events/communication. (does it talk about the tsconfig.app.json referene to bootstrap file)
explain the bubble up, angular outputs conversion, manual dispatch etc

add code comments or explain in the readme that im not sure what's best in terms of just using the manual custom event or leave both the manual one and the output one.

talk about the host1 -> host2/mfe2 -> mfe3 scenario where:
- on host1 you want to listen from custom event from mfe3 and then you either
  - propagate and re-expose the event from mfe3 on the mfe2 app. Then the host1 can subscribe to that event on the mfe2 app
  - use a manual custom event with bubble up and then you can listen to it on host1


https://medium.com/angular-in-depth/how-angular-elements-uses-custom-events-mechanism-to-transmit-components-outputs-outside-angular-7b469386f6e2
https://blog.davidjs.com/2018/02/angular-custom-event-bubbling/
https://itnext.io/handling-data-with-web-components-9e7e4a452e6e
https://stackoverflow.com/questions/43061417/how-to-listen-for-custom-events-defined-web-component
https://www.youtube.com/watch?v=hIv22aTl3-g
https://blog.bitsrc.io/different-patterns-in-communicating-between-web-components-7ac52771aeb8


https://github.com/angular/angular/issues/39489
https://github.com/angular/angular/blob/229331e11b6c214f74c9801aa52eb9cd47d7fc76/packages/elements/src/create-custom-element.ts



The mfe1 app will [set the input](/code-demos/communication-custom-events-ng16/mfe1-ng16/src/app/app-routing.module.ts) of the `MyStandaloneComponent` to `test input value from dev platform` and [subscribe to the output of the component](/code-demos/communication-custom-events-ng16/mfe1-ng16/src/app/app.component.ts) which logs to the console when the `Send message` button is clicked.


This means the subscription done by the dev platform of the component's output that logs to the console when the `Send message` is clicked, is not part of the exported component.

