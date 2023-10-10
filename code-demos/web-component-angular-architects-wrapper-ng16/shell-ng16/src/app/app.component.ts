import { WebComponentWrapperOptions } from '@angular-architects/module-federation-tools';
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
    messageSentEvent: (event: Event) => {
      this.message = (event as CustomEvent).detail;
    },
  };
}
