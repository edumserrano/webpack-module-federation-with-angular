import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { withRemoteModuleEventsHandler } from 'src/micro-frontends-tooling/with-remote-module-events-handler';
import { withNavigationErrorHandler } from 'src/micro-frontends-tooling/with-navigation-error-handler';
import { RemoteModuleEvent } from 'src/micro-frontends-tooling/remote-module-events';
import { LoadViaRoutingComponent } from './load-via-routing/load-via-routing.component';
import { LoadViaHtmlComponent } from './load-via-html/load-via-html.component';

// Here we are importing the components with an alias because all the micro-frontends
// wrappers for the checkout mfe are named CheckoutComponent and all the micro-frontends
// wrappers for the payment mfe are named PaymentComponent
//
// We're import the checkout.loaded-via-ng-on-init.component and payment.loaded-via-ng-on-init.component
// and we're using them on /advanced-ng16/shell/src/app/load-via-routing/load-via-routing.component.html
// but we could have done the same with any of the other wrapper components, there's nothing
// special about the `.loaded-via-ng-on-init.` wrapper components.
import { CheckoutComponent as CheckoutComponentViaNgOnInit } from 'src/micro-frontends/checkout/checkout.loaded-via-ng-on-init.component';
import { PaymentComponent as PaymentComponentViaNgOnInit } from 'src/micro-frontends/payment/payment.loaded-via-ng-on-init.component';

@NgModule({
  declarations: [
    AppComponent,
    LoadViaRoutingComponent,
    LoadViaHtmlComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CheckoutComponentViaNgOnInit,
    PaymentComponentViaNgOnInit,
  ],
  providers: [
    withNavigationErrorHandler((error) => {
      // TODO use inject and call some service
      console.log(`nav error handler: `, error);
    }),
    withRemoteModuleEventsHandler((event: RemoteModuleEvent) => {
      // TODO use inject and call some service
      console.log(`remote module events: `, event);
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
