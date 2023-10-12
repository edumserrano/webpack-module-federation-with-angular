import {
  Component,
  ComponentRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { remoteModuleDirective as RemoteModuleDirective } from 'src/micro-frontends-tooling/remote-module.directive';
import { ActivatedRoute, Routes, provideRouter } from '@angular/router';
import { remoteModuleResolver } from 'src/micro-frontends-tooling/remote-module.resolver';

// loadRemoteModule
// exposedModule="./payment"
// remoteEntry="http://localhost:4202/remoteEntry.js"
// [loadRemoteModuleCallback]="loadRemoteModuleHandler"

// TODO: note about not having an .html and using the templateUrl prop. if it's simple you can consider not having a separate file but usually it's better to have that and the styleUrls
// TODO: add note about the `.bind(this)` at [loadRemoteModuleCallback]="loadRemoteModuleHandler.bind(this)"
//       say it's about the this context or else this._mfePaymentViewContainerRef is always undefined because this would refer to the LoadRemoteModuleDirective

export const MFE_PAYMENT_ROUTES_2: Routes = [
  {
    path: '**',
    loadComponent: async () => {
      const localModule = await import('./payment2.component');
      return localModule.Payment2Component;
    },
    resolve: {
      remoteModule: remoteModuleResolver({
        remoteEntry: "http://localhost:4202/remoteEntry.js",
        exposedModule: "./payment2",
      }),
    },
  },
]

@Component({
  selector: 'mfe-payment-2',
  standalone: true,
  imports: [CommonModule, RemoteModuleDirective],
  template: `
    <ng-container #mfePayment></ng-container>
  `,
  styleUrls: [],
})
export class Payment2Component {
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
  }
}
