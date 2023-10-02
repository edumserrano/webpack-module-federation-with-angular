import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { MyStandaloneComponent } from './my-standalone-component.component';
import { ApplicationConfig, ApplicationRef } from '@angular/core';

// The webpack configuration file at /web-component-ng16/mfe1-ng16/webpack.config.js
// exposes a webpack module which contains this function
export async function bootstrapMyComponentAsync(): Promise<void> {
  // This converts the Angular component to a Web component.
  //
  // First we instantiate an Angular application so that we can get
  // a reference to its injector and pass it to the createCustomElement
  // which converts the Angular component to a Web component.
  //
  // Lastly, we add the Web component to the CustomElementRegistry
  // so that when an element <my-mfe-element></my-mfe-element> exists
  // on the html, the Web component will be rendered on it.

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
