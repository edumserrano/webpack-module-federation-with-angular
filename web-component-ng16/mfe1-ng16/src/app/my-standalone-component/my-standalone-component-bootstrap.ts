import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { MyStandaloneComponent } from './my-standalone-component.component';
import { ApplicationConfig, ApplicationRef } from '@angular/core';

export async function bootstrapMyComponentAsync(): Promise<void> {
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
