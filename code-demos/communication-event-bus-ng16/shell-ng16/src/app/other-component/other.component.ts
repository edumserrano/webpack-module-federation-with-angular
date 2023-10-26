import { Component } from '@angular/core';
import { EventBus } from '../event-bus';
import { MessageSentEvent } from '../mfe1-component/message-sent-event';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css'],
})
export class OtherComponent {

  public constructor(private readonly _eventBus: EventBus) {
    this.subscribeToEvents();
  }

  public greetEventAsJson?: string;
  public messageSentEventAsJson?: string;

  private subscribeToEvents(): void {
    // The `.bind` call is required to flow the `this` context
    // when the `messageSentEventHandler` method is executed.
    // Otherwise when the `this.messageSentEventAsJson` line was
    // executed, the `this` variable would be undefined.
    //
    // For more info see "Understanding This, Bind, Call, and Apply in JavaScript":
    // https://www.digitalocean.com/community/conceptual-articles/understanding-this-bind-call-and-apply-in-javascript
    this._eventBus
      .getEvent$(MessageSentEvent)
      .subscribe(this.messageSentEventHandler.bind(this));
  }

  public messageSentEventHandler(event: MessageSentEvent): void {
    this.messageSentEventAsJson = JSON.stringify(event);
  }
}
