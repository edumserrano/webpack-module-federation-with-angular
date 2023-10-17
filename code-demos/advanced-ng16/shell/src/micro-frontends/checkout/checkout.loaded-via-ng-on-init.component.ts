import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Routes } from '@angular/router';
import {
  RemoteModuleLoadOptions,
  RemoteModuleResultTypes,
  RemoteModuleService,
} from 'src/micro-frontends-tooling/remote-module.service';
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
    private readonly _remoteModuleService: RemoteModuleService,
    private readonly _checkoutService: CheckoutService,
  ) {}

  // TODO: the inputs and outputs are made available in the wrapper component
  // so that they can be used on the app. This wrapper component is the contract
  // to use with the app
  @Input()
  public basketValue?: string;

  @Output()
  public checkoutRequested: EventEmitter<string> = new EventEmitter<string>();

  // TODO explain in readme that a simple version of a wrapper could be like this
  // add the imports as well
  // public async ngOnInit(): Promise<void> {
  //   const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
  //     type: 'module',
  //     exposedModule: './checkout',
  //     remoteEntry: 'http://localhost:4201/remoteEntry.js',
  //   };
  //   const webpackModule: any = await loadRemoteModule(loadRemoteWebpackModuleOptions);
  //   const elementName = "mfe-checkout";
  //   await webpackModule.mountAsync(elementName);
  // }

  public async ngOnInit(): Promise<void> {
    const remoteModuleLoadOptions: RemoteModuleLoadOptions = {
      id: CheckoutComponent.name,
      exposedModule: './checkout',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
    };
    const result = await this._remoteModuleService.loadAsync(remoteModuleLoadOptions);
    switch (result.type) {
      case RemoteModuleResultTypes.Loaded:
        const elementName = "mfe-checkout";
        await result.webpackModule.mountAsync(elementName);
        break;
      case RemoteModuleResultTypes.Failed:
        console.log('failed loading mfe-checkout:', result.error);
        break;
      default:
        // see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
        const _exhaustiveCheck: never = result;
        return _exhaustiveCheck;
    }
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
  },
];
