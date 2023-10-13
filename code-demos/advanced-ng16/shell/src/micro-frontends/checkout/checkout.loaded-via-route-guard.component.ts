import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { Routes } from '@angular/router';
import { remoteModuleGuard } from 'src/micro-frontends-tooling/remote-module.guard';

@Component({
  selector: 'app-checkout-mfe',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<mfe-checkout></mfe-checkout>',
})
export class CheckoutComponent {}

export const MFE_CHECKOUT_ROUTES: Routes = [
  {
    path: '**',
    component: CheckoutComponent,
    canActivate: [
      remoteModuleGuard({
        remoteEntry: "http://localhost:4201/remoteEntry.js",
        exposedModule: "./checkout-auto",
      })
    ],
  },
]
