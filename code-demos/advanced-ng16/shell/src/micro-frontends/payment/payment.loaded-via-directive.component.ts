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

// TODO: add note about the `.bind(this)` at [loadRemoteModuleCallback]="loadRemoteModuleHandler.bind(this)"
//       say it's about the this context or else this._mfePaymentViewContainerRef is always undefined because this would refer to the LoadRemoteModuleDirective
// The `.bind` call is required to flow the `this` context
// when the `messageSentEventHandler` method is executed.
// Otherwise when the `this.messageSentEventAsJson` line was
// executed, the `this` variable would be undefined.
//
// For more info see "Understanding This, Bind, Call, and Apply in JavaScript":
// https://www.digitalocean.com/community/conceptual-articles/understanding-this-bind-call-and-apply-in-javascript

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

  // TODO use `bind(this)` on HTML or declare it as an arrow function like this
  // public loadRemoteModuleHandler = async (webpackModule: any): Promise<void> => {
  //   if (!this._mfePaymentViewContainerRef) {
  //     return;
  //   }

  //   this._mfePaymentViewContainerRef.clear();
  //   const paymentComponentType: Type<any> = webpackModule.PaymentComponent;
  //   const mfePaymentComponentRef: ComponentRef<any> = this._mfePaymentViewContainerRef.createComponent(paymentComponentType);
  // }

  // TODO note that the callback can return Promise<void> or void and here we use the void return type
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
