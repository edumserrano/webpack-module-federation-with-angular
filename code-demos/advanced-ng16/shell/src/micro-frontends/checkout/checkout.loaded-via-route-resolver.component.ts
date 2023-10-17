import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { remoteModuleResolver } from 'src/micro-frontends-tooling/remote-module.resolver';
import { CheckoutService } from './checkout.service';

@Component({
  selector: 'app-checkout-mfe',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <mfe-checkout
      [basketValue]="basketValue"
      (checkoutRequested)="checkoutHandler($event)">
    </mfe-checkout>
  `,
})
export class CheckoutComponent implements OnInit {

  public constructor(
    private readonly _route: ActivatedRoute,
    private readonly _checkoutService: CheckoutService,
  ) {}

  @Input()
  public basketValue?: string;

  @Output()
  public checkoutRequested: EventEmitter<string> = new EventEmitter<string>();

  public async ngOnInit(): Promise<void> {
    // TODO: note about the elementName on the directive matching the declared
    // custom element
    // TODO consider creating a type to define webpackModule.mountAsync instead of
    // using any? Does Zod help?
    // check how at https://sergiodxa.com/articles/using-zod-to-safely-read-env-variables
    // and https://jfranciscosousa.com/blog/validating-environment-variables-with-zod/
    const webpackModule: any = this._route.snapshot.data["remoteModule"];
    const elementName = "mfe-checkout";
    await webpackModule.mountAsync(elementName);
  }

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
    resolve: {
      remoteModule: remoteModuleResolver({
        id: CheckoutComponent.name,
        remoteEntry: "http://localhost:4201/remoteEntry.js",
        exposedModule: "./checkout",
      }),
    },
  },
]

