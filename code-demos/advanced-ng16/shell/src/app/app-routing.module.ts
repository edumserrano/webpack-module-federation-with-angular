import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  // TODO set input and bind outputs for the checkout component demos
  {
    path: 'checkout-via-ng-on-init',
    loadChildren: () =>
      import('../micro-frontends/checkout/checkout.loaded-via-ng-on-init.component')
        .then(m => m.MFE_CHECKOUT_ROUTES),
  },
  {
    path: 'checkout-via-directive',
    loadChildren: () =>
      import('../micro-frontends/checkout/checkout.loaded-via-directive.component')
        .then(m => m.MFE_CHECKOUT_ROUTES),
  },
  {
    path: 'checkout-via-route-resolver',
    loadChildren: () =>
      import('../micro-frontends/checkout/checkout.loaded-via-route-resolver.component')
        .then(m => m.MFE_CHECKOUT_ROUTES),
  },
  {
    path: 'checkout-via-route-guard',
    loadChildren: () =>
      import('../micro-frontends/checkout/checkout.loaded-via-route-guard.component')
        .then(m => m.MFE_CHECKOUT_ROUTES),
  },
  {
    path: 'payment-via-ng-on-init',
    loadChildren: () =>
      import('../micro-frontends/payment/payment.loaded-via-ng-on-init.component')
        .then(m => m.MFE_PAYMENT_ROUTES),
  },
  {
    path: 'payment-via-directive',
    loadChildren: () =>
      import('../micro-frontends/payment/payment.loaded-via-directive.component')
        .then(m => m.MFE_PAYMENT_ROUTES),
  },
  {
    path: 'payment-via-route-resolver',
    loadChildren: () =>
      import('../micro-frontends/payment/payment.loaded-via-route-resolver.component')
        .then(m => m.MFE_PAYMENT_ROUTES),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
