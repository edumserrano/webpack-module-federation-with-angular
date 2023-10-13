import {
  Component,
  ComponentRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Routes } from '@angular/router';
import { RemoteModuleResultTypes, RemoteModuleService } from 'src/micro-frontends-tooling/remote-module.service';

@Component({
  selector: 'app-payment-mfe',
  standalone: true,
  template: `
    <ng-container #mfePayment></ng-container>
  `,
})
export class PaymentComponent {
  @ViewChild('mfePayment', { read: ViewContainerRef, static: true })
  private readonly _mfePaymentViewContainerRef?: ViewContainerRef;

  public constructor(private readonly _remoteModuleService: RemoteModuleService) {}

  public async ngOnInit(): Promise<void> {
    if (!this._mfePaymentViewContainerRef) {
      return;
    }

    const result = await this._remoteModuleService.loadAsync(
      './payment',
      'http://localhost:4202/remoteEntry.js',
    );

    switch (result.type) {
      case RemoteModuleResultTypes.Loaded:
        this._mfePaymentViewContainerRef.clear();
        const paymentComponentType: Type<any> = result.webpackModule.PaymentComponent;
        const mfePaymentComponentRef: ComponentRef<any> = this._mfePaymentViewContainerRef.createComponent(paymentComponentType);
        // to set inputs use componentRef.setInput method
        // to subscribe to outputs use componentRef.instance.<output>.subscribe(...)
        break;
      case RemoteModuleResultTypes.Failed:
        console.log('failed loading mfe-payment:', result.error);
        break;
      default:
        // see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
        const _exhaustiveCheck: never = result;
        return _exhaustiveCheck;
    }
  }
}

export const MFE_PAYMENT_ROUTES: Routes = [
  {
    path: '**',
    component: PaymentComponent,
  },
]
