import { Injectable, InjectionToken, inject } from "@angular/core";
import { Observable, Subject } from "rxjs";

// TODO explain this with link to injection token magic article
export type CheckoutEvents = Observable<string>;
export const CHECKOUT_EVENTS = new InjectionToken<CheckoutEvents>(
  'Remote module events',
  {
    factory() {
      const checkoutService = inject(CheckoutService);
      return checkoutService.checkoutRequested$;
    },
  }
);

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly _checkoutRequested = new Subject<string>();

  public readonly checkoutRequested$ = this._checkoutRequested.asObservable();

  public triggerCheckoutRequested(checkoutMessage: string) {
    this._checkoutRequested.next(checkoutMessage);
  }
}
