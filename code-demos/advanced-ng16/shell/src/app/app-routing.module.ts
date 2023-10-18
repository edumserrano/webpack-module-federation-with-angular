import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadViaRoutingComponent } from './load-via-routing/load-via-routing.component';
import { LoadViaHtmlComponent } from './load-via-html/load-via-html.component';

// Passing the basketValue input to the checkout component using the route data
// works because the bindToComponentInputs option is set to true below
// For more info see:
// - https://angular.io/api/router/ExtraOptions
// - https://indepth.dev/posts/1519/router-data-as-components-inputs-in-angular-v16
// - https://www.freecodecamp.org/news/use-input-for-angular-route-parameters/
// - https://itnext.io/bind-route-info-to-component-inputs-new-router-feature-1d747e559dc4
export const routes: Routes = [
  {
    path: 'mfes-via-html',
    component: LoadViaHtmlComponent,
  },
  {
    path: 'mfes-via-routing',
    component: LoadViaRoutingComponent,
    children: [
      {
        path: 'checkout-via-ng-on-init',
        loadChildren: () =>
          import('../micro-frontends/checkout/checkout.loaded-via-ng-on-init.component')
            .then((m) => m.MFE_CHECKOUT_ROUTES),
        data: {
          basketValue: '123',
        },
      },
      {
        path: 'checkout-via-directive',
        loadChildren: () =>
          import(
            '../micro-frontends/checkout/checkout.loaded-via-directive.component'
          ).then((m) => m.MFE_CHECKOUT_ROUTES),
        data: {
          basketValue: '123',
        },
      },
      {
        path: 'checkout-via-route-resolver',
        loadChildren: () =>
          import(
            '../micro-frontends/checkout/checkout.loaded-via-route-resolver.component'
          ).then((m) => m.MFE_CHECKOUT_ROUTES),
        data: {
          basketValue: '123',
        },
      },
      {
        path: 'checkout-via-route-guard',
        loadChildren: () =>
          import(
            '../micro-frontends/checkout/checkout.loaded-via-route-guard.component'
          ).then((m) => m.MFE_CHECKOUT_ROUTES),
        data: {
          basketValue: '123',
        },
      },
      {
        path: 'payment-via-ng-on-init',
        loadChildren: () =>
          import(
            '../micro-frontends/payment/payment.loaded-via-ng-on-init.component'
          ).then((m) => m.MFE_PAYMENT_ROUTES),
      },
      {
        path: 'payment-via-directive',
        loadChildren: () =>
          import(
            '../micro-frontends/payment/payment.loaded-via-directive.component'
          ).then((m) => m.MFE_PAYMENT_ROUTES),
      },
      {
        path: 'payment-via-route-resolver',
        loadChildren: () =>
          import(
            '../micro-frontends/payment/payment.loaded-via-route-resolver.component'
          ).then((m) => m.MFE_PAYMENT_ROUTES),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
