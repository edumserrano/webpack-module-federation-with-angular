import { Component, ElementRef, EventEmitter, Output, VERSION } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-standalone-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-standalone-component.component.html',
  styleUrls: ['./my-standalone-component.component.css']
})
export class MyStandaloneComponent {
  public readonly version = VERSION.full;

  public constructor(private readonly _elementRef: ElementRef) {}

  @Output()
  public messageSentEvent: EventEmitter<string> = new EventEmitter<string>();

  public sendMessage(): void {
    this.messageSentEvent.emit(`The time is ${new Date()}`);

    // You can create a custom event like just by doing 'new CustomEvent' but it's
    // better if you type your events and do like it's shown below using the pattern
    // demonstrated by the GreetMessageEvent type.
    //
    // const manualCustomEvent = new CustomEvent('greet-message', {
    //   bubbles: true,
    //   composed: true,
    //   detail: {
    //     greet: "Hello",
    //     time: new Date(),
    //   }
    // });

    const greet: Greet = {
      greet: "Hello",
      time: new Date(),
    };
    const manualCustomEvent = new GreetMessageEvent(greet);
    this._elementRef.nativeElement.dispatchEvent(manualCustomEvent);
  }
}

export class GreetMessageEvent extends CustomEvent<Greet> {
  static eventName = "greet-message"

  constructor(detail: Greet) {
    super(GreetMessageEvent.eventName, {
      detail,
      bubbles: true,
      composed: true
    });
  }
}

export type Greet = {
  greet: string,
  time: Date,
}
