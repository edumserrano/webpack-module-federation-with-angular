import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { withRemoteModuleEventsHandler } from 'src/micro-frontends-tooling/with-remote-module-events-handler';
import { withNavigationErrorHandler } from 'src/micro-frontends-tooling/with-navigation-error-handler';
import { RemoteModuleEvent } from 'src/micro-frontends-tooling/remote-module-events';
import { LoadViaRoutingComponent } from './load-via-routing/load-via-routing.component';
import { LoadViaHtmlComponent } from './load-via-html/load-via-html.component';
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
    CheckoutComponentViaNgOnInit, // TODO: explain the alias and why using the checkout.loaded-via-ng-on-init.component.ts
    PaymentComponentViaNgOnInit, // TODO: explain the alias and why using the payment.loaded-via-ng-on-init.component.ts
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
