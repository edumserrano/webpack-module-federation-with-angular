import { Component } from '@angular/core';

@Component({
  selector: 'app-load-via-html',
  templateUrl: './load-via-html.component.html',
  styleUrls: ['./load-via-html.component.css']
})
export class LoadViaHtmlComponent {
  public checkoutHandler(message: string): void {
    alert(`Checkout event from component declared in HTML:\n\n${message}`);
  }
}
