import { WebComponentWrapper, WebComponentWrapperOptions } from '@angular-architects/module-federation-tools';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, VERSION } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public readonly version: string = VERSION.full;
  public message: string = "";

  // The correct way to interact with the document object in Angular is to use the DOCUMENT
  // injection token https://angular.io/api/common/DOCUMENT
  public constructor(@Inject(DOCUMENT) private readonly _document: Document) {}

  public reset(): void {
    this._document.location.href = "/";
  }

  public readonly mfe1WebComponentOptions: WebComponentWrapperOptions = {
    remoteEntry: 'http://localhost:4201/remoteEntry.js',
    type: 'module',
    exposedModule: './standalone-component-as-web-component',
    elementName: 'my-mfe-element',
  };

  public readonly mfe1WebComponentProps: { [key: string]: unknown } = {
    inputText: 'Hello from Shell',
  };

  public readonly mfe1WebComponentEvents: { [key: string]: (event: Event) => void } = {
    'message-sent': (event: Event) => {
      this.message = (event as CustomEvent).detail;
    },
  };

  // The routerActivateHandler method is being used to subscribe to the outputs
  // from the MyStandaloneComponent when it's loaded into the router-outlet.
  //
  // This is not the usual way to subscribe to outputs from angular components.
  // The two most common ways are:
  // 1) on the HTML the parent component subscribes to the child component outputs.
  // 2) use an Angular service to pass data around.
  //
  // The second approach is what would normally be used for a situation where the
  // component is loaded using Angular routing. However, in order of keeping this
  // code demo short, we aren't doing this in.
  //
  // As a workaround, to be able to subscribe to the outputs from the MyStandaloneComponent
  // when using the WebComponentWrapper we are using the activate event from the router-outlet.
  //
  // Based on the idea from https://chinedujude.medium.com/angular-emit-event-through-router-outlet-53b55fbd1f28
  //
  public routerActivateHandler(component: any): void {
    if(component instanceof WebComponentWrapper) {
      // outputs on the WebComponentWrapper are exposed by its events property
      component.events = {
        'message-sent': (event: Event) => {
          this.message = (event as CustomEvent).detail;
        },
      };
    }
  }
}
