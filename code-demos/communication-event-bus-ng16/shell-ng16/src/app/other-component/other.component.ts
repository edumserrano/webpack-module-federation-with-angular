import { Component } from '@angular/core';
import { EventBus } from '../event-bus';
import { GreetEvent } from '../mfe1-component/events/greet-event';
import { MessageSentEvent } from '../mfe1-component/events/message-sent-event';
import { GreetEvent2 } from '../mfe1-component/events/greet-event-2';
import { MessageSentEvent2 } from '../mfe1-component/events/message-sent-event-2';

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
  public greetEventAsJson2?: string;
  public messageSentEventAsJson2?: string;

  private subscribeToEvents(): void {
    this._eventBus
      .getEvent$(GreetEvent)
      .subscribe(this.greetEventHandler.bind(this));
    this._eventBus
      .getEvent$(MessageSentEvent)
      .subscribe(this.messageSentEventHandler.bind(this));
    this._eventBus
      .getEvent$(GreetEvent2)
      .subscribe(this.greetEventHandler.bind(this));
    this._eventBus
      .getEvent$(MessageSentEvent2)
      .subscribe(this.messageSentEventHandler.bind(this));
  }

  public greetEventHandler(event: GreetEvent): void {
    this.greetEventAsJson = JSON.stringify(event);
  }

  public messageSentEventHandler(event: MessageSentEvent): void {
    this.messageSentEventAsJson = JSON.stringify(event);
  }

  public greetEventHandler2(event: GreetEvent2): void {
    this.greetEventAsJson2 = JSON.stringify(event);
  }

  public messageSentEventHandler2(event: MessageSentEvent2): void {
    this.messageSentEventAsJson2 = JSON.stringify(event);
  }
}
