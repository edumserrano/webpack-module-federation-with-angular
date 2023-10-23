import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { MyStandaloneComponent } from './my-standalone-component.component';
import { ApplicationConfig, ApplicationRef } from '@angular/core';

// The webpack configuration file at /communication-custom-events-ng16/mfe1-ng16/webpack.config.js
// exposes a webpack module which contains this function.
export async function bootstrapMyComponentAsync(): Promise<void> {
  // This converts the Angular component to a Web component.
  //
  // First we check if the custom element has already been defined. If so we don't do anything
  // because the same custom element cannot be defined more than once.
  //
  // If the custom element has not been defined, we instantiate an Angular application so that
  // we can get a reference to its injector and pass it to the createCustomElement which converts
  // the Angular component to a Web component.
  //
  // Lastly, we add the Web component to the CustomElementRegistry so that when an element
  // <my-mfe-element></my-mfe-element> is defined on the html, the Web component will be rendered on it.

  const customElementCtor: CustomElementConstructor | undefined = customElements.get('my-mfe-element');
  if(customElementCtor) {
    // if this custom element has already been added to the custom elements registry then do nothing.
    return;
  }

  const appConfig: ApplicationConfig = {
    providers: [], // add any required providers here
  };
  const appRef: ApplicationRef = await createApplication(appConfig);
  const myStandaloneComponentAsWebComponent = createCustomElement(
    MyStandaloneComponent,
    { injector: appRef.injector }
  );
  customElements.define('my-mfe-element', myStandaloneComponentAsWebComponent);
}
