import {
  Component,
  ComponentRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { remoteModuleDirective as RemoteModuleDirective } from 'src/micro-frontends-tooling/remote-module.directive';
import { Routes, provideRouter } from '@angular/router';

// loadRemoteModule
// exposedModule="./payment"
// remoteEntry="http://localhost:4202/remoteEntry.js"
// [loadRemoteModuleCallback]="loadRemoteModuleHandler"

// TODO: note about not having an .html and using the templateUrl prop. if it's simple you can consider not having a separate file but usually it's better to have that and the styleUrls
// TODO: add note about the `.bind(this)` at [loadRemoteModuleCallback]="loadRemoteModuleHandler.bind(this)"
//       say it's about the this context or else this._mfePaymentViewContainerRef is always undefined because this would refer to the LoadRemoteModuleDirective



export const MFE_PAYMENT_ROUTES: Routes = [
  {
    path: '**',
    loadComponent: async () => {
      const localModule = await import('../../micro-frontends/checkout/checkout.component');
      return localModule.CheckoutComponent;
    },
  },
]

@Component({
  selector: 'mfe-payment',
  standalone: true,
  imports: [CommonModule, RemoteModuleDirective],
  template: `
    <ng-container
      #mfePayment
      remoteModule
      exposedModule="./payment"
      remoteEntry="http://localhost:4202/remoteEntry.js"
      [loadRemoteModuleCallback]="loadRemoteModuleHandler.bind(this)"
    ></ng-container>
  `,
  styleUrls: [],
})
export class PaymentComponent {
  @ViewChild('mfePayment', { read: ViewContainerRef, static: true })
  private readonly _mfePaymentViewContainerRef?: ViewContainerRef;

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
  }

}
