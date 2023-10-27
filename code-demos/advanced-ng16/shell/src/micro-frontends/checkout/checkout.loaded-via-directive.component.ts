import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { Routes } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RemoteModuleEvent } from 'src/micro-frontends-tooling/remote-module-events';
import {
  RemoteModuleDirective,
  RemoteModuleDirectiveOptions,
} from 'src/micro-frontends-tooling/remote-module.directive';
import {
  REMOTE_MODULE_EVENTS,
  RemoteModuleEvents,
} from 'src/micro-frontends-tooling/remote-module.service';
import { filter } from 'rxjs';
import { CheckoutService } from './checkout.service';

@Component({
  selector: 'app-checkout-mfe',
  standalone: true,
  imports: [RemoteModuleDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <mfe-checkout
      remoteModule
      [remoteModuleoptions]="remoteModuleOptions"
      [loadRemoteModuleCallback]="loadRemoteModuleHandler"
      [basketValue]="basketValue"
      (checkout-requested)="checkoutHandler($event)"
    ></mfe-checkout>
  `,
})
export class CheckoutComponent {

  public constructor(
    @Inject(REMOTE_MODULE_EVENTS) remoteModuleEvents$: RemoteModuleEvents,
    private readonly _checkoutService: CheckoutService,
  ) {
    this.subscribeToEvents(remoteModuleEvents$);
  }

  @Input()
  public basketValue?: string;

  @Output()
  public checkoutRequested: EventEmitter<string> = new EventEmitter<string>();

  public readonly remoteModuleOptions: RemoteModuleDirectiveOptions = {
    id: CheckoutComponent.name,
    type: "module",
    exposedModule: "./checkout",
    remoteEntry: "http://localhost:4201/remoteEntry.js",
  };

  // This handler isn't the only way to invoke the code on the remote module.
  // We could have done the same code by subscribing to the RemoteModuleLoaded
  // event. See the commented out code on the subscribeToEvents method below.
  //
  // The advantage of using this handler from the RemoteModuleDirective is that
  // you don't need to subscribe to the RemoteModuleEvents and filter by this
  // component and the RemoteModuleLoaded event.
  public async loadRemoteModuleHandler(webpackModule: any): Promise<void> {
    // here we call whatever is needed to mount the mfe

    // The elementName variable passed into `mountAsync` determines the name of the
    // custom element that is created. This needs to match the custom element that we
    // use on the html template above <mfe-checkout></mfe-checkout>
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
    // have that limitation.
    this.checkoutRequested.emit(checkoutMessage);
    this._checkoutService.triggerCheckoutRequested(checkoutMessage);
  }

  private subscribeToEvents(remoteModuleEvents$: RemoteModuleEvents): void {
    remoteModuleEvents$
      .pipe(
        takeUntilDestroyed(), // see https://indepth.dev/posts/1518/takeuntildestroy-in-angular-v16
        filter((event: RemoteModuleEvent) => event.id === CheckoutComponent.name),
      )
      .subscribe(remoteModuleEvent => {
        console.log("mfe-checkout remote module event:", remoteModuleEvent);

        // The code below could replace the loadRemoteModuleHandler method above.
        //
        // if(remoteModuleEvent instanceof RemoteModuleLoaded) {
        //   const elementName = "mfe-checkout";
        //   await remoteModuleEvent.webpackModule.mountAsync(elementName);
        // }
      })
  }
}

export const MFE_CHECKOUT_ROUTES: Routes = [
  {
    path: '**',
    component: CheckoutComponent,
  },
]
