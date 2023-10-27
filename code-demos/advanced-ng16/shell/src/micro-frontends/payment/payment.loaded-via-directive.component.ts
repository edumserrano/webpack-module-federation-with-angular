import {
  Component,
  ComponentRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  RemoteModuleDirective,
  RemoteModuleDirectiveOptions,
} from 'src/micro-frontends-tooling/remote-module.directive';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-payment-mfe',
  standalone: true,
  imports: [RemoteModuleDirective],
  template: `
    <ng-container
      #mfePayment
      remoteModule
      [remoteModuleoptions]="remoteModuleOptions",
      [loadRemoteModuleCallback]="loadRemoteModuleHandler.bind(this)"
    ></ng-container>
    <!--
    The '.bind' call used in 'loadRemoteModuleHandler.bind(this)' above is required
    to flow the 'this' context when the 'loadRemoteModuleHandler' method is executed.
    Otherwise when the 'this._mfePaymentViewContainerRef' line of the
    'loadRemoteModuleHandler' method is executed, the 'this' variable would be undefined.

    Alternatively to using the '.bind' method, you could implement the 'loadRemoteModuleHandler'
    as an arrow function. See commented out code below.

    For more info see "Understanding This, Bind, Call, and Apply in JavaScript":
    https://www.digitalocean.com/community/conceptual-articles/understanding-this-bind-call-and-apply-in-javascript
    -->
  `,
})
export class PaymentComponent {
  @ViewChild('mfePayment', { read: ViewContainerRef, static: true })
  private readonly _mfePaymentViewContainerRef?: ViewContainerRef;

  public readonly remoteModuleOptions: RemoteModuleDirectiveOptions = {
    id: PaymentComponent.name,
    type: "module",
    exposedModule: "./payment",
    remoteEntry: "http://localhost:4202/remoteEntry.js",
  };

  // On the HTML template above, instead of using the `bind` method on the
  // `loadRemoteModuleHandler.bind(this)` line, you could have just `loadRemoteModuleHandler`
  // if you declare it as an arrow function like this:
  //
  // public loadRemoteModuleHandler = async (webpackModule: any): Promise<void> => {
  //    // in here the `this` variable is not undefined and points
  //    // to the expected PaymentComponent instance so everything
  //    // works as intended.
  // }

  public loadRemoteModuleHandler(webpackModule: any): void {
    if (!this._mfePaymentViewContainerRef) {
      return;
    }

    this._mfePaymentViewContainerRef.clear();
    const paymentComponentType: Type<any> = webpackModule.PaymentComponent;
    const mfePaymentComponentRef: ComponentRef<any> = this._mfePaymentViewContainerRef.createComponent(paymentComponentType);
    // to set inputs use componentRef.setInput method
    // to subscribe to outputs use componentRef.instance.<output>.subscribe(...)
  }
}

export const MFE_PAYMENT_ROUTES: Routes = [
  {
    path: '**',
    component: PaymentComponent,
  },
]
