import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { remoteModuleDirective as RemoteModuleDirective } from 'src/micro-frontends-tooling/remote-module.directive';

// TODO: note about not having an .html and using the templateUrl prop. if it's simple you can consider not having a separate file but usually it's better to have that and the styleUrls
@Component({
  selector: 'mfe-checkout',
  standalone: true,
  imports: [CommonModule, RemoteModuleDirective],
  template: `
    <mfe-checkout-web-component
      remoteModule
      exposedModule="./checkout"
      remoteEntry="http://localhost:4201/remoteEntry.js"
      [loadRemoteModuleCallback]="loadRemoteModuleHandler"
      (loading)="moduleLoadingHandler()"
      (loaded)="moduleLoadedHandler()"
      (failed)="moduleFailerHandler()"
    ></mfe-checkout-web-component>
  `,
  styleUrls: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //TODO this doesnt seem necessary when the template is declared inline for standalone components
})
export class CheckoutComponent {

  // TODO talk about these 3 handlers being OPTIONAL and specific for this remote module load
  public moduleLoadingHandler(): void {
    console.log("mfe-checkout is loading");
  }

  public moduleLoadedHandler(): void {
    console.log("mfe-checkout loaded");
  }

  public moduleFailerHandler(): void {
    console.log("mfe-checkout failed to load");
  }

  public async loadRemoteModuleHandler(webpackModule: any): Promise<void> {
    // call whatever is needed to mount your mfe
    // console.log(this);
    // await this.sleepAsync(2000);

    const elementName = "mfe-checkout-web-component"; // TODO: note about the elementName on the directive matching the declared custom element
    await webpackModule.mountAsync(elementName); // TODO consider creating a type to define this instead of using any? Does Zod help? check how at https://sergiodxa.com/articles/using-zod-to-safely-read-env-variables and https://jfranciscosousa.com/blog/validating-environment-variables-with-zod/
   }


  private sleepAsync(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
