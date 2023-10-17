import { ApplicationConfig, ApplicationRef } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { CheckoutComponent } from './checkout.component';

// The webpack configuration file at /advanced-ng16/checkout/webpack.config.js
// exposes a webpack module which contains this function.
export async function mountAsync(customElementName: string): Promise<void> {
  const customElementCtor: CustomElementConstructor | undefined = customElements.get(customElementName);
  if(customElementCtor) {
    // if this custom element has already been added to the custom elements registry then do nothing.
    return;
  }

  const appConfig: ApplicationConfig = {
    providers: [], // add any required providers here
  };
  const appRef: ApplicationRef = await createApplication(appConfig);
  const myStandaloneComponentAsWebComponent = createCustomElement(
    CheckoutComponent,
    { injector: appRef.injector }
  );
  customElements.define(customElementName, myStandaloneComponentAsWebComponent);
}
