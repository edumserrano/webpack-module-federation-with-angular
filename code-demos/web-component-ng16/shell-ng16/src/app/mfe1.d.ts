//
// This file is not needed for the code demo, it's only here as a bonus to show
// how you could add type support to a remotely imported web component.
//
// See /code-demos/web-component-ng16/README.md#add-strict-type-information-to-remotely-imported-web-component
// for more info.
//
// The code here is based on this gist
// https://gist.github.com/difosfor/ceeb01d03a8db7dc68d5cd4167d60637
// from this GitHub issue
// https://github.com/lit/lit-element/issues/808#issuecomment-566684982
//
// Also useful reading is the article 'Using strongly typed events in TypeScript'
// https://43081j.com/2020/11/typed-events-in-typescript
//

// Define custom event types and details here
interface MyMfeElementEventMap {
  'message-sent': CustomEvent<string>;
}

export interface MyMfeElementCombinedEventMap  extends HTMLElementEventMap, MyMfeElementEventMap {}

// Add strict property type suport and event type support to addEventListener etc.
export interface MyMfeElement extends HTMLElement {

  inputText: string;

  addEventListener<K extends keyof MyMfeElementCombinedEventMap >(
    type: K,
    listener: (this: MyMfeElement, ev: MyMfeElementCombinedEventMap [K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof MyMfeElementCombinedEventMap >(
    type: K,
    listener: (this: MyMfeElement, ev: MyMfeElementCombinedEventMap [K]) => void,
    options?: boolean | EventListenerOptions,
  ): void;
}

// Add custom element to TypeScript's map
declare global {
  interface HTMLElementTagNameMap {
    'my-mfe-element': MyMfeElement;
  }
}
