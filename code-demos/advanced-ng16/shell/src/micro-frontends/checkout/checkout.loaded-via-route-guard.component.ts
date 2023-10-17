import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, Output } from '@angular/core';
import { Routes } from '@angular/router';
import { remoteModuleGuard } from 'src/micro-frontends-tooling/remote-module.guard';
import { CheckoutService } from './checkout.service';

@Component({
  selector: 'app-checkout-mfe',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <mfe-checkout
      [basketValue]="basketValue"
      (checkout-requested)="checkoutHandler($event)">
    </mfe-checkout>
  `,
})
export class CheckoutComponent {
  public constructor(private readonly _checkoutService: CheckoutService) {}

  @Input()
  public basketValue?: string;

  @Output()
  public checkoutRequested: EventEmitter<string> = new EventEmitter<string>();

  public checkoutHandler(event: Event): void {
    const checkoutEvent = event as CustomEvent<string>;
    const checkoutMessage= checkoutEvent.detail;

    // We don't need to both emit the checkout message and share it via
    // the checkout service. Usually, you would choose one of them depending
    // on how this mfe is used.
    //
    // Using the 'emit' function only allows the output to be consumed via
    // parent HTML elements, whilst using a service to share the data doesn't
    // have that limitation
    this.checkoutRequested.emit(checkoutMessage);
    this._checkoutService.triggerCheckoutRequested(checkoutMessage);
  }
}

export const MFE_CHECKOUT_ROUTES: Routes = [
  {
    path: '**',
    component: CheckoutComponent,
    canActivate: [
      remoteModuleGuard({
        id: CheckoutComponent.name,
        remoteEntry: "http://localhost:4201/remoteEntry.js",
        exposedModule: "./checkout-auto",
      })
    ],
  },
]
