import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import {
  RemoteModuleResultTypes,
  RemoteModuleService,
} from 'src/micro-frontends-tooling/remote-module.service';

// TODO explain the host: {} binding used in both checkout and payment load via ng on init
// used to avoid the error show at https://angular.io/errors/NG0912
// only needed because of the clash between the component loaded via ng on init and the resolver one
// The error only shows up in the first place because all the wrapper components use the same selector.
// Usually you don't need to use this host setting.

@Component({
  selector: 'app-checkout-mfe',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {'unique-description': 'checkout component loaded via ngOnInit'},
  template: '<mfe-checkout></mfe-checkout>',
})
export class CheckoutComponent implements OnInit {
  public constructor(private readonly _remoteModuleService: RemoteModuleService) {}

  public async ngOnInit(): Promise<void> {
    const result = await this._remoteModuleService.loadAsync(
      CheckoutComponent.name,
      './checkout',
      'http://localhost:4201/remoteEntry.js',
    );

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
}

export const MFE_CHECKOUT_ROUTES: Routes = [
  {
    path: '**',
    component: CheckoutComponent,
  },
];
