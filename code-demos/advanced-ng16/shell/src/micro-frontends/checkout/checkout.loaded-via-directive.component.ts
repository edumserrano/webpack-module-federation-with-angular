import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Routes } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RemoteModuleEvent } from 'src/micro-frontends-tooling/remote-module-events';
import { RemoteModuleDirective } from 'src/micro-frontends-tooling/remote-module.directive';
import { REMOTE_MODULE_EVENTS, RemoteModuleEvents } from 'src/micro-frontends-tooling/remote-module.service';
import { filter } from 'rxjs';
import { CheckoutService } from './checkout.service';

// TODO: note about not having an .html and using the templateUrl prop. if it's simple
// you can consider not having a separate file but usually it's better to have that and
// the styleUrls
// TODO: add note about naming checkout.<loaded via>.component.ts, this is not some kind of pattern, it's only
// a way to differentiate the different ways of loading remote modules

@Component({
  selector: 'app-checkout-mfe',
  standalone: true,
  imports: [RemoteModuleDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <mfe-checkout
      remoteModule
      [remoteModuleId]="remoteModuleId"
      exposedModule="./checkout"
      remoteEntry="http://localhost:4201/remoteEntry.js"
      [loadRemoteModuleCallback]="loadRemoteModuleHandler"
      [basketValue]="basketValue"
      (checkoutRequested)="checkoutHandler($event)"
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

  public readonly remoteModuleId: string = CheckoutComponent.name;

  public async loadRemoteModuleHandler(webpackModule: any): Promise<void> {
    // call whatever is needed to mount your mfe

    // TODO: note about the elementName on the directive matching the declared
    // custom element
    // TODO: explain that the handler doesn't need to be used, you could use
    // a subscription to the loaded event and pick up the webpack module from there
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

  // TODO talk about this example
  private subscribeToEvents(remoteModuleEvents$: RemoteModuleEvents): void {
    remoteModuleEvents$
      .pipe(
        takeUntilDestroyed(), // see https://indepth.dev/posts/1518/takeuntildestroy-in-angular-v16
        filter((event: RemoteModuleEvent) => event.id === CheckoutComponent.name),
      )
      .subscribe(x => {
        console.log("mfe-checkout remote module event:", x)
      })
  }
}

export const MFE_CHECKOUT_ROUTES: Routes = [
  {
    path: '**',
    component: CheckoutComponent,
  },
]
