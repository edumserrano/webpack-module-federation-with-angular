import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Routes } from '@angular/router';
import {
  LoadRemoteModuleOptionsExtended,
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
      (checkout-requested)="checkoutHandler($event)">
    </mfe-checkout>
  `,
})
export class CheckoutComponent implements OnInit {
  public constructor(
    private readonly _remoteModuleService: RemoteModuleService,
    private readonly _checkoutService: CheckoutService,
  ) {}

  @Input()
  public basketValue?: string;

  @Output()
  public checkoutRequested: EventEmitter<string> = new EventEmitter<string>();

  public async ngOnInit(): Promise<void> {
    const loadRemoteModuleOptions: LoadRemoteModuleOptionsExtended = {
      id: CheckoutComponent.name,
      type: 'module',
      exposedModule: './checkout',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
    };
    const result = await this._remoteModuleService.loadAsync(loadRemoteModuleOptions);
    switch (result.type) {
      case RemoteModuleResultTypes.Loaded:
        // The elementName variable passed into `mountAsync` determines the name of the
        // custom element that is created. This needs to match the custom element that we
        // use on the html template above <mfe-checkout></mfe-checkout>
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
    //
    // Alternatively, you could use an event bus as shown in the
    // communication-event-bus-ng16 code demo.
    this.checkoutRequested.emit(checkoutMessage);
    this._checkoutService.triggerCheckoutRequested(checkoutMessage);
  }
}

export const MFE_CHECKOUT_ROUTES: Routes = [
  {
    path: '**', // https://angular.io/guide/router#setting-up-wildcard-routes
    component: CheckoutComponent,
  },
];
