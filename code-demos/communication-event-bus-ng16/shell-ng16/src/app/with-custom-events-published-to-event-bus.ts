import {
  ENVIRONMENT_INITIALIZER,
  Provider,
  inject,
} from '@angular/core';
import { EventBus } from './event-bus';
import { DOCUMENT } from '@angular/common';
import { GreetEvent } from './mfe1-component/events/greet-event';

export function withCustomEventsPublishedToEventBus(): Provider {
  return {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useValue: () => {
      const eventBus = inject(EventBus);
      const document = inject(DOCUMENT);

      // Programmatically subscribe to the greet-message custom event and republish it via the EventBus.
      //
      // This custom event is being dispatched by the MyStandaloneComponent from the mfe1 app and
      // has the bubbles property set to true which means it can be listened to at any level of the DOM.
      document.addEventListener('greet-message', (event: Event) => {
        const greetEvent = GreetEvent.fromGreetCustomEvent(event);
        eventBus.publish(greetEvent);
      });
    },
  };
}


