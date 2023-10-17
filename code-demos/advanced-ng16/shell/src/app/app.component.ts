import { Component, Inject, VERSION } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CHECKOUT_EVENTS,
  CheckoutEvents,
} from 'src/micro-frontends/checkout/checkout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public constructor(@Inject(CHECKOUT_EVENTS) checkoutEvents$: CheckoutEvents) {
    this.subscribeToEvents(checkoutEvents$);
  }

  public readonly version: string = VERSION.full;

  public checkoutHandler(message: string): void {
    alert(message);
  }

  private subscribeToEvents(checkoutEvents$: CheckoutEvents) {
    checkoutEvents$
      .pipe(
        takeUntilDestroyed() // see https://indepth.dev/posts/1518/takeuntildestroy-in-angular-v16
      )
      .subscribe((x) => {
        alert(x);
      });
  }
}
