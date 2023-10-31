import { Component, Inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CHECKOUT_EVENTS, CheckoutEvents } from 'src/micro-frontends/checkout/checkout.service';

@Component({
  selector: 'app-load-via-routing',
  templateUrl: './load-via-routing.component.html',
  styleUrls: ['./load-via-routing.component.css']
})
export class LoadViaRoutingComponent {
  public constructor(@Inject(CHECKOUT_EVENTS) checkoutEvents$: CheckoutEvents) {
    this.subscribeToEvents(checkoutEvents$);
  }

  private subscribeToEvents(checkoutEvents$: CheckoutEvents) {
    checkoutEvents$
      .pipe(
        takeUntilDestroyed() // see https://angularindepth.com/posts/1518/takeuntildestroy-in-angular-v16
      )
      .subscribe((x) => {
        alert(`Checkout event from component loaded via Angular routing:\n\n${x}`);
      });
  }
}
