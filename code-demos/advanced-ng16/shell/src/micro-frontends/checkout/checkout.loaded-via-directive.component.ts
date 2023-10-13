import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { Routes } from '@angular/router';
import { RemoteModuleEvent } from 'src/micro-frontends-tooling/remote-module-events';
import { RemoteModuleDirective } from 'src/micro-frontends-tooling/remote-module.directive';

// TODO: note about not having an .html and using the templateUrl prop. if it's simple
// you can consider not having a separate file but usually it's better to have that and
// the styleUrls
// TODO: add note about naming checkout.<loaded via>.component.ts, this is not some kind of pattern, it's only
// a way to differentiate the different ways of loading remote modules

@Component({
  selector: 'app-checkout-mfe',
  standalone: true,
  imports: [RemoteModuleDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <mfe-checkout
      remoteModule
      exposedModule="./checkout"
      remoteEntry="http://localhost:4201/remoteEntry.js"
      [loadRemoteModuleCallback]="loadRemoteModuleHandler"
      (remoteModuleEvents)="remoteModuleEventsHandler($event)"
    ></mfe-checkout>
  `,
 })
export class CheckoutComponent {

  // TODO talk about this handler being OPTIONAL and specific for this remote module load
  public remoteModuleEventsHandler(event: RemoteModuleEvent): void {
    console.log("mfe-checkout remote module event:", event);
  }

  public async loadRemoteModuleHandler(webpackModule: any): Promise<void> {
    // call whatever is needed to mount your mfe

    // TODO: note about the elementName on the directive matching the declared
    // custom element
    // TODO consider creating a type to define webpackModule.mountAsync instead of
    // using any? Does Zod help?
    // check how at https://sergiodxa.com/articles/using-zod-to-safely-read-env-variables
    // and https://jfranciscosousa.com/blog/validating-environment-variables-with-zod/

    const elementName = "mfe-checkout";
    await webpackModule.mountAsync(elementName);
   }
}

export const MFE_CHECKOUT_ROUTES: Routes = [
  {
    path: '**',
    component: CheckoutComponent,
  },
]
