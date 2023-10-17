import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EventBus } from '../event-bus';
import { MessageSentEvent2 } from './events/message-sent-event-2';
import { MessageSentEvent } from './events/message-sent-event';
import { GreetEvent } from './events/greet-event';

@Component({
  selector: 'app-mfe1',
  templateUrl: './mfe1.component.html',
  styleUrls: ['./mfe1.component.css'],
})
export class Mfe1Component implements OnInit {

  /**
   * The ViewChild decorator is used to give us the ElementRef of the
   * element with the template variable 'mfe1'.
   * This _mfe1ElementRef property is what we can use to interact programmatically
   * with the my-mfe-element web component.
   *
   * For more info see:
   * - ViewChild official docs: https://angular.io/api/core/ViewChild
   * - ViewChild: In-Depth Explanation: https://blog.angular-university.io/angular-viewchild/
   * - All about the ViewContainerRef: https://medium.com/nerd-for-tech/angular-viewcontainerref-a1e8d08eabc2
   * - Template variables: https://angular.io/guide/template-reference-variables
   */
  @ViewChild('mfe1', { read: ElementRef, static: true })
  private readonly _mfe1ElementRef?: ElementRef<HTMLElement>;

  public constructor(private readonly _eventBus: EventBus) {}

  public ngOnInit(): void {
    if (!this._mfe1ElementRef) {
      return;
    }

    // Programmatically subscribe to the messageSentEvent custom event and republish it via the EventBus.
    //
    // This custom event was created from converting the MyStandaloneComponent from the mfe1 app
    // into a web component using Angular custom elements. Which means that this custom event
    // does NOT bubble up so the only way to programmatically subscribe to it is by
    // adding the event listener to the web component itself. Trying to add an event listener
    // for this custom event at any other level of the DOM, like the document level, will not work.
    const myMfeElement: HTMLElement = this._mfe1ElementRef.nativeElement;
    myMfeElement.addEventListener('messageSentEvent', (event: Event) => {
      const messageSentEvent = MessageSentEvent2.fromMessageSentCustomEvent(event);
      this._eventBus.publish(messageSentEvent);
    });
  }

  // Subscribe to the messageSentEvent custom event via HTML binding and republish it via the EventBus.
  public messageSentEventHandler(event: Event): void {
    const messageSentEvent = MessageSentEvent.fromMessageSentCustomEvent(event);
    this._eventBus.publish(messageSentEvent);
  }

  // Subscribe to the greet-message custom event via HTML binding and republish it via the EventBus.
  public greetEventHandler(event: Event): void {
    const greetEvent = GreetEvent.fromGreetCustomEvent(event);
    this._eventBus.publish(greetEvent);
  }
}
