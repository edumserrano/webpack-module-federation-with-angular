import { Injectable, InjectionToken, inject } from "@angular/core";
import { Observable, Subject } from "rxjs";

// The CHECKOUT_EVENTS InjectionToken was based on the idea explained in
// "The Hidden Power of InjectionToken Factory Functions in Angular":
// - https://netbasal.com/the-hidden-power-of-injectiontoken-factory-functions-in-angular-d42d5575859b
export type CheckoutEvents = Observable<string>;
export const CHECKOUT_EVENTS = new InjectionToken<CheckoutEvents>(
  'Checkout events',
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
