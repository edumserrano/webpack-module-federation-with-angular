import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import {
  RemoteModuleLoadOptions,
  RemoteModuleResultTypes,
  RemoteModuleService,
} from 'src/micro-frontends-tooling/remote-module.service';

@Component({
  selector: 'app-checkout-mfe',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<mfe-checkout></mfe-checkout>',
})
export class CheckoutComponent implements OnInit {
  public constructor(private readonly _remoteModuleService: RemoteModuleService) {}

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
}

export const MFE_CHECKOUT_ROUTES: Routes = [
  {
    path: '**',
    component: CheckoutComponent,
  },
];
