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
    this._eventBus
      .getEvent$(MessageSentEvent)
      .subscribe(this.messageSentEventHandler.bind(this));
  }

  public messageSentEventHandler(event: MessageSentEvent): void {
    this.messageSentEventAsJson = JSON.stringify(event);
  }
}
