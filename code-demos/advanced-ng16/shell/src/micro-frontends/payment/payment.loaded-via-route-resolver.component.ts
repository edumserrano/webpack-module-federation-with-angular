import {
  Component,
  ComponentRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { remoteModuleResolver } from 'src/micro-frontends-tooling/remote-module.resolver';

@Component({
  selector: 'app-payment-mfe',
  standalone: true,
  template: '<ng-container #mfePayment></ng-container>',
})
export class PaymentComponent {
  @ViewChild('mfePayment', { read: ViewContainerRef, static: true })
  private readonly _mfePaymentViewContainerRef?: ViewContainerRef;

  public constructor(private readonly _route: ActivatedRoute) {}

  public async ngOnInit(): Promise<void> {
    if (!this._mfePaymentViewContainerRef) {
      return;
    }

    this._mfePaymentViewContainerRef.clear();
    const webpackModule: any = this._route.snapshot.data["remoteModule"];
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
    resolve: {
      remoteModule: remoteModuleResolver({
        id: PaymentComponent.name,
        type: "module",
        remoteEntry: "http://localhost:4202/remoteEntry.js",
        exposedModule: "./payment",
      }),
    },
  },
]
